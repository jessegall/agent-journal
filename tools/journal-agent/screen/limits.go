// Package screen reads the screen of an agent program's terminal from its raw output.
package screen

import "fmt"

// Limits bound what a reader takes, so a runaway program fails as unreadable instead of exhausting the host.
type Limits struct {
	MaxChunkBytes int
	MaxColumns    int
	MaxRows       int
}

// DefaultLimits are measured from the phase 1 recordings with ample headroom (task 882 log).
var DefaultLimits = Limits{MaxChunkBytes: 1 << 20, MaxColumns: 500, MaxRows: 300}

// ScreenUnreadable is the screen a reader refuses to guess: a feed or a size past its limits.
type ScreenUnreadable struct {
	Reason string
}

func (unreadable ScreenUnreadable) Error() string {
	return "the screen is unreadable: " + unreadable.Reason
}

func (limits Limits) checkChunk(size int) error {
	if size > limits.MaxChunkBytes {
		return ScreenUnreadable{Reason: fmt.Sprintf("a chunk of %d bytes is over the %d byte limit", size, limits.MaxChunkBytes)}
	}

	return nil
}

func (limits Limits) checkSize(columns, rows int) error {
	if columns < 1 || rows < 1 || columns > limits.MaxColumns || rows > limits.MaxRows {
		return ScreenUnreadable{Reason: fmt.Sprintf("a size of %dx%d is outside 1x1 to %dx%d", columns, rows, limits.MaxColumns, limits.MaxRows)}
	}

	return nil
}
