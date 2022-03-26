package models

import (
	"errors"
	"time"

	"github.com/jinzhu/gorm"
)

type Balance struct {
	ID        uint64         `gorm:"primary_key;auto_increment" json:"id"`
	CurrentBalance    string `gorm:"type:text" json:"current_balance"`
	Author    User           `json:"author"`
	AuthorID  uint32         `sql:"type:int REFERENCES users(id)" json:"author_id"`
	CreatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (p *Balance) TableName() string {
	return "balances"
}

func (p *Balance) Prepare() {
	p.ID = 0
	p.CurrentBalance = "0"
	p.Author = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
}

func (p *Balance) StartAndUpdate(uid uint32) {
	p.ID = 0
	p.CurrentBalance = "0"
	p.Author = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	p.AuthorID = uid
}

func (p *Balance) Validate() error {
	if p.AuthorID < 1 {
		return errors.New("Required Author")
	}
	return nil
}

func (p *Balance) SaveItem(db *gorm.DB) (*Balance, error) {
	var err error
	err = db.Debug().Model(&Balance{}).Create(&p).Error

	if err != nil {
		return &Balance{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Balance{}, err
		}
	}
	return p, nil
}

//func (p *Balance) Activate(db *gorm.DB, uid uint32) (*Balance, error) {
//	var err error
//	balances := Balance{}
//	balances.StartAndUpdate()
//
//	err = db.Debug().Model(&Balance{}).Where("author_id = ?", uid).Find(&balances).Error
//	if err != nil {
//		return &Balance{}, err
//	}
//
//	return &balances, nil
//}

func (p *Balance) FindMyBalances(db *gorm.DB, uid uint32) (*Balance, error) {
	var err error
	balances := Balance{}
	err = db.Debug().Model(&Balance{}).Where("author_id = ?", uid).Find(&balances).Error
	if err != nil {
		return &Balance{}, err
	}

	return &balances, nil
}

func (p *Balance) FindAllBalances(db *gorm.DB) (*[]Balance, error) {
	var err error
	balances := []Balance{}
	err = db.Debug().Model(&Item{}).Limit(100).Find(&balances).Error
	if err != nil {
		return &[]Balance{}, err
	}
	if len(balances) > 0 {
		for i, _ := range balances {
			err := db.Debug().Model(&User{}).Where("id = ?", balances[i].AuthorID).Take(&balances[i].Author).Error
			if err != nil {
				return &[]Balance{}, err
			}
		}
	}
	return &balances, nil
}

