package classify

import (
	"regexp"
	"strings"
	"unicode/utf8"

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
	bodies := heredocBodies(string(characters))
	for index, character := range characters {
		if index <= passed || index > 0 && characters[index-1] == '\\' && quote != '\'' {
			continue
		}
		if bodies.contains(index) {
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

// A heredoc with its end word, quoted or not.
var heredocStart = regexp.MustCompile(`<<-?\s*['"]?(\w+)['"]?`)

// runeSpans are stretches of a text, each from its first character up to the one after its last.
type runeSpans [][2]int

func (spans runeSpans) contains(index int) bool {
	for _, span := range spans {
		if index >= span[0] && index < span[1] {
			return true
		}
	}
	return false
}

// heredocBodies are the stretches of text handed to a command as a heredoc: data, in which no pipe, quote or
// bracket belongs to the shell line. A heredoc with no end word in the text runs to the end.
func heredocBodies(text string) runeSpans {
	var bodies runeSpans
	searched := 0
	for searched < len(text) {
		match := heredocStart.FindStringSubmatchIndex(text[searched:])
		if match == nil {
			break
		}
		word := text[searched+match[2] : searched+match[3]]
		lineEnd := strings.Index(text[searched+match[1]:], "\n")
		if lineEnd < 0 {
			break
		}
		bodyStart := searched + match[1] + lineEnd + 1
		bodyEnd := len(text)
		if end := strings.Index(text[bodyStart-1:], "\n"+word); end >= 0 {
			bodyEnd = bodyStart - 1 + end
		}
		bodies = append(bodies, [2]int{utf8.RuneCountInString(text[:bodyStart]), utf8.RuneCountInString(text[:bodyEnd])})
		searched = bodyEnd
	}
	return bodies
}

// withoutHeredocBodies takes out the text of every heredoc, so no redirect sign in it reads as one of the line.
func withoutHeredocBodies(text string) string {
	characters := []rune(text)
	var kept []rune
	position := 0
	for _, body := range heredocBodies(text) {
		kept = append(kept, characters[position:body[0]]...)
		position = body[1]
	}
	return string(append(kept, characters[position:]...))
}

// A heredoc whose end word is quoted: the shell leaves its text as it stands.
var closedHeredoc = regexp.MustCompile(`<<-?\s*(?:'(\w+)'|"(\w+)")`)

// withoutClosedHeredocs takes out the text of heredocs the shell does not expand, so no word in it reads as a command.
func withoutClosedHeredocs(text string) string {
	for _, match := range closedHeredoc.FindAllStringSubmatchIndex(text, -1) {
		word := closedWord(text, match)
		start := strings.Index(text[match[1]:], "\n")
		if start < 0 {
			continue
		}
		bodyStart := match[1] + start
		end := strings.Index(text[bodyStart:], "\n"+word)
		if end < 0 {
			return text[:bodyStart]
		}
		return text[:bodyStart] + withoutClosedHeredocs(text[bodyStart+end+1+len(word):])
	}
	return text
}

func closedWord(text string, match []int) string {
	if match[2] >= 0 {
		return text[match[2]:match[3]]
	}
	return text[match[4]:match[5]]
}
