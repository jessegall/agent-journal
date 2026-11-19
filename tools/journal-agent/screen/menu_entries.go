package screen

import (
	"regexp"
	"strings"

	"journal-agent/screen/contracts"
)

// MenuEntries is the option list a menu shows: each entry's text, in order, and the index of the highlighted one.
// Across is a menu laid out left to right and moved with the side arrows, such as a slider.
type MenuEntries struct {
	Labels      []string
	Highlighted int
	Across      bool
}

// entryNumber is the "3. " a program puts before an entry's label.
var entryNumber = regexp.MustCompile(`^\d+\.\s+`)

// Find is the index of the one entry whose label is the given one, as labelOf reads it; found is false when no entry
// or more than one holds it, so a neighbour is never taken for it.
func (entries MenuEntries) Find(label string) (index int, found bool) {
	return entries.findOne(func(text string) bool { return labelOf(text, label) })
}

// FindMarked is the index of the one entry whose text carries the note, such as "(current)"; found is false when
// no entry or more than one carries it.
func (entries MenuEntries) FindMarked(note string) (index int, found bool) {
	return entries.findOne(func(text string) bool { return strings.Contains(text, note) })
}

func (entries MenuEntries) findOne(holds func(text string) bool) (int, bool) {
	index := -1
	for position, text := range entries.Labels {
		if !holds(text) {
			continue
		}
		if index >= 0 {
			return -1, false
		}
		index = position
	}

	return index, index >= 0
}

// HighlightedLabel is the text of the highlighted entry.
func (entries MenuEntries) HighlightedLabel() string {
	return entries.Labels[entries.Highlighted]
}

// labelOf is whether an entry's text names the label, in any case. The entry's label is its first column, after its
// number and up to the gap of two spaces before its description; the wanted label is all of it, or all of it but a
// note such as "(current)" or "✔". So "Opus" is not the label of "Opus 5.5", nor "GPT-6" of "GPT-6-Sol".
func labelOf(text, label string) bool {
	column, _, _ := strings.Cut(entryNumber.ReplaceAllString(text, ""), "  ")
	if strings.EqualFold(column, label) {
		return true
	}
	if len(column) <= len(label)+1 || column[len(label)] != ' ' || !strings.EqualFold(column[:len(label)], label) {
		return false
	}

	return !wordGoesOn([]rune(column[len(label)+1:]))
}

// EntryReader is a menu region that can read its entries.
type EntryReader interface {
	Entries(snapshot contracts.Snapshot) (MenuEntries, bool)
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

// MenuEntries is the entries of the menu on screen; no entries while no readable menu is drawn.
func (view View) MenuEntries() MenuEntries {
	entries, _ := view.layout.MenuEntries(view.reader.Snapshot())

	return entries
}
