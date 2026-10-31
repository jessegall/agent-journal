package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
)

// Flags are what the rewritten command line says: the process, the foreground limit, whether to move at once and the
// line after --; --follow with --folder and --parts is the detached follower of a moved run.
type Flags struct {
	Process    int
	Limit      int
	Background bool
	Line       string
	Follow     bool
	Folder     string
	Parts      int
}

// Home is the journal's folder: the one a follower was handed, else JOURNAL_HOME, else .journal here.
func (flags Flags) Home() string {
	home := flags.Folder
	if home == "" {
		home = os.Getenv("JOURNAL_HOME")
	}
	if home == "" {
		home = ".journal"
	}
	absolute, err := filepath.Abs(home)
	if err != nil {
		return home
	}
	return absolute
}

// ParseFlags reads --process <id> --limit <seconds> [--background] -- <line>.
func ParseFlags(arguments []string) (Flags, error) {
	var flags Flags
	hasProcess := false
	for index := 0; index < len(arguments); index++ {
		argument := arguments[index]
		switch argument {
		case "--":
			if index+1 >= len(arguments) {
				return flags, errors.New("the line after -- is missing")
			}
			flags.Line = arguments[index+1]
			return finished(flags, hasProcess)
		case "--background":
			flags.Background = true
		case "--follow":
			flags.Follow = true
		case "--process", "--limit", "--parts", "--folder":
			if index+1 >= len(arguments) {
				return flags, fmt.Errorf("%s needs a value", argument)
			}
			index++
			value := arguments[index]
			if argument == "--folder" {
				flags.Folder = value
				continue
			}
			number, err := strconv.Atoi(value)
			if err != nil || number < 0 {
				return flags, fmt.Errorf("%s is a number of 0 or more, not %q", argument, value)
			}
			switch argument {
			case "--process":
				flags.Process, hasProcess = number, true
			case "--limit":
				flags.Limit = number
			case "--parts":
				flags.Parts = number
			}
		default:
			return flags, fmt.Errorf("%q is not a flag of journal-run", argument)
		}
	}
	if flags.Follow {
		return finished(flags, hasProcess)
	}
	return flags, errors.New("the line after -- is missing")
}

func finished(flags Flags, hasProcess bool) (Flags, error) {
	if !hasProcess {
		return flags, errors.New("--process <number> is missing")
	}
	return flags, nil
}
