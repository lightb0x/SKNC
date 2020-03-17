package main

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

type User struct {
	gorm.Model
	Username  string `gorm:"type:varchar(120);unique"`
	Password  string `gorm:"type:char(128)"` // SHA512 encoded
	ResetPass string `gorm:"type:char(128)"` // SHA512 encoded
	Role      string `gorm:"type:varchar(15)"`
	Email     string `gorm:"type:varchar(384);unique"`
	Token     string `gorm:"type:char(36)"` // UUID
	// Token is always used with username, so need not to be unique
	// if you want explicit link
	// Articles []Article `gorm:"foreignkey:UserRefer"`
}

type Article struct {
	gorm.Model
	Boardname string    `gorm:"type:varchar(40)"`
	Writer    string    `gorm:"type:varchar(120)"`
	Title     string    `gorm:"type:varchar(480)"`
	Content   string    `gorm:"type:mediumtext"`
	Summary   string    `gorm:"type:varchar(1200)"`
	Thumbnail string    `gorm:"type:mediumblob"`
	Comments  []Comment `gorm:"foreignkey:ArticleRefer"`
	Count     uint64    `gorm:"type:BIGINT UNSIGNED"`
	DraftID   string    `gorm:"type:char(36);unique"` // UUID
}

type Image struct {
	gorm.Model
	Content string `gorm:"type:mediumblob"`
}

type Comment struct {
	gorm.Model
	Writer       string `gorm:"type:varchar(120)"` // TODO : update of def
	Content      string `gorm:"type:varchar(4000)"`
	ArticleRefer uint   `gorm:"type:INT UNSIGNED"`
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
	db.AutoMigrate(&Image{})

	var test = User{
		Username: "sys",
		Password: "2607f9155b45ab5161167a780659ef1f49cb6bb07902a079c9272808b88ea9bb3c23851aaae37590ff04dd882401f33419d796e233ccea5fe89b233ad4214461",
		Role:     "admin",
		Email:    "lightb0x@naver.com",
		Token:    "",
	}
	db.Create(&test)
}
