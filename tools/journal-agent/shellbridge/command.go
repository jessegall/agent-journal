// Package shellbridge reads the command a program hands its shell, so a protected-account container can pass that
// command, unparsed, to the executor instead of letting a shell of the program's user parse it.
package shellbridge

import (
	"errors"
	"strings"
)

// ErrNoCommand is a call that hands no command string: the bridge runs commands, never an interactive shell.
var ErrNoCommand = errors.New("the shell bridge runs only `bash -c <command>`")

// ErrPositionalArguments is a call that passes arguments after the command, which the executor cannot hand on.
var ErrPositionalArguments = errors.New("the shell bridge takes no arguments after the command")

// CommandOf is the command string of a bash-style call, such as `bash -c -l <command>`: the options
// before it may be grouped (-lc) or apart (-c -l), and the string itself is kept exactly as it came, never parsed.
func CommandOf(arguments []string) (string, error) {
	reads := false

	for index, argument := range arguments {
		if argument == "--" {
			return commandAfter(arguments[index+1:], reads)
		}

		if !strings.HasPrefix(argument, "-") || argument == "-" {
			return commandAfter(arguments[index:], reads)
		}

		reads = reads || strings.Contains(argument[1:], "c")
	}

	return "", ErrNoCommand
}

// commandAfter is the first argument left once the options end, when -c was among them and nothing follows it.
func commandAfter(rest []string, reads bool) (string, error) {
	if !reads || len(rest) == 0 {
		return "", ErrNoCommand
	}

	if len(rest) > 1 {
		return "", ErrPositionalArguments
	}

	return rest[0], nil
}
