package handlers

import (
	"net/http"
	"personal_website/database"
	"personal_website/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetMovies(c *gin.Context) {
	var movies []models.Movie
	database.DB.Order("`order` asc, id asc").Find(&movies)
	c.JSON(http.StatusOK, movies)
}

func CreateMovie(c *gin.Context) {
	var body models.Movie
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&body)
	c.JSON(http.StatusCreated, body)
}

func UpdateMovie(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var movie models.Movie
	if err := database.DB.First(&movie, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	var body struct {
		Title       string `json:"title"`
		Year        string `json:"year"`
		Director    string `json:"director"`
		Genre       string `json:"genre"`
		Description string `json:"description"`
		PosterURL   string `json:"poster_url"`
		Order       int    `json:"order"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	movie.Title = body.Title
	movie.Year = body.Year
	movie.Director = body.Director
	movie.Genre = body.Genre
	movie.Description = body.Description
	movie.PosterURL = body.PosterURL
	movie.Order = body.Order
	database.DB.Save(&movie)
	c.JSON(http.StatusOK, movie)
}

func DeleteMovie(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.Movie{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
