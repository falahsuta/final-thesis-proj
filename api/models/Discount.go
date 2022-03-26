package models

import (
	"errors"
	"github.com/jinzhu/gorm"
	"time"
)

type Discount struct {
	ID         uint64    `gorm:"primary_key;auto_increment" json:"id"`
	Name       string    `gorm:"size:255;not null;unique" json:"name"`
	PercentCut float64   `sql:"type:float" json:"percent_cut"`
	FixedCut   float64   `sql:"type:float" json:"fixed_cut"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (p *Discount) TableName() string {
	return "discounts"
}

func (p *Discount) Prepare() {
	p.ID = 0
	p.Name = ""
	p.PercentCut = 0.0
	p.FixedCut = 0.0
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
}

func (p *Discount) Validate() error {
	if p.PercentCut > 1.0 {
		return errors.New("Required Percentage")
	}

	if p.Name == "" {
		return errors.New("Required Name")
	}
	return nil
}

func (p *Discount) SaveItem(db *gorm.DB) (*Discount, error) {
	var err error
	err = db.Debug().Model(&Discount{}).Create(&p).Error

	if err != nil {
		return &Discount{}, err
	}

	return p, nil
}

func (p *Discount) FindAllItems(db *gorm.DB) (*[]Discount, error) {
	var err error
	discounts := []Discount{}
	err = db.Debug().Model(&Item{}).Limit(100).Find(&discounts).Error
	if err != nil {
		return &[]Discount{}, err
	}

	return &discounts, nil
}

func (p *Discount) FindItemByID(db *gorm.DB, pid uint64) (*Discount, error) {
	var err error
	err = db.Debug().Model(&Discount{}).Where("id = ?", pid).Take(&p).Error
	if err != nil {
		return &Discount{}, err
	}

	return p, nil
}

func (p *Discount) FindItemByName(db *gorm.DB, name string) (*Discount, error) {
	var err error
	err = db.Debug().Model(&Discount{}).Where("name = ?", name).Take(&p).Error
	if err != nil {
		return &Discount{}, err
	}

	return p, nil
}

func (p *Discount) UpdateAnItem(db *gorm.DB) (*Discount, error) {
	var err error

	err = db.Debug().Model(&Discount{}).Where("id = ?", p.ID).Updates(Discount{Name: p.Name, FixedCut: p.FixedCut, PercentCut: p.PercentCut, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Discount{}, err
	}

	return p, nil
}

func (p *Discount) DeleteAItem(db *gorm.DB, pid uint64) (int64, error) {

	db = db.Debug().Model(&Discount{}).Where("id = ?", pid).Take(&Discount{}).Delete(&Discount{})

	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Item not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}
