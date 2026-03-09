package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"

	"github.com/gin-gonic/gin"
)

func GetAbout(c *gin.Context) {
	var about models.About
	result := database.DB.First(&about)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "About not found"})
		return
	}
	c.JSON(http.StatusOK, about)
}

func UpdateAbout(c *gin.Context) {
	var body struct {
		Content   string `json:"content"`
		Tagline   string `json:"tagline"`
		Interests string `json:"interests"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var about models.About
	database.DB.First(&about)
	about.ID = 1
	about.Content = body.Content
	about.Tagline = body.Tagline
	about.Interests = body.Interests
	database.DB.Save(&about)

	c.JSON(http.StatusOK, about)
}
