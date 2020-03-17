package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// NOTE : beware of SQL injection attack !
// NOTE : use `Association`

type articleListOption struct {
	Boardname     string    `json:"boardname" binding:"required"`
	SearchType    string    `json:"searchType"`
	SearchKeyword string    `json:"searchKeyword"`
	NumArticles   int       `json:"numArticles" binding:"required"`
	LastTime      time.Time `json:"lastTime"`
}

type articleForm struct {
	Boardname string   `json:"boardname" binding:"required"`
	Title     string   `json:"title" binding:"required"`
	Content   string   `json:"content" binding:"required"`
	Summary   string   `json:"summary" binding:"required"`
	Thumbnail string   `json:"thumbnail"`
	Images    []string `json:"images"`
	// TODO : change of def; []byte->string
	DraftID string `json:"draftID" binding:"required"`
}

type editArticleForm struct {
	Title     string `json:"title" binding:"required"`
	Content   string `json:"content" binding:"required"`
	Summary   string `json:"summary" binding:"required"`
	Thumbnail string `json:"thumbnail"`
}

func getArticleList(c *gin.Context) {
	// get json data
	var data articleListOption
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	search := true
	home := false

	// boardname check
	boardname := data.Boardname
	switch boardname {
	case lite, mainArticle, oasis, square:
	default:
		home = true
	}

	searchType := data.SearchType
	switch searchType {
	case "writer", "title", "content":
	default:
		search = false
	}

	searchKeyword := data.SearchKeyword
	if utf8.RuneCountInString(strings.Trim(searchKeyword, " ")) < 2 {
		search = false
	} else {
		searchKeyword = trimKeywordToReturn(c, searchKeyword)
		if searchKeyword == "" {
			return
		}
	}

	numArticles := data.NumArticles
	if numArticles < 2 || numArticles > 30 {
		c.Status(http.StatusBadRequest)
		return
	}

	lastTime := data.LastTime
	if lastTime.IsZero() {
		lastTime = time.Now()
	}

	var articles []Article
	const selectQuery = "created_at, updated_at, title, summary, thumbnail, count"
	var query *gorm.DB
	if home {
		query = db.Model(&Article{}).
			Where("boardname = ? OR boardname = ? OR boardname = ?",
				lite, mainArticle, oasis).
			Order("created_at desc").Select(selectQuery).Limit(numArticles).
			Find(&articles)
	} else if search {
		// search
		query = db.Model(&Article{}).
			Where("boardname = ? AND "+searchType+" LIKE ? AND created_at < ?",
				boardname, "%"+searchKeyword+"%", lastTime).
			Order("created_at desc").Select(selectQuery).Limit(numArticles).
			Find(&articles)
	} else {
		// no search
		query = db.Model(&Article{}).
			Where("boardname = ? AND created_at < ?", boardname, lastTime).
			Order("created_at desc").Select(selectQuery).
			Limit(numArticles).Find(&articles)
	}
	if query.Error != nil {
		c.Status(http.StatusNotFound)
		return
	}

	result := make([]map[string]interface{}, len(articles)+1)
	var newLastTime time.Time
	for _, article := range articles {
		// var writer User
		// asoc := db.Model(&article).Association("Writer").Find(&writer)
		// if asoc.Error != nil {
		// 	c.Status(http.StatusInternalServerError)
		// 	return
		// }

		atc := map[string]interface{}{
			// "writer":    writer.Username,
			"writer":    article.Writer,
			"title":     article.Title,
			"summary":   article.Summary,
			"thumbnail": article.Thumbnail,
			"count":     article.Count,
			"createdAt": article.CreatedAt,
			"isUpdated": article.UpdatedAt.After(article.CreatedAt),
		}
		result = append(result, atc)
		newLastTime = article.CreatedAt
	}
	newLastTimeMap := map[string]interface{}{
		"lastTime": newLastTime,
	}
	result = append(result, newLastTimeMap)
	c.JSON(http.StatusOK, result)
}

func filenameToMIME(s string) string {
	prefix := "data:image/"
	suffix := ";base64,"
	switch s[strings.LastIndex(s, ".")+1:] {
	case "png":
		return prefix + s + suffix
	case "jpg", "jpeg":
		return prefix + "jpeg" + suffix
	default:
		return ""
	}
}

// helper function for postArticle
func extToMIME(s string) string {
	prefix := "data:image/"
	suffix := ";base64,"
	switch s {
	case "png":
		return prefix + s + suffix
	case "jpeg", "jpg":
		return prefix + "jpeg" + suffix
	default:
		return filenameToMIME(s)
	}
}

func postArticle(c *gin.Context) {
	// get json data
	var data articleForm
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// uuid (draftID) check
	draftID := data.DraftID
	if checkTokenToReturn(c, draftID) {
		return
	}

	// title check
	title := data.Title
	if utf8.RuneCountInString(title) > 120 {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "title is too long"})
		return
	}

	// content check
	content := data.Content
	if len(content) > (1<<24 - 1) {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "content is too long"})
		return
	}

	// summary check
	summary := data.Summary
	if utf8.RuneCountInString(summary) > 300 {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "summary is too long"})
		return
	}

	// boardname check
	boardname := data.Boardname
	switch boardname {
	case lite, mainArticle, oasis, square:
	default:
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Invalid boardname : " + boardname})
		return
	}

	// role check
	s := sessions.Default(c)
	role := s.Get(rolekey)
	switch role {
	case admin, staff:
	case user:
		if boardname != square {
			c.Status(http.StatusUnauthorized)
			return
		}
	default:
		c.Status(http.StatusUnauthorized)
		return
	}

	// thumbnail check
	thumbnail := data.Thumbnail
	if checkImageToReturn(c, thumbnail) {
		return
	}
	if len(thumbnail) > 1<<24-1 {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "thumbnail is too big"})
		return
	}

	// images check
	images := data.Images
	for _, value := range images {
		if checkImageToReturn(c, value) {
			return
		}
	}

	username := s.Get(userkey)
	// writer
	var writer User
	query := db.Model(&User{}).Where("username = ?", username.(string)).
		First(&writer)
	if query.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	if _, err := os.Stat("./archive/" + draftID); os.IsNotExist(err) {
		c.Status(http.StatusBadRequest)
		return
	}

	filePath := "./archive/" + draftID + "/media"
	files, readErr := ioutil.ReadDir(filePath)
	if readErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": readErr.Error()})
		return
	}

	// TODO : Image is not created!
	for key, value := range images {
		// store images on DB
		img := Image{
			Content: value,
		}
		if create := db.Create(&img); create.Error != nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		// and fix html image source
		// /archive/:uid/media/image1.jpeg -> /api/v1/article/:id
		path := "/archive/" + draftID + "/media/" + files[key-1].Name()
		fmt.Println(path)
		content = strings.Replace(content, path,
			"/api/v1/image/"+string(img.ID),
			strings.Count(content, path))
		fmt.Println(content)
	}

	newArticle := Article{
		Boardname: boardname,
		Writer:    username.(string),
		Title:     title,
		Content:   content,
		Summary:   summary,
		Thumbnail: thumbnail,
		Count:     0,
		DraftID:   draftID,
	}

	if create := db.Create(&newArticle); create.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": newArticle.ID})
}

// TODO : getEditArticle (IMAGES SHOULD BE DIFFERENT!)
func getArticle(c *gin.Context) {
	id := convertIDToReturn(c)
	if id == 0 {
		return
	}

	var article Article
	selectQuery := "created_at, updated_at, boardname, title, content, count"
	articleQuery := db.Model(Article{}).Select(selectQuery).
		Where("id = ?", id).Find(&article)
	if articleQuery.Error != nil {
		c.Status(http.StatusNotFound)
		return
	}

	var cmts []Comment

	var comments []map[string]interface{}
	if q := db.Model(&Comment{}).Where("ArticleRefer = ?", article.ID).Find(&cmts); q.Error == nil {
		// there are comments
		comments = make([]map[string]interface{}, len(cmts))
	}

	for _, cmt := range cmts {
		comment := map[string]interface{}{
			"writer":    cmt.Writer,
			"content":   cmt.Content,
			"createdAt": cmt.CreatedAt,
			"isUpdated": cmt.UpdatedAt.After(cmt.CreatedAt),
		}
		comments = append(comments, comment)
	}

	result := map[string]interface{}{
		"boardname": article.Boardname,
		"writer":    article.Writer,
		"title":     article.Title,
		"content":   article.Content,
		"comments":  comments,
		"count":     article.Count + 1,
		"createdAt": article.CreatedAt,
		"updatedAt": article.UpdatedAt,
		"isUpdated": article.UpdatedAt.After(article.CreatedAt),
	}

	c.JSON(http.StatusOK, result)
	db.Model(&article).Update(Article{Count: article.Count + 1})
}

func editArticle(c *gin.Context) {
	id := convertIDToReturn(c)
	if id == 0 {
		return
	}

	// firsthand auth check
	s := sessions.Default(c)
	role := s.Get(rolekey)
	username := s.Get(userkey)
	switch role {
	case admin, staff, user:
	default:
		c.Status(http.StatusUnauthorized)
		return
	}

	// get json data
	var data editArticleForm
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// title check
	title := data.Title
	if utf8.RuneCountInString(title) > 120 {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "title is too long"})
		return
	}

	// content check
	content := data.Content
	if len(content) > (1<<24 - 1) {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "content is too long"})
		return
	}

	// summary check
	summary := data.Summary
	if utf8.RuneCountInString(summary) > 300 {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "summary is too long"})
		return
	}

	// thumbnail check
	thumbnail := data.Thumbnail
	if checkImageToReturn(c, thumbnail) {
		return
	}
	if len(thumbnail) > 1<<24-1 {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "thumbnail is too big"})
		return
	}

	var article Article
	if query := db.First(&article, id); query.Error != nil {
		c.Status(http.StatusNotFound)
		return
	}
	var writer User
	// query := db.Model(&article).Association("Writer").Find(&writer)
	query := db.Model(&User{}).Where("username = ?", article.Writer).
		First(&writer)
	if query.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// second auth check
	switch role {
	case admin:
	case staff:
		if writer.Username != username {
			c.Status(http.StatusUnauthorized)
			return
		}
	case user:
		if writer.Username != username || article.Boardname != square {
			c.Status(http.StatusUnauthorized)
			return
		}
	default:
		c.Status(http.StatusUnauthorized)
		return
	}

	// update article on DB
	// only non-blank and updated values are updated
	update := db.Model(&article).Updates(Article{
		Title:     title,
		Content:   content,
		Summary:   summary,
		Thumbnail: thumbnail,
	})
	if update.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": article.ID})
}

func deleteArticle(c *gin.Context) {
	id := convertIDToReturn(c)
	if id == 0 {
		return
	}

	var article Article

	if query := db.First(&article, id); query.Error != nil {
		c.Status(http.StatusNotFound)
		return
	}

	if delete := db.Delete(&article); delete.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted"})
}

func fetchImage(c *gin.Context) {
	id := convertIDToReturn(c)
	if id == 0 {
		return
	}

	var image Image

	if query := db.First(&image, id); query.Error != nil {
		c.Status(http.StatusNotFound)
		return
	}
	// i := strings.Index("data:image/jpeg;base64,", ":")
	// j := strings.Index("data:image/jpeg;base64,", ";")
	// fmt.Println(st[i+1:j])
	// i := strings.Index(image.Ext, ":")
	// j := strings.Index(image.Ext, ";")
	// c.Data(http.StatusOK, image.Ext[i+1:j], image.Content)
	// TODO : TEST
	c.String(http.StatusOK, image.Content)
}
