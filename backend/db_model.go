package main

import "github.com/jinzhu/gorm"

// NOTE : in SQLite, VARCHAR(N) translates to TEXT
// NOTE : an UTF-8 character can take up to 4 bytes
// NOTE : MariaDB in mind

// Instagram usernames can only be up to 30 characters in length
// and to be valid, must be made up of any of
// only letters, numbers, period(.)s and underscore(_)s.

// Username(varchar(120))
// - cap to 30 characters
// Password
// - [alphanumeric @ $ ! % * # ? & - _] -> SHA512
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
	// Token is always used with username, so need not to be unique
}

const (
	admin = "admin"
	staff = "staff"
	user  = "user"
	temp  = "temp"
)

// Boardname(varchar(40))
// - cap to 10 characters
// Title(varchar(480))
// - cap to 120 characters
// Content(mediumtext)
// - up to about 16,777,216 bytes, about 5,592,405 hangul characters
// Summary(varchar(1200))
// - cap to 300 characters
type Article struct {
	gorm.Model
	Boardname string    `gorm:"type:varchar(40)"`
	Writer    User      `gorm:"foreignkey:ID"`
	Title     string    `gorm:"type:varchar(480)"`
	Content   string    `gorm:"type:mediumtext"`
	Summary   string    `gorm:"type:varchar(1200)"`
	Thumbnail []byte    `gorm:"type:mediumblob"`
	Comments  []Comment `gorm:"foreignkey:ID"`
	Count     uint64    `gorm:"type:BIGINT UNSIGNED"`
	DraftID   string    `gorm:"type:char(36);unique"` // UUID
}

const (
	lite        = "lite"
	mainArticle = "main"
	oasis       = "oasis"
	square      = "square"
)

// Ext(varchar(16))
// - contains MIME datatype (ex: image/jpeg)
// Content(mediumblob)
// - up to about 16,777,215 bytes (16 MiB)
type Image struct {
	gorm.Model
	Ext     string `gorm:"type:varchar(16)"`
	Content []byte `gorm:"type:mediumblob"`
}

// Content(varchar(4000))
// - cap to 1000 characters (including newline, space, etc)
type Comment struct {
	gorm.Model
	Writer  User   `gorm:"foreignkey:ID"`
	Content string `gorm:"type:varchar(4000)"`
}
