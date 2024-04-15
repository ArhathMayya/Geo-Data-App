package controllers

import (
	// "database/sql"
	"fmt"
	"geodataserver/initializers"

	// "encoding/json"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type UserShape struct {
	Email     string `json:"email"`
	ShapeJson string `json:"shapejson"`
}

func SaveShapeJsonHandler(c *gin.Context) {
	var usermap UserShape

	if err := c.Bind(&usermap); err != nil {
		fmt.Println("Error binding request:", err)
		c.JSON(200, gin.H{"error": "Invalid request"})
		return
	}

	fmt.Println(usermap.Email, usermap.ShapeJson)

	_, err := initializers.Db.Exec("UPDATE userdata SET shape = $1 WHERE email = $2", usermap.ShapeJson, usermap.Email)
	if err != nil {
		fmt.Println("Database error:", err)
		c.JSON(200, gin.H{"error": "Error uploading shape JSON"})
		return
	}

	c.JSON(200, gin.H{"message": "Shape JSON upload successful"})
}

type GetSjson struct {
	Email string `json:"email"`
}

func GetShapeJsonHandler(c *gin.Context) {
	var Sj GetSjson
	c.Bind(&Sj)
	fmt.Println(Sj.Email)

	var shapejson string

	// Query the database for the GeoJSON data where email matches
	err := initializers.Db.QueryRow("SELECT shape FROM userdata WHERE email = $1", Sj.Email).Scan(&shapejson)
	switch {
	case err != nil:
		// If no rows were found for the given email address
		fmt.Println("no GeoJSON data found for email: ", Sj.Email)
		c.JSON(200, gin.H{"message": "No ShapeJson"})
		return
	default:
		fmt.Println("Found GeoJson: ", shapejson)
		// Return the GeoJSON data
		c.JSON(200, gin.H{"message": shapejson})
		return

	}
}
