package shell

import (
	"strings"

	"mvdan.cc/sh/v3/syntax"
)

// Command is one command of a shell line: its text as the line writes it and where it stands in the line, the
// operator that joins it to the next command, and the command its output is piped into.
type Command struct {
	Text  string
	Start int
	End   int
	// JoinedBy is &&, ||, ; or & between this command and the next, or empty after the last.
	JoinedBy string
	// PipedInto is the index of the command this one's output is piped into, or -1.
	PipedInto int
}

// Split reads a shell line as shfmt's parser reads it, first as bash and then as zsh, and gives its commands and the
// text of every redirect in it. A command is a simple command, a subshell, a group in braces or a compound command
// (if, for, while, until, case, select, a function), each kept whole as version 4's Chain keeps them: a part of
// version 4 is a run of commands joined by || or a pipe. A line neither shell can read gives the parser's error.
func Split(line string) ([]Command, []string, error) {
	file, err := parsed(line, syntax.LangBash)
	if err != nil {
		if zsh, zshErr := parsed(line, syntax.LangZsh); zshErr == nil {
			file, err = zsh, nil
		}
	}
	if err != nil {
		return nil, nil, err
	}
	reader := splitter{line: line}
	for index, statement := range file.Stmts {
		after := ""
		if statement.Background {
			after = "&"
		} else if index < len(file.Stmts)-1 {
			after = ";"
		}
		reader.statement(statement, after)
	}
	syntax.Walk(file, func(node syntax.Node) bool {
		if redirect, ok := node.(*syntax.Redirect); ok {
			reader.redirects = append(reader.redirects, line[redirect.Pos().Offset():redirect.Word.End().Offset()])
		}
		return true
	})
	if reader.redirects == nil {
		reader.redirects = []string{}
	}
	return reader.commands, reader.redirects, nil
}

func parsed(line string, language syntax.LangVariant) (*syntax.File, error) {
	return syntax.NewParser(syntax.KeepComments(false), syntax.Variant(language)).Parse(strings.NewReader(line), "")
}

type splitter struct {
	line      string
	commands  []Command
	redirects []string
}

// statement adds the commands of one statement; after is the operator that joins its last command to what follows.
func (reader *splitter) statement(statement *syntax.Stmt, after string) {
	binary, ok := statement.Cmd.(*syntax.BinaryCmd)
	if !ok || statement.Negated || len(statement.Redirs) > 0 {
		reader.whole(statement, after)
		return
	}
	switch binary.Op {
	case syntax.AndStmt, syntax.OrStmt:
		reader.statement(binary.X, binary.Op.String())
		reader.statement(binary.Y, after)
	case syntax.Pipe, syntax.PipeAll:
		reader.statement(binary.X, "")
		reader.commands[len(reader.commands)-1].PipedInto = len(reader.commands)
		reader.statement(binary.Y, after)
	}
}

// whole adds a statement as one command, its text running from its start to its end without a closing ;, with the
// bodies of its here-documents: a body right after the command runs on in the line, and a body that follows other
// commands of the line, as one piped on (cat <<EOF | grep x), is added to the text after a newline.
func (reader *splitter) whole(statement *syntax.Stmt, after string) {
	start, end := int(statement.Pos().Offset()), ownEnd(statement)
	var bodies []string
	syntax.Walk(statement, func(node syntax.Node) bool {
		redirect, ok := node.(*syntax.Redirect)
		if !ok || redirect.Hdoc == nil {
			return true
		}
		bodyStart, bodyEnd := int(redirect.Hdoc.Pos().Offset()), int(redirect.Hdoc.End().Offset())
		if bodyEnd <= end {
			return true
		}
		if strings.TrimSpace(reader.line[end:bodyStart]) == "" {
			end = bodyEnd
		} else {
			bodies = append(bodies, reader.line[bodyStart:bodyEnd])
		}
		return true
	})
	reader.commands = append(reader.commands, Command{
		Text:      strings.Join(append([]string{strings.TrimSpace(reader.line[start:end])}, bodies...), "\n"),
		Start:     start,
		End:       end,
		JoinedBy:  after,
		PipedInto: -1,
	})
}

// ownEnd is where a statement's own text ends: after a background &, else after its command and its redirects' words,
// a closing ; and its here-documents' bodies left out.
func ownEnd(statement *syntax.Stmt) int {
	if statement.Background {
		return int(statement.End().Offset())
	}
	end := int(statement.Position.Offset())
	if statement.Negated {
		end++
	}
	if statement.Cmd != nil {
		end = max(end, int(statement.Cmd.End().Offset()))
	}
	for _, redirect := range statement.Redirs {
		if redirect.Hdoc != nil {
			end = max(end, int(redirect.Word.End().Offset()))
		} else {
			end = max(end, int(redirect.End().Offset()))
		}
	}
	return end
}
