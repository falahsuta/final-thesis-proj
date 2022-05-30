package models

import "testing"

func TestBalance_EncOutputFromZeroBalanceBootstrap(t *testing.T) {
	type args struct {
		secretKey string
	}
	tests := []struct {
		name string
		p    *Balance
		args args
		want string
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.p.EncOutputFromZeroBalanceBootstrap(tt.args.secretKey); got != tt.want {
				t.Errorf("Balance.EncOutputFromZeroBalanceBootstrap() = %v, want %v", got, tt.want)
			}
		})
	}
}
