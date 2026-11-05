package store

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"errors"
	"time"
)

// Role is what a user may do: admin, edit or read.
type Role string

const (
	RoleAdmin Role = "admin"
	RoleEdit  Role = "edit"
	RoleRead  Role = "read"
)

var (
	ErrNotFound         = errors.New("not found")
	ErrBadRole          = errors.New("the role is admin, edit or read")
	ErrBadName          = errors.New("a name is 1 to 100 characters")
	ErrNameTaken        = errors.New("the name is taken, also by a removed user")
	ErrNotAuthenticated = errors.New("the token is missing, wrong or revoked")
)

// TokenPrefix starts every token, so a secret scanner can find one in a document or a log.
const TokenPrefix = "jsl_"

// ParseRole reads a role from its stored name.
func ParseRole(text string) (Role, error) {
	role := Role(text)
	if role.level() == 0 {
		return "", ErrBadRole
	}
	return role, nil
}

// Allows tells whether this role may do what the needed role may.
func (role Role) Allows(needed Role) bool {
	return role.level() >= needed.level()
}

func (role Role) level() int {
	switch role {
	case RoleAdmin:
		return 3
	case RoleEdit:
		return 2
	case RoleRead:
		return 1
	}
	return 0
}

// User is a person who may use the server.
type User struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Role      Role   `json:"role"`
	RemovedAt string `json:"removed_at,omitempty"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// Token is one device's way in; the server keeps its digest and never its text.
type Token struct {
	ID         int64  `json:"id"`
	UserID     int64  `json:"user_id"`
	Label      string `json:"label"`
	LastUsedAt string `json:"last_used_at,omitempty"`
	RevokedAt  string `json:"revoked_at,omitempty"`
	CreatedAt  string `json:"created_at"`
}

// Caller is the user who sent a request and the token that was used.
type Caller struct {
	User    User
	TokenID int64
}

const userColumns = "id, name, role, COALESCE(removed_at, ''), created_at, updated_at"
const tokenColumns = "id, user_id, label, COALESCE(last_used_at, ''), COALESCE(revoked_at, ''), created_at"

type scanner interface {
	Scan(targets ...any) error
}

func scanUser(row scanner) (User, error) {
	var user User
	err := row.Scan(&user.ID, &user.Name, &user.Role, &user.RemovedAt, &user.CreatedAt, &user.UpdatedAt)
	return user, foundOrNot(err)
}

func scanToken(row scanner) (Token, error) {
	var token Token
	err := row.Scan(&token.ID, &token.UserID, &token.Label, &token.LastUsedAt, &token.RevokedAt, &token.CreatedAt)
	return token, foundOrNot(err)
}

func foundOrNot(err error) error {
	if errors.Is(err, sql.ErrNoRows) {
		return ErrNotFound
	}
	return err
}

func (store *Store) timestamp() string {
	return store.CurrentTime().UTC().Format(time.RFC3339)
}

// AddUser makes a user with a role.
func (store *Store) AddUser(name string, role Role) (User, error) {
	if len(name) < 1 || len(name) > 100 {
		return User{}, ErrBadName
	}
	if role.level() == 0 {
		return User{}, ErrBadRole
	}
	var matchingUsers int
	if err := store.DB.QueryRow("SELECT count(*) FROM users WHERE name = ?", name).Scan(&matchingUsers); err != nil {
		return User{}, err
	}
	if matchingUsers > 0 {
		return User{}, ErrNameTaken
	}
	currentAt := store.timestamp()
	result, err := store.DB.Exec("INSERT INTO users (name, role, created_at, updated_at) VALUES (?, ?, ?, ?)", name, role, currentAt, currentAt)
	if err != nil {
		return User{}, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return User{}, err
	}
	return store.UserByID(id)
}

// UserByID finds a user who is not removed.
func (store *Store) UserByID(id int64) (User, error) {
	return scanUser(store.DB.QueryRow("SELECT "+userColumns+" FROM users WHERE id = ? AND removed_at IS NULL", id))
}

// UserByName finds a user who is not removed.
func (store *Store) UserByName(name string) (User, error) {
	return scanUser(store.DB.QueryRow("SELECT "+userColumns+" FROM users WHERE name = ? AND removed_at IS NULL", name))
}

// FirstAdmin finds the admin who was made first.
func (store *Store) FirstAdmin() (User, error) {
	return scanUser(store.DB.QueryRow("SELECT " + userColumns + " FROM users WHERE role = 'admin' AND removed_at IS NULL ORDER BY id LIMIT 1"))
}

// Users lists the users who are not removed, oldest first.
func (store *Store) Users() ([]User, error) {
	rows, err := store.DB.Query("SELECT " + userColumns + " FROM users WHERE removed_at IS NULL ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	users := []User{}
	for rows.Next() {
		user, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, rows.Err()
}

// SetRole gives a user another role.
func (store *Store) SetRole(id int64, role Role) (User, error) {
	if role.level() == 0 {
		return User{}, ErrBadRole
	}
	result, err := store.DB.Exec("UPDATE users SET role = ?, updated_at = ? WHERE id = ? AND removed_at IS NULL", role, store.timestamp(), id)
	if err != nil {
		return User{}, err
	}
	if changed, _ := result.RowsAffected(); changed == 0 {
		return User{}, ErrNotFound
	}
	return store.UserByID(id)
}

// RemoveUser removes a user and revokes every token the user has. The name stays taken.
func (store *Store) RemoveUser(id int64) (User, error) {
	user, err := store.UserByID(id)
	if err != nil {
		return User{}, err
	}
	transaction, err := store.DB.Begin()
	if err != nil {
		return User{}, err
	}
	defer transaction.Rollback()
	currentAt := store.timestamp()
	if _, err := transaction.Exec("UPDATE users SET removed_at = ?, updated_at = ? WHERE id = ?", currentAt, currentAt, id); err != nil {
		return User{}, err
	}
	if _, err := transaction.Exec("UPDATE tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL", currentAt, id); err != nil {
		return User{}, err
	}
	user.RemovedAt, user.UpdatedAt = currentAt, currentAt
	return user, transaction.Commit()
}

// NewToken makes a token for a user. Its text is returned here and kept nowhere: only its digest is stored.
func (store *Store) NewToken(userID int64, label string) (string, Token, error) {
	if _, err := store.UserByID(userID); err != nil {
		return "", Token{}, err
	}
	random := make([]byte, 32)
	if _, err := rand.Read(random); err != nil {
		return "", Token{}, err
	}
	text := TokenPrefix + hex.EncodeToString(random)
	result, err := store.DB.Exec("INSERT INTO tokens (user_id, token_digest, label, created_at) VALUES (?, ?, ?, ?)", userID, digest(text), label, store.timestamp())
	if err != nil {
		return "", Token{}, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return "", Token{}, err
	}
	token, err := store.Token(id)
	return text, token, err
}

// Token finds a token by its number.
func (store *Store) Token(id int64) (Token, error) {
	return scanToken(store.DB.QueryRow("SELECT "+tokenColumns+" FROM tokens WHERE id = ?", id))
}

// Tokens lists a user's tokens, oldest first.
func (store *Store) Tokens(userID int64) ([]Token, error) {
	rows, err := store.DB.Query("SELECT "+tokenColumns+" FROM tokens WHERE user_id = ? ORDER BY id", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	tokens := []Token{}
	for rows.Next() {
		token, err := scanToken(rows)
		if err != nil {
			return nil, err
		}
		tokens = append(tokens, token)
	}
	return tokens, rows.Err()
}

// RevokeToken ends a token at once; a token revoked already keeps its first time.
func (store *Store) RevokeToken(id int64) (Token, error) {
	if _, err := store.DB.Exec("UPDATE tokens SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL", store.timestamp(), id); err != nil {
		return Token{}, err
	}
	return store.Token(id)
}

// Authenticate finds who a token belongs to, and notes its use at most once a minute.
func (store *Store) Authenticate(text string) (Caller, error) {
	row := store.DB.QueryRow(`SELECT tokens.id, users.id, users.name, users.role, '', users.created_at, users.updated_at
		FROM tokens JOIN users ON users.id = tokens.user_id
		WHERE tokens.token_digest = ? AND tokens.revoked_at IS NULL AND users.removed_at IS NULL`, digest(text))
	var caller Caller
	err := row.Scan(&caller.TokenID, &caller.User.ID, &caller.User.Name, &caller.User.Role, &caller.User.RemovedAt, &caller.User.CreatedAt, &caller.User.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return Caller{}, ErrNotAuthenticated
	}
	if err != nil {
		return Caller{}, err
	}
	currentAt := store.CurrentTime().UTC()
	_, err = store.DB.Exec("UPDATE tokens SET last_used_at = ? WHERE id = ? AND (last_used_at IS NULL OR last_used_at <= ?)",
		currentAt.Format(time.RFC3339), caller.TokenID, currentAt.Add(-time.Minute).Format(time.RFC3339))
	return caller, err
}

func digest(text string) string {
	sum := sha256.Sum256([]byte(text))
	return hex.EncodeToString(sum[:])
}
