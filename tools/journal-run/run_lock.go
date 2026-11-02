package main

import (
	"fmt"
	"path/filepath"
)

// RunLockMark is the file a change of the journal's code keeps in the home while it waits for the running runs to end.
const RunLockMark = "run-lock"

// RunLockLimitSeconds is how long a new run waits on the mark at most, so a change that died leaves no run waiting.
const RunLockLimitSeconds = 600

// LockWait is the start of a run's script: it names the run, so a change of the code started by this run does not wait
// on itself, and waits while the mark is there before the first part starts.
func LockWait(home string, process int) string {
	mark := quoted(filepath.Join(home, RunLockMark))
	return fmt.Sprintf("export JOURNAL_PROCESS=%d\n__journal_waited=0\nwhile [ -e %s ] && [ \"$__journal_waited\" -lt %d ]; do sleep 1; __journal_waited=$((__journal_waited+1)); done\n", process, mark, RunLockLimitSeconds)
}
