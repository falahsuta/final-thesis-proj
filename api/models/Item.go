package models

import (
	"errors"
	"html"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
)

type Item struct {
	ID        uint64         `gorm:"primary_key;auto_increment" json:"id"`
	Title     string         `gorm:"size:255;not null;unique" json:"title"`
	Content   string         `gorm:"size:255;not null;" json:"content"`
	Author    User           `json:"author"`
	AuthorID  uint32         `sql:"type:int REFERENCES users(id)" json:"author_id"`
	CreatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	Images    pq.StringArray `gorm:"type:text[]" json:"images"`
	Quantity  uint32         `gorm:"type:int" json:"quantity"`
	TotalSold uint32         `gorm:"type:int" json:"total_sold"`
	Buyer     pq.StringArray `gorm:"type:text[]" json:"buyer_ids"`
	Price     float64        `sql:"type:float" json:"price"`
}

type Pagination struct {
	Limit int    `json:"limit"`
	Page  int    `json:"page"`
	Sort  string `json:"sort"`
}

func (p *Item) TableName() string {
	return "items"
}

func (p *Item) Prepare() {
	p.ID = 0
	p.Title = html.EscapeString(strings.TrimSpace(p.Title))
	p.Content = html.EscapeString(strings.TrimSpace(p.Content))
	p.Author = User{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
}

func (p *Item) Validate() error {
	if p.Title == "" {
		return errors.New("Required Title")
	}
	if p.Content == "" {
		return errors.New("Required Content")
	}
	if p.AuthorID < 1 {
		return errors.New("Required Author")
	}
	return nil
}

func (p *Item) SaveItem(db *gorm.DB) (*Item, error) {
	var err error
	err = db.Debug().Model(&Item{}).Create(&p).Error

	if err != nil {
		return &Item{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Item{}, err
		}
	}
	return p, nil
}

func (p *Item) FindAllItems(db *gorm.DB) (*[]Item, error) {
	var err error
	items := []Item{}
	err = db.Debug().Model(&Item{}).Limit(100).Find(&items).Error
	if err != nil {
		return &[]Item{}, err
	}
	if len(items) > 0 {
		for i, _ := range items {
			err := db.Debug().Model(&User{}).Where("id = ?", items[i].AuthorID).Take(&items[i].Author).Error
			if err != nil {
				return &[]Item{}, err
			}
		}
	}
	return &items, nil
}

func (p *Item) FindAllItemsWithPaginate(db *gorm.DB, pagination *Pagination) (*[]Item, error) {
	items := []Item{}
	offset := (pagination.Page - 1) * pagination.Limit
	queryBuider := db.Limit(pagination.Limit).Offset(offset).Order(pagination.Sort)
	result := queryBuider.Model(&Item{}).Find(&items)

	if result.Error != nil {
		msg := result.Error
		return nil, msg
	}

	if len(items) > 0 {
		for i, _ := range items {
			err := db.Debug().Model(&User{}).Where("id = ?", items[i].AuthorID).Take(&items[i].Author).Error
			if err != nil {
				return &[]Item{}, err
			}
		}
	}
	return &items, nil
}

func (p *Item) FindItemByID(db *gorm.DB, pid uint64) (*Item, error) {
	var err error
	err = db.Debug().Model(&Item{}).Where("id = ?", pid).Take(&p).Error
	if err != nil {
		return &Item{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Item{}, err
		}
	}
	return p, nil
}

func (p *Item) UpdateAnItem(db *gorm.DB) (*Item, error) {
	var err error

	err = db.Debug().Model(&Item{}).Where("id = ?", p.ID).Updates(Item{Title: p.Title, Content: p.Content, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Item{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.AuthorID).Take(&p.Author).Error
		if err != nil {
			return &Item{}, err
		}
	}
	return p, nil
}

func (p *Item) DeleteAItem(db *gorm.DB, pid uint64, uid uint32) (int64, error) {

	db = db.Debug().Model(&Item{}).Where("id = ? and author_id = ?", pid, uid).Take(&Item{}).Delete(&Item{})

	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Item not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}

func (p *Item) GeneratePaginationFromRequest(r *http.Request) Pagination {
	// Initializing default
	limit := 2
	page := 1
	sort := "id asc"
	query := r.URL.Query()

	for key, value := range query {
		queryValue := value[len(value)-1]
		switch key {
		case "limit":
			limit, _ = strconv.Atoi(queryValue)
			break
		case "page":
			page, _ = strconv.Atoi(queryValue)
			break
		case "sort":
			sort = queryValue
			break

		}
	}
	return Pagination{
		Limit: limit,
		Page:  page,
		Sort:  sort,
	}
}
