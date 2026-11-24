// Package screen reads the screen of an agent driver's terminal from its raw output.
package screen

import "fmt"

// Limits bound what a reader takes, so a runaway program fails as unreadable instead of exhausting the host.
type Limits struct {
	MaxChunkBytes      int
	MaxColumns         int
	MaxRows            int
	MaxScrollbackLines int
}

// DefaultLimits are measured from the first recordings with ample headroom. The longest recorded
// turn scrolls about 300 lines; the scrollback keeps the latest 5000 and drops older lines, so memory stays bounded.
var DefaultLimits = Limits{MaxChunkBytes: 1 << 20, MaxColumns: 500, MaxRows: 300, MaxScrollbackLines: 5000}

// ScreenUnreadable is the screen a reader refuses to guess: a feed or a size past its limits.
type ScreenUnreadable struct {
	Reason string
}

func (unreadable ScreenUnreadable) Error() string {
	return "the screen is unreadable: " + unreadable.Reason
}

func (limits Limits) checkChunk(size int) error {
	if size > limits.MaxChunkBytes {
		reason := fmt.Sprintf("a chunk of %d bytes is over the %d byte limit", size, limits.MaxChunkBytes)

		return ScreenUnreadable{Reason: reason}
	}

	return nil
}

func (limits Limits) checkSize(columns, rows int) error {
	if columns < 1 || rows < 1 || columns > limits.MaxColumns || rows > limits.MaxRows {
		reason := fmt.Sprintf("a size of %dx%d is outside 1x1 to %dx%d", columns, rows, limits.MaxColumns, limits.MaxRows)

		return ScreenUnreadable{Reason: reason}
	}

	return nil
}
