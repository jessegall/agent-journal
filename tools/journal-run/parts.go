package main

import (
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// Part is one step of a line as the runner runs it: the commands joined by a pipe or || stay together, and the
// operator after it says whether the next part waits for its success.
type Part struct {
	Text     string
	JoinedBy string
}

// Parts cuts a line into the parts the runner runs one by one; a line the parser cannot read is one part.
func Parts(line string) []Part {
	commands, _, err := shell.Split(line)
	if err != nil || len(commands) == 0 {
		return []Part{{Text: line}}
	}
	var parts []Part
	var first *shell.Command
	for index := range commands {
		command := &commands[index]
		if first == nil {
			first = command
		}
		if command.PipedInto >= 0 || command.JoinedBy == "||" {
			continue
		}
		text := first.Source[first.Start:command.End]
		if command.JoinedBy == "&" {
			text += " &"
		}
		parts = append(parts, Part{Text: strings.TrimSpace(text), JoinedBy: command.JoinedBy})
		first = nil
	}
	if first != nil {
		parts = append(parts, Part{Text: strings.TrimSpace(first.Source[first.Start:commands[len(commands)-1].End])})
	}
	return parts
}
