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

// AnsweredRecord keeps answers until their retention ends, in
// <state>/instructions/answered.json, so an instruction handed out again is answered from it and never carried out twice, across
// a restart of the host too. An instruction is marked started on disk before it is carried out, so one the host stopped in
// the middle of is known after a restart. Expiry is read on the journal's clock, so a skewed host clock keeps no entry
// too short; the record is keyed by instruction alone, so replacing the host's credential keeps it.
type AnsweredRecord struct {
	path    string
	mutex   sync.Mutex
	entries map[string]answeredEntry
}

type answeredEntry struct {
	Answer    Answer    `json:"answer"`
	ExpiresAt time.Time `json:"expires_at"`
	// IsStarted is an instruction the host started to carry out and has not answered yet.
	IsStarted bool `json:"is_started,omitempty"`
}

const openingRecordTime = time.Hour

// OpenAnsweredRecord reads the record the host kept in its state folder, or starts an empty one.
func OpenAnsweredRecord(stateFolder string) (*AnsweredRecord, error) {
	record := &AnsweredRecord{
		path:    filepath.Join(stateFolder, "instructions", "answered.json"),
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

// Find gives the answer the host recorded for the instruction, if it answered it.
func (record *AnsweredRecord) Find(instructionID string) (Answer, bool) {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	entry, found := record.entries[instructionID]
	return entry.Answer, found && !entry.IsStarted
}

// IsInterrupted is whether the host started the instruction and stopped before it answered it.
func (record *AnsweredRecord) IsInterrupted(instructionID string) bool {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	return record.entries[instructionID].IsStarted
}

// Start writes to disk that the instruction is being carried out, before its executor runs.
func (record *AnsweredRecord) Start(instruction Instruction, now time.Time) error {
	return record.write(instruction, answeredEntry{ExpiresAt: keptUntil(instruction, now), IsStarted: true}, now)
}

// Keep writes the answer to disk before the host reports it and drops records past their retention.
func (record *AnsweredRecord) Keep(instruction Instruction, answer Answer, now time.Time) error {
	return record.write(instruction, answeredEntry{Answer: answer, ExpiresAt: keptUntil(instruction, now)}, now)
}

func keptUntil(instruction Instruction, now time.Time) time.Time {
	if InstructionTypes[instruction.Type].Opens {
		return now.Add(openingRecordTime)
	}
	return instruction.ExpiresAt
}

func (record *AnsweredRecord) write(instruction Instruction, entry answeredEntry, now time.Time) error {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	for instructionID, kept := range record.entries {
		if !now.Before(kept.ExpiresAt) {
			delete(record.entries, instructionID)
		}
	}
	record.entries[instruction.ID] = entry
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

// AnsweredThrough is the newest instruction the record holds an answer of; instruction ids sort by when they were made.
func (record *AnsweredRecord) AnsweredThrough() string {
	record.mutex.Lock()
	defer record.mutex.Unlock()
	newest := ""
	for instructionID, entry := range record.entries {
		if !entry.IsStarted {
			newest = max(newest, instructionID)
		}
	}
	return newest
}
