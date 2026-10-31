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
	tokens, err := Shlex(CommandText(text))
	if err != nil {
		tokens = strings.FieldsFunc(CommandText(text), pyre.IsSpace)
	}
	return Unassigned(tokens)
}

// Unassigned is version 4's Part.leads: the words before the first that is not a NAME=value assignment left out.
func Unassigned(tokens []string) []string {
	for len(tokens) > 0 && strings.Contains(tokens[0], "=") && !strings.HasPrefix(tokens[0], "-") {
		tokens = tokens[1:]
	}
	return tokens
}

// CommandText is Part.command_text: the text from its first line that is not a comment.
func CommandText(text string) string {
	lines := strings.Split(text, "\n")
	for index, line := range lines {
		if strings.HasPrefix(strings.TrimLeftFunc(line, pyre.IsSpace), "#") {
			continue
		}
		return strings.Join(lines[index:], "\n")
	}
	return ""
}

var (
	errNoClosingQuotation = errors.New("no closing quotation")
	errNoEscapedCharacter = errors.New("no escaped character")
)

const shlexWhitespace = " \t\r\n"

// Shlex is Python's shlex.split(text) in POSIX mode: words split at whitespace, quotes taken off, a backslash keeping
// the next character, and inside double quotes only before a backslash or a double quote.
func Shlex(text string) ([]string, error) {
	var tokens []string
	var word strings.Builder
	quoted, inWord := false, false
	runes := []rune(text)
	for index := 0; index < len(runes); index++ {
		character := runes[index]
		switch {
		case strings.ContainsRune(shlexWhitespace, character):
			if inWord || quoted {
				tokens = append(tokens, word.String())
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
			closing, err := quotation(runes, index, &word)
			if err != nil {
				return nil, err
			}
			index = closing
		default:
			word.WriteRune(character)
			inWord = true
		}
	}
	if inWord || quoted {
		tokens = append(tokens, word.String())
	}
	return tokens, nil
}

// quotation writes the quoted text that opens at runes[opening] into the word and gives the position of its closing
// quote: inside double quotes a backslash keeps a backslash or a double quote after it, and stays before any other.
func quotation(runes []rune, opening int, word *strings.Builder) (int, error) {
	quote := runes[opening]
	for index := opening + 1; index < len(runes); index++ {
		inner := runes[index]
		if inner == quote {
			return index, nil
		}
		if quote != '"' || inner != '\\' {
			word.WriteRune(inner)
			continue
		}
		if index+1 >= len(runes) {
			return 0, errNoClosingQuotation
		}
		next := runes[index+1]
		if next != '\\' && next != '"' {
			word.WriteRune('\\')
		}
		word.WriteRune(next)
		index++
	}
	return 0, errNoClosingQuotation
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
func Join(tokens []string) string {
	quoted := make([]string, len(tokens))
	for index, word := range tokens {
		quoted[index] = Quote(word)
	}
	return strings.Join(quoted, " ")
}
