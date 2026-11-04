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
	named := fmt.Sprintf("export JOURNAL_PROCESS=%d\n", process)
	if onlyReads || isJournalLine(parts, aliases) {
		return named
	}
	mark := quoted(filepath.Join(home, RunLockMark))
	return named + fmt.Sprintf("__journal_waited=0\nwhile [ -e %s ] && [ \"$__journal_waited\" -lt %d ]; do sleep 1; __journal_waited=$((__journal_waited+1)); done\n", mark, RunLockLimitSeconds)
}

// isJournalLine says every part is a journal command; an alias is the command under it, so it waits like any other.
// SlotWaitLimitSeconds is how long a queued run waits for its spot at most, so a queue that died leaves no run waiting.
const SlotWaitLimitSeconds = 1800

// SlotWait holds a queued run until the journal has written its spot into its folder.
func SlotWait(home string, process int, queued bool) string {
	if !queued {
		return ""
	}
	mark := quoted(filepath.Join(home, "processes", strconv.Itoa(process), "slot"))
	return fmt.Sprintf("__journal_slot=0\nwhile [ ! -e %s ] && [ \"$__journal_slot\" -lt %d ]; do sleep 1; __journal_slot=$((__journal_slot + 1)); done\n", mark, SlotWaitLimitSeconds)
}

func SlotWaits(options Options, parts []Part) map[int]string {
	positions := options.QueuePositions
	if len(positions) == 0 && (options.Queue || options.Count != "") {
		positions = []int{1}
	}
	waits := map[int]string{}
	countLine := options.Count
	folder := NewFolder(options.Home, options.Process)
	for index, part := range parts {
		for _, position := range positions {
			if position < part.Position || (index+1 < len(parts) && position >= parts[index+1].Position) {
				continue
			}
			marker := ""
			if options.Queue {
				marker = fmt.Sprintf(": > %s\n", quoted(filepath.Join(folder.Path, "slot-wait")))
			}
			waits[part.Position] = marker + CountWait(folder.Path, countLine) + SlotWait(options.Home, options.Process, options.Queue)
			countLine = ""
			break
		}
	}
	return waits
}

func isJournalLine(parts []Part, aliases []string) bool {
	for _, part := range parts {
		words := strings.Fields(part.Text)
		if len(words) == 0 || words[0] != "journal" || (len(words) > 1 && slices.Contains(aliases, words[1])) {
			return false
		}
	}
	return true
}

const CountLimitSeconds = 120

// CountWait runs a test listing before the run waits for its queue slot.
func CountWait(folder string, line string) string {
	if line == "" {
		return ""
	}
	output := quoted(filepath.Join(folder, "count.out"))
	counted := quoted(filepath.Join(folder, "counted"))
	return fmt.Sprintf(`( %s ) > %s 2>&1 &
__journal_count=$!
__journal_count_waited=0
while kill -0 "$__journal_count" 2>/dev/null && [ "$__journal_count_waited" -lt %d ]; do
    sleep 1
    __journal_count_waited=$((__journal_count_waited + 1))
done
if kill -0 "$__journal_count" 2>/dev/null; then
    kill "$__journal_count" 2>/dev/null || :
fi
if wait "$__journal_count"; then __journal_count_status=0; else __journal_count_status=$?; fi
printf '%%s' "$__journal_count_status" > %s
`, line, output, CountLimitSeconds, counted)
}
