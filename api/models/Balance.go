package models

import (
	"errors"
	"fmt"
	"github.com/tuneinsight/lattigo/v3/ckks"
	"github.com/tuneinsight/lattigo/v3/rlwe"
	"time"

	"github.com/jinzhu/gorm"
)

type Balance struct {
	ID             uint64    `gorm:"primary_key;auto_increment" json:"id"`
	CurrentBalance string    `gorm:"type:text" json:"current_balance"`
	Author         User      `json:"author"`
	AuthorID       uint32    `sql:"type:int REFERENCES users(id)" json:"author_id"`
	CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type Topup struct {
	AddedBalance float64 `json:"added_balance"`
}

func (p *Balance) TableName() string {
	return "balances"
}

func (p *Balance) Prepare() {
	p.ID = 0
	p.CurrentBalance = "0"
	p.Author = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
}

func (p *Balance) StartAndUpdate(db *gorm.DB, uid uint32) {
	p.Author = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	p.AuthorID = uid

	user := User{}
	user.FindUserByID(db, uid)

	p.CurrentBalance = p.EncOutputFromZeroBalance(user.SecretKey)
}

func (p *Balance) Validate() error {
	if p.AuthorID < 1 {
		return errors.New("Required Author")
	}
	return nil
}

func (p *Balance) SaveItem(db *gorm.DB) (*Balance, error) {
	var err error
	err = db.Debug().Model(&Balance{}).Create(&p).Error

	if err != nil {
		return &Balance{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Balance{}, err
		}
	}
	return p, nil
}

//func (p *Balance) Activate(db *gorm.DB, uid uint32) (*Balance, error) {
//	var err error
//	balances := Balance{}
//	balances.StartAndUpdate()
//
//	err = db.Debug().Model(&Balance{}).Where("author_id = ?", uid).Find(&balances).Error
//	if err != nil {
//		return &Balance{}, err
//	}
//
//	return &balances, nil
//}

func (p *Balance) FindMyBalances(db *gorm.DB, uid uint32) (*Balance, error) {
	var err error
	balances := Balance{}
	err = db.Debug().Model(&Balance{}).Where("author_id = ?", uid).Find(&balances).Error
	if err != nil {
		return &Balance{}, err
	}

	s := p.DecryptFromString(db, uid, balances.CurrentBalance)
	balances.CurrentBalance = s

	return &balances, nil
}

func (p *Balance) FindAllBalances(db *gorm.DB) (*[]Balance, error) {
	var err error
	balances := []Balance{}
	err = db.Debug().Model(&Item{}).Limit(100).Find(&balances).Error
	if err != nil {
		return &[]Balance{}, err
	}
	if len(balances) > 0 {
		for i, _ := range balances {
			err := db.Debug().Model(&User{}).Where("id = ?", balances[i].AuthorID).Take(&balances[i].Author).Error
			if err != nil {
				return &[]Balance{}, err
			}
		}
	}
	return &balances, nil
}

func (p *Balance) EncOutputFromZeroBalance(secretKey string) string {
	paramLogsGlobalBalance := 1
	fmt.Println(secretKey)

	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)
	if err != nil {
		panic(err)
	}

	// Secret Key Generation
	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, secretKey)

	// Evaluator Key Generation
	kgen := ckks.NewKeyGenerator(params)
	pk := kgen.GenPublicKey(sk)
	//rlk := kgen.GenRelinearizationKey(sk, 1)

	// Encryptor
	encryptor := ckks.NewEncryptor(params, pk)

	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	// Buyer Meta
	buyerMeta := make([]float64, paramLogsGlobalBalance)
	buyerMeta[0] = float64(0)

	// Encoder
	encoder := ckks.NewEncoder(params)

	// Plaintext Generation
	plaintext := encoder.EncodeNew(buyerMeta, params.MaxLevel(), params.DefaultScale(), paramLogsGlobalBalance)

	// Cipher Text Operation
	var ciphertext *ckks.Ciphertext
	ciphertext = encryptor.EncryptNew(plaintext)

	str1 := MarshalToBase64String(ciphertext)

	tmp := encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogsGlobalBalance)

	// Value Assignment from Decryption
	valuesTest := make([]float64, len(tmp))
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])

	return str1
}

func (p *Balance) ProcessTopUp(db *gorm.DB, addedConstant float64, uid uint32) *Balance {
	mybalance, err := p.FindMyBalances(db, uid)
	if mybalance.ID == 0 {
		return &Balance{}
	}

	paramLogsGlobalBalance := 1
	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)

	user := User{}
	user.FindUserByID(db, uid)

	var ciphertext = ckks.NewCiphertext(params, 1, 5, 1.073741824e+09)

	UnmarshalFromBase64(ciphertext, mybalance.CurrentBalance)

	if err != nil {
		panic(err)
	}

	// Secret Key Generation
	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, user.SecretKey)

	// Evaluator Key Generation
	kgen := ckks.NewKeyGenerator(params)
	rlk := kgen.GenRelinearizationKey(sk, 1)

	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})
	evaluator.AddConst(ciphertext, (addedConstant), ciphertext)

	// Encoder
	encoder := ckks.NewEncoder(params)
	tmp := encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogsGlobalBalance)

	// Value Assignment from Decryption
	valuesTest := make([]float64, len(tmp))
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])

	//s := fmt.Sprintf("ValuesTest: %.3f ...\n", valuesTest[0])

	str1 := MarshalToBase64String(ciphertext)

	err = db.Debug().Model(&Balance{}).Where("id = ?", mybalance.ID).Updates(Balance{CurrentBalance: str1, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Balance{}
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Balance{}
		}
	}

	return &Balance{CurrentBalance: str1, UpdatedAt: time.Now()}
}


func (p *Balance) DecryptFromString(db *gorm.DB, uid uint32, currBalance string) string {
	paramLogsGlobalBalance := 1
	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)

	user := User{}
	user.FindUserByID(db, uid)

	var ciphertext = ckks.NewCiphertext(params, 1, 5, 1.073741824e+09)

	UnmarshalFromBase64(ciphertext, currBalance)

	if err != nil {
		panic(err)
	}

	// Secret Key Generation
	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, user.SecretKey)


	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	// Encoder
	encoder := ckks.NewEncoder(params)
	tmp := encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogsGlobalBalance)

	// Value Assignment from Decryption
	valuesTest := make([]float64, len(tmp))
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])

	s := fmt.Sprintf("Rp. %.3f\n", valuesTest[0])

	return s
}

