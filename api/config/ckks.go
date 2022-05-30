package config

import (
	"finalthesisproject/api/Interfaces/configInterface"
	"os"
)

type Config struct {
	CKKS CKKSConfig
}

type CKKSConfig struct {
	BootstrappingMode string
	NTTMode           string
}

var config configInterface.ConfigInterface = &Config{}

func (config *Config) ProvideConfig() {
	config.CKKS.BootstrappingMode = os.Getenv("BOOTSTRAPPING_MODE")
	config.CKKS.NTTMode = os.Getenv("NTT_MODE")
}

func (config *Config) GetBootstrappingMode() string {
	return config.CKKS.BootstrappingMode
}

func (config *Config) GetNTTMode() string {
	return config.CKKS.NTTMode
}

func GetConfig() configInterface.ConfigInterface {
	return config
}

func Init() {
	config.ProvideConfig()
}
