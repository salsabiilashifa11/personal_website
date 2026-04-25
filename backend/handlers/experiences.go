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

	var body struct {
		Title        *string `json:"title"`
		Organization *string `json:"organization"`
		LogoURL      *string `json:"logo_url"`
		Type         *string `json:"type"`
		StartDate    *string `json:"start_date"`
		EndDate      *string `json:"end_date"`
		Description  *string `json:"description"`
		Order        *int    `json:"order"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.Title != nil        { exp.Title = *body.Title }
	if body.Organization != nil { exp.Organization = *body.Organization }
	if body.LogoURL != nil      { exp.LogoURL = *body.LogoURL }
	if body.Type != nil         { exp.Type = *body.Type }
	if body.StartDate != nil    { exp.StartDate = *body.StartDate }
	if body.EndDate != nil      { exp.EndDate = *body.EndDate }
	if body.Description != nil  { exp.Description = *body.Description }
	if body.Order != nil        { exp.Order = *body.Order }

	if result := database.DB.Save(&exp); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, exp)
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
