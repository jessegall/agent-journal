package classify

import (
	"fmt"
	"slices"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
	"mvdan.cc/sh/v3/syntax"
)

const aliasExpansionLevels = 32

func (classifier *Classifier) expandAliases(line string) (string, []string, error) {
	return classifier.expandAliasesAt(line, 0)
}

func (classifier *Classifier) expandAliasesAt(line string, level int) (string, []string, error) {
	names := []string{}
	previous := map[string]bool{}
	for depth := level; ; depth++ {
		file, err := shell.Parse(line)
		if err != nil {
			return line, names, err
		}
		replacements := []aliasReplacement{}
		syntax.Walk(file, func(node syntax.Node) bool {
			if err != nil {
				return false
			}
			call, present := node.(*syntax.CallExpr)
			if !present {
				return true
			}
			change, matched, failure := classifier.aliasReplacement(call, line, depth)
			if !matched {
				return true
			}
			for _, name := range change.names {
				if !slices.Contains(names, name) {
					names = append(names, name)
				}
			}
			err = failure
			replacements = append(replacements, change)
			return false
		})
		if err != nil || len(replacements) == 0 {
			return line, names, err
		}
		if previous[line] || depth >= aliasExpansionLevels {
			return line, names, fmt.Errorf("alias expansion is cyclic or exceeds %d levels", aliasExpansionLevels)
		}
		previous[line] = true
		for index := len(replacements) - 1; index >= 0; index-- {
			change := replacements[index]
			line = line[:change.start] + change.line + line[change.end:]
		}
	}
}

func (classifier *Classifier) aliasReplacement(call *syntax.CallExpr, line string, level int) (aliasReplacement, bool, error) {
	tokens := make([]string, len(call.Args))
	for index, word := range call.Args {
		raw := line[word.Pos().Offset():word.End().Offset()]
		tokens[index] = raw
		if parsed, err := shell.Shlex(raw); err == nil && len(parsed) == 1 {
			tokens[index] = parsed[0]
		}
	}
	unwrapped := classifier.loaded().Unwrapped(tokens)
	first := len(tokens) - len(unwrapped)
	if change, matched, err := classifier.scriptAlias(call, unwrapped, first, level); matched {
		return change, matched, err
	}
	if len(unwrapped) < 2 || !journalPrograms[baseName(unwrapped[0])] {
		return aliasReplacement{}, false, nil
	}
	name := unwrapped[1]
	definition, exists := classifier.aliases()[name]
	if !exists {
		return aliasReplacement{}, false, nil
	}
	arguments := ""
	if len(unwrapped) > 2 {
		arguments = line[call.Args[first+2].Pos().Offset():call.Args[len(call.Args)-1].End().Offset()]
	}
	options := savedOptions{arguments: arguments}
	isSaved := classifier.isSaved(name)
	if isSaved {
		options = splitSavedOptions(arguments)
		arguments = options.arguments
	}
	expanded := strings.ReplaceAll(definition, "{args}", arguments)
	if !strings.Contains(definition, "{args}") && arguments != "" {
		expanded += " " + arguments
	}
	expanded, err := groupedAlias(expanded)
	if first > 0 || len(call.Assigns) > 0 {
		if file, parseError := shell.Parse(expanded); parseError == nil && len(file.Stmts) == 1 {
			if _, simple := file.Stmts[0].Cmd.(*syntax.CallExpr); !simple {
				expanded = "sh -c " + shell.Quote(expanded)
			}
		}
	}
	if isSaved {
		classifier.savedRuns = append(classifier.savedRuns, savedRun{name, expanded, options.selection, options.timeoutDuration})
	}
	return aliasReplacement{[]string{name}, int(call.Args[first].Pos().Offset()), int(call.Args[len(call.Args)-1].End().Offset()), expanded}, true, err
}

func groupedAlias(line string) (string, error) {
	file, err := shell.Parse(line)
	if err != nil {
		return "", fmt.Errorf("alias command: %w", err)
	}
	if len(file.Stmts) == 1 {
		switch file.Stmts[0].Cmd.(type) {
		case *syntax.CallExpr, *syntax.Subshell, *syntax.Block:
			return line, nil
		}
	}
	return "( " + line + " )", nil
}
