package main

import (
	"regexp"
	"slices"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// filterPrograms only cut or change the output piped into them, so running them over a stored output changes nothing
// else. Version 4 kept this list to refuse a piped test run.
var filterPrograms = []string{"awk", "cat", "column", "cut", "egrep", "fgrep", "fold", "grep", "head", "jq", "nl", "rg", "sed", "sort", "tac", "tail", "tr", "uniq", "wc"}

// notFilters are the forms of those programs that write a file, run a command or never end on a stored file.
var notFilters = map[string]*regexp.Regexp{
	"awk":  regexp.MustCompile(`system|\|`),
	"sed":  regexp.MustCompile(`\s-[a-zA-Z]*i|--in-place|/[gpiIm0-9]*w\s`),
	"sort": regexp.MustCompile(`\s-[a-zA-Z]*o|--output`),
	"tail": regexp.MustCompile(`\s-[a-zA-Z0-9]*[fF]|--follow`),
}

// endlessCommand is a command that runs until something stops it: only a pipe that closes, such as head, ends it.
var endlessCommand = regexp.MustCompile(`\s(--watch\b|-w\b)`)

// Part is one step of a line as the runner runs it: the commands joined by a pipe or || stay together, and the
// operator after it says whether the next part waits for its success. A part stripped of its pipes runs Command alone
// and keeps its whole output; Filters are the pipes the agent wrote, which run over that output.
type Part struct {
	Text     string
	JoinedBy string
	Command  string
	Filters  string
	// Position is the number the journal knows the part by: the place of its first command among the line's commands.
	Position int
}

// Parts cuts a line into the parts the runner runs one by one; a line the parser cannot read is one part. Stripped
// names the commands whose filters come off, the test runs and builds of the line.
func Parts(line string, stripped ...string) []Part {
	commands, _, err := shell.Split(line)
	if err != nil || len(commands) == 0 {
		return []Part{{Text: line, Position: 1}}
	}
	var parts []Part
	var first *shell.Command
	firstIndex, position, recorded := 0, 0, 0
	for index := range commands {
		command := &commands[index]
		if command.Recorded {
			recorded++
		}
		if first == nil {
			first, firstIndex, position = command, index, max(recorded, 1)
		}
		if command.PipedInto >= 0 || command.JoinedBy == "||" {
			continue
		}
		text := first.Source[first.Start:command.End]
		part := Part{Text: strings.TrimSpace(text), JoinedBy: command.JoinedBy, Position: position}
		if command.JoinedBy == "&" {
			part.Text += " &"
		} else if name := strings.TrimSpace(first.Text); slices.Contains(stripped, name) && !strings.Contains(line, "pipefail") {
			part.Command, part.Filters = filtered(commands[firstIndex : index+1])
		}
		parts = append(parts, part)
		first = nil
	}
	if first != nil {
		parts = append(parts, Part{Text: strings.TrimSpace(first.Source[first.Start:commands[len(commands)-1].End]), Position: position})
	}
	return parts
}

// filtered cuts a pipeline into its first command and the pipes after it; both are empty when any pipe does more than
// cut or change the output, or when the first command has a here-document.
func filtered(pipeline []shell.Command) (string, string) {
	first, last := pipeline[0], pipeline[len(pipeline)-1]
	if len(pipeline) < 2 || first.BodyEnd > first.End || endlessCommand.MatchString(first.Text) {
		return "", ""
	}
	for _, command := range pipeline[:len(pipeline)-1] {
		if command.PipedInto < 0 {
			return "", ""
		}
	}
	for _, command := range pipeline[1:] {
		if !isFilter(command.Text) {
			return "", ""
		}
	}
	return strings.TrimSpace(first.Source[first.Start:first.End]), strings.TrimSpace(first.Source[pipeline[1].Start:last.End])
}

func isFilter(text string) bool {
	words := strings.Fields(text)
	if len(words) == 0 || !slices.Contains(filterPrograms, words[0]) || strings.Contains(text, ">") {
		return false
	}
	form, hasForms := notFilters[words[0]]
	return !hasForms || !form.MatchString(text)
}

// LastJournal is the position of the last part of a line that is a journal command, 0 when none is; an alias runs a
// shell line of its own, so it counts as none.
func LastJournal(parts []Part, aliases []string) int {
	last := 0
	for _, part := range parts {
		words := strings.Fields(part.Text)
		if len(words) > 0 && words[0] == "journal" && !(len(words) > 1 && slices.Contains(aliases, words[1])) {
			last = part.Position
		}
	}
	return last
}

// PartCount is the highest position of a line's parts: the positions between its parts are commands of a pipe.
func PartCount(parts []Part) int {
	return parts[len(parts)-1].Position
}
