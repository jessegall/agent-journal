package main

import (
	"regexp"
	"slices"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// readsPipeStatus is a line that reads the codes of a pipe, which only the shell that ran the pipe knows.
var readsPipeStatus = regexp.MustCompile(`(?i)pipestatus`)

// Part is one step of a line as the runner runs it: the commands joined by a pipe or || stay together, and the
// operator after it says whether the next part waits for its success.
type Part struct {
	Text     string
	JoinedBy string
	// Position is the number the journal knows the part by: the place of its first command among the line's commands.
	Position int
}

// Parts cuts a line into the parts the runner runs one by one. A line the parser cannot read is one part, and so is a
// line the shell must see whole: one that pipes an eval's text into its own, or reads a pipe's codes. Commands on the
// line of a here-document stay in one part with its body, and an & or a || takes the && chain before it along, as a
// shell reads a && b || c: c also runs when a fails.
func Parts(line string) []Part {
	commands, _, err := shell.Split(line)
	if err != nil || len(commands) == 0 || joinsSources(commands) || readsPipeStatus.MatchString(line) {
		return []Part{{Text: line, Position: 1}}
	}
	var parts []Part
	var starts []int
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
				first = starts[len(starts)-1]
				parts, starts = parts[:len(parts)-1], starts[:len(starts)-1]
			}
		}
		parts, starts = append(parts, partOf(commands, first, index, bodyEnd)), append(starts, first)
		first = -1
	}
	if first >= 0 {
		for hasFallback && len(parts) > 0 && parts[len(parts)-1].JoinedBy == "&&" {
			first = starts[len(starts)-1]
			parts, starts = parts[:len(parts)-1], starts[:len(starts)-1]
		}
		parts = append(parts, partOf(commands, first, len(commands)-1, bodyEnd))
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
func partOf(commands []shell.Command, first, last, bodyEnd int) Part {
	start, end := &commands[first], &commands[last]
	part := Part{Text: strings.TrimSpace(start.Source[start.Start:max(end.End, bodyEnd)]), JoinedBy: end.JoinedBy, Position: first + 1}
	if end.JoinedBy == "&" && !strings.HasSuffix(part.Text, "&") {
		part.Text += " &"
	}
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

// LastJournal is the position of the last part of a line that is a journal command, 0 when none is; an alias runs a
// shell line of its own, so it counts as none.
func LastJournal(parts []Part, aliases []string) int {
	last := 0
	for _, part := range parts {
		arguments := strings.Fields(part.Text)
		if len(arguments) > 0 && arguments[0] == "journal" && !(len(arguments) > 1 && slices.Contains(aliases, arguments[1])) {
			last = part.Position
		}
	}
	return last
}

// PartCount is the highest position of a line's parts: the positions between its parts are commands of a pipe.
func PartCount(parts []Part) int {
	return parts[len(parts)-1].Position
}
