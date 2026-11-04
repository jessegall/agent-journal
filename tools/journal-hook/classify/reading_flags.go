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

type savedOptions struct {
	arguments       string
	reading         string
	timeoutDuration *string
}

func splitSavedOptions(arguments string) savedOptions {
	flags, rest := arguments, ""
	if place := argumentsEnd.FindStringIndex(arguments); place != nil {
		flags, rest = arguments[:place[0]], arguments[place[1]:]
	}
	options := savedOptions{arguments: arguments}
	var reading []string
	flags, reading = removeSavedFlag(flags, readingFlag)
	if reading != nil {
		options.reading = reading[1] + ":" + reading[2]
		if reading[3] != "" {
			options.reading = reading[3] + ":" + reading[4]
		}
	}
	var timeout []string
	flags, timeout = removeSavedFlag(flags, timeoutFlag)
	if timeout != nil {
		value := timeout[1] + timeout[2] + timeout[3]
		options.timeoutDuration = &value
	}
	if reading != nil || timeout != nil {
		options.arguments = strings.TrimSpace(flags + " " + rest)
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
