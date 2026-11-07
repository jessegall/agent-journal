package classify

import (
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
	"mvdan.cc/sh/v3/syntax"
)

func nestedJournalCommands(line string) [][]string {
	return journalCommands(line, false)
}

func journalCommands(line string, includeOuter bool) [][]string {
	file, err := shell.Parse(line)
	if err != nil {
		return nil
	}
	var commands [][]string
	var outer syntax.Command
	if len(file.Stmts) == 1 {
		outer = file.Stmts[0].Cmd
	}
	syntax.Walk(file, func(node syntax.Node) bool {
		call, ok := node.(*syntax.CallExpr)
		if !ok || len(call.Args) == 0 {
			return true
		}
		tokens, err := shell.Shlex(line[call.Pos().Offset():call.End().Offset()])
		if err != nil || len(tokens) < 2 {
			return true
		}
		if (includeOuter || call != outer) && tokens[0] == "journal" {
			commands = append(commands, tokens[1:])
		}
		if tokens[0] == "eval" {
			commands = append(commands, journalCommands(tokens[1], true)...)
		}
		if len(tokens) > 2 && (tokens[0] == "sh" || tokens[0] == "bash" || tokens[0] == "zsh") && tokens[1] == "-c" {
			commands = append(commands, journalCommands(tokens[2], true)...)
		}
		return true
	})
	return commands
}
