// Package contracts holds the interfaces of screen reading.
package contracts

import "fmt"

// Buffer is which screen buffer a terminal shows: the normal one with scrollback, or the alternate one full-screen
// programs draw on.
type Buffer string

const (
	NormalBuffer    Buffer = "normal"
	AlternateBuffer Buffer = "alternate"
)

// Cursor is where the terminal's cursor is and whether it shows.
type Cursor struct {
	Row       int  `json:"row"`
	Column    int  `json:"column"`
	IsVisible bool `json:"isVisible"`
}

// Snapshot is one read of the screen: every row as text, the cursor, the buffer shown and its size.
type Snapshot struct {
	Rows    []string
	Cursor  Cursor
	Buffer  Buffer
	Columns int
	Height  int
}

// Status describes the cursor and the buffer in one line, as "cursor 3,4 visible true, normal buffer".
func (snapshot Snapshot) Status() string {
	return fmt.Sprintf("cursor %d,%d visible %v, %s buffer",
		snapshot.Cursor.Row, snapshot.Cursor.Column, snapshot.Cursor.IsVisible, snapshot.Buffer)
}

// ScreenReader turns a program's raw terminal output into the screen a user would see. Feeding bytes in any
// split gives the same screen; a feed or size past the limits fails with ScreenUnreadable instead of a guess.
type ScreenReader interface {
	// Feed takes the next raw bytes the program wrote, split anywhere.
	Feed(bytes []byte) error

	// Resize changes the terminal's size, as a resize of the user's window does.
	Resize(columns, rows int) error

	// Snapshot reads the screen as it stands.
	Snapshot() Snapshot

	// Generation counts the changes of a named region's text, so a reader waits for a region to settle.
	Generation(region string) uint64

	// ScreenGeneration counts the changes of the whole screen's text, leaving out the regions that change while the
	// screen stays the same, such as a spinner; a change undone before anyone looks still counts.
	ScreenGeneration() uint64
}

// RowRange is a run of screen rows from First up to, not including, Last.
type RowRange struct {
	First int
	Last  int
}

// Region is a named part of a program's screen, such as its composer, a menu, its spinner or its status line,
// found anew in every snapshot because it moves as the program draws above and below it.
type Region interface {
	// Name is the region's name, unique within a screen layout.
	Name() string

	// Rows finds the region's rows in the snapshot, or found is false while it is not drawn.
	Rows(snapshot Snapshot) (rows RowRange, found bool)
}

// ComposerRegion is the region a program's user types into; it knows the prompt marker drawn before the text.
type ComposerRegion interface {
	Region

	// Text is what is typed in the composer, without its prompt marker, spaces trimmed; empty while it is not drawn.
	Text(snapshot Snapshot) string
}
