package models

import (
	"errors"
	"finalthesisproject/api/config"
	"time"

	"github.com/jinzhu/gorm"
)

type Test struct {
	ID        uint64    `gorm:"primary_key;auto_increment" json:"id"`
	Function  string    `gorm:"size:255;not null" json:"function"`
	Operation string    `gorm:"size:255;not null" json:"operation"`
	Scheme    string    `gorm:"size:255;not null" json:"scheme"`
	Time      float64   `gorm:"not null" json:"time"`
	Size      float64   `gorm:"not null" json:"size"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (t *Test) TableName() string {
	return "test"
}

func (t *Test) Validate() error {
	if t.Function == "" {
		return errors.New("required function")
	}
	if t.Operation == "" {
		return errors.New("required operation")
	}
	if t.Scheme == "" {
		return errors.New("required scheme")
	}
	if t.Time == 0 {
		return errors.New("required time")
	}

	return nil
}

func (t *Test) SaveTest(db *gorm.DB) (*Test, error) {

	if config.GetConfig().GetNTTMode() != "on" {
		t.Operation += " Non NTT"
	}
	err := db.Debug().Model(&Test{}).Create(&t).Error

	if err != nil {
		return &Test{}, err
	}

	return t, nil
}

func (t *Test) FindAllTest(db *gorm.DB) (*[]Test, error) {
	test := []Test{}
	err := db.Debug().Model(&Test{}).Limit(100).Find(&test).Error
	if err != nil {
		return &[]Test{}, err
	}

	return &test, nil
}

func (t *Test) FindAverageSpesificTest(db *gorm.DB) (*Test, error) {
	test := Test{}
	err := db.Debug().Model(&Test{}).Select("function, operation, scheme, AVG(time) as time, AVG(size) as size").Where(t).Group("function, operation, scheme").First(&test).Error
	if err != nil {
		return nil, err
	}

	return &test, nil
}

func (t *Test) DeleteATest(db *gorm.DB, pid uint64) (int64, error) {

	db = db.Debug().Model(&Test{}).Where("id = ?", pid).Take(&Test{}).Delete(&Test{})

	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Item not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}
