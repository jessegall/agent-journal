package recording

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"syscall"
)

// DraftsFolder is where the host adds its wires' drafts to the journal's recording run.
const DraftsFolder = "/srv/journal/recordings/drafts"

// Drafts writes the drafts of the journal's open recording run, as the PHP RecordingDrafts does: line 1 of an
// exchange is its opening, each later line one event, appended under the draft's lock. Outside an open run nothing is
// written; the journal opens one only while its recording switch is on, so the host needs no switch of its own.
type Drafts struct {
	Folder string
}

// JournalDrafts are the drafts of the journal's recording runs, in the folder the journal shares with the host.
func JournalDrafts() Drafts {
	return Drafts{Folder: DraftsFolder}
}

// Begin opens the exchange's draft with its opening, once.
func (drafts Drafts) Begin(wire Wire, exchange string, opening Opening) error {
	draft := drafts.draftOf(wire, exchange)
	if !drafts.isRunOpen() {
		return nil
	}
	if _, err := os.Stat(draft); err == nil {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(draft), 0o775); err != nil {
		return err
	}
	return drafts.appendLine(draft, opening)
}

// Add adds the event to the exchange's draft; an exchange with no draft is not recorded.
func (drafts Drafts) Add(wire Wire, exchange string, event Event) error {
	draft := drafts.draftOf(wire, exchange)
	if !drafts.isRunOpen() {
		return nil
	}
	if _, err := os.Stat(draft); err != nil {
		return nil
	}
	return drafts.appendLine(draft, event)
}

func (drafts Drafts) isRunOpen() bool {
	content, err := os.ReadFile(filepath.Join(drafts.Folder, "run.json"))
	if err != nil {
		return false
	}
	var run struct {
		ClosedAt *int64 `json:"closed_at"`
	}
	return json.Unmarshal(content, &run) == nil && run.ClosedAt == nil
}

func (drafts Drafts) draftOf(wire Wire, exchange string) string {
	return filepath.Join(drafts.Folder, string(wire), exchange+".jsonl")
}

// appendLine adds one JSON line to the draft under the lock the journal's side takes too.
func (drafts Drafts) appendLine(draft string, line any) error {
	encoded, err := json.Marshal(line)
	if err != nil {
		return err
	}
	lock, err := os.OpenFile(draft+".lock", os.O_CREATE|os.O_RDWR, 0o664)
	if err != nil {
		return err
	}
	defer lock.Close()
	if err := syscall.Flock(int(lock.Fd()), syscall.LOCK_EX); err != nil {
		return err
	}
	defer func() { _ = syscall.Flock(int(lock.Fd()), syscall.LOCK_UN) }()
	file, err := os.OpenFile(draft, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o664)
	if err != nil {
		return err
	}
	_, writeErr := file.Write(append(encoded, '\n'))
	return errors.Join(writeErr, file.Close())
}
