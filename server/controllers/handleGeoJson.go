package controllers

import (
	// "database/sql"
	"fmt"
	"geodataserver/initializers"

	// "encoding/json"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type UserMap struct {
	Email   string `json:"email"`
	GeoJson string `json:"geojson"`
}

func SaveGeoJsonHandler(c *gin.Context) {
	var usermap UserMap

	c.Bind(&usermap)

	fmt.Println(usermap.Email, usermap.GeoJson)

	_, err := initializers.Db.Exec("UPDATE userdata SET geojson = $1 WHERE email = $2", usermap.GeoJson, usermap.Email)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(200, gin.H{"error": "Error uploading file"})
		return
	}

	c.JSON(200, gin.H{"message": "JSON upload successful"})
}

type GetGjson struct {
	Email string `json:"email"`
}

func GetGeoJsonHandler(c *gin.Context) {
	var Gj GetGjson
	c.Bind(&Gj)
	fmt.Println(Gj.Email)

	var geojson string

	// Query the database for the GeoJSON data where email matches
	err := initializers.Db.QueryRow("SELECT geojson FROM userdata WHERE email = $1", Gj.Email).Scan(&geojson)
	switch {
	case err != nil:
		// If no rows were found for the given email address
		fmt.Println("no GeoJSON data found for email: ", Gj.Email)
		c.JSON(200, gin.H{"message": "No GeoJson"})
		return
	default:
		fmt.Println("Found GeoJson: ", geojson)
		// Return the GeoJSON data
		c.JSON(200, gin.H{"message": geojson})
		return

	}

}
