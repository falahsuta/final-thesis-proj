package models

// multiplication with constant
type OpsFloat1 struct {
	Sk       string  `json:"sk"`
	Degree   int     `json:"degree"`
	Pt1      float64 `json:"plaintext1"`
	Constant float64 `json:"constant"`
	CtOut    string  `json:"ciphertextbase64"`
}
