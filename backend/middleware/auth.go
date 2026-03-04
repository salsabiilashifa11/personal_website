package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		password := os.Getenv("ADMIN_PASSWORD")
		if password == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin password not configured"})
			c.Abort()
			return
		}

		provided := c.GetHeader("X-Admin-Password")
		if provided != password {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		c.Next()
	}
}
