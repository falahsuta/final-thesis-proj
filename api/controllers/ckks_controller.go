package controllers

import (
	"encoding"
	"encoding/base64"
	"encoding/json"
	"finalthesisproject/api/models"
	"finalthesisproject/api/responses"
	"fmt"
	"github.com/tuneinsight/lattigo/v3/ckks"
	"github.com/tuneinsight/lattigo/v3/ring"
	"github.com/tuneinsight/lattigo/v3/rlwe"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"reflect"
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
	multiConst(sk, opsFloat1.Pt1, opsFloat1.Constant)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

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
	skStr := MarshalToBase64String(sk)

	return skStr
}



func multiConst(skStr string, value float64, constant float64) {
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

	var ciphertext *ckks.Ciphertext
	ciphertext = encryptor.EncryptNew(plaintext)

	// Evaluator
	evaluator := ckks.NewEvaluator(params, rlwe.EvaluationKey{Rlk: rlk})


	evaluator.MultByConst(ciphertext, constant, ciphertext)

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
	fmt.Println("CEPE")
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
