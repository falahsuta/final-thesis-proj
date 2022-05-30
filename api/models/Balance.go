package models

import (
	"errors"
	"finalthesisproject/api/config"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/tuneinsight/lattigo/v3/ckks"
	"github.com/tuneinsight/lattigo/v3/ckks/bootstrapping"
	"github.com/tuneinsight/lattigo/v3/rlwe"

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

	//start := time.Now()

	if config.GetConfig().GetBootstrappingMode() == "on" {
		p.CurrentBalance = p.EncOutputFromZeroBalanceBootstrap(user.SecretKey)
	} else {
		p.CurrentBalance = p.EncOutputFromZeroBalance(user.SecretKey)
	}

	//duration := time.Since(start)
	//fmt.Println("[LOG] Enc Zero Balance ", duration)
}

func (p *Balance) StartAndUpdateWithoutHE(db *gorm.DB, uid uint32) {
	p.Author = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	p.AuthorID = uid

	user := User{}
	user.FindUserByID(db, uid)

	p.CurrentBalance = "0"
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

	if config.GetConfig().GetBootstrappingMode() == "on" {
		balances.CurrentBalance = p.DecryptFromStringBootstrap(db, uid, balances.CurrentBalance)
	} else {
		balances.CurrentBalance = p.DecryptFromString(db, uid, balances.CurrentBalance)
	}

	return &balances, nil
}

func (p *Balance) FindMyBalancesNonDec(db *gorm.DB, uid uint32) (*Balance, error) {
	var err error
	balances := Balance{}
	err = db.Debug().Model(&Balance{}).Where("author_id = ?", uid).Find(&balances).Error
	if err != nil {
		return &Balance{}, err
	}

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

	fmt.Printf("[ActivateBalance]: ValuesTest: %.3f ...\n", valuesTest[0])

	return str1
}

func (p *Balance) EncOutputFromZeroBalanceBootstrap(secretKey string) string {
	paramLogsGlobalBalance := 1

	paramSet := BootstrapEncParams
	params, err := ckks.NewParametersFromLiteral(paramSet.SchemeParams)
	if err != nil {
		panic(err)
	}

	// Secret Key Generation
	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, secretKey)

	// Evaluator Key Generation
	kgen := ckks.NewKeyGenerator(params)
	pk := kgen.GenPublicKey(sk)

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
	ciphertext := encryptor.EncryptNew(plaintext)

	str1 := MarshalToBase64String(ciphertext)

	tmp := encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogsGlobalBalance)

	// Value Assignment from Decryption
	valuesTest := make([]float64, len(tmp))
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	fmt.Printf("[ActivateBalance]: ValuesTest: %.3f ...\n", valuesTest[0])

	return str1
}

func (p *Balance) ProcessTopUp(db *gorm.DB, addedConstant float64, uid uint32, myBalance *Balance) *Balance {
	// paramLogsGlobalBalance := 1
	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)

	user := User{}
	user.FindUserByID(db, uid)

	//duration := time.Since(start)
	//fmt.Println("[LOG] Enc Zero Balance ", duration)

	var ciphertext = ckks.NewCiphertext(params, params.MaxLevel(), len(params.Q()), params.DefaultScale())

	if config.GetConfig().GetNTTMode() != "on" && ciphertext != nil {
		for _, pol := range ciphertext.Value {
			pol.IsNTT = false
		}
	}

	// startDecode := time.Now()
	UnmarshalFromBase64(ciphertext, myBalance.CurrentBalance)

	// duration := time.Since(startDecode)
	// fmt.Println("[LOG] Decode ", duration)

	if err != nil {
		panic(err)
	}

	// // Secret Key Generation
	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, user.SecretKey)

	// Evaluator Key Generation
	kgen := ckks.NewKeyGenerator(params)
	rlk := kgen.GenRelinearizationKey(sk, params.MaxLevel())

	// Decryptor
	// decryptor := ckks.NewDecryptor(params, sk)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})
	evaluator.AddConst(ciphertext, addedConstant, ciphertext)

	// Encoder
	// encoder := ckks.NewEncoder(params)
	// tmp := encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogsGlobalBalance)

	// Value Assignment from Decryption
	// valuesTest := make([]float64, len(tmp))
	// for i := range tmp {
	// 	valuesTest[i] = real(tmp[i])
	// }

	//s := fmt.Sprintf("ValuesTest: %.3f ...\n", valuesTest[0])
	str1 := MarshalToBase64String(ciphertext)

	err = db.Debug().Model(&Balance{}).Where("id = ?", myBalance.ID).Updates(Balance{CurrentBalance: str1, UpdatedAt: time.Now()}).Error
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

func (p *Balance) ProcessTopUpBootstrap(db *gorm.DB, addedConstant float64, uid uint32, myBalance *Balance) *Balance {
	paramLogsGlobalBalance := 1

	user := User{}
	user.FindUserByID(db, uid)
	paramSet := BootstrapEncParams
	params, err := ckks.NewParametersFromLiteral(paramSet.SchemeParams)
	if err != nil {
		panic(err)
	}

	btpParams := paramSet.BootstrappingParams
	ciphertext := ckks.NewCiphertext(params, params.MaxLevel(), len(params.Q()), params.DefaultScale())
	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, user.SecretKey)
	evk := bootstrapping.GenEvaluationKeys(btpParams, params, sk)
	btp, err := bootstrapping.NewBootstrapper(params, btpParams, evk)
	if err != nil {
		panic(err)
	}

	if config.GetConfig().GetNTTMode() != "on" && ciphertext != nil {
		for _, pol := range ciphertext.Value {
			pol.IsNTT = false
		}
	}

	UnmarshalFromBase64(ciphertext, myBalance.CurrentBalance)

	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	// Before Value Assignment from Decryption
	encoder := ckks.NewEncoder(params)
	tmp := encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogsGlobalBalance)
	valuesTest := make([]float64, len(tmp))
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	f, _ := os.Create("./data5.txt")
	defer f.Close()
	s := fmt.Sprintf("ValuesTest: %.3f ...\n", valuesTest[0])
	_, _ = f.WriteString(s)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, evk.EvaluationKey)
	evaluator.AddConst(ciphertext, addedConstant, ciphertext)

	// Encoder
	tmp = encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogsGlobalBalance)

	// After Value Assignment from Decryption
	valuesTest = make([]float64, len(tmp))
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	f, _ = os.Create("./data6.txt")
	s = fmt.Sprintf("ValuesTest: %.3f ...\n", valuesTest[0])
	_, _ = f.WriteString(s)

	// fmt.Println("ValuesTest: %.3f ...\n", valuesTest[0])

	evaluator.SetScale(ciphertext, params.DefaultScale())
	_ = btp.Bootstrapp(ciphertext)

	// After Value Assignment from Decryption Bootstrap
	// tmp = encoder.Decode(decryptor.DecryptNew(ciphertextBootstrap), paramLogsGlobalBalance)
	// valuesTest = make([]float64, len(tmp))
	// for i := range tmp {
	// 	valuesTest[i] = real(tmp[i])
	// }

	// f, _ = os.Create("./data7.txt")
	// s = fmt.Sprintf("ValuesTest: %.3f ...\n", valuesTest[0])
	// _, _ = f.WriteString(s)
	str1 := MarshalToBase64String(ciphertext)

	err = db.Debug().Model(&Balance{}).Where("id = ?", myBalance.ID).Updates(Balance{CurrentBalance: str1, UpdatedAt: time.Now()}).Error
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

func (p *Balance) ProcessTopUpWithoutHE(db *gorm.DB, addedConstant float64, uid uint32, myBalance *Balance) *Balance {
	f, _ := strconv.ParseFloat(myBalance.CurrentBalance, 64)
	f += addedConstant

	currentAddedBalance := fmt.Sprintf("%f", f)

	err := db.Debug().Model(&Balance{}).Where("id = ?", myBalance.ID).Updates(Balance{CurrentBalance: currentAddedBalance, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Balance{}
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Balance{}
		}
	}

	return &Balance{CurrentBalance: currentAddedBalance, UpdatedAt: time.Now()}
}

func (p *Balance) DecryptFromString(db *gorm.DB, uid uint32, currBalance string) string {
	paramLogsGlobalBalance := 1
	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)

	user := User{}
	user.FindUserByID(db, uid)

	ciphertext := ckks.NewCiphertext(params, params.MaxLevel(), len(params.Q()), params.DefaultScale())

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

	fmt.Printf("[GetBalance]: ValuesTest: %.3f ...\n", valuesTest[0])

	s := fmt.Sprintf("Rp. %.f\n", valuesTest[0])

	return s
}

func (p *Balance) DecryptFromStringBootstrap(db *gorm.DB, uid uint32, currBalance string) string {
	paramLogsGlobalBalance := 1
	paramSet := BootstrapEncParams
	params, err := ckks.NewParametersFromLiteral(paramSet.SchemeParams)
	if err != nil {
		panic(err)
	}

	ciphertext := ckks.NewCiphertext(params, params.MaxLevel(), len(params.Q()), params.DefaultScale())

	user := User{}
	user.FindUserByID(db, uid)

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

	fmt.Printf("[GetBalance]: ValuesTest: %.3f ...\n", valuesTest[0])

	s := fmt.Sprintf("Rp. %.f\n", valuesTest[0])

	return s
}
