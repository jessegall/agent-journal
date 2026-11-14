// Package store holds the shared server's SQLite database: it opens shared.db and runs the migrations.
package store

import (
	"crypto/rand"
	"database/sql"
	"embed"
	"encoding/hex"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"time"

	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var migrationFiles embed.FS

// FileName is the one file in the data folder.
const FileName = "shared.db"

// Store is the open database of one data folder.
type Store struct {
	DB          *sql.DB
	CurrentTime func() time.Time
	ServerKey   string
	ServerName  string
}

// Open opens shared.db in the folder, made if it is not there, in WAL mode with foreign keys on, and runs the
// migrations not yet run.
func Open(folder string) (*Store, error) {
	if err := os.MkdirAll(folder, 0o700); err != nil {
		return nil, err
	}
	query := url.Values{}
	query.Add("_pragma", "journal_mode(WAL)")
	query.Add("_pragma", "foreign_keys(1)")
	query.Add("_pragma", "busy_timeout(5000)")
	query.Add("_txlock", "immediate")
	database, err := sql.Open("sqlite", "file:"+filepath.Join(folder, FileName)+"?"+query.Encode())
	if err != nil {
		return nil, err
	}
	store := &Store{DB: database, CurrentTime: time.Now}
	if err := store.migrate(); err != nil {
		database.Close()
		return nil, err
	}
	if err := store.identify(); err != nil {
		database.Close()
		return nil, err
	}
	return store, nil
}

// Backup writes the whole database to one new file with VACUUM INTO. A file that is there already is not overwritten.
func (store *Store) Backup(file string) error {
	if _, err := os.Stat(file); err == nil {
		return fmt.Errorf("%s exists already: a backup is written to a new file", file)
	}
	_, err := store.DB.Exec("VACUUM INTO ?", file)
	return err
}

// Close closes the database.
func (store *Store) Close() error {
	return store.DB.Close()
}

// identify makes the server's key and name the first time the file is opened, and reads them every time. The key tells
// this server from a new one at the same address.
func (store *Store) identify() error {
	random := make([]byte, 4)
	if _, err := rand.Read(random); err != nil {
		return err
	}
	name, err := os.Hostname()
	if err != nil || name == "" {
		name = "journal-shared"
	}
	if _, err := store.DB.Exec("INSERT OR IGNORE INTO server (id, server_key, name, created_at) VALUES (1, ?, ?, ?)", hex.EncodeToString(random), name, store.timestamp()); err != nil {
		return err
	}
	return store.DB.QueryRow("SELECT server_key, name FROM server WHERE id = 1").Scan(&store.ServerKey, &store.ServerName)
}

func (store *Store) migrate() error {
	if _, err := store.DB.Exec("CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL) STRICT"); err != nil {
		return err
	}
	files, err := migrationFiles.ReadDir("migrations")
	if err != nil {
		return err
	}
	names := make([]string, len(files))
	for index, file := range files {
		names[index] = file.Name()
	}
	sort.Strings(names)
	for _, name := range names {
		if err := store.apply(name); err != nil {
			return fmt.Errorf("migration %s: %w", name, err)
		}
	}
	return nil
}

func (store *Store) apply(name string) error {
	transaction, err := store.DB.Begin()
	if err != nil {
		return err
	}
	defer transaction.Rollback()
	var applied int
	if err := transaction.QueryRow("SELECT count(*) FROM migrations WHERE name = ?", name).Scan(&applied); err != nil {
		return err
	}
	if applied > 0 {
		return nil
	}
	script, err := migrationFiles.ReadFile("migrations/" + name)
	if err != nil {
		return err
	}
	if _, err := transaction.Exec(string(script)); err != nil {
		return err
	}
	if _, err := transaction.Exec("INSERT INTO migrations (name, applied_at) VALUES (?, ?)", name, time.Now().UTC().Format(time.RFC3339)); err != nil {
		return err
	}
	return transaction.Commit()
}
