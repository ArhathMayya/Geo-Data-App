package controllers

import (
	"database/sql"
	"fmt"
	"geodataserver/initializers"

	"net/http"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.ConnectDatabase()
}

type Userdata struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Handlesignup(c *gin.Context) {
	var user Userdata
	c.Bind(&user)

	// Check if the email already exists in the database
	var existingUser Userdata
	err := initializers.Db.QueryRow("SELECT email, password FROM userdata WHERE email = $1", user.Email).Scan(&existingUser.Email, &existingUser.Password)
	switch {
	case err == sql.ErrNoRows:
		// Email does not exist, proceed with signup
		fmt.Println("Email does not exist in the database. Proceed with signup.")
		// Create the user record
		_, err := initializers.Db.Exec("INSERT INTO userdata (email, password) VALUES ($1, $2)", user.Email, user.Password)
		if err != nil {
			// Error occurred while inserting user record
			fmt.Println("Error inserting user record into the database:", err)
			// Return an error response to the client
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		// Return a success response to the client
		c.JSON(200, gin.H{"message": "Signup successful"})
	case err != nil:
		// Error occurred while querying the database
		fmt.Println("Error querying the database:", err)
		// Return an error response to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	default:
		// Email already exists, return an error response
		fmt.Println("Email already exists in the database.")
		c.JSON(200, gin.H{"message": "Email already exists"})
		return
	}
}

func Handlelogin(c *gin.Context) {
	var user Userdata
	c.Bind(&user)

	// Check if the email exists in the database
	var dbPassword string
	err := initializers.Db.QueryRow("SELECT password FROM userdata WHERE email = $1", user.Email).Scan(&dbPassword)
	switch {
	case err == sql.ErrNoRows:
		// Email does not exist
		fmt.Println("Email does not exist in the database.")
		c.JSON(200, gin.H{"error": "Email does not exist"})
		return
	case err != nil:
		// Error occurred while querying the database
		fmt.Println("Error querying the database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	default:
		// Email exists, compare passwords
		if dbPassword != user.Password {
			// Passwords don't match
			fmt.Println("Password incorrect.")
			c.JSON(200, gin.H{"error": "Incorrect password"})
			return
		}
		// All credentials are correct
		fmt.Println("Login successful.")
		c.JSON(200, gin.H{"message": "Login successful"})
	}
}
