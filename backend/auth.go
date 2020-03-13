package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

const (
	rolekey = "role"
	userkey = "username"
)

func abortWithError(c *gin.Context) {
	c.AbortWithStatus(
		http.StatusUnauthorized,
	)
	return
}

// AuthRequired is complex middleware to check session
func AuthRequired(level string) gin.HandlerFunc {
	return func(c *gin.Context) {
		s := sessions.Default(c)
		role := s.Get(rolekey)
		switch role {
		case admin:
			c.Next()
		case staff:
			if level == admin {
				abortWithError(c)
			} else {
				c.Next()
			}
		case user:
			if level == admin || level == staff {
				abortWithError(c)
			} else {
				c.Next()
			}
		case temp:
			if level == admin || level == staff || level == user {
				abortWithError(c)
			} else {
				c.Next()
			}
		default:
			abortWithError(c)
		}
	}
}
