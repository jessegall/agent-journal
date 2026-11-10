package classify

import (
	"regexp"
	"strings"
)

// readingFlag is a flag of a saved command that says what the agent reads of its output, and never reaches the command.
var readingFlag = regexp.MustCompile(`(?:^|\s)--(tail|head)\s+(\d+)(?:\s|$)|(?:^|\s)--(cut)\s+(\d+-\d+)(?:\s|$)`)

// argumentsEnd is the bare -- after which every argument is the command's own.
var argumentsEnd = regexp.MustCompile(`(?:^|\s)--(?:\s|$)`)

var timeoutFlag = regexp.MustCompile(`(?:^|\s)--timeout(?:=|\s+)(?:'([^']*)'|"([^"]*)"|([^\s]+))|(?:^|\s)--timeout$`)

// largeReadFlag lets one journal line read past the read limit; a saved command reads no journal rows, so the flag
// never reaches it.
var largeReadFlag = regexp.MustCompile(`(?:^|\s)--allow-large-read(?:\s|$)`)

type savedOptions struct {
	arguments       string
	selection       string
	timeoutDuration *string
}

func splitSavedOptions(arguments string) savedOptions {
	flags, remainder := arguments, ""
	if place := argumentsEnd.FindStringIndex(arguments); place != nil {
		flags, remainder = arguments[:place[0]], arguments[place[1]:]
	}
	options := savedOptions{arguments: arguments}
	var selection []string
	flags, selection = removeSavedFlag(flags, readingFlag)
	if selection != nil {
		options.selection = selection[1] + ":" + selection[2]
		if selection[3] != "" {
			options.selection = selection[3] + ":" + selection[4]
		}
	}
	var timeout []string
	flags, timeout = removeSavedFlag(flags, timeoutFlag)
	if timeout != nil {
		value := timeout[1] + timeout[2] + timeout[3]
		options.timeoutDuration = &value
	}
	var largeRead []string
	flags, largeRead = removeSavedFlag(flags, largeReadFlag)
	if selection != nil || timeout != nil || largeRead != nil {
		options.arguments = strings.TrimSpace(flags + " " + remainder)
	}
	return options
}

func removeSavedFlag(arguments string, pattern *regexp.Regexp) (string, []string) {
	match := pattern.FindStringSubmatchIndex(arguments)
	if match == nil {
		return arguments, nil
	}
	groups := pattern.FindStringSubmatch(arguments)
	return strings.TrimSpace(arguments[:match[0]] + " " + arguments[match[1]:]), groups
}
