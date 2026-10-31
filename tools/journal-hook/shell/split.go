package shell

import (
	"regexp"
	"strings"

	"mvdan.cc/sh/v3/syntax"
)

// Command is one command of a shell line: its text as the line writes it and where it stands in the text it was cut
// from, the operator that joins it to the next command, and the command its output is piped into.
type Command struct {
	Text string
	// Source is the text Start, End and Through count in: the line, or the line inside an eval the line wraps.
	Source string
	Start  int
	End    int
	// Through is where the command's text ends with its here-documents' bodies, which may follow other commands.
	Through int
	// JoinedBy is &&, ||, ; or & between this command and the next, or empty after the last.
	JoinedBy string
	// PipedInto is the index of the command this one's output is piped into, or -1.
	PipedInto int
	// Recorded is false for the shell's own wrapping around a line Claude Code hands to eval, as version 4 marks it.
	Recorded bool
}

var (
	// Claude Code quotes the command it evals, unless the command is one word its quoting leaves bare: version 4's
	// Chain WRAPPED.
	evalWrapped = regexp.MustCompile(`(?s)^eval (?:'(.*)'|([^\s'"]+))(?: < /dev/null)?\n?\z`)
	// a comment at the end of a command's line, which version 4 keeps in the command's text
	trailingComment = regexp.MustCompile(`^[ \t]+#[^\n]*`)
)

// The quote Claude Code writes for a ' inside the line it evals.
const evalQuote = `'"'"'`

// Split reads a shell line as shfmt's parser reads it, first as bash and then as zsh, and gives its commands and the
// text of every redirect in it. A command is a simple command, a subshell, a group in braces or a compound command
// (if, for, while, until, case, select, a function, zsh's foreach), each kept whole as version 4's Chain keeps them:
// a part of version 4 is a run of commands joined by || or a pipe. A line Claude Code hands to eval is read as the
// line inside it, as version 4 reads it. A line neither shell can read gives the parser's error.
func Split(line string) ([]Command, []string, error) {
	commands, redirects, err := read(line)
	if err != nil {
		return nil, nil, err
	}
	for _, command := range commands {
		if evalWrapped.MatchString(command.Text) {
			return unwrapped(commands), redirects, nil
		}
	}
	return commands, redirects, nil
}

func read(line string) ([]Command, []string, error) {
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
	return foreachJoined(reader.commands), reader.redirects, nil
}

// unwrapped reads each command that evals a line as the commands of that line, as Chain.build does: they are the
// agent's own, the commands around them the shell's wrapping.
func unwrapped(commands []Command) []Command {
	var found []Command
	// where each command of the line begins among the commands found, so a pipe into it still points at it
	begins := make([]int, len(commands)+1)
	outer := map[int]bool{}
	for index, command := range commands {
		begins[index] = len(found)
		wrapped := evalWrapped.FindStringSubmatch(command.Text)
		if wrapped == nil {
			command.Recorded = false
			outer[len(found)] = true
			found = append(found, command)
			continue
		}
		inside := wrapped[1]
		if inside == "" {
			inside = wrapped[2]
		}
		inner, _, err := read(strings.ReplaceAll(inside, evalQuote, "'"))
		if err != nil || len(inner) == 0 {
			outer[len(found)] = true
			found = append(found, command)
			continue
		}
		for position := range inner {
			if inner[position].PipedInto >= 0 {
				inner[position].PipedInto += len(found)
			}
		}
		inner[len(inner)-1].JoinedBy = command.JoinedBy
		found = append(found, inner...)
	}
	begins[len(commands)] = len(found)
	for index := range found {
		if outer[index] && found[index].PipedInto >= 0 {
			found[index].PipedInto = begins[found[index].PipedInto]
		}
	}
	return found
}

// foreachJoined keeps a zsh foreach loop whole: the commands from its foreach to its end, which the parser reads as
// commands of their own, become one.
func foreachJoined(commands []Command) []Command {
	var found []Command
	for index := 0; index < len(commands); index++ {
		command := commands[index]
		if !strings.HasPrefix(command.Text, "foreach ") {
			found = append(found, command)
			continue
		}
		last := index
		for last < len(commands) && commands[last].Text != "end" {
			last++
		}
		if last == len(commands) {
			found = append(found, command)
			continue
		}
		closing := commands[last]
		command.Text = strings.TrimSpace(command.Source[command.Start:closing.End])
		command.End, command.Through, command.JoinedBy, command.PipedInto = closing.End, max(closing.Through, closing.End), closing.JoinedBy, closing.PipedInto
		found = append(found, command)
		index = last
	}
	return found
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

// whole adds a statement as one command, its text running from its start to its end without a closing ;, with a
// comment that ends its line and the bodies of its here-documents: a body right after the command runs on in the line,
// and a body that follows other commands of the line, as one piped on (cat <<EOF | grep x), is added to the text
// after a newline.
func (reader *splitter) whole(statement *syntax.Stmt, after string) {
	start, end := int(statement.Pos().Offset()), ownEnd(statement)
	if comment := trailingComment.FindString(reader.line[end:]); comment != "" && !statement.Background {
		end += len(comment)
	}
	through := end
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
		through = max(through, bodyEnd)
		return true
	})
	reader.commands = append(reader.commands, Command{
		Text:      strings.Join(append([]string{strings.TrimSpace(reader.line[start:end])}, bodies...), "\n"),
		Source:    reader.line,
		Start:     start,
		End:       end,
		Through:   max(through, end),
		JoinedBy:  after,
		PipedInto: -1,
		Recorded:  true,
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
