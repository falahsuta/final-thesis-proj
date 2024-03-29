package api

import (
	"fmt"
	"log"
	"os"

	"finalthesisproject/api/config"
	"finalthesisproject/api/controllers"
	"finalthesisproject/api/seed"

	"github.com/joho/godotenv"
)

var server = controllers.Server{}

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("sad .env file found")
	}
}

func Run() {

	port := os.Getenv("PORT")
	var err error
	err = godotenv.Load()
	if err != nil {
		log.Fatalf("Error getting env, %v", err)
	} else {
		fmt.Println("We are getting the env values")
	}

	server.Initialize(os.Getenv("DB_DRIVER"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PORT"), os.Getenv("DB_HOST"), os.Getenv("DB_NAME"))
	config.Init()

	seed.Load(server.DB)

	server.Run(":" + port)

}
