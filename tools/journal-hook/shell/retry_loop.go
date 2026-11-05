package shell

import (
	"strings"

	"mvdan.cc/sh/v3/syntax"
)

const (
	breakWord = "break"
	sleepWord = "sleep"
	// sleepCall is how a line waits without the sleep command, inside a quoted python -c.
	sleepCall = "time.sleep"
)

// IsRetryLoop says a line runs something again until it works: a loop that waits and either leaves by a break or tests a
// command at its head. A loop over a list with no wait is ordinary work.
func IsRetryLoop(line string) bool {
	file, err := Parse(line)
	if err != nil {
		return false
	}
	hasMatch := false
	syntax.Walk(file, func(node syntax.Node) bool {
		switch loop := node.(type) {
		case *syntax.WhileClause:
			hasMatch = hasMatch || waits(loop.Do)
		case *syntax.ForClause:
			hasMatch = hasMatch || (waits(loop.Do) && leaves(loop.Do))
		}
		return !hasMatch
	})
	return hasMatch
}

func waits(body []*syntax.Stmt) bool {
	return bodyHas(body, func(node syntax.Node) bool {
		switch word := node.(type) {
		case *syntax.CallExpr:
			return len(word.Args) > 0 && word.Args[0].Lit() == sleepWord
		case *syntax.SglQuoted:
			return strings.Contains(word.Value, sleepCall)
		case *syntax.Lit:
			return strings.Contains(word.Value, sleepCall)
		}
		return false
	})
}

func leaves(body []*syntax.Stmt) bool {
	return bodyHas(body, func(node syntax.Node) bool {
		call, isCall := node.(*syntax.CallExpr)
		return isCall && len(call.Args) > 0 && call.Args[0].Lit() == breakWord
	})
}

func bodyHas(body []*syntax.Stmt, matches func(syntax.Node) bool) bool {
	hasMatch := false
	for _, statement := range body {
		syntax.Walk(statement, func(node syntax.Node) bool {
			hasMatch = hasMatch || (node != nil && matches(node))
			return !hasMatch
		})
	}
	return hasMatch
}
