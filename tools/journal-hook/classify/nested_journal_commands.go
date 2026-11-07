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
		words, err := shell.Shlex(line[call.Pos().Offset():call.End().Offset()])
		if err != nil || len(words) < 2 {
			return true
		}
		if (includeOuter || call != outer) && words[0] == "journal" {
			commands = append(commands, words[1:])
		}
		if words[0] == "eval" {
			commands = append(commands, journalCommands(words[1], true)...)
		}
		if len(words) > 2 && (words[0] == "sh" || words[0] == "bash" || words[0] == "zsh") && words[1] == "-c" {
			commands = append(commands, journalCommands(words[2], true)...)
		}
		return true
	})
	return commands
}
