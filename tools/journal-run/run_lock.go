package main

import (
	"fmt"
	"path/filepath"
	"slices"
	"strings"
)

// RunLockMark is the file a change of the journal's code keeps in the home while it waits for the running runs to end.
const RunLockMark = "run-lock"

// RunLockLimitSeconds is how long a new run waits on the mark at most, so a change that died leaves no run waiting.
const RunLockLimitSeconds = 600

// LockWait is the start of a run's script: it names the run, so a change of the code started by this run does not wait
// on itself, and waits while the mark is there before the first part starts. A line of journal commands does not
// wait: the agent needs them to go on working, and they end at once.
func LockWait(home string, process int, parts []Part, aliases []string) string {
	named := fmt.Sprintf("export JOURNAL_PROCESS=%d\n", process)
	if isJournalLine(parts, aliases) {
		return named
	}
	mark := quoted(filepath.Join(home, RunLockMark))
	return named + fmt.Sprintf("__journal_waited=0\nwhile [ -e %s ] && [ \"$__journal_waited\" -lt %d ]; do sleep 1; __journal_waited=$((__journal_waited+1)); done\n", mark, RunLockLimitSeconds)
}

// isJournalLine says every part is a journal command; an alias is the command under it, so it waits like any other.
func isJournalLine(parts []Part, aliases []string) bool {
	for _, part := range parts {
		words := strings.Fields(part.Text)
		if len(words) == 0 || words[0] != "journal" || (len(words) > 1 && slices.Contains(aliases, words[1])) {
			return false
		}
	}
	return true
}
