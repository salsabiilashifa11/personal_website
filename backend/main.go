package main

import (
	"log"
	"os"
	"personal_website/database"
	"personal_website/handlers"
	"personal_website/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env if present
	_ = godotenv.Load()

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "data.db"
	}

	database.Init(dbPath)

	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://shifa.me"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "X-Admin-Password"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Serve uploaded files
	r.Static("/uploads", "./uploads")

	api := r.Group("/api")
	{
		// Public routes
		api.GET("/about", handlers.GetAbout)
		api.GET("/experiences", handlers.GetExperiences)
		api.GET("/writings", handlers.GetWritings)
		api.GET("/books", handlers.GetBooks)

		// Admin routes
		admin := api.Group("/")
		admin.Use(middleware.AdminAuth())
		{
			admin.PUT("/about", handlers.UpdateAbout)

			admin.POST("/experiences", handlers.CreateExperience)
			admin.PUT("/experiences/:id", handlers.UpdateExperience)
			admin.DELETE("/experiences/:id", handlers.DeleteExperience)

			admin.POST("/writings", handlers.CreateWriting)
			admin.PUT("/writings/:id", handlers.UpdateWriting)
			admin.DELETE("/writings/:id", handlers.DeleteWriting)

			admin.POST("/books", handlers.CreateBook)
			admin.PUT("/books/:id", handlers.UpdateBook)
			admin.DELETE("/books/:id", handlers.DeleteBook)

			admin.POST("/upload", handlers.UploadFile)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
