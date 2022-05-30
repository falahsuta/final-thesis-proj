package config

import (
	"os"
	"reflect"
	"testing"
)

func TestProvideConfig(t *testing.T) {
	_, _ = os.Setenv("NTT_MODE", "on"), os.Setenv("BOOTSTRAPPING_MODE", "off")
	defer os.Clearenv()
	type want CKKSConfig
	wantTest := CKKSConfig{
		BootstrappingMode: "off",
		NTTMode:           "on",
	}
	tests := []struct {
		name string
		test func()
		want
	}{
		{
			name: "Do preparation for config",
			test: func() {
				Init()
			},
			want: want(wantTest),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.test()
			// if (err != nil) != tt.wantErr {
			// 	t.Errorf("Config error = %v, wantErr %v", err, tt.wantErr)
			// 	return
			// }
			if !reflect.DeepEqual(GetConfig().GetBootstrappingMode(), tt.want.BootstrappingMode) {
				t.Errorf("Config got = %v, want %v",
					GetConfig().GetBootstrappingMode(), tt.want.BootstrappingMode)
			}
			if !reflect.DeepEqual(GetConfig().GetNTTMode(), tt.want.NTTMode) {
				t.Errorf("Config got = %v, want %v", GetConfig().GetNTTMode(), tt.want.NTTMode)
			}
		})

	}
}
