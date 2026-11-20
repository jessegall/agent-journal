// Package contracts holds the one interface every agent driver implements: the six operations the journal asks of a
// running program, each carrying the identity of the request and attempt it answers.
package contracts

import (
	"context"

	"journal-agent/keyscripts"
)

// RequestIdentity names the accepted request and the attempt a driver works on, so a late result of an older attempt
// can never overwrite a newer one.
type RequestIdentity struct {
	RuntimeID string
	RequestID string
	Sequence  int
	Attempt   int
}

// Delivery is content to hand the program as a new prompt.
type Delivery struct {
	Request RequestIdentity
	Message string
}

// WakeRequest asks an idle program to look for waiting work.
type WakeRequest struct{ Request RequestIdentity }

// ModelChange asks the program to use another model.
type ModelChange struct {
	Request RequestIdentity
	Model   string
}

// EffortChange asks the program to use another reasoning effort.
type EffortChange struct {
	Request RequestIdentity
	Effort  string
}

// InterruptRequest asks the program to stop the turn it was bound to when the host accepted it; Turn is zero when no
// turn was admitted then, so the interrupt can never reach a later turn.
type InterruptRequest struct {
	Request RequestIdentity
	Turn    int
}

// StopRequest asks the program to end.
type StopRequest struct{ Request RequestIdentity }

// KeyScriptRequest asks the program to run one registered maintenance key script with its parameters, from its
// first step, or from the step a stopped attempt reached when ResumeStep is set.
type KeyScriptRequest struct {
	Request    RequestIdentity
	Script     string
	Parameters map[string]string
	ResumeStep *int
}

// KeyScriptRunner runs registered key scripts; a driver with no terminal answers with OutcomeTerminalRequired.
type KeyScriptRunner interface {
	RunKeyScript(ctx context.Context, request KeyScriptRequest) (OperationResult, error)
}

// Progress is how far a request got, in the journal's words (doc 40, section 21).
type Progress string

const (
	ProgressStaged            Progress = "staged"
	ProgressApplying          Progress = "applying"
	ProgressApplied           Progress = "applied"
	ProgressDeliveryUncertain Progress = "delivery_uncertain"
	ProgressFailed            Progress = "failed"
	ProgressUnavailable       Progress = "unavailable"
)

// Outcome is how an applied or failed request ended.
type Outcome string

const (
	OutcomeConfirmed Outcome = "confirmed"
	OutcomeRefused   Outcome = "refused"
	OutcomeTimedOut  Outcome = "timed_out"
	// OutcomeTerminalRequired answers a key script sent to a runtime that has no terminal to type it into.
	OutcomeTerminalRequired Outcome = "terminal_required"
	// OutcomeAlreadyIdle answers an interrupt whose turn had ended: nothing is interrupted and the hold stays.
	OutcomeAlreadyIdle Outcome = "already_idle"
	// OutcomeStopUnconfirmed answers a stop whose signals were sent but whose exit could not be proven.
	OutcomeStopUnconfirmed Outcome = "stop_unconfirmed"
	// OutcomeUnconfirmed answers a key script that ran to its end while nothing on screen showed the change.
	OutcomeUnconfirmed Outcome = "unconfirmed"
	// OutcomeScriptFailed answers a key script whose step did not see its screen in time.
	OutcomeScriptFailed Outcome = "script_failed"
	// OutcomeEntryUnavailable answers a key script whose wanted menu entry was not on screen once by its label.
	OutcomeEntryUnavailable Outcome = "entry_unavailable"
)

// Hold is why a runtime waits on something other than the journal.
type Hold string

const (
	HoldNone           Hold = "none"
	HoldInterrupted    Hold = "interrupted"
	HoldNeedsAttention Hold = "needs_attention"
	// HoldNavigationNeeded is a key script stopped on a menu it could not be certain of, for the main agent.
	HoldNavigationNeeded Hold = "navigation_needed"
)

// OperationResult is what a driver reports for one attempt: its progress, the binding it actually used, how it ended
// and why the runtime is held, if it is.
type OperationResult struct {
	Request       RequestIdentity
	Progress      Progress
	ActualBinding string
	Outcome       Outcome
	Hold          Hold
	// Script is where a key script run stopped, for the loop to report; nil for every other operation and for a
	// driver that could not run the script at all.
	Script *keyscripts.Result
}

// IsHeld is whether the driver holds the program after the operation, waiting on the user or a menu.
func (result OperationResult) IsHeld() bool {
	return result.Hold != "" && result.Hold != HoldNone
}

// AgentDriver carries out the six operations on one running program. Starting a program is the driver factory's job,
// never a seventh operation.
type AgentDriver interface {
	Deliver(ctx context.Context, delivery Delivery) (OperationResult, error)
	Wake(ctx context.Context, wake WakeRequest) (OperationResult, error)
	ChangeModel(ctx context.Context, change ModelChange) (OperationResult, error)
	ChangeEffort(ctx context.Context, change EffortChange) (OperationResult, error)
	Interrupt(ctx context.Context, interrupt InterruptRequest) (OperationResult, error)
	Stop(ctx context.Context, stop StopRequest) (OperationResult, error)
}
