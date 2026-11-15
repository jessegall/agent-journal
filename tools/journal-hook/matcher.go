package main

import (
	"regexp"
	"strings"
)

// namesOrRegex is the matcher style of a program that reads a matcher of name characters only as an exact name or a
// list of names, and any other matcher as a regex.
const namesOrRegex = "names_or_regex"

var nameCharacters = regexp.MustCompile(`^[A-Za-z0-9_\-, |]+$`)

// matcherMatches says whether a hook's matcher picks the value, read the way the program of the given matcher style
// reads it: an exact name or a list split on ',' and '|', or else an unanchored regex; an invalid regex matches nothing.
func matcherMatches(style, matcher, value string) bool {
	if matcher == "" || matcher == "*" {
		return true
	}
	if style == namesOrRegex && nameCharacters.MatchString(matcher) {
		for _, name := range strings.FieldsFunc(matcher, func(character rune) bool { return character == ',' || character == '|' }) {
			if strings.TrimSpace(name) == value {
				return true
			}
		}
		return false
	}
	matched, err := regexp.MatchString(matcher, value)
	return err == nil && matched
}
