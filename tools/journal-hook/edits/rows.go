package edits

import (
	"regexp"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// How many rows and how many characters of each the hook hands on for one edit, so a huge file cannot fill the
// event; the rest is counted in one row left out.
const (
	rowLimit       = 600
	rowTextLimit   = 400
	foldedLineType = "fold"
)

var patchFileLine = regexp.MustCompile(`^\*\*\* (Add|Update|Delete) File: `)

// Section is one hunk of a patch: where it starts in the old and the new file, and its lines, each with its sign.
type Section struct {
	OldStart int
	NewStart int
	Lines    []string
}

// SectionRows numbers the lines of a patch's hunks in the file they belong to.
func SectionRows(sections []Section) []event.DiffRow {
	rows := []event.DiffRow{}
	for _, section := range sections {
		old, changed := section.OldStart, section.NewStart
		for _, line := range section.Lines {
			switch {
			case strings.HasPrefix(line, "+"):
				rows = append(rows, event.DiffRow{LineType: "add", Line: changed, Text: line[1:]})
				changed++
			case strings.HasPrefix(line, "-"):
				rows = append(rows, event.DiffRow{LineType: "del", Line: old, Text: line[1:]})
				old++
			default:
				rows = append(rows, event.DiffRow{LineType: "ctx", Line: changed, Text: strings.TrimPrefix(line, " ")})
				old++
				changed++
			}
		}
	}
	return limited(rows)
}

// NewFileRows are the lines of a file a tool made, every one added.
func NewFileRows(content string) []event.DiffRow {
	rows := []event.DiffRow{}
	for number, line := range strings.Split(strings.TrimSuffix(content, "\n"), "\n") {
		rows = append(rows, event.DiffRow{LineType: "add", Line: number + 1, Text: line})
	}
	return limited(rows)
}

// PatchRows are the lines of the first file in a Codex apply_patch, unnumbered, since its hunks name no line numbers.
func PatchRows(patch string) []event.DiffRow {
	rows := []event.DiffRow{}
	inFile := false
	for _, line := range strings.Split(patch, "\n") {
		if patchFileLine.MatchString(line) {
			if inFile {
				break
			}
			inFile = true
			continue
		}
		switch {
		case !inFile || strings.HasPrefix(line, "***") || strings.HasPrefix(line, "@@"):
		case strings.HasPrefix(line, "+"):
			rows = append(rows, event.DiffRow{LineType: "add", Text: line[1:]})
		case strings.HasPrefix(line, "-"):
			rows = append(rows, event.DiffRow{LineType: "del", Text: line[1:]})
		case strings.HasPrefix(line, " "):
			rows = append(rows, event.DiffRow{LineType: "ctx", Text: line[1:]})
		}
	}
	return limited(rows)
}

func limited(rows []event.DiffRow) []event.DiffRow {
	for index := range rows {
		if len(rows[index].Text) > rowTextLimit {
			rows[index].Text = strings.ToValidUTF8(rows[index].Text[:rowTextLimit], "")
		}
	}
	if len(rows) <= rowLimit {
		return rows
	}
	return append(rows[:rowLimit:rowLimit], event.DiffRow{LineType: foldedLineType, Hidden: len(rows) - rowLimit})
}
