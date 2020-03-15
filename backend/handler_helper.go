package main

import (
	"math"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
)

// helper function to abort if username is not valid
func checkUsernameToReturn(c *gin.Context, username string) bool {
	if !isValidUsername(username) {
		c.Status(http.StatusBadRequest)
		return true
	}
	return false
}

// helper function to check username
func isValidUsername(s string) bool {
	if utf8.RuneCountInString(s) > 30 {
		return false
	}
	// ^[a-zA-Z0-9\uac00-\ud7a3]+$
	r, err := regexp.Compile("^[a-zA-Z0-9\uac00-\ud7a3._]+$")
	if err != nil {
		return false
	}
	return r.MatchString(s)
}

func checkEmailToReturn(c *gin.Context, email string) bool {
	if !isValidEmail(email) {
		c.Status(http.StatusBadRequest)
		return true
	}
	return false
}

func isValidEmail(s string) bool {
	r, err := regexp.Compile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

	// from https://emailregex.com, RFC5322
	// r, err := regexp.Compile("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])")

	if err != nil {
		return false
	}
	return r.MatchString(s)
}

func checkTokenToReturn(c *gin.Context, token string) bool {
	if !isValidToken(token) {
		c.Status(http.StatusBadRequest)
		return true
	}
	return false
}

func isValidToken(s string) bool {
	r, err := regexp.Compile("^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$")

	if err != nil {
		return false
	}
	return r.MatchString(s)
}

func checkPasswordToReturn(c *gin.Context, password string) bool {
	if !isValidPassword(password) {
		c.Status(http.StatusBadRequest)
		return true
	}
	return false
}

func isValidPassword(s string) bool {
	alphabet, alErr := regexp.Compile("[A-Za-z]")
	number, nErr := regexp.Compile("[0-9]")
	r, err := regexp.Compile("^[A-Za-z0-9@$!%*#?&-_]{8,}$")

	if alErr != nil || nErr != nil || err != nil {
		return false
	}
	return alphabet.MatchString(s) && number.MatchString(s) && r.MatchString(s)
}

func convertIDToReturn(c *gin.Context) uint {
	requestID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil || requestID > math.MaxUint32 || requestID == 0 {
		c.Status(http.StatusBadRequest)
		return 0
	}
	return uint(requestID)
}

func trimKeywordToReturn(c *gin.Context, keyword string) string {
	trimmed := strings.Trim(keyword, " ")
	if !isValidKeyword(trimmed) {
		c.Status(http.StatusBadRequest)
		return ""
	}
	return trimmed
}

func isValidKeyword(s string) bool {
	r, err := regexp.Compile("^[a-zA-Z0-9\uac00-\ud7a3 ]*$")
	if err != nil {
		return false
	}
	return r.MatchString(s)
}

func checkFilenameToReturn(c *gin.Context, filename string) bool {
	if !isValidFilename(filename) {
		c.Status(http.StatusBadRequest)
		return true
	}
	return false
}

func isValidFilename(s string) bool {
	r, err := regexp.Compile("^[A-Za-z0-9]+\\.[a-z]+$")
	if err != nil {
		return false
	}
	return r.MatchString(s)
}

func checkRoleToReturn(c *gin.Context, role string) bool {
	switch role {
	case admin, staff, user, temp:
		return false
	default:
		c.Status(http.StatusBadRequest)
		return true
	}
}

func checkExtToReturn(c *gin.Context, ext string) bool {
	switch ext {
	case "png", "jpeg", "jpg":
		return false
	default:
		c.Status(http.StatusBadRequest)
		return true
	}
}
