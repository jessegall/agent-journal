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
		target := command.PipedInto
		prepared.PipedInto = &target
	}
	return prepared
}

// isJournalOnly is Chain.is_journal_line: every part of the line is a journal command.
func isJournalOnly(commands []shell.Command) bool {
	runs := shell.Runs(commands)
	for _, run := range runs {
		if isJournal(run[0].Text) {
			continue
		}
		return false
	}
	return len(runs) > 0
}

// nonEmpty leaves an empty list out of the object, where the schema makes it optional.
func nonEmpty(items []string) []string {
	if len(items) == 0 {
		return nil
	}
	return items
}
