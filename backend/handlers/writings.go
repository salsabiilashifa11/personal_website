package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"
	"time"

	"github.com/gin-gonic/gin"
)

func GetWritings(c *gin.Context) {
	var writings []models.Writing
	database.DB.Order("published_at desc").Find(&writings)
	c.JSON(http.StatusOK, writings)
}

func CreateWriting(c *gin.Context) {
	var body struct {
		Title       string `json:"title" binding:"required"`
		MediumURL   string `json:"medium_url" binding:"required"`
		PublishedAt string `json:"published_at"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	publishedAt := time.Now()
	if body.PublishedAt != "" {
		if t, err := time.Parse("2006-01-02", body.PublishedAt); err == nil {
			publishedAt = t
		}
	}

	writing := models.Writing{
		Title:       body.Title,
		MediumURL:   body.MediumURL,
		PublishedAt: publishedAt,
	}
	database.DB.Create(&writing)
	c.JSON(http.StatusCreated, writing)
}

func UpdateWriting(c *gin.Context) {
	id := c.Param("id")
	var writing models.Writing
	if result := database.DB.First(&writing, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Writing not found"})
		return
	}

	var body struct {
		Title       string `json:"title"`
		MediumURL   string `json:"medium_url"`
		PublishedAt string `json:"published_at"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.Title != "" {
		writing.Title = body.Title
	}
	if body.MediumURL != "" {
		writing.MediumURL = body.MediumURL
	}
	if body.PublishedAt != "" {
		if t, err := time.Parse("2006-01-02", body.PublishedAt); err == nil {
			writing.PublishedAt = t
		}
	}

	database.DB.Save(&writing)
	c.JSON(http.StatusOK, writing)
}

func DeleteWriting(c *gin.Context) {
	id := c.Param("id")
	var writing models.Writing
	if result := database.DB.First(&writing, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Writing not found"})
		return
	}
	database.DB.Delete(&writing)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
