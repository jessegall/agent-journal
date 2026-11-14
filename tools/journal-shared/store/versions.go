package store

import "encoding/json"

// VersionRow is one change of an item: what was done, by whom with which token, and when. It carries no text.
type VersionRow struct {
	Version   int64  `json:"version"`
	Action    string `json:"action"`
	User      string `json:"user"`
	Token     string `json:"token"`
	CreatedAt string `json:"created_at"`
}

// ItemVersion is one old version of an item with its fields.
type ItemVersion struct {
	VersionRow
	Kind   string          `json:"kind"`
	ID     int64           `json:"id"`
	Fields json.RawMessage `json:"fields"`
}

const versionColumns = "v.version, v.action, u.name, COALESCE(t.label, ''), v.created_at"
const versionFrom = " FROM item_versions v JOIN users u ON u.id = v.user_id LEFT JOIN tokens t ON t.id = v.token_id"

// ItemVersions lists the changes of an item, newest first. An item with no changes on record is not found.
func (store *Store) ItemVersions(kind ItemType, id int64) ([]VersionRow, error) {
	rows, err := store.DB.Query("SELECT "+versionColumns+versionFrom+" WHERE v.kind = ? AND v.item_id = ? ORDER BY v.version DESC", kind.Name, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	versions := []VersionRow{}
	for rows.Next() {
		var row VersionRow
		if err := rows.Scan(&row.Version, &row.Action, &row.User, &row.Token, &row.CreatedAt); err != nil {
			return nil, err
		}
		versions = append(versions, row)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(versions) == 0 {
		return nil, ErrNotFound
	}
	return versions, nil
}

// ItemVersionOf reads one version of an item with its fields.
func (store *Store) ItemVersionOf(kind ItemType, id, version int64) (ItemVersion, error) {
	itemVersion := ItemVersion{Kind: kind.Name, ID: id}
	var fields string
	err := store.DB.QueryRow("SELECT "+versionColumns+", v.fields"+versionFrom+" WHERE v.kind = ? AND v.item_id = ? AND v.version = ?", kind.Name, id, version).
		Scan(&itemVersion.Version, &itemVersion.Action, &itemVersion.User, &itemVersion.Token, &itemVersion.CreatedAt, &fields)
	itemVersion.Fields = json.RawMessage(fields)
	return itemVersion, foundOrNot(err)
}
