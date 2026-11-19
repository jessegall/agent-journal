package screen

import (
	"strings"
	"unicode/utf8"

	"journal-agent/screen/contracts"
)

// Slider is a horizontal scale of choices, as Claude Code draws its effort picker: a bar of ─ with one marker on it,
// and right below it a row of labels; the chosen label is the one under the marker. Labels past the end of the bar,
// such as a key hint, are not choices.
type Slider struct {
	Label  string
	Marker string
}

func (region Slider) Name() string {
	return region.Label
}

func (region Slider) Rows(snapshot contracts.Snapshot) (contracts.RowRange, bool) {
	for row := len(snapshot.Rows) - 2; row >= 0; row-- {
		if _, _, onBar := region.bar(snapshot.Rows[row]); onBar && len(sliderLabels(snapshot.Rows[row+1], 0, 0)) >= 2 {
			return contracts.RowRange{First: row, Last: row + 2}, true
		}
	}

	return contracts.RowRange{}, false
}

// Entries reads the slider's labels, left to right, and which one sits under its marker; found is false while no
// slider is drawn.
func (region Slider) Entries(snapshot contracts.Snapshot) (MenuEntries, bool) {
	rows, found := region.Rows(snapshot)
	if !found {
		return MenuEntries{}, false
	}
	start, end, _ := region.bar(snapshot.Rows[rows.First])
	barRow := snapshot.Rows[rows.First]
	markerColumn := utf8.RuneCountInString(barRow[:strings.Index(barRow, region.Marker)])
	labels := sliderLabels(snapshot.Rows[rows.First+1], start, end)

	entries := MenuEntries{Across: true, Highlighted: -1}
	nearest := -1
	for index, label := range labels {
		entries.Labels = append(entries.Labels, label.text)
		distance := label.distanceTo(markerColumn)
		if nearest < 0 || distance < nearest {
			nearest, entries.Highlighted = distance, index
		}
	}

	return entries, entries.Highlighted >= 0
}

// bar finds the marker on a row of ─ and gives the columns the bar spans.
func (region Slider) bar(text string) (int, int, bool) {
	runes := []rune(plainSpaces(text))
	marker := []rune(region.Marker)
	if len(marker) != 1 || strings.Count(string(runes), region.Marker) != 1 {
		return 0, 0, false
	}

	start, end := -1, -1
	for column, character := range runes {
		if character != '─' && character != marker[0] {
			continue
		}
		if start < 0 {
			start = column
		}
		end = column
	}

	return start, end, start >= 0 && end-start >= 10
}

// sliderLabel is one label of a slider and the columns it covers.
type sliderLabel struct {
	text       string
	start, end int
}

// distanceTo is how far the column is from the label: zero inside it.
func (label sliderLabel) distanceTo(column int) int {
	if column < label.start {
		return label.start - column
	}
	if column > label.end {
		return column - label.end
	}

	return 0
}

// sliderLabels splits a row into its words that start within the bar's columns; with no bar given, every word.
func sliderLabels(text string, barStart, barEnd int) []sliderLabel {
	runes := []rune(plainSpaces(text))
	labels := []sliderLabel{}

	for column := 0; column < len(runes); column++ {
		if runes[column] == ' ' {
			continue
		}
		start := column
		for column < len(runes) && runes[column] != ' ' {
			column++
		}
		if barEnd > 0 && (start < barStart || start > barEnd) {
			continue
		}
		labels = append(labels, sliderLabel{text: string(runes[start:column]), start: start, end: column - 1})
	}

	return labels
}
