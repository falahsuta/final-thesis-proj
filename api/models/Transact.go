package models

import (
	"encoding"
	"encoding/base64"
	"errors"
	"finalthesisproject/api/config"
	"fmt"
	"net/http"
	"reflect"
	"strconv"
	"time"

	"github.com/tuneinsight/lattigo/v3/ckks"
	"github.com/tuneinsight/lattigo/v3/ckks/bootstrapping"
	"github.com/tuneinsight/lattigo/v3/ring"
	"github.com/tuneinsight/lattigo/v3/rlwe"

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
	DiscName  string `gorm:"size:255;not null;" json:"disc_name"`
	ProductID uint64 `sql:"type:int REFERENCES items(id)" json:"product_id"`
	Quantity  uint64 `sql:"type:int" json:"qty"`
	Product   Item
}

type TransactMetaParams struct {
	Discount     Discount
	TransactMeta TransactMeta
}

type TransactParams struct {
	Transact    []Transact `json:"transacts"`
	TotalCounts int64      `json:"total_counts"`
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
	var (
		err                       error
		buyerMeta, BuyerTotalBill string
	)

	user := User{}
	user.FindUserByID(db, p.AuthorID)

	product := Item{}
	product.FindItemByID(db, meta.ProductID)

	meta.Product = product

	discount := Discount{}
	discount.FindItemByName(db, meta.DiscName)

	metaParams := TransactMetaParams{
		TransactMeta: meta,
		Discount:     discount,
	}

	if config.GetConfig().GetBootstrappingMode() == "on" {
		buyerMeta, BuyerTotalBill = p.EncOutputFromMetaBootstrap(metaParams, user.SecretKey)
	} else {
		buyerMeta, BuyerTotalBill = p.EncOutputFromMeta(metaParams, user.SecretKey)
	}

	p.BuyerMeta = buyerMeta
	p.BuyerTotalBill = BuyerTotalBill

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

func (p *Transact) SaveItemWithDiscWithoutHE(db *gorm.DB, meta TransactMeta) (*Transact, error) {
	var err error

	user := User{}
	user.FindUserByID(db, p.AuthorID)

	product := Item{}
	product.FindItemByID(db, meta.ProductID)

	meta.Product = product

	discount := Discount{}
	discount.FindItemByName(db, meta.DiscName)

	metaParams := TransactMetaParams{
		TransactMeta: meta,
		Discount:     discount,
	}

	buyerMeta, BuyerTotalBill := p.EncOutputFromMetaWithoutHE(metaParams)

	p.BuyerMeta = buyerMeta
	p.BuyerTotalBill = BuyerTotalBill

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

func (p *Transact) FindItemByUID(db *gorm.DB, uid uint32, pagination Pagination) (*TransactParams, error) {
	transacts := []Transact{}
	offset := (pagination.Page - 1) * pagination.Limit
	queryBuider := db.Limit(pagination.Limit).Offset(offset).Order(pagination.Sort)
	result := queryBuider.Model(&Transact{}).Where("author_id = ?", uid).Find(&transacts)

	if result.Error != nil {
		msg := result.Error
		return nil, msg
	}

	var count int64
	db.Model(&Transact{}).Where("author_id = ?", uid).Count(&count)

	for e, _ := range transacts {
		x := p.DecryptPerDataForBuyerMeta(db, uid, transacts[e].BuyerMeta)
		y := p.DecryptPerDataForBuyerTotalBill(db, uid, transacts[e].BuyerTotalBill)

		transacts[e].BuyerMeta = x
		transacts[e].BuyerTotalBill = y
	}

	return &TransactParams{Transact: transacts, TotalCounts: count}, nil
}

func (p *Transact) FindItemByUIDWithoutHE(db *gorm.DB, uid uint32, pagination Pagination) (*TransactParams, error) {
	transacts := []Transact{}
	offset := (pagination.Page - 1) * pagination.Limit
	queryBuider := db.Limit(pagination.Limit).Offset(offset).Order(pagination.Sort)
	result := queryBuider.Model(&Transact{}).Where("author_id = ?", uid).Find(&transacts)

	if result.Error != nil {
		msg := result.Error
		return nil, msg
	}

	var count int64
	db.Model(&Transact{}).Where("author_id = ?", uid).Count(&count)

	return &TransactParams{Transact: transacts, TotalCounts: count}, nil
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
	LogN:     4,
	LogSlots: 3,
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

var BootstrapEncParams = bootstrapping.DefaultParametersDense[3]

func (p *Transact) EncOutputFromMeta(meta TransactMetaParams, secretKey string) (string, string) {
	paramLogsGlobalBuyerMeta := 3
	paramLogsGlobalBuyerBill := 1

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
	rlk := kgen.GenRelinearizationKey(sk, 1)

	// Encryptor
	encryptor := ckks.NewEncryptor(params, pk)

	// Decryptor
	//decryptor := ckks.NewDecryptor(params, sk)

	// Buyer Meta
	buyerMeta := make([]float64, paramLogsGlobalBuyerMeta)
	buyerMeta[0] = float64(meta.TransactMeta.ProductID)
	buyerMeta[1] = float64(meta.TransactMeta.Quantity)
	buyerMeta[2] = float64(meta.Discount.ID)

	// Buyer Bill
	buyerBill := make([]float64, paramLogsGlobalBuyerBill)
	buyerBill[0] = float64(meta.TransactMeta.Product.Price * float64(meta.TransactMeta.Quantity))

	// Encoder
	encoder := ckks.NewEncoder(params)

	// Plaintext Generation
	plaintextBuyerMeta := encoder.EncodeNew(buyerMeta, params.MaxLevel(), params.DefaultScale(), paramLogsGlobalBuyerMeta)
	plaintextBuyerBill := encoder.EncodeNew(buyerBill, params.MaxLevel(), params.DefaultScale(), paramLogsGlobalBuyerBill)

	// Cipher Text Operation
	var ciphertextBuyerMeta *ckks.Ciphertext
	var ciphertextBuyerBill *ckks.Ciphertext
	ciphertextBuyerMeta = encryptor.EncryptNew(plaintextBuyerMeta)

	//fmt.Println("LEVEL: ", ciphertextBuyerMeta.Level())
	//fmt.Println("SCALE: ", ciphertextBuyerMeta.Scale)
	//fmt.Println("SCALEing(): ", ciphertextBuyerBill.ScalingFactor())

	ciphertextBuyerBill = encryptor.EncryptNew(plaintextBuyerBill)
	if config.GetConfig().GetNTTMode() != "on" && ciphertextBuyerBill != nil {
		for _, pol := range ciphertextBuyerBill.Value {
			pol.IsNTT = false
		}
	}

	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})

	if meta.Discount.PercentCut > 0.0 {
		if meta.Discount.Wholy == "true" {
			evaluator.MultByConst(ciphertextBuyerBill, meta.Discount.PercentCut, ciphertextBuyerBill)
		} else {
			evaluator.AddConst(ciphertextBuyerBill, buyerBill[0]*meta.Discount.PercentCut*(-1.00), ciphertextBuyerBill)
		}
	}

	if meta.Discount.FixedCut > 0.0 {
		//fmt.Println(float64(meta.Discount.FixedCut)*(-1.00))
		evaluator.AddConst(ciphertextBuyerBill, float64(meta.Discount.FixedCut)*(-1.00), ciphertextBuyerBill)
	}

	//emp := MarshalToBase64String(ciphertextBuyerMeta)
	////fmt.Println("Size In Bytes:", len(emp))
	//
	//// Decryption Testing
	//tmpBuyerMeta := encoder.Decode(decryptor.DecryptNew(ciphertextBuyerMeta), paramLogsGlobalBuyerMeta)
	//tmpBuyerBill := encoder.Decode(decryptor.DecryptNew(ciphertextBuyerBill), paramLogsGlobalBuyerBill)
	//
	//// Value Assignment from Decryption
	//valuesTest := make([]float64, len(tmpBuyerMeta))
	//for i := range tmpBuyerMeta {
	//	valuesTest[i] = real(tmpBuyerMeta[i])
	//}
	//
	//fmt.Printf("[CreateTransact] ProdId ValuesTest: %.3f ...\n", valuesTest[0])
	//fmt.Printf("[CreateTransact] Qty ValuesTest: %.3f ...\n", valuesTest[1])
	//fmt.Printf("[CreateTransact] DiscId ValuesTest: %.3f ...\n", valuesTest[2])

	// Value Assignment from Decryption
	//valuesTest2 := make([]float64, len(tmpBuyerBill))
	//for i := range tmpBuyerBill {
	//	valuesTest2[i] = real(tmpBuyerBill[i])
	//}

	//fmt.Printf("[CreateTransact] TotalTransact ValuesTest: %.3f ...\n", valuesTest2[0])

	startConvert := time.Now()

	str1 := MarshalToBase64String(ciphertextBuyerMeta)
	str2 := MarshalToBase64String(ciphertextBuyerBill)

	durationConvert := time.Since(startConvert)
	fmt.Println("[LOG] Convert: ", durationConvert)

	//str1 := ""
	//str2 := ""

	//f, _ := os.Create("data4.txt")
	//defer f.Close()
	//data := []byte(str2)
	//_, _ = f.Write(data)

	//fmt.Println(len(str1))
	//fmt.Println(len(str2))

	return str1, str2
}

func (p *Transact) EncOutputFromMetaBootstrap(meta TransactMetaParams, secretKey string) (string, string) {
	paramLogsGlobalBuyerMeta := 3
	paramLogsGlobalBuyerBill := 1

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
	btpParams := paramSet.BootstrappingParams
	evk := bootstrapping.GenEvaluationKeys(btpParams, params, sk)
	btp, err := bootstrapping.NewBootstrapper(params, btpParams, evk)
	if err != nil {
		panic(err)
	}

	// Encryptor
	encryptor := ckks.NewEncryptor(params, pk)

	// Decryptor
	//decryptor := ckks.NewDecryptor(params, sk)

	// Buyer Meta
	buyerMeta := make([]float64, paramLogsGlobalBuyerMeta)
	buyerMeta[0] = float64(meta.TransactMeta.ProductID)
	buyerMeta[1] = float64(meta.TransactMeta.Quantity)
	buyerMeta[2] = float64(meta.Discount.ID)

	// Buyer Bill
	buyerBill := make([]float64, paramLogsGlobalBuyerBill)
	buyerBill[0] = float64(meta.TransactMeta.Product.Price * float64(meta.TransactMeta.Quantity))

	// Encoder
	encoder := ckks.NewEncoder(params)

	// Plaintext Generation
	plaintextBuyerMeta := encoder.EncodeNew(buyerMeta, params.MaxLevel(), params.DefaultScale(), paramLogsGlobalBuyerMeta)
	plaintextBuyerBill := encoder.EncodeNew(buyerBill, params.MaxLevel(), params.DefaultScale(), paramLogsGlobalBuyerBill)

	// Cipher Text Operation
	var ciphertextBuyerMeta *ckks.Ciphertext
	var ciphertextBuyerBill *ckks.Ciphertext
	if config.GetConfig().GetNTTMode() != "on" && ciphertextBuyerBill != nil {
		for _, pol := range ciphertextBuyerBill.Value {
			pol.IsNTT = false
		}
	}
	ciphertextBuyerMeta = encryptor.EncryptNew(plaintextBuyerMeta)

	//fmt.Println("LEVEL: ", ciphertextBuyerMeta.Level())
	//fmt.Println("SCALE: ", ciphertextBuyerMeta.Scale)
	//fmt.Println("SCALEing(): ", ciphertextBuyerBill.ScalingFactor())

	ciphertextBuyerBill = encryptor.EncryptNew(plaintextBuyerBill)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, evk.EvaluationKey)

	if meta.Discount.PercentCut > 0.0 {
		if meta.Discount.Wholy == "true" {
			evaluator.MultByConst(ciphertextBuyerBill, meta.Discount.PercentCut, ciphertextBuyerBill)
		} else {
			evaluator.AddConst(ciphertextBuyerBill, buyerBill[0]*meta.Discount.PercentCut*(-1.00), ciphertextBuyerBill)
		}
	}

	if meta.Discount.FixedCut > 0.0 {
		//fmt.Println(float64(meta.Discount.FixedCut)*(-1.00))
		evaluator.AddConst(ciphertextBuyerBill, float64(meta.Discount.FixedCut)*(-1.00), ciphertextBuyerBill)
	}

	evaluator.SetScale(ciphertextBuyerBill, params.DefaultScale())
	ciphertextBootstrap := btp.Bootstrapp(ciphertextBuyerBill)
	ciphertextBuyerBill = ciphertextBootstrap

	//emp := MarshalToBase64String(ciphertextBuyerMeta)
	////fmt.Println("Size In Bytes:", len(emp))
	//
	//// Decryption Testing
	//tmpBuyerMeta := encoder.Decode(decryptor.DecryptNew(ciphertextBuyerMeta), paramLogsGlobalBuyerMeta)
	//tmpBuyerBill := encoder.Decode(decryptor.DecryptNew(ciphertextBuyerBill), paramLogsGlobalBuyerBill)
	//
	//// Value Assignment from Decryption
	//valuesTest := make([]float64, len(tmpBuyerMeta))
	//for i := range tmpBuyerMeta {
	//	valuesTest[i] = real(tmpBuyerMeta[i])
	//}
	//
	//fmt.Printf("[CreateTransact] ProdId ValuesTest: %.3f ...\n", valuesTest[0])
	//fmt.Printf("[CreateTransact] Qty ValuesTest: %.3f ...\n", valuesTest[1])
	//fmt.Printf("[CreateTransact] DiscId ValuesTest: %.3f ...\n", valuesTest[2])

	// Value Assignment from Decryption
	//valuesTest2 := make([]float64, len(tmpBuyerBill))
	//for i := range tmpBuyerBill {
	//	valuesTest2[i] = real(tmpBuyerBill[i])
	//}

	//fmt.Printf("[CreateTransact] TotalTransact ValuesTest: %.3f ...\n", valuesTest2[0])

	startConvert := time.Now()

	str1 := MarshalToBase64String(ciphertextBuyerMeta)
	str2 := MarshalToBase64String(ciphertextBuyerBill)

	durationConvert := time.Since(startConvert)
	fmt.Println("[LOG] Convert: ", durationConvert)

	//str1 := ""
	//str2 := ""

	//f, _ := os.Create("data4.txt")
	//defer f.Close()
	//data := []byte(str2)
	//_, _ = f.Write(data)

	//fmt.Println(len(str1))
	//fmt.Println(len(str2))

	return str1, str2
}

func (p *Transact) EncOutputFromMetaWithoutHE(meta TransactMetaParams) (string, string) {
	buyerBillBeforeDisc := meta.TransactMeta.Product.Price * float64(meta.TransactMeta.Quantity)

	if meta.Discount.PercentCut > 0.0 {
		if meta.Discount.Wholy == "true" {
			buyerBillBeforeDisc *= meta.Discount.PercentCut
		} else {
			discTot := buyerBillBeforeDisc * meta.Discount.PercentCut
			buyerBillBeforeDisc -= discTot
		}
	}

	if meta.Discount.FixedCut > 0.0 {
		buyerBillBeforeDisc -= meta.Discount.FixedCut
	}

	buyerBillNonHE := fmt.Sprintf("%f", buyerBillBeforeDisc)
	buyerMetaNonHE := fmt.Sprintf("%d,%d,%d", meta.TransactMeta.ProductID, meta.TransactMeta.Quantity, meta.Discount.ID)

	return buyerBillNonHE, buyerMetaNonHE
}

func Secrecy() string {
	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)
	if config.GetConfig().GetBootstrappingMode() == "on" {
		paramSet := BootstrapEncParams
		params, err = ckks.NewParametersFromLiteral(paramSet.SchemeParams)
	}
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

func (p *Transact) GeneratePaginationFromRequest(r *http.Request) Pagination {
	// Initializing default
	limit := 2
	page := 1
	sort := "id asc"
	query := r.URL.Query()

	for key, value := range query {
		queryValue := value[len(value)-1]
		switch key {
		case "limit":
			limit, _ = strconv.Atoi(queryValue)
			break
		case "page":
			page, _ = strconv.Atoi(queryValue)
			break
		case "sort":
			sort = queryValue
			break

		}
	}
	return Pagination{
		Limit: limit,
		Page:  page,
		Sort:  sort,
	}
}

func (p *Transact) DecryptPerDataForBuyerMeta(db *gorm.DB, uid uint32, buyerMeta string) string {
	user := User{}
	user.FindUserByID(db, uid)

	paramLogsGlobalBalance := 3

	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)
	if config.GetConfig().GetBootstrappingMode() == "on" {
		paramSet := BootstrapEncParams
		params, err = ckks.NewParametersFromLiteral(paramSet.SchemeParams)
	}

	ciphertext := ckks.NewCiphertext(params, params.MaxLevel(), len(params.Q()), params.DefaultScale())

	UnmarshalFromBase64(ciphertext, buyerMeta)

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

	//fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])

	s := fmt.Sprintf("%.3f,%.3f,%.3f", valuesTest[0], valuesTest[1], valuesTest[2])

	return s

}

func (p *Transact) DecryptPerDataForBuyerTotalBill(db *gorm.DB, uid uint32, buyerTotalBill string) string {
	user := User{}
	user.FindUserByID(db, uid)

	paramLogsGlobalBalance := 1
	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)
	if config.GetConfig().GetBootstrappingMode() == "on" {
		paramSet := BootstrapEncParams
		params, err = ckks.NewParametersFromLiteral(paramSet.SchemeParams)
	}

	ciphertext := ckks.NewCiphertext(params, params.MaxLevel(), len(params.Q()), params.DefaultScale())

	UnmarshalFromBase64(ciphertext, buyerTotalBill)

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

	//fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])

	s := fmt.Sprintf("%.3f", valuesTest[0])

	return s

}
