package hostapi

import (
	"encoding/json"
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// AnsweredRecord keeps the answer of every order the host answered until the order expires, in
// <state>/orders/answered.json, so an order handed out again is answered from it and never carried out twice, across
// a restart of the host too.
type AnsweredRecord struct {
	path    string
	mutex   sync.Mutex
	entries map[string]answeredEntry
}

type answeredEntry struct {
	Answer    Answer    `json:"answer"`
	ExpiresAt time.Time `json:"expires_at"`
}

// OpenAnsweredRecord reads the record the host kept in its state folder, or starts an empty one.
func OpenAnsweredRecord(stateFolder string) (*AnsweredRecord, error) {
	record := &AnsweredRecord{
		path:    filepath.Join(stateFolder, "orders", "answered.json"),
		entries: map[string]answeredEntry{},
	}
	content, err := os.ReadFile(record.path)
	if errors.Is(err, fs.ErrNotExist) {
		return record, nil
	}
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(content, &record.entries); err != nil {
		return nil, err
	}
	return record, nil
}

// Find gives the answer the host recorded for the order, if it answered it.
func (record *AnsweredRecord) Find(orderID string) (Answer, bool) {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	entry, found := record.entries[orderID]
	return entry.Answer, found
}

// Keep writes the order's answer to disk before the host reports it, and drops the answers of orders that expired.
func (record *AnsweredRecord) Keep(order Order, answer Answer, now time.Time) error {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	for orderID, entry := range record.entries {
		if !now.Before(entry.ExpiresAt) {
			delete(record.entries, orderID)
		}
	}
	record.entries[order.ID] = answeredEntry{Answer: answer, ExpiresAt: order.ExpiresAt}
	return record.save()
}

// Count is how many answers the record holds.
func (record *AnsweredRecord) Count() int {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	return len(record.entries)
}

func (record *AnsweredRecord) save() error {
	content, err := json.Marshal(record.entries)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(record.path), 0o700); err != nil {
		return err
	}
	temporary := record.path + ".new"
	if err := os.WriteFile(temporary, content, 0o600); err != nil {
		return err
	}
	return os.Rename(temporary, record.path)
}
