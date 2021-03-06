package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB
var err error

// TODO : FINAL CHECK BEFORE DEPLOY
// 				db.Select
// 				return -> Status
// 				SQL INJECTION
// 				filesystem bypass, etc.
//        update packages by `go get -u all` ?
func main() {
	db, err = gorm.Open("sqlite3", "./sqlite.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// for release
	// gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	// TODO : DELETE FOLLOWING LINE WHEN DEPLOYING
	r.Use(cors.Default()) // CORS allow-all : ONLY FOR DEV MODE

	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("sessionid", store))
	// r.Use(csrf.Middleware(csrf.Options{
	// 	// Secret: "secret123", // TODO : go for real secret key
	// 	ErrorFunc: func(c *gin.Context) {
	// 		fmt.Println("CSRF token mismatch")
	// 		c.String(400, "CSRF token mismatch")
	// 		c.Abort()
	// 	},
	// }))
	// r.GET("/protected", func(c *gin.Context) {
	// 	c.String(200, csrf.GetToken(c))
	// })
	draftHandy := r.Group("/archive")
	draftHandy.Use(AuthRequired(staff))
	draftHandy.Static("/", "./archive")
	v1 := r.Group("/api/v1")
	{
		draft := v1.Group("/draft")
		draft.Use(AuthRequired(staff))
		{
			draft.POST("", postDocx)
			draft.PUT("", checkDraftID)

			draft.GET("/img", getImgs)
			draft.GET("/html", getHTML)
		}

		v1.PUT("/article", getArticleList)
		v1.GET("/article/:id", getArticle)
		article := v1.Group("/article")
		article.Use(AuthRequired(user))
		{
			article.POST("", postArticle)

			specificArticle := article.Group("/:id")
			specificArticle.PUT("", editArticle)
			specificArticle.DELETE("", deleteArticle)
		}

		v1.GET("/image/:id", fetchImage)

		commentWithID := v1.Group("/comment/:id")
		commentWithID.Use(AuthRequired(user))
		{
			commentWithID.POST("", postComment)
			commentWithID.PUT("", editComment)
			commentWithID.DELETE("", deleteComment)
		}

		v1.POST("/signin", signin)
		signoutGroup := v1.Group("/signout")
		signoutGroup.Use(AuthRequired(user))
		{
			signoutGroup.GET("", signout)
		}
		accountGroup := v1.Group("/account")
		{
			accountGroup.POST("/resetRequest", resetSendEmail)
			accountGroup.GET("/resetAccept", resetAccept)
		}
		accountTempGroup := v1.Group("/account")
		accountTempGroup.Use(AuthRequired(temp))
		{
			accountTempGroup.POST("/password", changePassword)
			accountTempGroup.GET("/role", getRole)
		}
		accountUserGroup := v1.Group("/account")
		accountUserGroup.Use(AuthRequired(user))
		{
			accountUserGroup.POST("/delete", deleteSelfAccount)
		}
		accountAdminGroup := v1.Group("/account")
		accountAdminGroup.Use(AuthRequired(admin))
		{
			accountAdminGroup.POST("/search", searchAccount)
		}

		check := v1.Group("/check")
		{
			check.PUT("/username", checkUsername)
			check.PUT("/email", checkEmail)
			check.GET("/emailToken", authEmail)
		}
		v1.POST("/signup", signup)

		role := v1.Group("/role")
		role.Use(AuthRequired(admin))
		{
			role.POST("", changeRole)
		}
	}

	r.Run(":8080")
}
