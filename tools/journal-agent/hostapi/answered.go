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
// a restart of the host too. An order is marked started on disk before it is carried out, so one the host stopped in
// the middle of is known after a restart. Expiry is read on the journal's clock, so a skewed host clock keeps no entry
// too short; the record is keyed by order alone, so replacing the host's credential keeps it.
type AnsweredRecord struct {
	path    string
	mutex   sync.Mutex
	entries map[string]answeredEntry
}

type answeredEntry struct {
	Answer    Answer    `json:"answer"`
	ExpiresAt time.Time `json:"expires_at"`
	// IsStarted is an order the host started to carry out and has not answered yet.
	IsStarted bool `json:"is_started,omitempty"`
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
	return entry.Answer, found && !entry.IsStarted
}

// IsInterrupted is whether the host started the order and stopped before it answered it.
func (record *AnsweredRecord) IsInterrupted(orderID string) bool {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	return record.entries[orderID].IsStarted
}

// Start writes to disk that the order is being carried out, before its executor runs.
func (record *AnsweredRecord) Start(order Order, now time.Time) error {
	return record.write(order, answeredEntry{ExpiresAt: order.ExpiresAt, IsStarted: true}, now)
}

// Keep writes the order's answer to disk before the host reports it, and drops the answers of orders that expired.
func (record *AnsweredRecord) Keep(order Order, answer Answer, now time.Time) error {
	return record.write(order, answeredEntry{Answer: answer, ExpiresAt: order.ExpiresAt}, now)
}

func (record *AnsweredRecord) write(order Order, entry answeredEntry, now time.Time) error {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	for orderID, kept := range record.entries {
		if !now.Before(kept.ExpiresAt) {
			delete(record.entries, orderID)
		}
	}
	record.entries[order.ID] = entry
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

// AnsweredThrough is the newest order the record holds an answer of; order ids sort by when they were made.
func (record *AnsweredRecord) AnsweredThrough() string {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	newest := ""
	for orderID, entry := range record.entries {
		if !entry.IsStarted {
			newest = max(newest, orderID)
		}
	}
	return newest
}
