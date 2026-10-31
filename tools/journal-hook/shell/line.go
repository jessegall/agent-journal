package shell

import (
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// Line reads a shell line into the prepared object's shell line: each command a part with its program and arguments
// and how it joins the next; a line no shell can read has no parts and says why in parse_error.
func Line(line string) event.ShellLine {
	prepared := event.ShellLine{Line: line, Parts: []event.Part{}, Redirects: []string{}, Kind: "unknown"}
	commands, redirects, err := Split(line)
	if err != nil {
		prepared.ParseError = err.Error()
		return prepared
	}
	prepared.Redirects = redirects
	for _, command := range commands {
		prepared.Parts = append(prepared.Parts, part(command))
	}
	return prepared
}

func part(command Command) event.Part {
	tokens := Tokens(command.Text)
	prepared := event.Part{
		Text:           command.Text,
		Arguments:      []string{},
		Classification: event.Classification{Kind: "unknown", Effects: []string{}},
	}
	if len(tokens) > 0 {
		prepared.Program = tokens[0][strings.LastIndex(tokens[0], "/")+1:]
		prepared.Arguments = tokens[1:]
	}
	if command.JoinedBy != "" {
		prepared.JoinedBy = command.JoinedBy
	}
	if command.PipedInto >= 0 {
		into := command.PipedInto
		prepared.PipedInto = &into
	}
	return prepared
}
