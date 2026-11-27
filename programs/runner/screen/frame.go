package screen

import (
	"encoding/json"
	"fmt"
	"image/color"
	"strings"
	"time"

	uv "github.com/charmbracelet/ultraviolet"

	"journal-runner/screen/contracts"
)

// Frame is the screen as currently shown: every row as runs of one style, the cursor, the buffer and the size. A
// shielded frame stands for a screen the host would not export, with no rows and no cursor.
type Frame struct {
	Epoch         string           `json:"epoch"`
	Sequence      uint64           `json:"sequence"`
	Captured      time.Time        `json:"captured"`
	Columns       int              `json:"columns"`
	Rows          [][]Run          `json:"rows"`
	Cursor        contracts.Cursor `json:"cursor"`
	Buffer        contracts.Buffer `json:"buffer"`
	IsPlain       bool             `json:"is_plain"`
	IsTooLarge    bool             `json:"is_too_large"`
	IsUnreadable  bool             `json:"is_unreadable"`
	HasNoTerminal bool             `json:"has_no_terminal"`
	IsShielded    bool             `json:"is_shielded"`
	// Stream names the sender that sent the frame: a sender started over is a new stream, its sequence from one.
	Stream string `json:"stream"`
}

// FrameLimit is the most bytes of JSON one frame may take.
const FrameLimit = 256 << 10

// Run is neighbouring cells of one row that share one style.
type Run struct {
	Text  string `json:"text"`
	Style Style  `json:"style"`
}

// Style is how a run is drawn; an empty colour is the terminal's default.
type Style struct {
	Foreground   string `json:"fg,omitempty"`
	Background   string `json:"bg,omitempty"`
	IsBold       bool   `json:"isBold,omitempty"`
	IsItalic     bool   `json:"isItalic,omitempty"`
	IsUnderlined bool   `json:"isUnderlined,omitempty"`
	IsInverse    bool   `json:"isInverse,omitempty"`
}

// Frame reads the grid with its styles under the reader's lock; the epoch names the host process, so a restart is
// not mistaken for old frames.
func (reader *EmulatorReader) Frame(epoch string, sequence uint64, now time.Time) Frame {
	reader.lock.Lock()
	defer reader.lock.Unlock()

	return reader.frame(epoch, sequence, now)
}

// ShieldFrame is the placeholder that stands for the screen while a capture barrier is closed: no rows, no cursor.
func (reader *EmulatorReader) ShieldFrame(epoch string, sequence uint64, now time.Time) Frame {
	reader.lock.Lock()
	defer reader.lock.Unlock()

	return reader.shieldFrame(epoch, sequence, now)
}

// shieldFrame is the placeholder frame; the caller holds the lock.
func (reader *EmulatorReader) shieldFrame(epoch string, sequence uint64, now time.Time) Frame {
	return Frame{
		Epoch:      epoch,
		Sequence:   sequence,
		Captured:   now,
		Columns:    reader.terminal.Width(),
		Rows:       [][]Run{},
		Buffer:     reader.buffer(),
		IsShielded: true,
	}
}

// frame reads the grid with its styles; the caller holds the lock.
func (reader *EmulatorReader) frame(epoch string, sequence uint64, now time.Time) Frame {
	columns, height := reader.terminal.Width(), reader.terminal.Height()
	rows := make([][]Run, height)
	for row := range height {
		rows[row] = reader.runsOfRow(row, columns)
	}

	cursor := reader.terminal.CursorPosition()

	return Frame{
		Epoch:    epoch,
		Sequence: sequence,
		Captured: now,
		Columns:  columns,
		Rows:     rows,
		Cursor:   contracts.Cursor{Row: cursor.Y, Column: cursor.X, IsVisible: reader.cursorVisible},
		Buffer:   reader.buffer(),
	}
}

// Bounded gives the frame as it is when its JSON fits the limit; over it, the rows as plain text without styles,
// and when even that is over it, a marker that says the screen is too large, with no rows.
func (frame Frame) Bounded(limit int) Frame {
	if frame.fits(limit) {
		return frame
	}

	plain := frame
	plain.IsPlain = true
	plain.Rows = make([][]Run, len(frame.Rows))
	for row, runs := range frame.Rows {
		plain.Rows[row] = plainRow(runs)
	}
	if plain.fits(limit) {
		return plain
	}

	marker := frame
	marker.IsTooLarge = true
	marker.Rows = [][]Run{}

	return marker
}

// fits says whether the frame's JSON takes at most limit bytes.
func (frame Frame) fits(limit int) bool {
	encoded, err := json.Marshal(frame)

	return err == nil && len(encoded) <= limit
}

// plainRow joins a row's runs into one run of the default style.
func plainRow(runs []Run) []Run {
	var text strings.Builder
	for _, run := range runs {
		text.WriteString(run.Text)
	}
	trimmed := strings.TrimRight(text.String(), " ")
	if trimmed == "" {
		return []Run{}
	}

	return []Run{{Text: trimmed}}
}

// runsOfRow reads one row as styled runs, reading cells as snapshot does; the caller holds the lock. Trailing spaces
// of the default style are cut, as snapshot cuts trailing spaces.
func (reader *EmulatorReader) runsOfRow(row, columns int) []Run {
	runs := []Run{}
	var text strings.Builder
	var style Style

	for column := 0; column < columns; column++ {
		cell := reader.terminal.CellAt(column, row)
		if cell != nil && cell.Content == "" && cell.Width == 0 {
			continue
		}

		cellText, cellStyle := " ", Style{}
		if cell != nil {
			cellStyle = styleOf(cell.Style)
			if cell.Content != "" {
				cellText = cell.Content
			}
		}

		if cellStyle != style && text.Len() > 0 {
			runs = append(runs, Run{Text: text.String(), Style: style})
			text.Reset()
		}
		style = cellStyle
		text.WriteString(cellText)
	}
	if text.Len() > 0 {
		runs = append(runs, Run{Text: text.String(), Style: style})
	}

	return withoutTrailingSpaces(runs)
}

// withoutTrailingSpaces cuts the spaces of the default style that end a row, which nobody sees.
func withoutTrailingSpaces(runs []Run) []Run {
	kept := runs
	for len(kept) > 0 {
		last := &kept[len(kept)-1]
		if last.Style != (Style{}) {
			return kept
		}
		last.Text = strings.TrimRight(last.Text, " ")
		if last.Text != "" {
			return kept
		}
		kept = kept[:len(kept)-1]
	}

	return kept
}

// styleOf turns the emulator's cell style into the style a frame carries.
func styleOf(style uv.Style) Style {
	return Style{
		Foreground:   hexOf(style.Fg),
		Background:   hexOf(style.Bg),
		IsBold:       style.Attrs&uv.AttrBold != 0,
		IsItalic:     style.Attrs&uv.AttrItalic != 0,
		IsUnderlined: style.Underline != uv.UnderlineNone,
		IsInverse:    style.Attrs&uv.AttrReverse != 0,
	}
}

// hexOf writes a colour as #rrggbb, and the terminal's default colour as nothing.
func hexOf(colour color.Color) string {
	if colour == nil {
		return ""
	}
	red, green, blue, _ := colour.RGBA()

	return fmt.Sprintf("#%02x%02x%02x", red>>8, green>>8, blue>>8)
}
