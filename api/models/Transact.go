package models

import (
	"encoding"
	"encoding/base64"
	"errors"
	"fmt"
	"github.com/tuneinsight/lattigo/v3/ckks"
	"github.com/tuneinsight/lattigo/v3/ring"
	"github.com/tuneinsight/lattigo/v3/rlwe"
	"os"
	"reflect"
	"time"

	"github.com/jinzhu/gorm"
)

type Transact struct {
	ID             uint64    `gorm:"primary_key;auto_increment" json:"id"`
	BuyerMeta      string    `gorm:"type:text" json:"buyer_meta"`
	BuyerTotalBill string    `gorm:"type:text" json:"buyer_total_bill"`
	Author         User      `json:"author"`
	AuthorID       uint32    `sql:"type:int REFERENCES users(id)" json:"author_id"`
	CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type TransactMeta struct {
	DiscName     string  `gorm:"size:255;not null;" json:"disc_name"`
	ProductID    uint64  `sql:"type:int REFERENCES items(id)" json:"product_id"`
	ProductPrice float64 `sql:"type:float" json:"product_price"`
}

type TransactMetaParams struct {
	Discount     Discount
	TransactMeta TransactMeta
}

func (p *Transact) TableName() string {
	return "transacts"
}

func (p *Transact) Prepare() {
	//p.ID = 0
	//p.BuyerMeta = ""
	//p.BuyerTotalBill = ""
	p.Author = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
}

func (p *Transact) InsertID(id uint32) {
	p.AuthorID = id
}

func (p *Transact) SaveItemWithDisc(db *gorm.DB, meta TransactMeta) (*Transact, error) {
	//var err error

	discount := Discount{}
	discount.FindItemByName(db, meta.DiscName)

	metaParams := TransactMetaParams{
		TransactMeta: meta,
		Discount:     discount,
	}

	p.EncOutputFromMeta(metaParams)

	//err = db.Debug().Model(&Transact{}).Create(&p).Error

	//if err != nil {
	//	return &Transact{}, err
	//}
	//if p.ID != 0 {
	//	err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
	//	if err != nil {
	//		return &Transact{}, err
	//	}
	//}

	return p, nil
}

func (p *Transact) SaveItem(db *gorm.DB) (*Transact, error) {
	var err error
	err = db.Debug().Model(&Transact{}).Create(&p).Error

	if err != nil {
		return &Transact{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Transact{}, err
		}
	}
	return p, nil
}

func (p *Transact) FindAllItems(db *gorm.DB) (*[]Transact, error) {
	var err error
	transacts := []Transact{}
	err = db.Debug().Model(&Transact{}).Limit(100).Find(&transacts).Error
	if err != nil {
		return &[]Transact{}, err
	}
	if len(transacts) > 0 {
		for i, _ := range transacts {
			err := db.Debug().Model(&User{}).Where("id = ?", transacts[i].AuthorID).Take(&transacts[i].Author).Error
			if err != nil {
				return &[]Transact{}, err
			}
		}
	}
	return &transacts, nil
}

func (p *Transact) FindMyItemsWithPaginate(db *gorm.DB, uid uint32, pagination *Pagination) (*[]Transact, error) {
	transacts := []Transact{}
	offset := (pagination.Page - 1) * pagination.Limit
	queryBuider := db.Limit(pagination.Limit).Offset(offset).Order(pagination.Sort)
	result := queryBuider.Model(&Item{}).Where("author_id = ?", uid).Find(&transacts)

	if result.Error != nil {
		msg := result.Error
		return nil, msg
	}

	if len(transacts) > 0 {
		for i, _ := range transacts {
			err := db.Debug().Model(&User{}).Where("id = ?", transacts[i].AuthorID).Take(&transacts[i].Author).Error
			if err != nil {
				return &[]Transact{}, err
			}
		}
	}
	return &transacts, nil
}

func (p *Transact) FindItemByID(db *gorm.DB, pid uint64) (*Transact, error) {
	var err error
	err = db.Debug().Model(&Item{}).Where("id = ?", pid).Take(&p).Error
	if err != nil {
		return &Transact{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Transact{}, err
		}
	}
	return p, nil
}

func (p *Transact) UpdateAnItem(db *gorm.DB) (*Transact, error) {
	var err error

	err = db.Debug().Model(&Transact{}).Where("id = ?", p.ID).Updates(Transact{BuyerMeta: p.BuyerMeta, BuyerTotalBill: p.BuyerTotalBill, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Transact{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Transact{}, err
		}
	}
	return p, nil
}

func (p *Transact) DeleteAItem(db *gorm.DB, pid uint64, uid uint32) (int64, error) {

	db = db.Debug().Model(&Transact{}).Where("id = ? and author_id = ?", pid, uid).Take(&Transact{}).Delete(&Transact{})

	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Item not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}

// Utils
var GlobalEncParams = ckks.ParametersLiteral{
	LogN:     5,
	LogSlots: 4,
	Q: []uint64{0x1fffec001, // 33 + 5 x 30
		0x3fff4001,
		0x3ffe8001,
		0x40020001,
		0x40038001,
		0x3ffc0001},
	P:            []uint64{0x800004001}, // 35
	DefaultScale: 1 << 30,
	Sigma:        rlwe.DefaultSigma,
	RingType:     ring.Standard,
}

func (p *Transact) EncOutputFromMeta(meta TransactMetaParams) (string, string) {
	paramLogsGlobalBuyerMeta := 2
	paramLogsGlobalBuyerBill := 1

	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)
	if err != nil {
		panic(err)
	}

	// Secret Key Generation
	skStr := Secrecy()
	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, skStr)

	// Evaluator Key Generation
	kgen := ckks.NewKeyGenerator(params)
	pk := kgen.GenPublicKey(sk)
	rlk := kgen.GenRelinearizationKey(sk, 1)

	// Encryptor
	encryptor := ckks.NewEncryptor(params, pk)

	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	// Buyer Meta
	buyerMeta := make([]float64, paramLogsGlobalBuyerMeta)
	buyerMeta[0] = float64(meta.TransactMeta.ProductID)
	buyerMeta[1] = float64(meta.Discount.ID)

	// Buyer Bill
	buyerBill := make([]float64, paramLogsGlobalBuyerBill)
	buyerBill[0] = float64(meta.TransactMeta.ProductPrice)

	// Encoder
	encoder := ckks.NewEncoder(params)

	// Plaintext Generation
	plaintextBuyerMeta := encoder.EncodeNew(buyerMeta, params.MaxLevel(), params.DefaultScale(), paramLogsGlobalBuyerMeta)
	plaintextBuyerBill := encoder.EncodeNew(buyerBill, params.MaxLevel(), params.DefaultScale(), paramLogsGlobalBuyerBill)

	// Cipher Text Operation
	var ciphertextBuyerMeta *ckks.Ciphertext
	var ciphertextBuyerBill *ckks.Ciphertext
	ciphertextBuyerMeta = encryptor.EncryptNew(plaintextBuyerMeta)
	ciphertextBuyerBill = encryptor.EncryptNew(plaintextBuyerBill)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})

	if meta.Discount.PercentCut > 0.0 {
		evaluator.MultByConst(ciphertextBuyerBill, meta.Discount.PercentCut, ciphertextBuyerBill)
		//evaluator.AddConst(ciphertextBuyerBill, float64(meta.Discount.FixedCut)*(-1.00), ciphertextBuyerBill)
	}

	if meta.Discount.FixedCut > 0.0 {
		//fmt.Println(float64(meta.Discount.FixedCut)*(-1.00))
		//evaluator.AddConst(ciphertextBuyerBill, float64(meta.Discount.FixedCut)*(-1.00), ciphertextBuyerBill)
	}


	// Decryption Testing
	tmpBuyerMeta := encoder.Decode(decryptor.DecryptNew(ciphertextBuyerMeta), paramLogsGlobalBuyerMeta)
	tmpBuyerBill := encoder.Decode(decryptor.DecryptNew(ciphertextBuyerBill), paramLogsGlobalBuyerBill)

	// Value Assignment from Decryption
	valuesTest := make([]float64, len(tmpBuyerMeta))
	for i := range tmpBuyerMeta {
		valuesTest[i] = real(tmpBuyerMeta[i])
	}

	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])
	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[1])


	// Value Assignment from Decryption
	valuesTest2 := make([]float64, len(tmpBuyerBill))
	for i := range tmpBuyerBill {
		valuesTest2[i] = real(tmpBuyerBill[i])
	}

	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest2[0])
	fmt.Println(valuesTest2[0])

	//fmt.Println(float64(30000.0)*float64(0.3))

	str1 := MarshalToBase64String(ciphertextBuyerMeta)
	str2 := MarshalToBase64String(ciphertextBuyerBill)

	f, _ := os.Create("data4.txt")
	defer f.Close()
	data := []byte(str2)
	_, _ = f.Write(data)


	fmt.Println(len(str1))
	fmt.Println(len(str2))

	return str1, str2
}

func Secrecy() string {
	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)
	if err != nil {
		panic(err)
	}

	sk := ckks.NewSecretKey(params)
	skStr := MarshalToBase64String(sk)

	return skStr
}

// UnmarshalFromBase64 reads a base-64 string into a unmarshallable type
func UnmarshalFromBase64(bum encoding.BinaryUnmarshaler, b64string string) error {
	b, err := base64.StdEncoding.DecodeString(b64string)

	if err != nil {
		return err
	}
	return bum.UnmarshalBinary(b)
}

// MarshalToBase64String returns serialization of a marshallable type as a base-64-encoded string
func MarshalToBase64String(bm encoding.BinaryMarshaler) string {
	if bm == nil || reflect.ValueOf(bm).IsNil() {
		return "nil"
	}
	b, err := bm.MarshalBinary()
	if err != nil {
		panic(err)
	}
	return base64.StdEncoding.EncodeToString(b)
}
