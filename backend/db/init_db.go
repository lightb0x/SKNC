package main

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

// NOTE : in SQLite, VARCHAR(N) translates to TEXT
// NOTE : an UTF-8 character can take up to 4 bytes
// NOTE : MariaDB in mind

// Instagram usernames can only be up to 30 characters in length
// and to be valid, must be made up of any of
// only letters, numbers or underscores (source).

// Username(varchar(120))
// - cap to 30 characters
// Role(varchar(15))
// - cap to 15 alphabet characters
// Email(varchar(384))
// - cap to 384 alphabet + `@` + `.` characters
type User struct {
	gorm.Model
	Username  string `gorm:"type:varchar(120);unique"`
	Password  string `gorm:"type:char(128)"` // SHA512 encoded
	ResetPass string `gorm:"type:char(128)"` // SHA512 encoded
	Role      string `gorm:"type:varchar(15)"`
	Email     string `gorm:"type:varchar(384);unique"`
	Token     string `gorm:"type:char(36)"` // UUID
}

type Board struct {
	gorm.Model
	Articles []Article `gorm:"foreignkey:ID"`
}

// Title(varchar(480))
// - cap to 120 characters
// Content(mediumtext)
// - up to about 16,777,216 bytes, about 5,592,405 hangul characters
// Summary(varchar(1200))
// - cap to 300 characters
type Article struct {
	gorm.Model
	// Writer    User      `gorm:"foreignkey:ID"`
	// Title     string    `gorm:"type:varchar(480)"`
	Content string `gorm:"type:mediumtext"`
	// Username  string    `gorm:"type:varchar(120);unique"`
	// Summary   string    `gorm:"type:"varchar(1200)"`
	// Thumbnail Image     `gorm:"foreignkey:ID"`
	// Images    []Image   `gorm:"foreignkey:ID"`
	// Comments  []Comment `gorm:"foreignkey:ID"`
	// Count     uint64    `gorm:"type:BIGINT UNSIGNED"`
}

// TODO : members with foreignkey:ID does not exist on DB

// Content(mediumblob)
// - up to about 16,777,215 bytes (16 MiB)
type Image struct {
	gorm.Model
	Content string `gorm:"type:mediumblob"`
}

// Content(varchar(4000))
// - cap to 1000 characters (including newline, space, etc)
type Comment struct {
	gorm.Model
	Writer  User   `gorm:"foreignkey:ID"`
	Content string `gorm:"type:varchar(4000)"`
}

func main() {
	fmt.Println("starting initializtion ...")

	db, err := gorm.Open("sqlite3", "./sqlite.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Comment{})
	db.AutoMigrate(&Article{})
	db.AutoMigrate(&Board{})

	var test = User{
		Username: "sys",
		// SHA512 encoded "helloworld1"
		Password: "76cfde0f132223ee1a9a21ff52e99e0671e269ce82b3bb5283be4ac3dbf3a67e58ce9f4631d12172f622c264935b4c0b475f19a1686b54a5c7efc85176575ec6",
		Role:     "admin",
		Email:    "lightb0x@naver.com",
		Token:    "",
	}
	db.Create(&test)
	var test2 = User{
		Username: "sys2",
		// SHA512 encoded "helloworld"
		Password: "1594244d52f2d8c12b142bb61f47bc2eaf503d6d9ca8480cae9fcf112f66e4967dc5e8fa98285e36db8af1b8ffa8b84cb15e0fbcf836c3deb803c13f37659a60",
		Role:     "admin",
		Email:    "lightb0x@naver.com2",
		Token:    "",
	}
	db.Create(&test2)

	var comment1 = Comment{
		Writer:  test,
		Content: "hello, world I'm content!",
	}
	db.Create(&comment1)
	// fmt.Println(comment1)

	// var test3 User
	// db.Model(&comment1).Select("username, created_at").Association("Writer").Find(&test3)
	// fmt.Println(test3)
	// var test3 User
	// db.Model(&User{}).Select("username, created_at, updated_at").Find(&test3)
	// fmt.Println(test3)
	// fmt.Println(test3.CreatedAt)
	// fmt.Println(test3.UpdatedAt)
	// fmt.Println(test3.CreatedAt.Equal(test3.UpdatedAt))
	// fmt.Println(test3.Username)
	// fmt.Println(test3.Password)

	var test3 User
	query := db.Model(&User{}).Where("username = ?", "nothing").Find(&test3)
	if query.Error != nil {
		fmt.Println("error occured")
		fmt.Println(query.Error.Error())
	}
	fmt.Println(test3)

	// var test4 User
	// db.First(&test4, 1)
	// fmt.Println(test4)

	// var finduser User
	// now := time.Now()
	// db.Model(&User{}).Where("created_at < ?", now).Order("created_at desc").First(&finduser)
	// fmt.Println(finduser)
	// how to : error handling
	// if result := db.Create(&test2); result.Error != nil {
	// 	fmt.Println("error occurred")
	// }
	// var board1 = Board{}
	// var board2 = Board{}
	// var board3 = Board{}
	// var board4 = Board{}

	// db.Create(&board1)
	// db.Create(&board2)
	// db.Create(&board3)
	// db.Create(&board4)

	// fmt.Printf("%T\n", board1.CreatedAt)
	// fmt.Printf("%s\n", board1.CreatedAt)

	// var article1 = Article{Content: "hello world"}
	// db.Create(&article1)

	// fmt.Println(board1.Articles)
	// fmt.Println(append(board1.Articles, article1))
	// db.Model(&board1).Update("articles", append(board1.Articles, article1))

	// var board1find Board
	// db.Find(&board1find, 1)
	// articles := board1find.Articles
	// db.Model(&board1find).Association("Articles").Append(&article1)
	// fmt.Println("articles")
	// fmt.Println(articles)

	// fmt.Println(board1find)
	// fmt.Println(board1find.Articles)

	// var boardfind1 Board
	// var userfind1 User

	// db.Find(&boardfind1, 1)
	// db.Find(&userfind1, 1)

	// fmt.Println(boardfind1)
	// fmt.Println(userfind1)

	// var boardfind2 Board
	// var userfind2 User

	// if query := db.First(&boardfind2, 5); query.Error != nil {
	// 	fmt.Println(query.Error.Error())
	// }
	// db.First(&userfind2, 1)

	// fmt.Println(boardfind2)
	// fmt.Println(userfind2)
	// TODO : hasMany tests
	//        Related, association_foreignkey

	// board1find.Articles = append(board1find.Articles, Article{
	// 	Writer:   test,
	// 	Title:    "hello i'm title!",
	// 	Content:  "hello i'm content!",
	// 	Images:   []Image{},
	// 	Comments: []Comment{},
	// })
	// db.Save(&board1find)
	// var article1 = Article{
	// 	Writer:   test,
	// 	Title:    "hello i'm title!",
	// 	Content:  "hello i'm content!",
	// 	Username: "sys",
	// 	Images:   []Image{},
	// 	Comments: []Comment{},
	// }
	// db.Create(&article1)
	// db.Model(&board1).Association("Articles").Append(article1)

	// // update works
	// var article1find Article
	// db.Find(&article1find, 1)
	// // fmt.Println(article1find)
	// db.Model(&article1find).Update("Content", "updated article content")

	// // update on link does not work
	// // finding on link works
	// var article1find2 Article
	// var board1find Board
	// db.Find(&board1find, 1)
	// db.Model(&board1find).Association("Articles").Find(&article1find2)
	// fmt.Println(article1find2)

	// var board2find Board
	// db.Find(&board2find, 1)
	// // fmt.Println(board2find)
	// // fmt.Println(board2find.Articles)

	// // var user1 User
	// // db.Model(&user1).Where("username = ?", "sys").First(&user1)
	// // fmt.Println(user1)

	// // var user2 User
	// // db.Where("username = ?", "sys").First(&user2)
	// // fmt.Println(user2)
	// var user1 User
	// db.Model(&user1).Where("username = ?", "sys").First(&user1)
	// fmt.Println(user1)
	// var user2 User
	// db.Model(&user2).Where("username = ?", "sys2").First(&user2)
	// fmt.Println(user2)

	// db.Delete(&user1)

	// if res := db.Model(&user1).Where("username = ?", "sys").First(&user1); res != nil {
	// 	fmt.Println("successfully deleted")
	// }
	// var user3 User
	// db.Model(&user3).Where("username = ?", "sys2").First(&user3)
	// fmt.Println(user3)
}
