package screen

import (
	"regexp"
	"strings"

	"journal-agent/screen/contracts"
)

// entryName is an option's name: after any "N." number, up to its first gap of two spaces or more.
var entryName = regexp.MustCompile(`^(?:\d+\.\s+)?(.+?)(?:\s{2,}|$)`)

// MenuEntries is the options of a drawn menu, in order, with the index of the highlighted one; Across is a menu
// laid out left to right, moved with the side arrows, such as a slider.
type MenuEntries struct {
	Labels      []string
	Highlighted int
	Across      bool
}

// EntryReader is a menu region that can read its entries.
type EntryReader interface {
	Entries(snapshot contracts.Snapshot) (MenuEntries, bool)
}

// View is what a key script reads besides the screen's kind: its rows, and the entries of the menu on it.
type View struct {
	layout Layout
	reader contracts.ScreenReader
}

func NewView(layout Layout, reader contracts.ScreenReader) View {
	return View{layout: layout, reader: reader}
}

// Rows is the screen's text as it stands.
func (view View) Rows() []string {
	return view.reader.Snapshot().Rows
}

// MenuEntries reads the entries of the menu on screen; drawn is false while no readable menu is.
func (view View) MenuEntries() (MenuEntries, bool) {
	return view.layout.MenuEntries(view.reader.Snapshot())
}

// MenuEntries reads the entries of the menu family on screen, when its option region can read them.
func (layout Layout) MenuEntries(snapshot contracts.Snapshot) (MenuEntries, bool) {
	for _, family := range layout.Menus {
		reader, readable := family.Options.(EntryReader)
		if readable && family.matches(snapshot) {
			return reader.Entries(snapshot)
		}
	}

	return MenuEntries{}, false
}

// IndexMarked is the index of the one entry whose text carries the note, such as "(current)", or -1 when no entry
// or more than one does.
func (entries MenuEntries) IndexMarked(note string) int {
	found := -1

	for index, text := range entries.Labels {
		if !strings.Contains(text, note) {
			continue
		}
		if found >= 0 {
			return -1
		}
		found = index
	}

	return found
}

// IndexOf is the index of the one entry named label, in any case, or -1 when no entry or more than one is. An
// entry's name is its text after any "N." number up to its first wide gap, such as "Haiku 5.5" in "5.  Haiku 5.5
// Fastest for quick answers"; a note after one space, such as "GPT-6.1-Sol (current)", still names "GPT-6.1-Sol".
func (entries MenuEntries) IndexOf(label string) int {
	found := -1

	for index, text := range entries.Labels {
		if !names(text, label) {
			continue
		}
		if found >= 0 {
			return -1
		}
		found = index
	}

	return found
}

func names(text, label string) bool {
	match := entryName.FindStringSubmatch(text)
	if match == nil {
		return false
	}

	name := strings.ToLower(match[1])
	label = strings.ToLower(label)

	return name == label || strings.HasPrefix(name, label+" (")
}

// Entries reads every option of the list, top to bottom, and which one is highlighted; found is false while no
// option list is drawn.
func (region OptionList) Entries(snapshot contracts.Snapshot) (MenuEntries, bool) {
	rows, found := region.Rows(snapshot)
	if !found {
		return MenuEntries{}, false
	}

	entries := MenuEntries{Highlighted: -1}
	for row := rows.First; row < rows.Last; row++ {
		text := []rune(plainSpaces(snapshot.Rows[row]))
		column, highlighted := region.highlight(snapshot.Rows[row])
		if highlighted {
			entries.Highlighted = len(entries.Labels)
		}
		if !highlighted {
			column = len(text) - len([]rune(strings.TrimLeft(string(text), " ")))
		}
		entries.Labels = append(entries.Labels, strings.TrimSpace(string(text[min(column, len(text)):])))
	}

	return entries, entries.Highlighted >= 0
}
