package main

import (
	"fmt"

	"github.com/gin-contrib/cors"

	"geodataserver/controllers"

	"github.com/gin-gonic/gin"
)

//Used gin framework to handle requests

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	fmt.Println("Table exists or has been created successfully.")
	r.POST("/signup", controllers.Handlesignup)
	r.POST("/login", controllers.Handlelogin)
	r.POST("/savegeojson", controllers.SaveGeoJsonHandler)
	r.POST("/getgeojson", controllers.GetGeoJsonHandler)
	r.POST("/saveshapejson", controllers.SaveShapeJsonHandler)
	r.POST("/getshapejson", controllers.GetShapeJsonHandler)

	r.Run(":3001")
}
