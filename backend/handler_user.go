package main

import (
	"crypto/sha512"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"sync"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type login struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type newPassword struct {
	Password    string `json:"password" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required"`
}

type password struct {
	Password string `json:"password" binding:"required"`
}

type username struct {
	Username string `json:"username" binding:"required"`
}

type email struct {
	Email string `json:"email" binding:"required"`
}

type userForm struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type userRole struct {
	Username string `json:"username" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

type userEmail struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type searchAccountForm struct {
	SearchType    string `json:"searchType" binding:"required"`
	SearchKeyword string `json:"searchKeyword" binding:"required"`
}

// smtpServer data to smtp server
type smtpServer struct {
	host string
	port string
}

const used = "used"

var resetLock = &sync.Mutex{}
var authLock = &sync.Mutex{}

func signin(c *gin.Context) {
	// get json data
	var data login
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	username := data.Username
	password := data.Password

	// Validate form input
	if checkUsernameToReturn(c, username) {
		return
	}
	if checkPasswordToReturn(c, password) {
		return
	}

	// SHA512 encode
	encoded := fmt.Sprintf("%x", sha512.Sum512([]byte(password)))

	// DB read
	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.Status(http.StatusUnauthorized)
		return
	}

	// Check for username and password
	if user.Username != username || user.Password != encoded {
		c.Status(http.StatusUnauthorized)
		return
	}

	// Save relevant info in session
	s := sessions.Default(c)
	s.Set(rolekey, user.Role)
	s.Set(userkey, user.Username)
	if err := s.Save(); err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged in"})
}

func signout(c *gin.Context) {
	s := sessions.Default(c)
	username := s.Get(userkey)

	if username == nil {
		c.Status(http.StatusBadRequest)
		return
	}
	s.Delete(userkey)
	s.Delete(rolekey)
	if err := s.Save(); err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}

func changePassword(c *gin.Context) {
	// get json data
	var data newPassword
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	password := data.Password
	newPassword := data.NewPassword

	// Validate form input
	if checkPasswordToReturn(c, password) {
		return
	}
	if checkPasswordToReturn(c, newPassword) {
		return
	}

	// SHA512 encode
	encoded := fmt.Sprintf("%x", sha512.Sum512([]byte(password)))
	newEncoded := fmt.Sprintf("%x", sha512.Sum512([]byte(newPassword)))

	s := sessions.Default(c)
	username := s.Get(userkey)

	// DB read
	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// Check for username and password
	if user.Username != username || user.Password != encoded {
		c.Status(http.StatusUnauthorized)
		return
	}

	// change password in DB
	update := db.Model(&user).Update("password", newEncoded)
	if update.Error != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": update.Error.Error()},
		)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully changed password"})
}

// delete user itself
func deleteSelfAccount(c *gin.Context) {
	// get json data
	var data password
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	password := data.Password

	// Validate form input
	if checkPasswordToReturn(c, password) {
		return
	}

	// SHA512 encode
	encoded := fmt.Sprintf("%x", sha512.Sum512([]byte(password)))
	s := sessions.Default(c)
	username := s.Get(userkey)

	// DB read
	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// Check for username and password
	if user.Username != username || user.Password != encoded {
		c.Status(http.StatusUnauthorized)
		return
	}

	// delete user
	if delete := db.Delete(&user); delete.Error != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": delete.Error.Error()})
		return
	}

	// logout
	s.Delete(userkey)
	s.Delete(rolekey)
	if err := s.Save(); err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted"})
}

func checkUsername(c *gin.Context) {
	// get json data
	var data username
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	username := data.Username

	if checkUsernameToReturn(c, username) {
		return
	}

	// search DB
	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.JSON(http.StatusOK, gin.H{"message": "OK"})
	} else {
		c.JSON(http.StatusOK, gin.H{"message": "Exists"})
	}
}

func checkEmail(c *gin.Context) {
	// get json data
	var data email
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	email := data.Email

	if checkEmailToReturn(c, email) {
		return
	}

	// search DB
	var user User
	// TODO : probable SQL injection weakpoint
	//        yet passed `');DROP DATABASE;`, `'--`
	query := db.Model(&User{}).Where("email = ?", email).First(&user)
	if query.Error != nil {
		c.JSON(http.StatusOK, gin.H{"message": "OK"})
	} else {
		c.JSON(http.StatusOK, gin.H{"message": "Exists"})
	}
}

// Token is non-empty only for "temp" users. otherwise, it is empty.
func authEmail(c *gin.Context) {
	username := c.Query("username")
	token := c.Query("token")
	userString := user

	if checkUsernameToReturn(c, username) {
		return
	}
	if checkTokenToReturn(c, token) {
		return
	}

	// for security, lock and lag 0.01 sec
	//               up to 360000 signups, auth tries per hour
	authLock.Lock()
	defer authLock.Unlock()
	time.Sleep(10 * time.Millisecond)

	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	if user.Token == used || user.Token != token {
		c.Status(http.StatusBadRequest)
		return
	}

	update := db.Model(&user).Updates(User{Role: userString, Token: used})

	if update.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully authenticated"})
}

// Address URI to smtp server
func (s *smtpServer) Address() string {
	return s.host + ":" + s.port
}
func signup(c *gin.Context) {
	// get json data
	var data userForm
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	username := data.Username
	password := data.Password
	email := data.Email

	if checkUsernameToReturn(c, username) {
		return
	}
	if checkPasswordToReturn(c, password) {
		return
	}
	if checkEmailToReturn(c, email) {
		return
	}

	token := uuid.New().String()

	newUser := User{
		Username:  username,
		Password:  password,
		ResetPass: used,
		Role:      temp,
		Email:     email,
		Token:     token,
	}
	// make new user on DB
	if create := db.Create(&newUser); create.Error != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	// send email
	emailSender := emailAddress
	to := []string{email}
	authLink := domainURL + "/api/v1/check/emailToken?username=" + username +
		"&token=" + token

	// smtp server configuration.
	smtpServer := smtpServer{host: smtpDomain, port: smtpPort}
	// 메시지 작성
	headerSubject := "Subject: 상경논총 인증메일입니다\r\n"
	mime := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"
	body := "<html><body><p>가입해주셔서 감사합니다.</p>" +
		"<p>다음 링크에 접속하시면 인증이 완료됩니다.</p>" +
		"<a href='" + authLink + "'>" + authLink + "</a></body></html>"
	msg := []byte(headerSubject + mime + body)

	// Authentication.
	auth := smtp.PlainAuth("", emailSender, emailPassword, smtpServer.host)
	// Sending email.
	err := smtp.SendMail(smtpServer.Address(), auth, emailSender, to, msg)
	if err != nil {
		// error handling: delete newUser from DB
		if delete := db.Delete(&newUser); delete.Error != nil {
			c.Status(http.StatusInternalServerError)
			// log username
			log.Println(delete.Error.Error())
			log.Println(
				"Failed to send mail and delete newUser: username =", username)
			log.Println("DIRECTION : delete newUser OR",
				"self-authenticate email and promote newUser yourself")
			return
		}
		c.Status(http.StatusBadRequest)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully signed up"})
}

func getRole(c *gin.Context) {
	s := sessions.Default(c)
	role := s.Get(rolekey)

	c.String(http.StatusOK, role.(string))
}

func changeRole(c *gin.Context) {
	// get json data
	var data userRole
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	username := data.Username
	newRole := data.Role

	userString := user

	if checkUsernameToReturn(c, username) {
		return
	}
	if checkRoleToReturn(c, newRole) {
		return
	}

	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.Status(http.StatusNotFound)
		return
	}

	role := user.Role
	// only [ from {temp, user, staff} to {user, staff} ] allowed
	switch role {
	case temp, userString, staff:
	default:
		c.Status(http.StatusBadRequest)
		return
	}
	switch newRole {
	case userString, staff:
	default:
		c.Status(http.StatusBadRequest)
		return
	}

	if role != newRole {
		update := db.Model(&user).Update("role", newRole)
		if update.Error != nil {
			c.Status(http.StatusInternalServerError)
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully changed role"})
}

func resetSendEmail(c *gin.Context) {
	// get json data
	var data userEmail
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	username := data.Username
	email := data.Email

	userString := user

	if checkUsernameToReturn(c, username) {
		return
	}
	if checkEmailToReturn(c, email) {
		return
	}

	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	// Check for username and email
	if user.Username != username || user.Email != email {
		c.Status(http.StatusBadRequest)
		return
	}

	// check user role : only user and staff can reset their password
	//                   as username and email address of admin is known
	if user.Role != userString && user.Role != staff {
		c.Status(http.StatusBadRequest)
		return
	}

	newRandomPassword := uuid.New().String()[9:23]
	token := uuid.New().String()
	newEncoded := fmt.Sprintf("%x", sha512.Sum512([]byte(newRandomPassword)))

	// store token and reset password in DB
	update := db.Model(&user).Updates(User{Token: token, ResetPass: newEncoded})
	if update.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// send email
	emailSender := emailAddress
	to := []string{email}
	resetURL := domainURL + "/api/v1/account/resetAccept?username=" +
		username + "&token=" + token

	// smtp server configuration.
	smtpServer := smtpServer{host: smtpDomain, port: smtpPort}
	// 메시지 작성
	headerSubject := "Subject: 상경논총 비밀번호 재설정 정보입니다\r\n"
	mime := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"
	body := "<html><body>" +
		"<p>다음의 링크를 클릭하면 비밀번호가 '" + newRandomPassword + "'로 재설정됩니다.</p>" +
		"<p>로그인 후 비밀번호를 변경하시기 바랍니다.</p>" +
		"<a href='" + resetURL + "'>" + resetURL + "</a>" +
		"<br />" +
		"<p>비밀번호 재설정을 요청하지 않으셨다면 링크를 클릭하지 마세요!</p>" +
		"</body></html>"
	msg := []byte(headerSubject + mime + body)

	// Authentication.
	auth := smtp.PlainAuth("", emailSender, emailPassword, smtpServer.host)
	// Sending email.
	err := smtp.SendMail(smtpServer.Address(), auth, emailSender, to, msg)

	if err != nil {
		db.Model(&user).Update("token", used) // doesn't matter to fail on rollback
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully sent message"})
}

func resetAccept(c *gin.Context) {
	username := c.Query("username")
	token := c.Query("token")

	if checkUsernameToReturn(c, username) {
		return
	}
	if checkTokenToReturn(c, token) {
		return
	}
	// for security, lock and lag 0.01 sec
	//               up to 360000 reset tries per hour
	resetLock.Lock()
	defer resetLock.Unlock()
	time.Sleep(10 * time.Millisecond)

	var user User
	query := db.Model(&User{}).Where("username = ?", username).First(&user)
	if query.Error != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	if token != user.Token {
		c.Status(http.StatusBadRequest)
		return
	}

	newEncoded := user.ResetPass

	update := db.Model(&user).Updates(User{
		Password: newEncoded, ResetPass: used, Token: used})
	if update.Error != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully reset password"})
}

func searchAccount(c *gin.Context) {
	// get json data
	var data searchAccountForm
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	searchType := data.SearchType
	searchKeyword := data.SearchKeyword

	// searchType, searchKeyword check
	switch searchType {
	case "username":
		if checkUsernameToReturn(c, searchKeyword) {
			return
		}
	case "email":
		if checkEmailToReturn(c, searchKeyword) {
			return
		}
	default:
		c.Status(http.StatusBadRequest)
		return
	}

	var user User
	query := db.Model(&User{}).Select("username, email, role, created_at").
		Where(searchType+" = ?", searchKeyword).First(&user)
	if query.Error != nil {
		c.Status(http.StatusNotFound)
		return
	}

	result := map[string]interface{}{
		"username":  user.Username,
		"email":     user.Email,
		"role":      user.Role,
		"createdAt": user.CreatedAt,
	}
	c.JSON(http.StatusOK, result)
}
