package classify

import (
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

const runnerProgram = "journal-run"

// Line reads a shell line into the prepared object's shell line: each command a part with its program, subcommand,
// arguments, classification and the files it reads and writes, and how it joins the next. A line no shell can read has
// no parts and says why in parse_error. The runner's line, which a hook after the tool sees, is read as the line it runs.
func (classifier *Classifier) Line(line string) event.ShellLine {
	line = lineOfRunner(line)
	prepared := event.ShellLine{Line: line, Parts: []event.Part{}, Redirects: []string{}}
	classifier.savedRuns = nil
	classifier.isSaved("")
	prepared.SavedCommandsKnown = classifier.savedCommandsKnown
	expanded, aliases, expansionError := classifier.expandAliases(line)
	prepared.Line, prepared.Aliases = expanded, aliases
	if expansionError != nil {
		prepared.ParseError = expansionError.Error()
		return prepared
	}
	line = expanded
	commands, redirects, err := shell.Split(line)
	if err != nil {
		prepared.ParseError = err.Error()
		return prepared
	}
	prepared.Redirects = redirects
	prepared.RetryLoop = shell.IsRetryLoop(line)
	for _, command := range commands {
		prepared.Parts = append(prepared.Parts, classifier.part(command, classifier.Classify(command.Text)))
	}
	prepared.IsJournalOnly = isJournalOnly(commands)
	return prepared
}

// lineOfRunner is the line journal-run runs, from its last word after --, or the line itself when it is no runner's.
func lineOfRunner(line string) string {
	tokens := shell.Tokens(line)
	if len(tokens) < 3 || baseName(tokens[0]) != runnerProgram || tokens[len(tokens)-2] != "--" {
		return line
	}
	return tokens[len(tokens)-1]
}

func (classifier *Classifier) part(command shell.Command, classification Classification) event.Part {
	program, subcommand, arguments := classifier.Program(command.Text)
	prepared := event.Part{
		Text:           command.Text,
		Program:        program,
		Subcommand:     subcommand,
		Arguments:      arguments,
		Classification: event.Classification{Category: classification.Category, Effects: classification.Effects, Uncertain: classification.Uncertain},
		ReadPaths:      nonEmpty(classifier.ReadPaths(command.Text)),
		WritePaths:     nonEmpty(classifier.WritePaths(command.Text)),
		JoinedBy:       command.JoinedBy,
		IsFullTestRun:  classifier.IsFullTestRun(command.Text, classification),
		NestedJournalCommands: nestedJournalCommands(command.Text),
	}
	if command.PipedInto >= 0 {
		target := command.PipedInto
		prepared.PipedInto = &target
	}
	for _, run := range classifier.savedRuns {
		if run.line != strings.TrimSpace(command.Text) {
			continue
		}
		prepared.SavedCommand, prepared.ReadFlag = run.name, run.selection
		prepared.TimeoutDuration = run.timeoutDuration
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
