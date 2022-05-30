package configInterface

type ConfigInterface interface {
	ProvideConfig()
	GetBootstrappingMode() string
	GetNTTMode() string
}
