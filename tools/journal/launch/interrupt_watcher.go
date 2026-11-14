package launch

import (
	"strings"
	"sync"
)

// interruptNotices are the words each program prints in its terminal when a person interrupts its turn: Claude Code, and
// Codex. They are read in lower case, whatever the colours around them.
var interruptNotices = []string{"request interrupted by user", "interrupted \u00b7 what should claude do instead", "conversation interrupted"}

// InterruptWatcher reads an agent's terminal output for the notice its program prints when its turn is interrupted, since
// neither program's hooks say so, and tells of each notice once.
type InterruptWatcher struct {
	mutex       sync.Mutex
	tail        string
	OnInterrupt func()
}

// Write looks for an interrupt notice in the output. What follows a notice found is kept, and the end of what does not,
// as long as a notice, so a notice split across two writes is seen and none is seen twice.
func (watcher *InterruptWatcher) Write(output []byte) (int, error) {
	watcher.mutex.Lock()
	text := strings.ToLower(watcher.tail + string(output))
	notified := 0
	for _, notice := range interruptNotices {
		for {
			index := strings.Index(text, notice)
			if index < 0 {
				break
			}
			notified++
			text = text[index+len(notice):]
		}
	}
	watcher.tail = text[max(0, len(text)-longestNotice()):]
	watcher.mutex.Unlock()
	for range notified {
		if watcher.OnInterrupt != nil {
			watcher.OnInterrupt()
		}
	}
	return len(output), nil
}

func longestNotice() int {
	longest := 0
	for _, notice := range interruptNotices {
		longest = max(longest, len(notice))
	}
	return longest
}
