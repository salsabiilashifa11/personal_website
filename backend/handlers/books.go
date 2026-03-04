package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"

	"github.com/gin-gonic/gin"
)

type BooksGrouped struct {
	Reading  []models.Book `json:"reading"`
	Read     []models.Book `json:"read"`
	WillRead []models.Book `json:"will_read"`
}

func GetBooks(c *gin.Context) {
	var books []models.Book
	database.DB.Order("created_at desc").Find(&books)

	grouped := BooksGrouped{
		Reading:  []models.Book{},
		Read:     []models.Book{},
		WillRead: []models.Book{},
	}

	for _, book := range books {
		switch book.Status {
		case "reading":
			grouped.Reading = append(grouped.Reading, book)
		case "read":
			grouped.Read = append(grouped.Read, book)
		case "will_read":
			grouped.WillRead = append(grouped.WillRead, book)
		}
	}

	c.JSON(http.StatusOK, grouped)
}

func CreateBook(c *gin.Context) {
	var book models.Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&book)
	c.JSON(http.StatusCreated, book)
}

func UpdateBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book
	if result := database.DB.First(&book, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	var body models.Book
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body.ID = book.ID
	body.CreatedAt = book.CreatedAt
	database.DB.Save(&body)
	c.JSON(http.StatusOK, body)
}

func DeleteBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book
	if result := database.DB.First(&book, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	database.DB.Delete(&book)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
