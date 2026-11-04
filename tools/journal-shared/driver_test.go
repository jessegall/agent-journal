package main

import (
	"database/sql"
	"path/filepath"
	"testing"

	_ "modernc.org/sqlite"
)

func TestTheDriverKeepsAStrictTableWithValidJson(t *testing.T) {
	database, err := sql.Open("sqlite", filepath.Join(t.TempDir(), "shared.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()
	if _, err := database.Exec("PRAGMA journal_mode = WAL"); err != nil {
		t.Fatal(err)
	}
	if _, err := database.Exec("CREATE TABLE items (id INTEGER PRIMARY KEY, body TEXT NOT NULL CHECK (json_valid(body))) STRICT"); err != nil {
		t.Fatal(err)
	}
	if _, err := database.Exec("INSERT INTO items (body) VALUES (?)", `{"title": "Suite"}`); err != nil {
		t.Fatal(err)
	}
	var title string
	if err := database.QueryRow("SELECT json_extract(body, '$.title') FROM items").Scan(&title); err != nil || title != "Suite" {
		t.Fatalf("title %q, error %v", title, err)
	}
	if _, err := database.Exec("INSERT INTO items (body) VALUES (?)", "not json"); err == nil {
		t.Fatal("a body that is not JSON was accepted")
	}
	if _, err := database.Exec("INSERT INTO items (id, body) VALUES (?, ?)", "text", "{}"); err == nil {
		t.Fatal("a STRICT table accepted text in an integer column")
	}
}
