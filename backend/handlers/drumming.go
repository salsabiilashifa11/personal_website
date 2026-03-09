package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetDrummingMedia(c *gin.Context) {
	var media []models.DrummingMedia
	database.DB.Order("`order` asc, id asc").Find(&media)
	c.JSON(http.StatusOK, media)
}

func CreateDrummingMedia(c *gin.Context) {
	var body models.DrummingMedia
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&body)
	c.JSON(http.StatusCreated, body)
}

func UpdateDrummingMedia(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.DrummingMedia
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	var body struct {
		URL       string `json:"url"`
		MediaType string `json:"media_type"`
		Caption   string `json:"caption"`
		Order     int    `json:"order"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	item.URL = body.URL
	item.MediaType = body.MediaType
	item.Caption = body.Caption
	item.Order = body.Order
	database.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteDrummingMedia(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.DrummingMedia{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
