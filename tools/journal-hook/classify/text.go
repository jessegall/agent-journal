package classify

import (
	"regexp"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// Version 4's Part reads a command's text by these patterns and scans; positions are counted in characters, as Python
// counts them.
var (
	// a quoted word, in single quotes or in double quotes with its escapes
	quotedWord = regexp.MustCompile(`'[^']*'|"(?:\\.|[^"\\])*"`)
	// a word in single quotes, which the shell runs nothing inside
	singleQuoted = regexp.MustCompile(`'[^']*'`)
)

// The operators that join the commands of one part: a pipe, a pipe of both outputs, and an or.
var joints = []string{"||", "|&", "|"}

// blanked is Part.blanked: the text past its leading comment lines, each quoted word made an empty pair of quotes.
func blanked(text string) string {
	return quotedWord.ReplaceAllLiteralString(shell.CommandText(text), " '' ")
}

// unexpanded is Part.unexpanded: the text with its single-quoted words taken out.
func unexpanded(text string) string {
	return singleQuoted.ReplaceAllLiteralString(text, " ")
}

type joint struct {
	position int
	symbol   string
}

// jointsAt is Part.joints: the pipes and ors outside quotes at the given depth of brackets.
func jointsAt(characters []rune, level int) []joint {
	var found []joint
	quote, depth, passed := rune(0), 0, -1
	for index, character := range characters {
		if index <= passed || index > 0 && characters[index-1] == '\\' && quote != '\'' {
			continue
		}
		switch {
		case quote != 0:
			if character == quote {
				quote = 0
			}
		case character == '\'' || character == '"' || character == '`':
			quote = character
		case character == '(' || character == '{':
			depth++
		case character == ')' || character == '}':
			depth = max(depth-1, 0)
		case character == '|' && depth == level:
			rest := string(characters[index:])
			for _, symbol := range joints {
				if strings.HasPrefix(rest, symbol) {
					found = append(found, joint{index, symbol})
					passed = index + len([]rune(symbol)) - 1
					break
				}
			}
		}
	}
	return found
}

// commands is Part.commands: the commands of a pipe or of its || alternatives, a >| redirect left whole.
func commands(text string) []string {
	characters := []rune(text)
	starts, ends := []int{0}, []int{}
	for _, each := range jointsAt(characters, 0) {
		if each.position > 0 && characters[each.position-1] == '>' {
			continue
		}
		ends = append(ends, each.position)
		starts = append(starts, each.position+len([]rune(each.symbol)))
	}
	ends = append(ends, len(characters))
	found := make([]string, len(starts))
	for index := range starts {
		found[index] = pyre.Strip(strings.TrimLeft(string(characters[starts[index]:ends[index]]), "&"))
	}
	return found
}

// stages is Part.stages: the commands of the text's pipe, its || alternatives kept together.
func stages(text string) []string {
	characters := []rune(text)
	cuts := []int{-1}
	for _, each := range jointsAt(characters, 0) {
		if each.symbol != "||" {
			cuts = append(cuts, each.position)
		}
	}
	cuts = append(cuts, len(characters))
	found := make([]string, len(cuts)-1)
	for index := range found {
		found[index] = pyre.Strip(strings.TrimLeft(string(characters[cuts[index]+1:cuts[index+1]]), "&"))
	}
	return found
}

// isSubshell is Part.is_subshell: the text is one subshell, its opening bracket closed at its end.
func isSubshell(text string) bool {
	stripped := []rune(pyre.Strip(text))
	return len(stripped) > 0 && stripped[0] == '(' && stripped[len(stripped)-1] == ')' && closingParen(stripped) == len(stripped)-1
}

func closingParen(characters []rune) int {
	quote, depth := rune(0), 0
	for index, character := range characters {
		switch {
		case quote != 0:
			if character == quote {
				quote = 0
			}
		case character == '\'' || character == '"' || character == '`':
			quote = character
		case character == '(':
			depth++
		case character == ')':
			depth--
			if depth == 0 {
				return index
			}
		}
	}
	return -1
}
