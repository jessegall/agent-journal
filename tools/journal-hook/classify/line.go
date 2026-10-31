package classify

import (
	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// Line reads a shell line into the prepared object's shell line: each command a part with its program, subcommand,
// arguments, classification and the files it reads and writes, and how it joins the next; the line is named by its
// weightiest part, as version 4 names it. A line no shell can read has no parts, says why in parse_error and is
// unknown.
func (classifier *Classifier) Line(line string) event.ShellLine {
	prepared := event.ShellLine{Line: line, Parts: []event.Part{}, Redirects: []string{}, Category: unknown}
	commands, redirects, err := shell.Split(line)
	if err != nil {
		prepared.ParseError = err.Error()
		return prepared
	}
	prepared.Redirects = redirects
	var classifications []Classification
	for _, command := range commands {
		classification := classifier.Classify(command.Text)
		classifications = append(classifications, classification)
		prepared.Parts = append(prepared.Parts, classifier.part(command, classification))
	}
	prepared.Category = Union(classifications).Category
	prepared.IsJournalOnly = isJournalOnly(commands)
	return prepared
}

func (classifier *Classifier) part(command shell.Command, classification Classification) event.Part {
	program, subcommand, arguments := classifier.Program(command.Text)
	prepared := event.Part{
		Text:           command.Text,
		Program:        program,
		Subcommand:     subcommand,
		Arguments:      arguments,
		Classification: event.Classification{Category: classification.Category, Effects: classification.Effects},
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

// Runs are the parts of version 4's Chain: the commands joined by || or a pipe stay one part.
func Runs(commands []shell.Command) [][]shell.Command {
	var runs [][]shell.Command
	for index, command := range commands {
		if index == 0 || !joinsOn(commands[index-1]) {
			runs = append(runs, nil)
		}
		runs[len(runs)-1] = append(runs[len(runs)-1], command)
	}
	return runs
}

func joinsOn(command shell.Command) bool {
	return command.JoinedBy == "||" || command.PipedInto >= 0
}

// isJournalOnly is Chain.is_journal_line: every part of the line is a journal command.
func isJournalOnly(commands []shell.Command) bool {
	runs := Runs(commands)
	for _, run := range runs {
		if !isJournal(run[0].Text) {
			return false
		}
	}
	return len(runs) > 0
}

// nonEmpty leaves an empty list out of the object, where the schema makes it optional.
func nonEmpty(words []string) []string {
	if len(words) == 0 {
		return nil
	}
	return words
}
