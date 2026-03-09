package database

import (
	"log"
	"personal_website/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(dbPath string) {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	err = DB.AutoMigrate(
		&models.About{},
		&models.Experience{},
		&models.Writing{},
		&models.Book{},
		&models.Recommendation{},
		&models.DrummingMedia{},
		&models.Movie{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Seed a default About row if none exists
	var count int64
	DB.Model(&models.About{}).Count(&count)
	if count == 0 {
		DB.Create(&models.About{ID: 1, Content: ""})
	}

	log.Println("Database initialized successfully")
}
