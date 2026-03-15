package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"

	"github.com/gin-gonic/gin"
)

type PapersGrouped struct {
	Reading  []models.Paper `json:"reading"`
	Read     []models.Paper `json:"read"`
	WillRead []models.Paper `json:"will_read"`
}

func GetPapers(c *gin.Context) {
	var papers []models.Paper
	database.DB.Order("created_at desc").Find(&papers)

	grouped := PapersGrouped{
		Reading:  []models.Paper{},
		Read:     []models.Paper{},
		WillRead: []models.Paper{},
	}

	for _, p := range papers {
		switch p.Status {
		case "reading":
			grouped.Reading = append(grouped.Reading, p)
		case "read":
			grouped.Read = append(grouped.Read, p)
		case "will_read":
			grouped.WillRead = append(grouped.WillRead, p)
		}
	}

	c.JSON(http.StatusOK, grouped)
}

func CreatePaper(c *gin.Context) {
	var paper models.Paper
	if err := c.ShouldBindJSON(&paper); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&paper)
	c.JSON(http.StatusCreated, paper)
}

func UpdatePaper(c *gin.Context) {
	id := c.Param("id")
	var paper models.Paper
	if result := database.DB.First(&paper, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paper not found"})
		return
	}

	var body models.Paper
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body.ID = paper.ID
	body.CreatedAt = paper.CreatedAt
	database.DB.Save(&body)
	c.JSON(http.StatusOK, body)
}

func DeletePaper(c *gin.Context) {
	id := c.Param("id")
	var paper models.Paper
	if result := database.DB.First(&paper, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paper not found"})
		return
	}
	database.DB.Delete(&paper)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
