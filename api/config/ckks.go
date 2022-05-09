package config

import "os"

type Config struct {
	CKKS CKKSConfig
}

type CKKSConfig struct {
	BootstrappingMode string
	NTTMode           string
}

var config Config

func ProvideConfig() {
	config.CKKS.BootstrappingMode = os.Getenv("BOOTSTRAPPING_MODE")
	config.CKKS.NTTMode = os.Getenv("NTT_MODE")
}

func GetBootstrappingMode() string {
	return config.CKKS.BootstrappingMode
}

func GetNTTMode() string {
	return config.CKKS.NTTMode
}
