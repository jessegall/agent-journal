package screen

import (
	"regexp"
	"strings"

	"journal-agent/screen/contracts"
)

// entryName is an option's name: after any "N." number, up to its first gap of two spaces or more.
var entryName = regexp.MustCompile(`^(?:\d+\.\s+)?(.+?)(?:\s{2,}|$)`)

// MenuEntries is the options of a drawn menu, top to bottom, with the index of the highlighted one.
type MenuEntries struct {
	Labels      []string
	Highlighted int
}

// IndexOf is the index of the one entry named label, or -1 when no entry or more than one is. An entry's name is
// its text after any "N." number up to its first wide gap, such as "Haiku 5.5" in "5.  Haiku 5.5   Fastest for
// quick answers"; a note after one space, such as "GPT-6.1-Sol (current)", still names "GPT-6.1-Sol".
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

// HighlightedIs is whether the highlighted entry is the one named label.
func (entries MenuEntries) HighlightedIs(label string) bool {
	return entries.Highlighted >= 0 && entries.Highlighted < len(entries.Labels) &&
		names(entries.Labels[entries.Highlighted], label)
}

func names(text, label string) bool {
	match := entryName.FindStringSubmatch(text)
	if match == nil {
		return false
	}

	return match[1] == label || strings.HasPrefix(match[1], label+" (")
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
