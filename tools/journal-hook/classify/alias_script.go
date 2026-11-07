package classify

import (
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
	"mvdan.cc/sh/v3/syntax"
)

func (classifier *Classifier) scriptAlias(call *syntax.CallExpr, tokens []string, first, level int) (aliasReplacement, bool, error) {
	if len(tokens) < 2 {
		return aliasReplacement{}, false, nil
	}
	start, end, script := 0, 0, ""
	switch baseName(tokens[0]) {
	case "sh", "bash", "zsh":
		position := scriptArgument(tokens[1:])
		if position < 0 {
			return aliasReplacement{}, false, nil
		}
		start, end, script = first+position+1, first+position+1, tokens[position+1]
	case "eval":
		start, end, script = first+1, first+len(tokens)-1, joinedLines(tokens[1:])[0]
	default:
		return aliasReplacement{}, false, nil
	}
	for _, argument := range call.Args[start : end+1] {
		if !literalArgument(argument) {
			return aliasReplacement{}, false, nil
		}
	}
	expanded, names, err := classifier.expandAliasesAt(script, level)
	if len(names) == 0 {
		return aliasReplacement{}, false, nil
	}
	return aliasReplacement{names, int(call.Args[start].Pos().Offset()), int(call.Args[end].End().Offset()), shell.Quote(expanded)}, true, err
}

func literalArgument(argument *syntax.Word) bool {
	literal := true
	syntax.Walk(argument, func(node syntax.Node) bool {
		switch node.(type) {
		case nil, *syntax.Word, *syntax.Lit, *syntax.SglQuoted, *syntax.DblQuoted:
			return true
		default:
			literal = false
			return false
		}
	})
	return literal
}
