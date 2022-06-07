package controllers

import (
	"encoding"
	"encoding/base64"
	"encoding/json"
	"finalthesisproject/api/models"
	"finalthesisproject/api/responses"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"reflect"
	"time"

	"github.com/tuneinsight/lattigo/v3/ckks"
	"github.com/tuneinsight/lattigo/v3/ring"
	"github.com/tuneinsight/lattigo/v3/rlwe"
)

func (server *Server) CountQT(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	opsFloat1 := models.OpsFloat1{}
	err = json.Unmarshal(body, &opsFloat1)

	sk := secrecy()
	//multiConst(sk, opsFloat1.Pt1, opsFloat1.Constant, opsFloat1.Degree)

	opsFloat1.Sk = sk

	ea(opsFloat1)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	opsFloat1.Sk = ""

	//w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, post.Constant))
	responses.JSON(w, http.StatusCreated, opsFloat1)
}

func (server *Server) CountCP(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	opsFloat1 := models.OpsFloat1{}
	err = json.Unmarshal(body, &opsFloat1)

	sk := secrecy()
	multiCP(sk, opsFloat1.Pt1, opsFloat1.Constant)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	//w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, post.Constant))
	responses.JSON(w, http.StatusCreated, opsFloat1)
}

func secrecy() string {
	c := ckks.ParametersLiteral{
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

	params, err := ckks.NewParametersFromLiteral(c)
	if err != nil {
		panic(err)
	}

	sk := ckks.NewSecretKey(params)
	skStr := MarshalToBase64String(sk)

	return skStr
}

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

func generate(degree int) ckks.ParametersLiteral {
	var cek = ckks.ParametersLiteral{
		LogN:     degree,
		LogSlots: degree - 1,
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

	return cek
}

func ea(opsFloat models.OpsFloat1) {
	fmt.Println("DEGREE: ", opsFloat.Degree)

	var err error

	//params, err := ckks.NewParametersFromLiteral(ckks.DefaultParams[1])
	//params, err := ckks.NewParametersFromLiteral(ckks.PN14QP438)
	//params, err := ckks.NewParametersFromLiteral(GlobalEncParams)

	parameters := generate(opsFloat.Degree)
	params, err := ckks.NewParametersFromLiteral(parameters)

	if err != nil {
		panic(err)
	}

	// Keys
	kgen := ckks.NewKeyGenerator(params)
	sk, pk := kgen.GenKeyPair()

	// Relinearization key
	rlk := kgen.GenRelinearizationKey(sk, 2)

	// Encryptor
	encryptor := ckks.NewEncryptor(params, pk)

	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})

	paramLOGS := 1

	// Values to encrypt
	values := make([]float64, paramLOGS)
	values[0] = opsFloat.Pt1

	// ENCODE
	startEncode := time.Now()
	encoder := ckks.NewEncoder(params)
	plaintext := encoder.EncodeNew(values, params.MaxLevel(), params.DefaultScale(), paramLOGS)
	durationEncode := time.Since(startEncode)
	fmt.Println("[LOG] Encode: ", durationEncode)

	startEncrypt := time.Now()
	var ciphertext *ckks.Ciphertext
	ciphertext = encryptor.EncryptNew(plaintext)
	durationEncrypt := time.Since(startEncrypt)
	fmt.Println("[LOG] Encrypt: ", durationEncrypt)

	startMult := time.Now()
	evaluator.MultByConst(ciphertext, opsFloat.Constant, ciphertext)
	durationMult := time.Since(startMult)
	fmt.Println("[LOG] Mult: ", durationMult)

	startAdd := time.Now()
	evaluator.AddConst(ciphertext, 50000, ciphertext)
	durationAdd := time.Since(startAdd)
	fmt.Println("[LOG] Add: ", durationAdd)

	emp := MarshalToBase64String(ciphertext)
	fmt.Println("Size In Bytes:", len(emp))

	//if err := evaluator.Rescale(ciphertext, params.DefaultScale(), ciphertext); err != nil {
	//	panic(err)
	//}

	startDecrypt := time.Now()
	dec := decryptor.DecryptNew(ciphertext)
	durationDecrypt := time.Since(startDecrypt)
	fmt.Println("[LOG] Decrypt: ", durationDecrypt)

	startDecode := time.Now()
	tmp := encoder.Decode(dec, paramLOGS)
	durationDecode := time.Since(startDecode)
	fmt.Println("[LOG] Decode: ", durationDecode)

	valuesTest := make([]float64, len(tmp))
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])
}

func multiConst(skStr string, value float64, constant float64, degree int) {
	paramLogs := 1

	fmt.Println("DEGREE: ", degree)

	params, err := ckks.NewParametersFromLiteral(GlobalEncParams)
	if err != nil {
		panic(err)
	}

	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, skStr)

	kgen := ckks.NewKeyGenerator(params)
	pk := kgen.GenPublicKey(sk)
	rlk := kgen.GenRelinearizationKey(sk, 2)

	// Encryptor
	encryptor := ckks.NewEncryptor(params, pk)

	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	values := make([]float64, paramLogs)
	values[0] = value

	// ENCODE
	startEncode := time.Now()
	encoder := ckks.NewEncoder(params)
	plaintext := encoder.EncodeNew(values, params.MaxLevel(), params.DefaultScale(), paramLogs)
	durationEncode := time.Since(startEncode)
	fmt.Println("[LOG] Encode: ", durationEncode)

	startEncrypt := time.Now()
	var ciphertext *ckks.Ciphertext
	ciphertext = encryptor.EncryptNew(plaintext)

	durationEncrypt := time.Since(startEncrypt)
	fmt.Println("[LOG] Encrypt: ", durationEncrypt)

	startMult := time.Now()
	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})

	evaluator.MultByConst(ciphertext, constant, ciphertext)
	durationMult := time.Since(startMult)
	fmt.Println("[LOG] Mult: ", durationMult)

	//emp := MarshalToBase64String(ciphertext)
	//fmt.Println("Size In Bytes:", len(emp))
	//
	//f, err := os.Create("data4.txt")
	//
	//if err != nil {
	//	log.Fatal(err)
	//}
	//
	//defer f.Close()
	//
	//
	//data := []byte(emp)
	//
	//_, err2 := f.Write(data)
	//
	//if err2 != nil {
	//	log.Fatal(err2)
	//}

	startDecrypt := time.Now()
	decrypt := decryptor.DecryptNew(ciphertext)
	durationDecrypt := time.Since(startDecrypt)
	fmt.Println("[LOG] Decrypt: ", durationDecrypt)

	startDecode := time.Now()
	tmp := encoder.Decode(decrypt, paramLogs)
	durationDecode := time.Since(startDecode)
	fmt.Println("[LOG] Decode: ", durationDecode)
	valuesTest := make([]float64, len(tmp))
	//
	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	fmt.Println("constant multiplikesyen: ", constant)
	//fmt.Println()
	//fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])
}

func multiCP(skStr string, value float64, constant float64) {
	paramLogs := 1

	c := ckks.ParametersLiteral{
		LogN:     4,
		LogSlots: 3,
		Q: []uint64{0x200000e001, // 37 + 32
			0x100006001},
		P:            []uint64{0x3ffffea001}, // 38
		DefaultScale: 1 << 32,
		Sigma:        rlwe.DefaultSigma,
		RingType:     ring.Standard,
	}

	params, err := ckks.NewParametersFromLiteral(c)
	if err != nil {
		panic(err)
	}

	sk := ckks.NewSecretKey(params)
	_ = UnmarshalFromBase64(sk, skStr)

	kgen := ckks.NewKeyGenerator(params)
	pk := kgen.GenPublicKey(sk)
	rlk := kgen.GenRelinearizationKey(sk, 1)

	// Encryptor
	encryptor := ckks.NewEncryptor(params, pk)

	// Decryptor
	decryptor := ckks.NewDecryptor(params, sk)

	values := make([]float64, paramLogs)
	values[0] = value

	encoder := ckks.NewEncoder(params)
	plaintext := encoder.EncodeNew(values, params.MaxLevel(), params.DefaultScale(), paramLogs)

	mult := make([]float64, paramLogs)
	mult[0] = constant
	plaintextMult := encoder.EncodeNew(mult, params.MaxLevel(), params.DefaultScale(), paramLogs)

	var ciphertext *ckks.Ciphertext
	var ciphertext2 *ckks.Ciphertext
	ciphertext = encryptor.EncryptNew(plaintext)

	ciphertext2 = encryptor.EncryptNew(plaintextMult)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})

	evaluator.Mul(ciphertext, ciphertext2, ciphertext)

	emp := MarshalToBase64String(ciphertext)
	fmt.Println(len(emp))

	f, err := os.Create("data3.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	data := []byte(emp)

	_, err2 := f.Write(data)

	if err2 != nil {
		log.Fatal(err2)
	}

	tmp := encoder.Decode(decryptor.DecryptNew(ciphertext), paramLogs)
	valuesTest := make([]float64, len(tmp))

	for i := range tmp {
		valuesTest[i] = real(tmp[i])
	}

	fmt.Println("constant multiplikesyen: ", constant)
	fmt.Println()
	fmt.Printf("ValuesTest: %.3f ...\n", valuesTest[0])
	//fmt.Println("CEPE")
	//fmt.Println(int64(5))
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
