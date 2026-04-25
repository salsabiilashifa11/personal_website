package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"

	"github.com/gin-gonic/gin"
)

// LikeWriting increments the like counter for a writing.
func LikeWriting(c *gin.Context) {
	id := c.Param("id")
	var writing models.Writing
	if result := database.DB.First(&writing, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Writing not found"})
		return
	}
	database.DB.Exec("UPDATE writings SET likes = likes + 1 WHERE id = ?", writing.ID)
	database.DB.First(&writing, writing.ID)
	c.JSON(http.StatusOK, gin.H{"likes": writing.Likes})
}

// UnlikeWriting decrements the like counter (min 0).
func UnlikeWriting(c *gin.Context) {
	id := c.Param("id")
	var writing models.Writing
	if result := database.DB.First(&writing, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Writing not found"})
		return
	}
	database.DB.Exec("UPDATE writings SET likes = MAX(likes - 1, 0) WHERE id = ?", writing.ID)
	database.DB.First(&writing, writing.ID)
	c.JSON(http.StatusOK, gin.H{"likes": writing.Likes})
}

// GetComments returns all comments for a writing, oldest first.
func GetComments(c *gin.Context) {
	id := c.Param("id")
	var comments []models.WritingComment
	database.DB.Where("writing_id = ?", id).Order("created_at asc").Find(&comments)
	c.JSON(http.StatusOK, comments)
}

// CreateComment posts a new comment on a writing.
func CreateComment(c *gin.Context) {
	id := c.Param("id")

	// Verify the writing exists
	var writing models.Writing
	if result := database.DB.First(&writing, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Writing not found"})
		return
	}

	var body struct {
		Name    string `json:"name" binding:"required"`
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment := models.WritingComment{
		WritingID: writing.ID,
		Name:      body.Name,
		Content:   body.Content,
	}
	database.DB.Create(&comment)
	c.JSON(http.StatusCreated, comment)
}

// DeleteComment removes a comment (admin only).
func DeleteComment(c *gin.Context) {
	id := c.Param("id")
	var comment models.WritingComment
	if result := database.DB.First(&comment, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}
	database.DB.Delete(&comment)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
