package main

import (
	"fmt"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
)

// RunLockMark is the file a change of the journal's code keeps in the home while it waits for the running runs to end.
const RunLockMark = "run-lock"

// RunLockLimitSeconds is how long a new run waits on the mark at most, so a change that died leaves no run waiting.
const RunLockLimitSeconds = 600

// LockWait is the start of a run's script: it names the run, so a change of the code started by this run does not wait
// on itself, and waits while the mark is there before the first part starts. A line of journal commands, or one that
// only reads, does not wait: the agent needs them to go on working, and they touch none of the code being changed.
func LockWait(home string, process int, parts []Part, aliases []string, onlyReads bool) string {
	processExport := fmt.Sprintf("export JOURNAL_PROCESS=%d\n", process)
	if onlyReads || isJournalLine(parts, aliases) {
		return processExport
	}
	mark := quoted(filepath.Join(home, RunLockMark))
	return processExport + fmt.Sprintf("__journal_waited=0\nwhile [ -e %s ] && [ \"$__journal_waited\" -lt %d ]; do sleep 1; __journal_waited=$((__journal_waited+1)); done\n", mark, RunLockLimitSeconds)
}

// SlotWaitLimitSeconds is how long a queued run waits for its spot at most, so a queue that died leaves no run waiting.
const SlotWaitLimitSeconds = 1800

// SlotWait holds a queued run until the journal has written its spot into its folder.
func SlotWait(home string, process int, queued bool, limits ...int) string {
	if !queued {
		return ""
	}
	limitSeconds := SlotWaitLimitSeconds
	if len(limits) > 0 && limits[0] > 0 {
		limitSeconds = limits[0]
	}
	folder := filepath.Join(home, "processes", strconv.Itoa(process))
	mark := quoted(filepath.Join(folder, "slot"))
	return fmt.Sprintf(`__journal_slot=0
while [ ! -e %s ] && [ "$__journal_slot" -lt %d ] && [ -d %s ]; do
    sleep 1
    __journal_slot=$((__journal_slot + 1))
done
if [ ! -d %s ]; then
    printf 'queue folder is missing: no command was started\n' >&2
    exit 125
fi
if [ ! -e %s ]; then
    printf 'queue slot wait expired: no command was started\n' >&2
    exit 124
fi
`, mark, limitSeconds, quoted(folder), quoted(folder), mark)
}

// isJournalLine says every part is a journal command; an alias is the command under it, so it waits like any other.
func isJournalLine(parts []Part, aliases []string) bool {
	for _, part := range parts {
		arguments := strings.Fields(part.Text)
		if len(arguments) == 0 || arguments[0] != "journal" || (len(arguments) > 1 && slices.Contains(aliases, arguments[1])) {
			return false
		}
	}
	return true
}

const CountLimitSeconds = 120

// CountWait runs a test listing before the run waits for its queue slot.
func CountWait(folder string, line string, values ...ListingOptions) string {
	if line == "" {
		return ""
	}
	options := listingOptions(values)
	counted := quoted(filepath.Join(folder, "counted"))
	return fmt.Sprintf("if ! %s --count-listing %s %s %d %d %s; then printf '125' > %s || :; fi\n",
		quoted(options.Program), quoted(folder), quoted(options.Shell), options.LimitSeconds, options.KillGraceMilliseconds, quoted(line), counted)
}

// ProgressCount runs a listing after a short delay without holding the test run.
func ProgressCount(folder string, line string, position int, pattern string, values ...ListingOptions) string {
	if line == "" {
		return ""
	}
	options := listingOptions(values)
	progress := filepath.Join(folder, "progress-count")
	return fmt.Sprintf("( sleep 3; if [ ! -e %s ] && [ ! -e %s ] && [ ! -e %s ] && [ ! -e %s ] && ! %s --has-progress-count %s %s && [ ! -e %s ] && [ ! -e %s ] && [ ! -e %s ] && mkdir %s; then %s --count-listing %s %s %d %d %s; fi ) </dev/null >/dev/null 2>&1 &\n",
		quoted(filepath.Join(folder, "count-known")), quoted(filepath.Join(folder, "counted")), quoted(filepath.Join(folder, "end")), quoted(filepath.Join(folder, fmt.Sprintf("%d.status", position))), quoted(options.Program), quoted(filepath.Join(folder, fmt.Sprintf("%d.out", position))), quoted(pattern), quoted(filepath.Join(folder, "count-known")), quoted(filepath.Join(folder, "end")), quoted(filepath.Join(folder, fmt.Sprintf("%d.status", position))), quoted(progress),
		quoted(options.Program), quoted(progress), quoted(options.Shell), options.LimitSeconds, options.KillGraceMilliseconds, quoted(line))
}
