// Package contracts holds the interfaces of screen reading.
package contracts

// Buffer is which screen buffer a terminal shows: the normal one with scrollback, or the alternate one full-screen
// programs draw on.
type Buffer string

const (
	NormalBuffer    Buffer = "normal"
	AlternateBuffer Buffer = "alternate"
)

// Cursor is where the terminal's cursor is and whether it shows.
type Cursor struct {
	Row     int
	Column  int
	Visible bool
}

// Snapshot is one read of the screen: every row as text, the cursor, the buffer shown and its size.
type Snapshot struct {
	Rows    []string
	Cursor  Cursor
	Buffer  Buffer
	Columns int
	Height  int
}

// ScreenReader turns a program's raw terminal output into the screen a person would see. Feeding bytes in any
// split gives the same screen; a feed or size past the limits fails with ScreenUnreadable instead of a guess.
type ScreenReader interface {
	// Feed takes the next raw bytes the program wrote, split anywhere.
	Feed(bytes []byte) error

	// Resize changes the terminal's size, as a resize of the person's window does.
	Resize(columns, rows int) error

	// Snapshot reads the screen as it stands.
	Snapshot() Snapshot

	// Generation counts the changes of a named region of rows, so a reader waits for a region to settle.
	Generation(region string) uint64
}
