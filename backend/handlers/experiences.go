package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"

	"github.com/gin-gonic/gin"
)

func GetExperiences(c *gin.Context) {
	var experiences []models.Experience
	database.DB.Order("`order` asc, id asc").Find(&experiences)
	c.JSON(http.StatusOK, experiences)
}

func CreateExperience(c *gin.Context) {
	var exp models.Experience
	if err := c.ShouldBindJSON(&exp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&exp)
	c.JSON(http.StatusCreated, exp)
}

func UpdateExperience(c *gin.Context) {
	id := c.Param("id")
	var exp models.Experience
	if result := database.DB.First(&exp, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Experience not found"})
		return
	}

	var body models.Experience
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body.ID = exp.ID
	database.DB.Save(&body)
	c.JSON(http.StatusOK, body)
}

func DeleteExperience(c *gin.Context) {
	id := c.Param("id")
	var exp models.Experience
	if result := database.DB.First(&exp, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Experience not found"})
		return
	}
	database.DB.Delete(&exp)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
