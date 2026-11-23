package screen

import (
	"strings"

	"journal-agent/screen/contracts"
)

// FencedRow is the lowest row that starts with its marker and sits directly between two rule rows, as Claude Code
// draws its composer: a row of ─ above, the prompt row, a row of ─ below. Text that merely looks like the prompt is
// not fenced, so it is not found.
type FencedRow struct {
	Label  string
	Marker string
}

func (region FencedRow) Name() string {
	return region.Label
}

func (region FencedRow) Rows(snapshot contracts.Snapshot) (contracts.RowRange, bool) {
	for row := len(snapshot.Rows) - 2; row >= 1; row-- {
		if startsWith(snapshot.Rows[row], region.Marker) &&
			isRule(snapshot.Rows[row-1]) && isRule(snapshot.Rows[row+1]) {
			return contracts.RowRange{First: row, Last: row + 1}, true
		}
	}

	return contracts.RowRange{}, false
}

// MarkedRow is the lowest row that starts with one of its prefixes and holds its text, at most MaxBelow rows above
// the last drawn row when MaxBelow is set, as Codex draws its composer just above its status lines.
type MarkedRow struct {
	Label    string
	Prefixes []string
	Contains string
	MaxBelow int
}

func (region MarkedRow) Name() string {
	return region.Label
}

func (region MarkedRow) Rows(snapshot contracts.Snapshot) (contracts.RowRange, bool) {
	lastDrawn := lastDrawnRow(snapshot)

	for row := lastDrawn; row >= 0; row-- {
		if region.MaxBelow > 0 && lastDrawn-row > region.MaxBelow {
			break
		}
		if region.matches(snapshot.Rows[row]) {
			return contracts.RowRange{First: row, Last: row + 1}, true
		}
	}

	return contracts.RowRange{}, false
}

func (region MarkedRow) matches(text string) bool {
	if !strings.Contains(text, region.Contains) {
		return false
	}
	if len(region.Prefixes) == 0 {
		return true
	}
	for _, prefix := range region.Prefixes {
		if startsWith(text, prefix) {
			return true
		}
	}

	return false
}

// MarkedSpan runs from the lowest row holding its first text down to the next row holding its last text, both
// included, as a menu runs from its title to its footer.
type MarkedSpan struct {
	Label string
	First string
	Last  string
}

func (region MarkedSpan) Name() string {
	return region.Label
}

func (region MarkedSpan) Rows(snapshot contracts.Snapshot) (contracts.RowRange, bool) {
	for first := len(snapshot.Rows) - 1; first >= 0; first-- {
		if !strings.Contains(snapshot.Rows[first], region.First) {
			continue
		}
		for last := first; last < len(snapshot.Rows); last++ {
			if strings.Contains(snapshot.Rows[last], region.Last) {
				return contracts.RowRange{First: first, Last: last + 1}, true
			}
		}

		return contracts.RowRange{}, false
	}

	return contracts.RowRange{}, false
}

// Text is the composer's typed text, without its marker.
func (region FencedRow) Text(snapshot contracts.Snapshot) string {
	rows, found := region.Rows(snapshot)
	if !found {
		return ""
	}

	return unmarked(snapshot.Rows[rows.First], []string{region.Marker})
}

// Text is the composer's typed text, without the prefix it starts with.
func (region MarkedRow) Text(snapshot contracts.Snapshot) string {
	rows, found := region.Rows(snapshot)
	if !found {
		return ""
	}

	return unmarked(snapshot.Rows[rows.First], region.Prefixes)
}

// unmarked is a row without the first marker it starts with, its no-break spaces plain and its spaces trimmed.
func unmarked(text string, markers []string) string {
	row := strings.TrimSpace(plainSpaces(text))
	for _, marker := range markers {
		bare := strings.TrimSpace(marker)
		if strings.HasPrefix(row, bare) {
			return strings.TrimSpace(strings.TrimPrefix(row, bare))
		}
	}

	return row
}

// startsWith is whether a row starts with the marker; a row is read without its trailing spaces, so a bare marker
// such as an empty prompt's "❯ " is drawn as "❯".
func startsWith(text, marker string) bool {
	row := plainSpaces(text)

	return strings.HasPrefix(row, marker) || strings.TrimRight(row, " ") == strings.TrimRight(marker, " ")
}

// plainSpaces turns the no-break spaces a program draws after its prompt marker into plain spaces, so a marker
// matches however the program spaces it.
func plainSpaces(text string) string {
	return strings.ReplaceAll(text, "\u00a0", " ")
}

// isRule is whether a row is drawn as a horizontal rule across most of its width.
func isRule(text string) bool {
	return len([]rune(text)) >= 10 && strings.Trim(text, "─") == ""
}

// IsBlank is whether nothing is drawn on the screen yet, as while a program is still starting.
func IsBlank(snapshot contracts.Snapshot) bool {
	return lastDrawnRow(snapshot) < 0
}

func lastDrawnRow(snapshot contracts.Snapshot) int {
	for row := len(snapshot.Rows) - 1; row >= 0; row-- {
		if strings.TrimSpace(snapshot.Rows[row]) != "" {
			return row
		}
	}

	return -1
}

// OptionList is the lowest list of menu options on the screen: a row that starts with one of the highlight markers,
// with at least one more option row beside it, each indented by the marker's width. It is found by its shape, not
// by its words, so a reworded menu is still found; a prompt row with no options beside it is not a list.
type OptionList struct {
	Label   string
	Markers []string
}

func (region OptionList) Name() string {
	return region.Label
}

func (region OptionList) Rows(snapshot contracts.Snapshot) (contracts.RowRange, bool) {
	for row := len(snapshot.Rows) - 1; row >= 0; row-- {
		textColumn, highlighted := region.highlight(snapshot.Rows[row])
		if !highlighted {
			continue
		}

		first, last := row, row+1
		for first > 0 && isOptionRow(snapshot.Rows[first-1], textColumn) {
			first--
		}
		for last < len(snapshot.Rows) && isOptionRow(snapshot.Rows[last], textColumn) {
			last++
		}
		if last-first >= 2 {
			return contracts.RowRange{First: first, Last: last}, true
		}
	}

	return contracts.RowRange{}, false
}

// Entries is every option of the list on screen, top to bottom, and which of them is highlighted: each option's
// text from the column after the highlight marker, with no-break spaces made plain; found is false while no option
// list is drawn.
func (region OptionList) Entries(snapshot contracts.Snapshot) (MenuEntries, bool) {
	rows, found := region.Rows(snapshot)
	if !found {
		return MenuEntries{}, false
	}

	entries, textColumn := MenuEntries{}, 0
	for row := rows.First; row < rows.Last; row++ {
		if column, highlighted := region.highlight(snapshot.Rows[row]); highlighted {
			entries.Highlighted, textColumn = row-rows.First, column
		}
	}
	for row := rows.First; row < rows.Last; row++ {
		text := []rune(plainSpaces(snapshot.Rows[row]))
		entries.Labels = append(entries.Labels, strings.TrimSpace(string(text[min(textColumn, len(text)):])))
	}

	return entries, true
}

// highlight finds a highlight marker after the row's indent and gives the column its option text starts at.
func (region OptionList) highlight(text string) (int, bool) {
	row := plainSpaces(text)
	trimmed := strings.TrimLeft(row, " ")
	indent := len(row) - len(trimmed)

	for _, marker := range region.Markers {
		if strings.HasPrefix(trimmed, marker) && strings.TrimSpace(strings.TrimPrefix(trimmed, marker)) != "" {
			return indent + len([]rune(marker)), true
		}
	}

	return 0, false
}

// isOptionRow is whether a row is an option beside the highlighted one: its text starts at the same column.
func isOptionRow(text string, textColumn int) bool {
	row := plainSpaces(text)

	return len(row) > textColumn &&
		strings.TrimLeft(row[:textColumn], " ") == "" &&
		row[textColumn] != ' '
}
