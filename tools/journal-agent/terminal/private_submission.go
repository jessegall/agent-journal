package terminal

import "io"

// PrivateOperation is a browser writer's private value on its way into the program: its grant, the sequence and
// prompt revision it was sent at, its single-use submission id and the value itself, which is written once and
// kept nowhere.
type PrivateOperation struct {
	GrantID      string
	Sequence     uint64
	SubmissionID string
	Value        string
}

// WritePrivate writes a private value and Enter once under the gate lock. Its submission id is single-use: a repeat
// answers the first outcome without comparing anything and writes nothing, and only the outcome is kept, never the
// value, its length or a digest of it. A grant that ended, a sequence that is not the next one or a missing value
// writes nothing.
func (gate *InputGate) WritePrivate(operation PrivateOperation) BrowserReceipt {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if outcome, consumed := gate.privateOutcomes[operation.SubmissionID]; consumed {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: outcome}
	}
	gate.expireGrant()
	held := gate.browser.grant
	if held == nil || held.ID != operation.GrantID {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Expired}
	}
	receipts := gate.browser.receipts
	if operation.Sequence != receipts.highWater+1 || operation.Value == "" {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Gap, Expected: receipts.highWater + 1}
	}

	outcome := Applied
	written, err := io.WriteString(gate.program, operation.Value+enterKey)
	if err != nil || written != len(operation.Value)+len(enterKey) {
		outcome = Uncertain
		receipts.uncertain = true
	}
	gate.privateOutcomes[operation.SubmissionID] = outcome
	receipts.highWater = operation.Sequence

	return BrowserReceipt{Sequence: operation.Sequence, Outcome: outcome}
}
