package store

// StateItem is one item in the list a journal reads each round: which version it is at and whether it is removed.
type StateItem struct {
	Kind    string `json:"kind"`
	ID      int64  `json:"id"`
	Version int64  `json:"version"`
	Removed bool   `json:"removed"`
}

// State gives the number of the newest history row and every item that is not purged, kind by kind. The number is read
// first, so a write that lands during the read shows in the items and moves the number on the next round.
func (store *Store) State() (int64, []StateItem, error) {
	var newest int64
	if err := store.DB.QueryRow("SELECT COALESCE(MAX(id), 0) FROM item_versions").Scan(&newest); err != nil {
		return 0, nil, err
	}
	items := []StateItem{}
	for _, kind := range Kinds {
		rows, err := store.DB.Query("SELECT id, version, removed_at IS NOT NULL FROM " + kind.Table + " ORDER BY id")
		if err != nil {
			return 0, nil, err
		}
		for rows.Next() {
			item := StateItem{Kind: kind.Name}
			if err := rows.Scan(&item.ID, &item.Version, &item.Removed); err != nil {
				rows.Close()
				return 0, nil, err
			}
			items = append(items, item)
		}
		err = rows.Err()
		rows.Close()
		if err != nil {
			return 0, nil, err
		}
	}
	return newest, items, nil
}
