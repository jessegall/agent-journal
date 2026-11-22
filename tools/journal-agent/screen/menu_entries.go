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

// EntryMatch is how many entries hold what was looked for: none, exactly one, or more than one.
type EntryMatch string

const (
	NotShown  EntryMatch = "not shown"
	ShownOnce EntryMatch = "shown once"
	Ambiguous EntryMatch = "ambiguous"
)

// Find is the index of the one entry whose label is the given one, as labelOf reads it; found is false when no entry
// or more than one holds it, so a neighbour is never taken for it.
func (entries MenuEntries) Find(label string) (index int, found bool) {
	index, match := entries.Locate(label)

	return index, match == ShownOnce
}

// Locate is the index of the entry whose label is the given one and how many entries hold it; the index is -1
// unless exactly one does.
func (entries MenuEntries) Locate(label string) (int, EntryMatch) {
	return entries.locate(func(text string) bool { return labelOf(text, label) })
}

// LocateMarked is the index of the entry whose text carries the note, such as "(current)", and how many carry it.
func (entries MenuEntries) LocateMarked(note string) (int, EntryMatch) {
	return entries.locate(func(text string) bool { return strings.Contains(text, note) })
}

func (entries MenuEntries) locate(holds func(text string) bool) (int, EntryMatch) {
	index := -1
	for position, text := range entries.Labels {
		if !holds(text) {
			continue
		}
		if index >= 0 {
			return -1, Ambiguous
		}
		index = position
	}
	if index < 0 {
		return -1, NotShown
	}

	return index, ShownOnce
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

// FrameMenu is a recognized menu as a public frame shows it: its family, its option labels, the highlighted one
// (-1 when the highlight cannot be told), and the screen generation it was read at, which a choice must name.
type FrameMenu struct {
	Family      string   `json:"family"`
	Labels      []string `json:"labels"`
	Highlighted int      `json:"highlighted"`
	Revision    uint64   `json:"revision"`
}

// frameMenu is the recognized menu of the snapshot for a public frame; found is false on a screen without one.
func (layout Layout) frameMenu(snapshot contracts.Snapshot, revision uint64) (FrameMenu, bool) {
	for _, family := range layout.Menus {
		reader, readable := family.Options.(EntryReader)
		if !readable || !family.matches(snapshot) {
			continue
		}
		entries, found := reader.Entries(snapshot)
		if !found {
			return FrameMenu{}, false
		}

		return FrameMenu{
			Family:      family.Name,
			Labels:      entries.Labels,
			Highlighted: entries.Highlighted,
			Revision:    revision,
		}, true
	}

	return FrameMenu{}, false
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

// MenuEntries is the entries of the menu on screen: a known family's own, such as a slider's, or else the shared
// option region's, so a menu no family knows is read too; no entries while no readable menu is drawn.
func (view View) MenuEntries() MenuEntries {
	snapshot := view.reader.Snapshot()
	if entries, found := view.layout.MenuEntries(snapshot); found {
		return entries
	}
	region, _ := view.layout.OptionRegion(snapshot)

	return region.Entries
}
