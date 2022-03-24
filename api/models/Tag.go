package models

import (
	"errors"
	"github.com/jinzhu/gorm"
)

type Tag struct {
	ID   uint64 `gorm:"primary_key;auto_increment" json:"id"`
	Name string `gorm:"size:255;not null;unique" json:"name"`
	Capt string `gorm:"size:255;not null;unique" json:"caption"`
	Link string `gorm:"size:255;not null;unique" json:"link"`
}

func (p *Tag) TableName() string {
	return "tags"
}

func (p *Tag) Validate() error {
	if p.Name == "" {
		return errors.New("Required Name")
	}

	if p.Capt == "" {
		return errors.New("Required Caption")
	}

	if p.Link == "" {
		return errors.New("Required Link")
	}

	return nil
}

func (p *Tag) SaveTag(db *gorm.DB) (*Tag, error) {
	var err error
	err = db.Debug().Model(&Tag{}).Create(&p).Error

	if err != nil {
		return &Tag{}, err
	}

	return p, nil
}

func (p *Tag) FindAllTags(db *gorm.DB) (*[]Tag, error) {
	var err error
	tags := []Tag{}
	err = db.Debug().Model(&Tag{}).Limit(100).Find(&tags).Error
	if err != nil {
		return &[]Tag{}, err
	}

	return &tags, nil
}

func (p *Tag) UpdateATag(db *gorm.DB) (*Tag, error) {
	var err error

	err = db.Debug().Model(&Tag{}).Where("id = ?", p.ID).Updates(Tag{Name: p.Name, Capt: p.Capt}).Error
	if err != nil {
		return &Tag{}, err
	}

	return p, nil
}

func (p *Tag) DeleteATag(db *gorm.DB, pid uint64) (int64, error) {

	db = db.Debug().Model(&Tag{}).Where("id = ?", pid).Take(&Tag{}).Delete(&Tag{})

	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Item not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}
