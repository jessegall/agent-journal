package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// Flags are what the rewritten command line says: the process, the foreground limit, whether to move at once and the
// line after --; --follow with --folder and --parts is the detached tracker of a moved run.
type Flags struct {
	Count         string
	Process       int
	Limit         int
	Background    bool
	Queue         bool
	OnlyReads     bool
	ReadOnlyShell bool
	WriteFolder   string
	Line          string
	Follow        bool
	// KeepCutting is the program that keeps a line's outputs under the limit while a part with & outlives the line.
	KeepCutting bool
	Folder      string
	Parts       int
	Aliases     []string
	MostOutput  int
}

// The output settings of a run come in variables, so a runner of an older install ignores them. Each is cleared once
// read, so a run inside this one starts with none.
const mostOutputVariable = "JOURNAL_RUN_MOST_OUTPUT"

const queueWaitVariable = "JOURNAL_RUN_QUEUE_WAIT"

const countedQueueVariable = "JOURNAL_RUN_COUNTED_QUEUE"

const readFoldersVariable = "JOURNAL_RUN_READ_FOLDERS"

// readFolders reads the folders of the project a worker's line may read, and clears them.
func readFolders() []string {
	return folderList(readFoldersVariable)
}

// writeFolders are the folders the journal lets this run write beside its own, such as a plugin's data folder.
const writeFoldersVariable = "JOURNAL_RUN_WRITE_FOLDERS"

func writeFolders() []string {
	return folderList(writeFoldersVariable)
}

func folderList(variable string) []string {
	folders := filepath.SplitList(os.Getenv(variable))
	_ = os.Unsetenv(variable)
	return folders
}

// countedQueue says the foreground limit counts from the start of the line, the time in the queue included.
func countedQueue() bool {
	value := os.Getenv(countedQueueVariable)
	_ = os.Unsetenv(countedQueueVariable)
	return value == "1"
}

func queueWait() time.Duration {
	value := os.Getenv(queueWaitVariable)
	_ = os.Unsetenv(queueWaitVariable)
	seconds, err := strconv.Atoi(value)
	if err != nil || seconds < 0 {
		return 5 * time.Second
	}
	return time.Duration(seconds) * time.Second
}

// mostOutputBytes reads the most bytes one part may keep.
func mostOutputBytes() int {
	bytes, _ := strconv.Atoi(os.Getenv(mostOutputVariable))
	_ = os.Unsetenv(mostOutputVariable)
	return bytes
}

// outputReading reads what the agent reads of each part, and clears it, so a run inside this one starts with none.
func outputReading() map[int]string {
	selection := parseReading(os.Getenv(readingVariable))
	_ = os.Unsetenv(readingVariable)
	return selection
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
		case "--read-only-shell":
			flags.ReadOnlyShell = true
		case "--write-folder":
			if index+1 >= len(arguments) {
				return flags, fmt.Errorf("%s needs a value", argument)
			}
			index++
			flags.WriteFolder = arguments[index]
			flags.ReadOnlyShell = true
		case "--follow":
			flags.Follow = true
		case "--keep-cutting":
			flags.KeepCutting = true
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
	if flags.Follow || flags.KeepCutting {
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
