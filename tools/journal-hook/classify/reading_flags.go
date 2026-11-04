package classify

import (
	"regexp"
	"strings"
)

// readingFlag is a flag of a saved command that says what the agent reads of its output, and never reaches the command.
var readingFlag = regexp.MustCompile(`(?:^|\s)--(tail|head)\s+(\d+)(?:\s|$)|(?:^|\s)--(cut)\s+(\d+-\d+)(?:\s|$)`)

// argumentsEnd is the bare -- after which every argument is the command's own.
var argumentsEnd = regexp.MustCompile(`(?:^|\s)--(?:\s|$)`)

// splitReading takes the reading flags off a saved command's arguments, up to a bare --: tail:5, head:5 or cut:100-160.
func splitReading(arguments string) (string, string) {
	flags, rest := arguments, ""
	if place := argumentsEnd.FindStringIndex(arguments); place != nil {
		flags, rest = arguments[:place[0]], arguments[place[1]:]
	}
	match := readingFlag.FindStringSubmatchIndex(flags)
	if match == nil {
		return arguments, ""
	}
	groups := readingFlag.FindStringSubmatch(flags)
	reading := groups[1] + ":" + groups[2]
	if groups[3] != "" {
		reading = groups[3] + ":" + groups[4]
	}
	kept := strings.TrimSpace(flags[:match[0]] + " " + flags[match[1]:] + " " + rest)
	return kept, reading
}
