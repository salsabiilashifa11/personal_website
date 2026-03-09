package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateRecommendation(c *gin.Context) {
	var body struct {
		Title  string `json:"title"`
		Author string `json:"author"`
		Note   string `json:"note"`
		From   string `json:"from"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if body.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title is required"})
		return
	}
	rec := models.Recommendation{
		Title:  body.Title,
		Author: body.Author,
		Note:   body.Note,
		From:   body.From,
	}
	database.DB.Create(&rec)
	c.JSON(http.StatusCreated, rec)
}

func GetRecommendations(c *gin.Context) {
	var recs []models.Recommendation
	database.DB.Order("created_at desc").Find(&recs)
	c.JSON(http.StatusOK, recs)
}

func DeleteRecommendation(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	database.DB.Delete(&models.Recommendation{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
