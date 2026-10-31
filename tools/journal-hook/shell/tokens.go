// Package shell splits a shell line into its commands and reads each one's words, as version 4 does.
package shell

import (
	"errors"
	"regexp"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
)

// Tokens is version 4's Part.tokens: the words of a command as Python's shlex.split reads them in POSIX mode, the
// comment lines before it and the variable assignments in front of it left out; a line shlex cannot read (an unclosed
// quote, a trailing backslash) is split at whitespace instead.
func Tokens(text string) []string {
	words, err := Words(CommandText(text))
	if err != nil {
		words = strings.FieldsFunc(CommandText(text), pyre.IsSpace)
	}
	for len(words) > 0 && strings.Contains(words[0], "=") && !strings.HasPrefix(words[0], "-") {
		words = words[1:]
	}
	return words
}

// CommandText is Part.command_text: the text from its first line that is not a comment.
func CommandText(text string) string {
	lines := strings.Split(text, "\n")
	for index, line := range lines {
		if !strings.HasPrefix(strings.TrimLeftFunc(line, pyre.IsSpace), "#") {
			return strings.Join(lines[index:], "\n")
		}
	}
	return ""
}

var (
	errNoClosingQuotation = errors.New("no closing quotation")
	errNoEscapedCharacter = errors.New("no escaped character")
)

const shlexWhitespace = " \t\r\n"

// Words is Python's shlex.split(text) in POSIX mode: words split at whitespace, quotes taken off, a backslash keeping
// the next character, and inside double quotes only before a backslash or a double quote.
func Words(text string) ([]string, error) {
	var words []string
	var word strings.Builder
	quoted, inWord := false, false
	runes := []rune(text)
	for index := 0; index < len(runes); index++ {
		character := runes[index]
		switch {
		case strings.ContainsRune(shlexWhitespace, character):
			if inWord || quoted {
				words = append(words, word.String())
			}
			word.Reset()
			quoted, inWord = false, false
		case character == '\\':
			if index+1 >= len(runes) {
				return nil, errNoEscapedCharacter
			}
			index++
			word.WriteRune(runes[index])
			inWord = true
		case character == '\'' || character == '"':
			quoted, inWord = true, true
			closed := false
			for index++; index < len(runes); index++ {
				inner := runes[index]
				if inner == character {
					closed = true
					break
				}
				if character == '"' && inner == '\\' {
					if index+1 >= len(runes) {
						return nil, errNoClosingQuotation
					}
					next := runes[index+1]
					if next != '\\' && next != '"' {
						word.WriteRune('\\')
					}
					word.WriteRune(next)
					index++
					continue
				}
				word.WriteRune(inner)
			}
			if !closed {
				return nil, errNoClosingQuotation
			}
		default:
			word.WriteRune(character)
			inWord = true
		}
	}
	if inWord || quoted {
		words = append(words, word.String())
	}
	return words, nil
}

var shlexSafe = regexp.MustCompile(`^[a-zA-Z0-9_@%+=:,./-]+$`)

// Quote is Python's shlex.quote.
func Quote(word string) string {
	if word == "" {
		return "''"
	}
	if shlexSafe.MatchString(word) {
		return word
	}
	return "'" + strings.ReplaceAll(word, "'", `'"'"'`) + "'"
}

// Join is Python's shlex.join.
func Join(words []string) string {
	quoted := make([]string, len(words))
	for index, word := range words {
		quoted[index] = Quote(word)
	}
	return strings.Join(quoted, " ")
}
