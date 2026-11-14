// Package pyre reads Python regular expressions and Python's character classes in Go: Python's \s, \w and \d match
// Unicode characters, Go's only ASCII, and Python's \b is a boundary of Unicode words.
package pyre

import (
	"regexp"
	"strings"
	"unicode"
	"unicode/utf8"
)

// The members of Python's \s, \w and \d, written to stand inside a Go character class.
const (
	Space = `\t\n\v\f\r \x{1c}-\x{1f}\x{85}\p{Z}`
	Word  = `\p{L}\p{N}_`
	Digit = `\p{Nd}`
)

// Compile compiles a Python pattern whose \s, \w and \d (and \S, \W, \D outside a class) are Python's.
func Compile(pattern string) *regexp.Regexp {
	return regexp.MustCompile(Translated(pattern))
}

// Translated writes Python's classes out in a pattern; every other escape is the same in Go.
func Translated(pattern string) string {
	var encoded strings.Builder
	inClass := false
	for index := 0; index < len(pattern); index++ {
		character := pattern[index]
		switch {
		case character == '\\' && index+1 < len(pattern):
			index++
			encoded.WriteString(escape(pattern[index], inClass))
		case character == '[' && !inClass:
			inClass = true
			encoded.WriteByte(character)
			if strings.HasPrefix(pattern[index+1:], "^") {
				encoded.WriteByte('^')
				index++
			}
			if strings.HasPrefix(pattern[index+1:], "]") {
				encoded.WriteByte(']')
				index++
			}
		case character == ']' && inClass:
			inClass = false
			encoded.WriteByte(character)
		default:
			encoded.WriteByte(character)
		}
	}
	return encoded.String()
}

// The Python classes a backslash and a letter name.
var classes = map[byte]string{'s': Space, 'w': Word, 'd': Digit}

// escape is the Go text of a backslash and the character after it: a Python class written out, inside a character
// class as its members, outside it as a class of its own, and as its negation for the capital letter; any other escape
// as it stands.
func escape(character byte, inClass bool) string {
	if members, present := classes[character]; present && inClass {
		return members
	}
	if members, present := classes[character]; present {
		return "[" + members + "]"
	}
	if members, present := classes[character+'a'-'A']; present && character >= 'A' && character <= 'Z' && !inClass {
		return "[^" + members + "]"
	}
	return `\` + string(character)
}

// IsSpace is Python's str.isspace, which strip() trims and \s matches.
func IsSpace(character rune) bool {
	return strings.ContainsRune("\t\n\v\f\r \x1c\x1d\x1e\x1f\x85", character) || unicode.Is(unicode.Z, character)
}

// Strip is Python's str.strip().
func Strip(text string) string {
	return strings.TrimFunc(text, IsSpace)
}

// IsWord is a character Python's \w matches.
func IsWord(character rune) bool {
	return character == '_' || unicode.IsLetter(character) || unicode.IsNumber(character)
}

// IsBoundary is Python's \b at a position of the text: a word character on one side and not on the other.
func IsBoundary(text string, position int) bool {
	preceding, following := false, false
	if position > 0 {
		character, _ := utf8.DecodeLastRuneInString(text[:position])
		preceding = IsWord(character)
	}
	if position < len(text) {
		character, _ := utf8.DecodeRuneInString(text[position:])
		following = IsWord(character)
	}
	return preceding != following
}
