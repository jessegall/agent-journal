package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// Flags are what the rewritten command line says: the process, the foreground limit, whether to move at once and the
// line after --; --follow with --folder and --parts is the detached tracker of a moved run.
type Flags struct {
	Count      string
	Process    int
	Limit      int
	Background bool
	Queue      bool
	OnlyReads  bool
	Line       string
	Follow     bool
	Folder     string
	Parts      int
	Aliases    []string
	MostOutput int
}

// The output settings of a run come in variables, so a runner of an older install ignores them. Each is cleared once
// read, so a run inside this one starts with none.
const (
	strippedVariable   = "JOURNAL_RUN_STRIPPED"
	mostOutputVariable = "JOURNAL_RUN_MOST_OUTPUT"
)

// outputSettings reads the commands to strip and the most bytes one part may keep.
func outputSettings() ([]string, int) {
	stripped, mostOutput := os.Getenv(strippedVariable), os.Getenv(mostOutputVariable)
	_ = os.Unsetenv(strippedVariable)
	_ = os.Unsetenv(mostOutputVariable)
	bytes, _ := strconv.Atoi(mostOutput)
	if stripped == "" {
		return nil, bytes
	}
	return strings.Split(stripped, "\n"), bytes
}

// binFolder is where a journal keeps this program, inside the journal's folder.
const binFolder = "bin"

// binaryHome is the journal's folder a program installed in its bin folder belongs to, so a worker's worktree, which
// has no journal of its own, still finds it.
func binaryHome(program string) string {
	folder := filepath.Dir(program)
	if filepath.Base(folder) != binFolder {
		return ""
	}
	return filepath.Dir(folder)
}

// Home is the journal's folder: the one a tracker was handed, else JOURNAL_HOME, else the one this program is installed
// in, else .journal here.
func (flags Flags) Home() string {
	home := flags.Folder
	if home == "" {
		home = os.Getenv("JOURNAL_HOME")
	}
	if home == "" {
		if program, err := os.Executable(); err == nil {
			home = binaryHome(program)
		}
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
		case "--queue":
			flags.Queue = true
		case "--only-reads":
			flags.OnlyReads = true
		case "--follow":
			flags.Follow = true
		case "--count":
			if index+1 >= len(arguments) {
				return flags, fmt.Errorf("%s needs a value", argument)
			}
			index++
			flags.Count = arguments[index]
		case "--aliases":
			if index+1 >= len(arguments) {
				return flags, fmt.Errorf("%s needs a value", argument)
			}
			index++
			flags.Aliases = strings.Split(arguments[index], ",")
		case "--process", "--limit", "--parts", "--most-output", "--folder":
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
			case "--most-output":
				flags.MostOutput = number
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
