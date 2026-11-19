package keyscripts

import (
	"bytes"
	"fmt"
	"strings"
	"testing"

	"journal-agent/screen"
)

// liveMenu answers keys as the program does, from the menu a recording left on screen: each arrow moves the
// highlight by its stride and the screen is drawn again, with the entries in whatever order the test gave them.
type liveMenu struct {
	reader      *screen.EmulatorReader
	above       []string
	below       []string
	marker      string
	indent      string
	labels      []string
	highlighted int
	stride      int
	keys        bytes.Buffer
	chosen      string
}

// newLiveMenu takes over the option list drawn on the reader's screen; nothing of the recording is fed after it.
func newLiveMenu(t *testing.T, reader *screen.EmulatorReader, options screen.OptionList) *liveMenu {
	t.Helper()
	snapshot := reader.Snapshot()
	rows, shown := options.Rows(snapshot)
	entries, _ := options.Entries(snapshot)
	if !shown {
		t.Fatal("the recording leaves no menu on screen")
	}
	highlightedRow := strings.ReplaceAll(snapshot.Rows[rows.First+entries.Highlighted], "\u00a0", " ")
	prefix := highlightedRow[:strings.Index(highlightedRow, entries.HighlightedLabel())]
	marker := options.Markers[0]

	return &liveMenu{
		reader:      reader,
		above:       snapshot.Rows[:rows.First],
		below:       snapshot.Rows[rows.Last:],
		marker:      marker,
		indent:      strings.TrimSuffix(prefix, marker),
		labels:      entries.Labels,
		highlighted: entries.Highlighted,
		stride:      1,
	}
}

// show draws the menu again with these entries, the given one highlighted.
func (menu *liveMenu) show(labels []string, highlighted int) {
	menu.labels, menu.highlighted = labels, highlighted
	menu.draw()
}

func (menu *liveMenu) Write(keys []byte) (int, error) {
	menu.keys.Write(keys)
	switch string(keys) {
	case arrowDown:
		menu.highlighted = min(menu.highlighted+menu.stride, len(menu.labels)-1)
	case arrowUp:
		menu.highlighted = max(menu.highlighted-menu.stride, 0)
	case enterKey:
		menu.chosen = menu.labels[menu.highlighted]
	}
	menu.draw()

	return len(keys), nil
}

func (menu *liveMenu) draw() {
	rows := append([]string{}, menu.above...)
	for index, label := range menu.labels {
		mark := strings.Repeat(" ", len([]rune(menu.marker)))
		if index == menu.highlighted {
			mark = menu.marker
		}
		rows = append(rows, menu.indent+mark+label)
	}
	rows = append(rows, menu.below...)

	var screen strings.Builder
	screen.WriteString("\x1b[2J")
	for row, text := range rows[:min(len(rows), 40)] {
		fmt.Fprintf(&screen, "\x1b[%d;1H%s", row+1, text)
	}
	menu.reader.Feed([]byte(screen.String()))
}

// sent is every key the program got.
func (menu *liveMenu) sent() string {
	return menu.keys.String()
}

// highlightedLabel is the entry the highlight is on.
func (menu *liveMenu) highlightedLabel() string {
	return menu.labels[menu.highlighted]
}
