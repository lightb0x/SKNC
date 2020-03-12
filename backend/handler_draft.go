package main

import (
	"bytes"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// helper function for postDocx
func streamToByte(stream io.Reader) []byte {
	buf := new(bytes.Buffer)
	buf.ReadFrom(stream)
	return buf.Bytes()
}

func postDocx(c *gin.Context) {
	// get docx file from client
	inputFile, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer inputFile.Close()

	// uuid for filename
	uid := uuid.New().String()
	filename := "original.docx"
	newPath := "./archive/" + uid

	if err := os.Mkdir(newPath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	// create file
	f, err := os.Create(newPath + "/" + filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}
	defer f.Close()

	// write to file
	if _, err := f.Write(streamToByte(inputFile)); err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	if err := os.Chdir(newPath); err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	// use pandoc to get HTML and img files
	cmd := exec.Command("pandoc",
		"--webtex='https://latex.codecogs.com/svg.latex?'",
		"--extract-media=.",
		"-o", "./draft.html", "./"+filename)
	if err := cmd.Run(); err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	if err := os.Chdir("../../"); err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	// return generated uuid
	c.JSON(http.StatusOK, gin.H{"message": uid})
}

func getImgs(c *gin.Context) {
	id := c.Query("id")

	if checkTokenToReturn(c, id) {
		return
	}

	filePath := "./archive/" + id + "/media"

	files, readErr := ioutil.ReadDir(filePath)
	if readErr != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": readErr.Error()})
		return
	}

	images := make(map[string][]byte, len(files))
	for _, f := range files {
		// open f.Name()
		imgPath := filePath + "/" + f.Name()
		imgFile, openErr := os.Open(imgPath)
		if openErr != nil {
			c.JSON(http.StatusInternalServerError,
				gin.H{"error": openErr.Error()})
			return
		}
		defer imgFile.Close()

		// get file size
		stat, statErr := os.Stat(imgPath)
		if statErr != nil {
			c.JSON(http.StatusInternalServerError,
				gin.H{"error": statErr.Error()})
			return
		}

		img := make([]byte, stat.Size())
		if _, err := imgFile.Read(img); err != nil {
			c.JSON(http.StatusInternalServerError,
				gin.H{"error": err.Error()})
			return
		}

		// append []byte to images
		images[f.Name()] = img
	}
	c.JSON(http.StatusOK, images)
}

func getHTML(c *gin.Context) {
	id := c.Query("id")

	if checkTokenToReturn(c, id) {
		return
	}

	filePath := "./archive/" + id + "/draft.html"

	htmlFile, openErr := os.Open(filePath)
	if openErr != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": openErr.Error()})
		return
	}
	defer htmlFile.Close()

	stat, statErr := os.Stat(filePath)
	if statErr != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": statErr.Error()})
		return
	}

	html := make([]byte, stat.Size())
	if _, err := htmlFile.Read(html); err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": html})
}
