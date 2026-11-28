package terminal

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"
	"sync"

	"journal-runner/hostapi"
	"journal-runner/screen"
)

// Screen is a terminal process's screen as its emulator draws it, with when each row last changed.
type Screen struct {
	reader          *screen.EmulatorReader
	mutex           sync.Mutex
	rows            []string
	changedAt       []int64
	inputGeneration uint64
	shields         []hostapi.ShieldRule
}

// IsShielded is whether the screen now shows one the journal named as never to leave the machine.
func (screen *Screen) IsShielded() bool {
	return isShielded(screen.shields, screen.reader.Snapshot().Rows)
}

// Feed draws the printed bytes and marks the rows they changed at the host's monotonic time.
func (screen *Screen) Feed(printed []byte, now int64) {
	_ = screen.reader.Feed(printed)
	snapshot := screen.reader.Snapshot()
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	for len(screen.changedAt) < len(snapshot.Rows) {
		screen.changedAt = append(screen.changedAt, now)
		screen.rows = append(screen.rows, "")
	}
	for row, text := range snapshot.Rows {
		if screen.rows[row] != text {
			screen.rows[row] = text
			screen.changedAt[row] = now
		}
	}
}

// Frame is the screen now, each row with how long it has not changed.
func (screen *Screen) Frame(now int64) hostapi.Frame {
	snapshot := screen.reader.Snapshot()
	if isShielded(screen.shields, snapshot.Rows) {
		return hostapi.Frame{Rows: []string{}, Columns: snapshot.Columns, Buffer: string(snapshot.Buffer), Captured: now,
			UnchangedMs: []int64{}, IsShielded: true}
	}
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	unchanged := make([]int64, len(snapshot.Rows))
	for row := range snapshot.Rows {
		if row < len(screen.changedAt) {
			unchanged[row] = now - screen.changedAt[row]
		}
	}
	return hostapi.Frame{
		Rows:         snapshot.Rows,
		CursorRow:    snapshot.Cursor.Row,
		CursorColumn: snapshot.Cursor.Column,
		Columns:      snapshot.Columns,
		Buffer:       string(snapshot.Buffer),
		Captured:     now,
		UnchangedMs:  unchanged,
	}
}

// RowsHash is the SHA-256 hex of the rows' text from one row to another, joined by newlines.
func (screen *Screen) RowsHash(from, to int) string {
	rows := screen.reader.Snapshot().Rows
	from, to = max(0, from), min(to, len(rows)-1)
	if from > to {
		return ""
	}
	digest := sha256.Sum256([]byte(strings.Join(rows[from:to+1], "\n")))
	return hex.EncodeToString(digest[:])
}

// InputGeneration is raised by every write the user makes.
func (screen *Screen) InputGeneration() uint64 {
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	return screen.inputGeneration
}

// RaiseInputGeneration marks a write of the user's, so a guarded write made before it is refused.
func (screen *Screen) RaiseInputGeneration() uint64 {
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	screen.inputGeneration++
	return screen.inputGeneration
}

func newScreen(columns, rows int, shields []hostapi.ShieldRule) (*Screen, error) {
	reader, err := screen.NewEmulatorReader(columns, rows, screen.DefaultLimits, nil)
	if err != nil {
		return nil, err
	}
	return &Screen{reader: reader, shields: shields}, nil
}
