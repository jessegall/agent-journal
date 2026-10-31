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
	classes := map[byte]string{'s': Space, 'w': Word, 'd': Digit}
	var written strings.Builder
	inClass := false
	for index := 0; index < len(pattern); index++ {
		character := pattern[index]
		switch {
		case character == '\\' && index+1 < len(pattern):
			next := pattern[index+1]
			index++
			if members, ok := classes[next]; ok {
				if inClass {
					written.WriteString(members)
				} else {
					written.WriteString("[" + members + "]")
				}
				continue
			}
			if members, ok := classes[next+'a'-'A']; ok && next >= 'A' && next <= 'Z' && !inClass {
				written.WriteString("[^" + members + "]")
				continue
			}
			written.WriteByte('\\')
			written.WriteByte(next)
		case character == '[' && !inClass:
			inClass = true
			written.WriteByte(character)
			if strings.HasPrefix(pattern[index+1:], "^") {
				written.WriteByte('^')
				index++
			}
			if strings.HasPrefix(pattern[index+1:], "]") {
				written.WriteByte(']')
				index++
			}
		case character == ']' && inClass:
			inClass = false
			written.WriteByte(character)
		default:
			written.WriteByte(character)
		}
	}
	return written.String()
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
	before, after := false, false
	if position > 0 {
		character, _ := utf8.DecodeLastRuneInString(text[:position])
		before = IsWord(character)
	}
	if position < len(text) {
		character, _ := utf8.DecodeRuneInString(text[position:])
		after = IsWord(character)
	}
	return before != after
}
