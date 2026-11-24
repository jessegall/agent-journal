package terminal

import (
	"errors"
	"io"
	"strings"
	"time"
)

// takeSettleWait is how long a take waits for a pending driver submission to complete, and then for the cleared
// composer to show empty, before it gives up.
var takeSettleWait = 2 * time.Second

// takeSettlePoll is how often a take looks at the gate and the screen while it waits.
var takeSettlePoll = 10 * time.Millisecond

var (
	// ErrTakeUncertain refuses a take whose driver line could not be settled: partly written, changed, or not shown.
	// The hold stays, nothing is replayed, and the writer may check the screen or stop the agent.
	ErrTakeUncertain = errors.New("the driver's unfinished line could not be settled; check the screen")
)

// TakeAfterSettling takes the input for a browser writer, first settling a driver line still on its way: it waits
// up to two seconds for the driver's submission to complete; at that boundary it cancels the line's Enter under the
// gate lock, and when the composer shows exactly the line's unsent text it clears it with the profile's clear keys
// and waits for an empty composer before the grant is issued. A line it cannot account for leaves the take
// uncertain. The take never sends Enter.
func (gate *InputGate) TakeAfterSettling(takeID string, scope GrantScope, clearKeys string) (BrowserGrant, error) {
	if gate.waitFor(func() bool { return gate.pending == nil }) {
		return gate.Take(takeID, scope)
	}

	line, err := gate.strandLine(takeID, clearKeys)
	if err != nil {
		return BrowserGrant{}, err
	}
	if line == nil {
		return gate.Take(takeID, scope)
	}
	if !gate.waitFor(func() bool { return gate.composerText() == "" }) {
		gate.concludeSettlement(line, false)

		return BrowserGrant{}, ErrTakeUncertain
	}
	gate.concludeSettlement(line, true)

	return gate.Take(takeID, scope)
}

// AwaitSettlement waits for a browser take to settle a stranded driver line and says whether it was cleared before any
// Enter; a settlement that never ends within the wait counts as uncertain.
func (gate *InputGate) AwaitSettlement(line *TypedLine, wait time.Duration) bool {
	select {
	case <-line.settled:
	case <-time.After(wait):
		return false
	}

	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	return line.cancelled
}

// concludeSettlement records how the stranded line ended and frees an empty composer for the grant.
func (gate *InputGate) concludeSettlement(line *TypedLine, cleared bool) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	line.cancelled = cleared
	close(line.settled)
	gate.browser.pendingTake = ""
	if cleared {
		gate.pending, gate.owner = nil, NobodyOwns
	}
}

// strandLine cancels the pending line's Enter and, when the composer shows exactly its unsent text, writes the
// clear keys; the take is pending meanwhile and the composer stays the driver's. A line it cannot account for ends
// its settlement as uncertain at once and keeps the hold; a line that was submitted meanwhile leaves nothing to settle.
func (gate *InputGate) strandLine(takeID, clearKeys string) (*TypedLine, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	line := gate.pending
	if line == nil {
		return nil, nil
	}
	line.stranded = true
	gate.browser.pendingTake = takeID

	if strings.TrimSpace(gate.composerText()) != strings.TrimSpace(line.Text) || clearKeys == "" {
		gate.browser.pendingTake = ""
		close(line.settled)

		return nil, ErrTakeUncertain
	}
	if _, err := io.WriteString(gate.program, clearKeys); err != nil {
		gate.browser.pendingTake = ""
		close(line.settled)

		return nil, ErrTakeUncertain
	}

	return line, nil
}

// waitFor looks at the condition under the gate lock until it holds or the settle wait passes.
func (gate *InputGate) waitFor(condition func() bool) bool {
	deadline := time.Now().Add(takeSettleWait)
	for {
		gate.mutex.Lock()
		held := condition()
		gate.mutex.Unlock()
		if held {
			return true
		}
		if !time.Now().Before(deadline) {
			return false
		}
		time.Sleep(takeSettlePoll)
	}
}
