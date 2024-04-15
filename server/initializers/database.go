package initializers

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var Db *sql.DB // Global variable for the database connection

// ConnectDatabase initializes the database connection
func ConnectDatabase() {
	// Database connection parameters
	host := "localhost"
	port := 5432
	user := "postgres"
	dbname := "geodata"
	pass := "postgres"

	// Set up PostgreSQL connection string
	psqlSetup := fmt.Sprintf("host=%s port=%d user=%s dbname=%s password=%s sslmode=disable",
		host, port, user, dbname, pass)

	// Open a connection to the PostgreSQL database
	db, errSql := sql.Open("postgres", psqlSetup)
	if errSql != nil {
		fmt.Println("There is an error while connecting to the database ", errSql)
		panic(errSql)
	} else {
		// Assign the database connection to the global variable
		Db = db
		fmt.Println("Successfully connected to the database!")
	}
}
