package terminal

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"
)

// BrowserInput is the composer held by a browser writer's grant: it stays theirs across prompts until the grant is
// released, cancelled, expires or a local key takes it back.
const BrowserInput Owner = "browser"

// GrantLifetime is how long a browser grant lasts after it was issued or last renewed.
const GrantLifetime = 30 * time.Second

// retiredTakeLimit is how many cancelled takes the gate remembers, so a late take of one never revives it.
const retiredTakeLimit = 64

var (
	// ErrGrantHeld refuses a take while another browser writer's grant is live.
	ErrGrantHeld = errors.New("another browser writer holds the input")
	// ErrTakeCancelled refuses a take whose request was cancelled before it arrived.
	ErrTakeCancelled = errors.New("this take was cancelled")
	// ErrGrantEnded refuses anything through a grant that expired, was released, cancelled or taken back locally.
	ErrGrantEnded = errors.New("this browser grant has ended")
)

// GrantScope is what a browser grant was issued for: the runtime's process generation and the attachment
// incarnation, so it never acts on a relaunched program.
type GrantScope struct {
	Generation uint64
	Attachment string
}

// BrowserGrant is one browser writer's hold on the input: its opaque id, the take that asked for it, its scope and
// when it expires unless renewed.
type BrowserGrant struct {
	ID        string
	TakeID    string
	Scope     GrantScope
	ExpiresAt time.Time
}

// GrantState is who holds the input as the screen report and the claim answers say it: the owner, the live grant's id
// when a browser holds it, a take still pending, and whether a local key or resize last took control back.
type GrantState struct {
	Owner          Owner
	GrantID        string
	PendingTake    string
	LocalControl   bool
	PromptRevision uint64
}

// browserGrants is the gate's record of browser writers; the gate's mutex guards it.
type browserGrants struct {
	grant          *BrowserGrant
	receipts       *grantReceipts
	pendingTake    string
	cancelledTakes []string
	localControl   bool
	// promptRevision rises each time the prompt turns protected or unknown; promptAllowed is how it was last seen.
	promptRevision uint64
	promptAllowed  bool
}

func (grants *browserGrants) isCancelled(takeID string) bool {
	for _, cancelled := range grants.cancelledTakes {
		if cancelled == takeID {
			return true
		}
	}

	return false
}

func (grants *browserGrants) rememberCancelled(takeID string) {
	grants.cancelledTakes = append(grants.cancelledTakes, takeID)
	if len(grants.cancelledTakes) > retiredTakeLimit {
		grants.cancelledTakes = grants.cancelledTakes[len(grants.cancelledTakes)-retiredTakeLimit:]
	}
}

// Take issues a browser grant for the take, which holds the input across prompts until it ends; a pending driver
// line is invalidated and never submitted. Taking again with the same take gives the same live grant; a take that
// was cancelled, or one while another writer's grant is live, is refused.
func (gate *InputGate) Take(takeID string, scope GrantScope) (BrowserGrant, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.expireGrant()
	if gate.browser.isCancelled(takeID) {
		return BrowserGrant{}, ErrTakeCancelled
	}
	if held := gate.browser.grant; held != nil {
		if held.TakeID == takeID {
			return *held, nil
		}

		return BrowserGrant{}, ErrGrantHeld
	}

	id, err := grantID()
	if err != nil {
		return BrowserGrant{}, err
	}
	receipts, err := newGrantReceipts()
	if err != nil {
		return BrowserGrant{}, err
	}
	gate.browser.receipts = receipts
	gate.invalidatePending()
	gate.browser.grant = &BrowserGrant{ID: id, TakeID: takeID, Scope: scope, ExpiresAt: gate.now().Add(GrantLifetime)}
	gate.browser.pendingTake, gate.browser.localControl = "", false
	gate.owner, gate.draftSince = BrowserInput, time.Time{}

	return *gate.browser.grant, nil
}

// Renew keeps exactly the named live grant for another lifetime.
func (gate *InputGate) Renew(grantID string) (BrowserGrant, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	held, err := gate.liveGrant(grantID)
	if err != nil {
		return BrowserGrant{}, err
	}
	held.ExpiresAt = gate.now().Add(GrantLifetime)

	return *held, nil
}

// Release ends exactly the named grant; an empty composer is free for the journal again, and text left in it is a
// draft the journal does not touch.
func (gate *InputGate) Release(grantID string) error {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if _, err := gate.liveGrant(grantID); err != nil {
		return err
	}
	gate.endGrant()

	return nil
}

// Cancel ends the take: a take still on its way is remembered, so it never issues a grant when it arrives, and a
// grant it already issued is released. A newer holder's grant is untouched.
func (gate *InputGate) Cancel(takeID string) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.browser.rememberCancelled(takeID)
	if gate.browser.pendingTake == takeID {
		gate.browser.pendingTake = ""
	}
	if held := gate.browser.grant; held != nil && held.TakeID == takeID {
		gate.endGrant()
	}
}

// GrantState is who holds the input now, with the live grant's id and a pending take.
func (gate *InputGate) GrantState() GrantState {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.expireGrant()
	state := GrantState{
		Owner:          gate.owner,
		PendingTake:    gate.browser.pendingTake,
		LocalControl:   gate.browser.localControl,
		PromptRevision: gate.browser.promptRevision,
	}
	if held := gate.browser.grant; held != nil {
		state.GrantID = held.ID
	}

	return state
}

// LocalResized takes the input back from a browser writer for a local resize or a new local attach, before the
// resize reaches the program.
func (gate *InputGate) LocalResized() {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.preemptForLocal()
}

// preemptForLocal retires a browser grant because the local user acted; the caller holds the mutex.
func (gate *InputGate) preemptForLocal() {
	if gate.browser.grant == nil {
		return
	}
	gate.endGrant()
	gate.browser.localControl = true
}

// liveGrant is the named grant while it is live; the caller holds the mutex.
func (gate *InputGate) liveGrant(grantID string) (*BrowserGrant, error) {
	gate.expireGrant()
	held := gate.browser.grant
	if held == nil || held.ID != grantID {
		return nil, ErrGrantEnded
	}

	return held, nil
}

// expireGrant ends a grant whose lifetime ran out; the caller holds the mutex.
func (gate *InputGate) expireGrant() {
	if held := gate.browser.grant; held != nil && !gate.now().Before(held.ExpiresAt) {
		gate.endGrant()
	}
}

// endGrant drops the grant and gives the composer back: free when empty, a draft when text was left; the caller
// holds the mutex.
func (gate *InputGate) endGrant() {
	gate.browser.grant, gate.browser.receipts = nil, nil
	if gate.owner != BrowserInput {
		return
	}
	if gate.composerText() == "" {
		gate.owner, gate.draftSince = NobodyOwns, time.Time{}

		return
	}
	gate.owner, gate.draftSince = UserInput, gate.now()
}

// invalidatePending drops a pending driver line so it is never submitted; the caller holds the mutex.
func (gate *InputGate) invalidatePending() {
	if gate.pending == nil {
		return
	}
	gate.pending.invalidated = true
	gate.pending = nil
}

// grantID is a new opaque grant id.
func grantID() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return hex.EncodeToString(random), nil
}
