// Command shell-oracle reads shell lines with mvdan.cc/sh, an independent parser, and writes what version 6's shell
// grammar is expected to find: the outcome and the byte span of every command
// the shell would run. It reads one JSON object per line on standard input, {"id", "source", "dialect"}, and writes
// one JSON object per line. It never runs anything.
package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"mvdan.cc/sh/v3/syntax"
)

type input struct {
	ID      string `json:"id"`
	Source  string `json:"source"`
	Dialect string `json:"dialect"`
}

// Span is a byte range of the source.
type Span struct {
	Start int `json:"start"`
	End   int `json:"end"`
}

type output struct {
	ID          string `json:"id"`
	Outcome     string `json:"outcome"`
	Unsupported string `json:"unsupported,omitempty"`
	Parts       []Span `json:"parts"`
}

// unsupportedCommands are the words that start a construct version 6 reads as Unsupported.
var unsupportedCommands = map[string]string{"set": "shell options", "shopt": "shell options", "setopt": "shell options", "unsetopt": "shell options"}

const sourceLimit = 65536

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Buffer(make([]byte, 0, 1<<20), 1<<26)
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()
	encoder := json.NewEncoder(writer)
	encoder.SetEscapeHTML(false)
	for scanner.Scan() {
		var line input
		if err := json.Unmarshal(scanner.Bytes(), &line); err != nil {
			fmt.Fprintln(os.Stderr, "shell-oracle: an input line is not JSON:", err)
			os.Exit(1)
		}
		if err := encoder.Encode(read(line)); err != nil {
			fmt.Fprintln(os.Stderr, "shell-oracle:", err)
			os.Exit(1)
		}
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "shell-oracle:", err)
		os.Exit(1)
	}
}

func read(line input) output {
	result := output{ID: line.ID, Parts: []Span{}}
	if len(line.Source) > sourceLimit {
		result.Outcome = "limit_exceeded"
		return result
	}
	variant := syntax.LangBash
	switch line.Dialect {
	case "sh":
		variant = syntax.LangPOSIX
	case "zsh":
		variant = syntax.LangZsh
	}
	file, err := syntax.NewParser(syntax.Variant(variant), syntax.KeepComments(true)).Parse(strings.NewReader(line.Source), "")
	if err != nil {
		result.Outcome = "invalid"
		return result
	}
	result.Outcome = "complete"
	timedStarts := map[*syntax.Stmt]syntax.Pos{}
	syntax.Walk(file, func(node syntax.Node) bool {
		if clause, ok := node.(*syntax.TimeClause); ok && clause.Stmt != nil {
			timedStarts[leftmostStatement(clause.Stmt)] = clause.Pos()
		}
		return true
	})
	syntax.Walk(file, func(node syntax.Node) bool {
		if result.Unsupported == "" {
			result.Unsupported = unsupportedFamily(node)
		}
		if statement, ok := node.(*syntax.Stmt); ok {
			if span, ok := commandSpan(statement); ok {
				if timed, isTimed := timedStarts[statement]; isTimed {
					span.Start = int(timed.Offset())
				}
				result.Parts = append(result.Parts, span)
			}
		}
		return true
	})
	if result.Unsupported != "" {
		result.Outcome = "unsupported"
	}
	return result
}

// commandSpan is the span version 6 gives a simple command: from its first assignment, word or redirect to the end
// of its last one.
func commandSpan(statement *syntax.Stmt) (Span, bool) {
	var nodes []syntax.Node
	switch command := statement.Cmd.(type) {
	case nil:
	case *syntax.CallExpr:
		for _, assign := range command.Assigns {
			nodes = append(nodes, assign)
		}
		for _, word := range command.Args {
			nodes = append(nodes, word)
		}
	case *syntax.DeclClause, *syntax.TestClause, *syntax.LetClause:
		// Builtins and keywords the reference parser models as clauses run as one command in version 6's tree.
		nodes = append(nodes, command)
	default:
		return Span{}, false
	}
	for _, redirect := range statement.Redirs {
		// A here-document's body is not part of its command's span; the redirect ends at its delimiter.
		if redirect.Hdoc != nil {
			nodes = append(nodes, spanNode{redirect.Pos(), redirect.Word.End()})
			continue
		}
		nodes = append(nodes, redirect)
	}
	if len(nodes) == 0 {
		return Span{}, false
	}
	start, end := int(nodes[0].Pos().Offset()), int(nodes[0].End().Offset())
	for _, node := range nodes[1:] {
		start = min(start, int(node.Pos().Offset()))
		end = max(end, int(node.End().Offset()))
	}
	return Span{start, end}, true
}

// leftmostStatement is the first statement a timed pipeline runs: time measures the whole pipeline, and version 6
// keeps the time keyword on its first command.
func leftmostStatement(statement *syntax.Stmt) *syntax.Stmt {
	leftmost := statement
	for {
		binary, ok := leftmost.Cmd.(*syntax.BinaryCmd)
		if !ok {
			return leftmost
		}
		leftmost = binary.X
	}
}

// spanNode is a stand-in node covering a chosen range.
type spanNode struct{ start, end syntax.Pos }

func (node spanNode) Pos() syntax.Pos { return node.start }
func (node spanNode) End() syntax.Pos { return node.end }

func unsupportedFamily(node syntax.Node) string {
	switch typed := node.(type) {
	case *syntax.IfClause:
		return "conditional"
	case *syntax.WhileClause, *syntax.ForClause:
		return "loop"
	case *syntax.CaseClause:
		return "case"
	case *syntax.FuncDecl:
		return "function definition"
	case *syntax.CoprocClause:
		return "coprocess"
	case *syntax.ArithmCmd:
		return "arithmetic command"
	case *syntax.ArrayExpr:
		return "array"
	case *syntax.CallExpr:
		if len(typed.Args) > 0 {
			if literal := typed.Args[0].Lit(); literal != "" {
				return unsupportedCommands[literal]
			}
		}
	}
	return ""
}
