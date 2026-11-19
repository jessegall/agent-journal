package screen

import (
	"regexp"
	"strings"
	"unicode"
)

// MenuEntries is the option list a menu shows: each entry's text, top to bottom, and the index of the highlighted one.
type MenuEntries struct {
	Labels      []string
	Highlighted int
}

// entryNumber is the "3. " a program puts before an entry's label.
var entryNumber = regexp.MustCompile(`^\d+\.\s+`)

// Find is the index of the one entry whose label is the given one, as labelOf reads it; found is false when no entry
// or more than one holds it, so a neighbour is never taken for it.
func (entries MenuEntries) Find(label string) (index int, found bool) {
	index = -1
	for position, text := range entries.Labels {
		if !labelOf(text, label) {
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
	note := []rune(column[len(label)+1:])

	return !unicode.IsLetter(note[0]) && !unicode.IsDigit(note[0])
}
