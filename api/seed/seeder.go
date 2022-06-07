package seed

import (
	"log"

	"github.com/lib/pq"

	"finalthesisproject/api/models"

	"github.com/jinzhu/gorm"
)

var discounts = []models.Discount{
	models.Discount{
		Name:       "DISCOUNT30",
		PercentCut: 0.3,
		FixedCut:   4000.00,
	},
	models.Discount{
		Name:       "DISCOUNT30S",
		PercentCut: 0.3,
		FixedCut:   4000.00,
		Wholy:      "true",
	},
	models.Discount{
		Name:       "DISCOUNT50",
		PercentCut: 0.5,
		FixedCut:   0.0,
	},
	models.Discount{
		Name:       "DISCOUNT90",
		PercentCut: 0.0,
		FixedCut:   9000.0,
	},
}

var users = []models.User{
	models.User{
		Nickname: "Steven victor",
		Email:    "steven@gmail.com",
		Password: "password",
	},
	// models.User{
	// 	Nickname: "Steven victor2",
	// 	Email:    "steven2@gmail.com",
	// 	Password: "password",
	// },
	// models.User{
	// 	Nickname: "Steven victor3",
	// 	Email:    "steven3@gmail.com",
	// 	Password: "password",
	// },
	// models.User{
	// 	Nickname: "Steven victor4",
	// 	Email:    "steven4@gmail.com",
	// 	Password: "password",
	// },
	// models.User{
	// 	Nickname: "Steven victor5",
	// 	Email:    "steven5@gmail.com",
	// 	Password: "password",
	// },
	// models.User{
	// 	Nickname: "Steven victor6",
	// 	Email:    "steven6@gmail.com",
	// 	Password: "password",
	// },
}

var posts = []models.Post{
	models.Post{
		Title:   "Title 1",
		Content: "Hello world 1",
	},
	models.Post{
		Title:   "Title 2",
		Content: "Hello world 2",
	},
}

var items = []models.Item{
	models.Item{
		Title:     "Title 1",
		Content:   "Hello world 1",
		Price:     30000.00,
		Images:    pq.StringArray{"https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg"},
		Quantity:  9,
		TotalSold: 3,
	},
	models.Item{
		Title:     "Title 2",
		Content:   "Hello world 2",
		Price:     30000.00,
		Images:    pq.StringArray{"https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg"},
		Quantity:  9,
		TotalSold: 2,
	},
	models.Item{
		Title:     "Title 3",
		Content:   "Hello world 3",
		Price:     30000.00,
		Images:    pq.StringArray{"https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg"},
		Quantity:  9,
		TotalSold: 1,
	},
	models.Item{
		Title:    "Title 4",
		Content:  "Hello world 4",
		Price:    30000.00,
		Images:   pq.StringArray{"https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg"},
		Quantity: 9,
	},
	models.Item{
		Title:    "Title 5",
		Content:  "Hello world 5",
		Price:    30000.00,
		Images:   pq.StringArray{"https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg"},
		Quantity: 9,
	},
	models.Item{
		Title:    "Title 6",
		Content:  "Hello world 6",
		Price:    30000.00,
		Images:   pq.StringArray{"https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg", "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg"},
		Quantity: 9,
	},
}

var tags = []models.Tag{
	models.Tag{
		Name: "Quirk",
		Link: "https://shopage.s3.amazonaws.com/media/f855/580321926366_PEnByxR6Xdn7soyNMiGPG4ZPMng1N4CN4D4XvB7j.jpg",
		Capt: "Most Popular Genre Around",
	},
	models.Tag{
		Name: "Bizzare",
		Link: "https://music-artwork.com/wp-content/uploads/2020/05/preview_artwork55.jpg",
		Capt: "Bizzare Things Around",
	},
	models.Tag{
		Name: "Cool",
		Link: "https://music-artwork.com/wp-content/uploads/2018/04/artwork_music-2.jpg",
		Capt: "The coolest thing you'd find",
	},
	models.Tag{
		Name: "Informative",
		Link: "https://music-artwork.com/wp-content/uploads/2020/08/preview_album_cover878.jpg",
		Capt: "You'll find it useful",
	},
	models.Tag{
		Name: "Tech",
		Link: "https://music-artwork.com/wp-content/uploads/2020/04/preview_artwork76.jpg",
		Capt: "Makes you a Techie geek",
	},
	models.Tag{
		Name: "Study-tips",
		Link: "https://music-artwork.com/wp-content/uploads/2018/04/32017151_album_art.jpg",
		Capt: "Cramming exam? wait no more",
	},
	{
		Name: "Rnb",
		Link: "https://music-artwork.com/wp-content/uploads/2018/06/jan2018137.jpg",
		Capt: "Gets you the blues feeling",
	},
	{
		Name: "Soul",
		Link: "https://music-artwork.com/wp-content/uploads/2018/06/march32018084.jpg",
		Capt: "Anything but soul",
	},
	{
		Name: "Pop",
		Link: "https://music-artwork.com/wp-content/uploads/2020/06/preview_artwork065.jpg",
		Capt: "Gets you socialy active",
	},
}

func Load(db *gorm.DB) {

	err := db.Debug().DropTableIfExists(&models.Post{}, &models.User{}, &models.Item{}, &models.Tag{}, &models.Balance{}, &models.Discount{}, &models.Transact{}, &models.Test{}).Error
	if err != nil {
		log.Fatalf("cannot drop table: %v", err)
	}
	err = db.Debug().AutoMigrate(&models.User{}, &models.Post{}, &models.Item{}, &models.Tag{}, &models.Balance{}, &models.Discount{}, &models.Transact{}, &models.Test{}).Error
	if err != nil {
		log.Fatalf("cannot migrate table: %v", err)
	}

	/*
		err = db.Debug().Model(&models.Post{}).AddForeignKey("author_id", "users(id)", "cascade", "cascade").Error
		if err != nil {
			log.Fatalf("attaching foreign key error: %v", err)
		}
	*/

	for e, _ := range tags {
		err = db.Debug().Model(&models.Tag{}).Create(&tags[e]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}
	}

	for k, _ := range discounts {
		err = db.Debug().Model(&models.Discount{}).Create(&discounts[k]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}
	}

	for i, _ := range users {
		err = db.Debug().Model(&models.User{}).Create(&users[i]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}
		//posts[i].AuthorID = users[i].ID
		//
		//err = db.Debug().Model(&models.Post{}).Create(&posts[i]).Error
		//if err != nil {
		//	log.Fatalf("cannot seed posts table: %v", err)
		//}

		items[i].AuthorID = users[i].ID
		err = db.Debug().Model(&models.Item{}).Create(&items[i]).Error
		if err != nil {
			log.Fatalf("cannot seed items table: %v", err)
		}

	}

}
