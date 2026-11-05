package store

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"maps"
	"reflect"
	"strings"
	"unicode"
)

var (
	ErrBadFields = errors.New("the fields do not fit the kind")
	ErrStale     = errors.New("the item has changed since the version sent")
	ErrRemoved   = errors.New("the item is removed")
)

// sqliteConstraint is the primary result code SQLite gives when a CHECK, NOT NULL or type rule refuses a value.
const sqliteConstraint = 19

const (
	ActionCreate  = "create"
	ActionUpdate  = "update"
	ActionRemove  = "remove"
	ActionRestore = "restore"
	ActionPurge   = "purge"
)

// excerptReach is how many characters an excerpt shows on each side of the first search term.
const excerptReach = 30

// Fields are the values an item carries, by field name: text, or whole numbers for interval_minutes.
type Fields map[string]any

// With returns these fields with the given ones written over them.
func (fields Fields) With(changes Fields) Fields {
	merged := make(Fields, len(fields))
	maps.Copy(merged, fields)
	maps.Copy(merged, changes)
	return merged
}

// Item is one document, sequence or check with its fields.
type Item struct {
	Kind      string `json:"kind"`
	ID        int64  `json:"id"`
	Version   int64  `json:"version"`
	Fields    Fields `json:"fields"`
	Creator   string `json:"creator"`
	UpdatedBy string `json:"updated_by"`
	UpdatedAt string `json:"updated_at"`
	RemovedAt string `json:"removed_at,omitempty"`
}

// ItemRow is one line of a list: an item without its text.
type ItemRow struct {
	Kind      string `json:"kind"`
	ID        int64  `json:"id"`
	Version   int64  `json:"version"`
	Title     string `json:"title"`
	Abstract  string `json:"abstract,omitempty"`
	Excerpt   string `json:"excerpt,omitempty"`
	Creator   string `json:"creator"`
	UpdatedBy string `json:"updated_by"`
	UpdatedAt string `json:"updated_at"`
}

// Page is one page of a list.
type Page struct {
	Page  int       `json:"page"`
	Size  int       `json:"size"`
	Total int       `json:"total"`
	Rows  []ItemRow `json:"rows"`
}

type querier interface {
	QueryRow(query string, arguments ...any) *sql.Row
}

// CreateItem makes an item at version 1; every field of the kind is needed.
func (store *Store) CreateItem(kind ItemType, fields Fields, caller Caller) (Item, error) {
	checked, err := kind.checked(fields, true)
	if err != nil {
		return Item{}, err
	}
	transaction, err := store.DB.Begin()
	if err != nil {
		return Item{}, err
	}
	defer transaction.Rollback()
	currentAt := store.timestamp()
	columns, marks, values := "creator_id, created_at, updated_at", "?, ?, ?", []any{caller.User.ID, currentAt, currentAt}
	for _, field := range kind.Fields {
		columns, marks, values = columns+", "+field, marks+", ?", append(values, checked[field])
	}
	result, err := transaction.Exec("INSERT INTO "+kind.Table+" ("+columns+") VALUES ("+marks+")", values...)
	if err != nil {
		return Item{}, refused(err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return Item{}, err
	}
	item, err := store.record(transaction, kind, id, ActionCreate, caller)
	if err != nil {
		return Item{}, err
	}
	return item, transaction.Commit()
}

// ReadItem reads one item, removed or not.
func (store *Store) ReadItem(kind ItemType, id int64) (Item, error) {
	return readItem(store.DB, kind, id)
}

// UpdateItem saves new fields when baseVersion is the newest version, and adds them to the history in the same
// transaction. The answer is read inside that transaction, so it is the version this call wrote and never a later one.
// It returns the newest item with ErrStale when another write came first, and ErrRemoved on a removed item. A field
// that is not sent keeps its value, and fields that change nothing write nothing.
func (store *Store) UpdateItem(kind ItemType, id, baseVersion int64, fields Fields, caller Caller) (Item, error) {
	checked, err := kind.checked(fields, false)
	if err != nil {
		return Item{}, err
	}
	transaction, err := store.DB.Begin()
	if err != nil {
		return Item{}, err
	}
	defer transaction.Rollback()
	current, err := readItem(transaction, kind, id)
	if err != nil {
		return Item{}, err
	}
	if current.RemovedAt != "" {
		return Item{}, ErrRemoved
	}
	if current.Version != baseVersion {
		return current, ErrStale
	}
	merged := current.Fields.With(checked)
	if reflect.DeepEqual(merged, current.Fields) {
		return current, nil
	}
	assignments, values := "version = version + 1, updated_at = ?", []any{store.timestamp()}
	for _, field := range kind.Fields {
		assignments, values = assignments+", "+field+" = ?", append(values, merged[field])
	}
	if _, err := transaction.Exec("UPDATE "+kind.Table+" SET "+assignments+" WHERE id = ? AND version = ?", append(values, id, baseVersion)...); err != nil {
		return Item{}, refused(err)
	}
	updated, err := store.record(transaction, kind, id, ActionUpdate, caller)
	if err != nil {
		return Item{}, err
	}
	return updated, transaction.Commit()
}

// RemoveItem marks an item removed from the library, as a new version; an item removed already stays as it is.
func (store *Store) RemoveItem(kind ItemType, id int64, caller Caller) (Item, error) {
	return store.markRemoved(kind, id, true, caller)
}

// RestoreItem clears the removed mark, as a new version; an item that is not removed stays as it is.
func (store *Store) RestoreItem(kind ItemType, id int64, caller Caller) (Item, error) {
	return store.markRemoved(kind, id, false, caller)
}

func (store *Store) markRemoved(kind ItemType, id int64, removing bool, caller Caller) (Item, error) {
	transaction, err := store.DB.Begin()
	if err != nil {
		return Item{}, err
	}
	defer transaction.Rollback()
	current, err := readItem(transaction, kind, id)
	if err != nil {
		return Item{}, err
	}
	if (current.RemovedAt != "") == removing {
		return current, nil
	}
	currentAt, action := store.timestamp(), ActionRestore
	var removedAt any
	if removing {
		removedAt, action = currentAt, ActionRemove
	}
	if _, err := transaction.Exec("UPDATE "+kind.Table+" SET removed_at = ?, version = version + 1, updated_at = ? WHERE id = ?", removedAt, currentAt, id); err != nil {
		return Item{}, err
	}
	changed, err := store.record(transaction, kind, id, action, caller)
	if err != nil {
		return Item{}, err
	}
	return changed, transaction.Commit()
}

// PurgeItem deletes an item and all its versions for good, and adds one purge row with no fields, so the history still
// shows that the item is gone. The number is never used again. It returns how many versions were deleted.
func (store *Store) PurgeItem(kind ItemType, id int64, caller Caller) (int64, error) {
	transaction, err := store.DB.Begin()
	if err != nil {
		return 0, err
	}
	defer transaction.Rollback()
	current, err := readItem(transaction, kind, id)
	if err != nil {
		return 0, err
	}
	deleted, err := transaction.Exec("DELETE FROM item_versions WHERE kind = ? AND item_id = ?", kind.Name, id)
	if err != nil {
		return 0, err
	}
	if _, err := transaction.Exec("DELETE FROM "+kind.Table+" WHERE id = ?", id); err != nil {
		return 0, err
	}
	if err := store.addVersion(transaction, kind, id, current.Version+1, ActionPurge, "{}", caller); err != nil {
		return 0, err
	}
	count, err := deleted.RowsAffected()
	if err != nil {
		return 0, err
	}
	return count, transaction.Commit()
}

// ListItems lists one page of the items of a kind that are not removed, newest change first. Every word of search
// has to be in one of the kind's search fields, and each row then carries an excerpt around the first word.
func (store *Store) ListItems(kind ItemType, search string, pageNumber, size int) (Page, error) {
	terms := strings.Fields(search)
	conditions, arguments := "t.removed_at IS NULL", []any{}
	for _, term := range terms {
		alternatives := make([]string, len(kind.Search))
		for index, field := range kind.Search {
			alternatives[index] = "t." + field + ` LIKE ? ESCAPE '\'`
			arguments = append(arguments, "%"+likeEscaped(term)+"%")
		}
		conditions += " AND (" + strings.Join(alternatives, " OR ") + ")"
	}
	page := Page{Page: pageNumber, Size: size, Rows: []ItemRow{}}
	if err := store.DB.QueryRow("SELECT count(*) FROM "+kind.Table+" t WHERE "+conditions, arguments...).Scan(&page.Total); err != nil {
		return Page{}, err
	}
	abstract := "''"
	if kind.hasField("abstract") {
		abstract = "t.abstract"
	}
	columns := "t.id, t.version, t.title, " + abstract + ", t.updated_at, c.name, " + updatedBySQL
	if len(terms) > 0 {
		for _, field := range kind.Search {
			columns += ", t." + field
		}
	}
	query := "SELECT " + columns + " FROM " + kind.Table + " t JOIN users c ON c.id = t.creator_id WHERE " + conditions +
		" ORDER BY t.updated_at DESC, t.id DESC LIMIT ? OFFSET ?"
	rows, err := store.DB.Query(query, append([]any{kind.Name}, append(arguments, size, (pageNumber-1)*size)...)...)
	if err != nil {
		return Page{}, err
	}
	defer rows.Close()
	for rows.Next() {
		row := ItemRow{Kind: kind.Name}
		targets := []any{&row.ID, &row.Version, &row.Title, &row.Abstract, &row.UpdatedAt, &row.Creator, &row.UpdatedBy}
		texts := make([]string, len(kind.Search))
		for index := range texts {
			if len(terms) > 0 {
				targets = append(targets, &texts[index])
			}
		}
		if err := rows.Scan(targets...); err != nil {
			return Page{}, err
		}
		if len(terms) > 0 {
			row.Excerpt = excerptAround(terms[0], texts)
		}
		page.Rows = append(page.Rows, row)
	}
	return page, rows.Err()
}

const updatedBySQL = `COALESCE((SELECT u.name FROM item_versions v JOIN users u ON u.id = v.user_id
	WHERE v.kind = ? AND v.item_id = t.id ORDER BY v.id DESC LIMIT 1), '')`

func readItem(database querier, kind ItemType, id int64) (Item, error) {
	columns := "t.id, t.version, COALESCE(t.removed_at, ''), t.updated_at, c.name, " + updatedBySQL
	for _, field := range kind.Fields {
		columns += ", t." + field
	}
	row := database.QueryRow("SELECT "+columns+" FROM "+kind.Table+" t JOIN users c ON c.id = t.creator_id WHERE t.id = ?", kind.Name, id)
	item := Item{Kind: kind.Name, Fields: Fields{}}
	values := make([]any, len(kind.Fields))
	targets := []any{&item.ID, &item.Version, &item.RemovedAt, &item.UpdatedAt, &item.Creator, &item.UpdatedBy}
	for index := range values {
		targets = append(targets, &values[index])
	}
	if err := row.Scan(targets...); err != nil {
		return Item{}, foundOrNot(err)
	}
	for index, field := range kind.Fields {
		if text, isBytes := values[index].([]byte); isBytes {
			values[index] = string(text)
		}
		item.Fields[field] = values[index]
	}
	return item, nil
}

// record adds the history row of a write and reads the item as that write left it.
func (store *Store) record(transaction *sql.Tx, kind ItemType, id int64, action string, caller Caller) (Item, error) {
	recordedItem, err := readItem(transaction, kind, id)
	if err != nil {
		return Item{}, err
	}
	fields, err := json.Marshal(recordedItem.Fields)
	if err != nil {
		return Item{}, err
	}
	if err := store.addVersion(transaction, kind, id, recordedItem.Version, action, string(fields), caller); err != nil {
		return Item{}, err
	}
	return readItem(transaction, kind, id)
}

func (store *Store) addVersion(transaction *sql.Tx, kind ItemType, id, version int64, action, fields string, caller Caller) error {
	var token sql.NullInt64
	if caller.TokenID != 0 {
		token = sql.NullInt64{Int64: caller.TokenID, Valid: true}
	}
	_, err := transaction.Exec("INSERT INTO item_versions (kind, item_id, version, action, fields, user_id, token_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		kind.Name, id, version, action, fields, caller.User.ID, token, store.timestamp())
	return err
}

// checked keeps the fields of the kind, with numbers as whole numbers; a field that is not named in the kind is left
// out, so a newer journal can send more than this server knows.
func (kind ItemType) checked(fields Fields, creating bool) (Fields, error) {
	checked := Fields{}
	for _, field := range kind.Fields {
		value, exists := fields[field]
		if !exists {
			if creating {
				return nil, fmt.Errorf("%w: %s is missing", ErrBadFields, field)
			}
			continue
		}
		switch fieldValue := value.(type) {
		case string:
			checked[field] = fieldValue
		case json.Number:
			number, err := fieldValue.Int64()
			if err != nil {
				return nil, fmt.Errorf("%w: %s is not a whole number", ErrBadFields, field)
			}
			checked[field] = number
		case int64:
			checked[field] = fieldValue
		default:
			return nil, fmt.Errorf("%w: %s is neither text nor a whole number", ErrBadFields, field)
		}
	}
	return checked, nil
}

func (kind ItemType) hasField(field string) bool {
	for _, name := range kind.Fields {
		if name == field {
			return true
		}
	}
	return false
}

// refused turns a rule of the database into ErrBadFields, with the rule that refused.
func refused(err error) error {
	var coded interface{ Code() int }
	if errors.As(err, &coded) && coded.Code()&0xff == sqliteConstraint {
		return fmt.Errorf("%w: %s", ErrBadFields, err.Error())
	}
	return err
}

func likeEscaped(term string) string {
	return strings.NewReplacer(`\`, `\\`, "%", `\%`, "_", `\_`).Replace(term)
}

// excerptAround shows the first text that holds the term, cut to a few characters around it.
func excerptAround(term string, texts []string) string {
	wanted := []rune(strings.ToLower(term))
	for _, text := range texts {
		characters := []rune(text)
		for start := 0; start+len(wanted) <= len(characters); start++ {
			if !sameLetters(characters[start:start+len(wanted)], wanted) {
				continue
			}
			startIndex, endIndex := max(0, start-excerptReach), min(len(characters), start+len(wanted)+excerptReach)
			excerpt := strings.Join(strings.Fields(string(characters[startIndex:endIndex])), " ")
			if startIndex > 0 {
				excerpt = "…" + excerpt
			}
			if endIndex < len(characters) {
				excerpt += "…"
			}
			return excerpt
		}
	}
	return ""
}

func sameLetters(actual, wanted []rune) bool {
	for index := range wanted {
		if unicode.ToLower(actual[index]) != wanted[index] {
			return false
		}
	}
	return true
}
