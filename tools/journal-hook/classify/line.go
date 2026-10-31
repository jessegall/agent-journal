package classify

import (
	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// Line reads a shell line into the prepared object's shell line: each command a part with its program, subcommand,
// arguments and the files it reads and writes, and how it joins the next; a line no shell can read has no parts and
// says why in parse_error.
func (classifier *Classifier) Line(line string) event.ShellLine {
	prepared := event.ShellLine{Line: line, Parts: []event.Part{}, Redirects: []string{}, Kind: unknown}
	commands, redirects, err := shell.Split(line)
	if err != nil {
		prepared.ParseError = err.Error()
		return prepared
	}
	prepared.Redirects = redirects
	for _, command := range commands {
		prepared.Parts = append(prepared.Parts, classifier.part(command))
	}
	return prepared
}

func (classifier *Classifier) part(command shell.Command) event.Part {
	program, subcommand, arguments := classifier.Program(command.Text)
	prepared := event.Part{
		Text:           command.Text,
		Program:        program,
		Subcommand:     subcommand,
		Arguments:      arguments,
		Classification: event.Classification{Kind: unknown, Effects: []string{}},
		ReadPaths:      nonEmpty(classifier.ReadPaths(command.Text)),
		WritePaths:     nonEmpty(classifier.WritePaths(command.Text)),
		JoinedBy:       command.JoinedBy,
	}
	if command.PipedInto >= 0 {
		into := command.PipedInto
		prepared.PipedInto = &into
	}
	return prepared
}

// nonEmpty leaves an empty list out of the object, where the schema makes it optional.
func nonEmpty(words []string) []string {
	if len(words) == 0 {
		return nil
	}
	return words
}
