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
var pipeSymbols = []string{"||", "|&", "|"}

// blanked is Part.blanked: the text past its leading comment lines, each quoted word made an empty pair of quotes.
func blanked(text string) string {
	return quotedWord.ReplaceAllLiteralString(shell.CommandText(text), " '' ")
}

// unexpanded is Part.unexpanded: the text with its single-quoted words taken out.
func unexpanded(text string) string {
	return singleQuoted.ReplaceAllLiteralString(text, " ")
}

type pipeMark struct {
	position int
	symbol   string
}

// pipesAt is Part.pipeSymbols: the pipes and ors outside quotes at the given depth of brackets.
func pipesAt(characters []rune, level int) []pipeMark {
	var positions []pipeMark
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
			remainder := string(characters[index:])
			for _, symbol := range pipeSymbols {
				if !strings.HasPrefix(remainder, symbol) {
					continue
				}
				positions = append(positions, pipeMark{index, symbol})
				passed = index + len([]rune(symbol)) - 1
				break
			}
		}
	}
	return positions
}

// commands is Part.commands: the commands of a pipe or of its || alternatives, a >| redirect left whole.
func commands(text string) []string {
	characters := []rune(text)
	starts, ends := []int{0}, []int{}
	for _, entry := range pipesAt(characters, 0) {
		if entry.position > 0 && characters[entry.position-1] == '>' {
			continue
		}
		ends = append(ends, entry.position)
		starts = append(starts, entry.position+len([]rune(entry.symbol)))
	}
	ends = append(ends, len(characters))
	parts := make([]string, len(starts))
	for index := range starts {
		parts[index] = pyre.Strip(strings.TrimLeft(string(characters[starts[index]:ends[index]]), "&"))
	}
	return parts
}

// stages is Part.stages: the commands of the text's pipe, its || alternatives kept together.
func stages(text string) []string {
	characters := []rune(text)
	splitPositions := []int{-1}
	for _, entry := range pipesAt(characters, 0) {
		if entry.symbol == "||" {
			continue
		}
		splitPositions = append(splitPositions, entry.position)
	}
	splitPositions = append(splitPositions, len(characters))
	parts := make([]string, len(splitPositions)-1)
	for index := range parts {
		parts[index] = pyre.Strip(strings.TrimLeft(string(characters[splitPositions[index]+1:splitPositions[index+1]]), "&"))
	}
	return parts
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
