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
	"sed":  regexp.MustCompile(`\s-[a-zA-Z]*i|--in-place|(^|[^a-zA-Z_])w\s+\S`),
	"sort": regexp.MustCompile(`\s-[a-zA-Z]*o|--output`),
	"tail": regexp.MustCompile(`\s[-+][a-zA-Z0-9]*[fF]|--follow`),
}

// endlessCommand is a command that runs until something stops it: only a pipe that closes, such as head, ends it.
var endlessCommand = regexp.MustCompile(`(?i)\swatch\b|[-:]watch|--continuous|--looponfail|\s-[a-zA-Z]*w[a-zA-Z]*(\s|$)|^gradlew?\b.*\s-t(\s|$)|pytest\b.*\s-f(\s|$)`)

// readsPipeStatus is a line that reads the codes of a pipe, which only the shell that ran the pipe knows.
var readsPipeStatus = regexp.MustCompile(`(?i)pipestatus`)

// Part is one step of a line as the runner runs it: the commands joined by a pipe or || stay together, and the
// operator after it says whether the next part waits for its success. A part stripped of its pipes runs Command alone
// and keeps its whole output; Filters are the pipes the agent wrote, which run over that output.
type Part struct {
	Text     string
	JoinedBy string
	Command  string
	Filters  string
	// DropStdout and DropStderr are the streams the agent threw away: they are stored and never shown.
	DropStdout bool
	DropStderr bool
	// Position is the number the journal knows the part by: the place of its first command among the line's commands.
	Position int
}

// Parts cuts a line into the parts the runner runs one by one. A line the parser cannot read is one part, and so is a
// line the shell must see whole: one that pipes an eval's text into its own, or reads a pipe's codes. Commands on the
// line of a here-document stay in one part with its body, and an & or a || takes the && chain before it along, as a
// shell reads a && b || c: c also runs when a fails.
// Stripped names the commands whose filters come off, the test runs and builds of the line.
func Parts(line string, stripped ...string) []Part {
	commands, _, err := shell.Split(line)
	if err != nil || len(commands) == 0 || joinsSources(commands) || readsPipeStatus.MatchString(line) {
		return []Part{{Text: line, Position: 1}}
	}
	var parts []Part
	var firsts []int
	first, bodyEnd, hasFallback := -1, 0, false
	for index := range commands {
		command := &commands[index]
		if first < 0 {
			first, bodyEnd, hasFallback = index, 0, false
		}
		if command.BodyEnd > command.End {
			bodyEnd = max(bodyEnd, command.BodyEnd)
		}
		hasFallback = hasFallback || command.JoinedBy == "||"
		onBodyLine := index+1 < len(commands) && commands[index+1].Source == command.Source && commands[index+1].Start < bodyEnd
		if command.PipedInto >= 0 || command.JoinedBy == "||" || onBodyLine {
			continue
		}
		if command.JoinedBy == "&" || hasFallback {
			for len(parts) > 0 && parts[len(parts)-1].JoinedBy == "&&" {
				first = firsts[len(firsts)-1]
				parts, firsts = parts[:len(parts)-1], firsts[:len(firsts)-1]
			}
		}
		parts, firsts = append(parts, partOf(commands, first, index, bodyEnd, line, stripped)), append(firsts, first)
		first = -1
	}
	if first >= 0 {
		for hasFallback && len(parts) > 0 && parts[len(parts)-1].JoinedBy == "&&" {
			first = firsts[len(firsts)-1]
			parts, firsts = parts[:len(parts)-1], firsts[:len(firsts)-1]
		}
		parts = append(parts, partOf(commands, first, len(commands)-1, bodyEnd, line, stripped))
	}
	if slices.ContainsFunc(parts, unreadable) {
		return []Part{{Text: line, Position: 1}}
	}
	return parts
}

// unreadable says a part does not read on its own, as a here-document whose body runs past a command opened after it,
// so the line stays whole.
func unreadable(part Part) bool {
	_, err := shell.Parse(part.Text)
	return err != nil
}

// partOf is the part made of the commands from first to last.
func partOf(commands []shell.Command, first, last, bodyEnd int, line string, stripped []string) Part {
	start, end := &commands[first], &commands[last]
	part := Part{Text: strings.TrimSpace(start.Source[start.Start:max(end.End, bodyEnd)]), JoinedBy: end.JoinedBy, Position: first + 1}
	if end.JoinedBy == "&" {
		if !strings.HasSuffix(part.Text, "&") {
			part.Text += " &"
		}
	} else if name := strings.TrimSpace(start.Text); slices.Contains(stripped, name) && !setsPipefail(line) {
		part.Command, part.Filters = filtered(commands[first : last+1])
		if first == last && start.BodyEnd <= start.End {
			part.Command = part.Text
		}
		part = withoutDiscards(part, first == last)
	}
	return part
}

// withoutDiscards takes the redirects to /dev/null off a stripped command, so its whole output is stored. A single
// command with none is not stripped at all.
func withoutDiscards(part Part, isSingle bool) Part {
	discards := shell.ReadDiscards(part.Command)
	if !discards.HasDiscard {
		if isSingle {
			part.Command = ""
		}
		return part
	}
	part.Command, part.DropStdout, part.DropStderr = discards.Bare, discards.Stdout, discards.Stderr
	return part
}

// joinsSources says a pipe or || joins an eval's text to the line around it, so no one text holds that part.
func joinsSources(commands []shell.Command) bool {
	for index, command := range commands[:len(commands)-1] {
		if (command.PipedInto >= 0 || command.JoinedBy == "||") && command.Source != commands[index+1].Source {
			return true
		}
	}
	return false
}

// setsPipefail says the line makes a pipe fail with any of its commands, in bash's spelling or zsh's, which a pipe run
// over a stored output could not honour.
func setsPipefail(line string) bool {
	return strings.Contains(strings.ReplaceAll(strings.ToLower(line), "_", ""), "pipefail")
}

// filtered cuts a pipeline into its first command and the pipes after it; both are empty when any pipe does more than
// cut or change the output, or when the first command has a here-document.
func filtered(pipeline []shell.Command) (string, string) {
	first, last := pipeline[0], pipeline[len(pipeline)-1]
	if len(pipeline) < 2 || endlessCommand.MatchString(first.Text) {
		return "", ""
	}
	for _, command := range pipeline {
		if command.BodyEnd > command.End || (command.PipedInto < 0 && command.End != last.End) {
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
	fields := strings.Fields(text)
	if len(fields) == 0 || !slices.Contains(filterPrograms, fields[0]) || strings.Contains(shell.ReadDiscards(text).Bare, ">") {
		return false
	}
	form, hasForms := notFilters[fields[0]]
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
