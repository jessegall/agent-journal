// Package contracts holds the one interface every agent driver implements: the six operations the journal asks of a
// running agent, each carrying the identity of the request and attempt it answers.
package contracts

import (
	"context"
	"errors"

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

// Delivery is content to hand the agent as a new prompt: its parts in the order they were sent.
type Delivery struct {
	Request RequestIdentity
	Parts   []MessagePart
}

// WakeRequest asks an idle agent to look for waiting work.
type WakeRequest struct {
	Request RequestIdentity
	// Prompt is the whole text the journal asks the wake to present, such as a batch of chat messages or the
	// pending-work prompt; the host sends it as it is and never makes one up.
	Prompt string
}

// ModelChange asks the agent to use another model.
type ModelChange struct {
	Request RequestIdentity
	Model   string
}

// EffortChange asks the agent to use another reasoning effort.
type EffortChange struct {
	Request RequestIdentity
	Effort  string
}

// InterruptRequest asks the agent to stop the turn it was bound to when the host accepted it; Turn is zero when no
// turn was admitted then, so the interrupt can never reach a later turn.
type InterruptRequest struct {
	Request RequestIdentity
	Turn    int
}

// StopRequest asks the agent to end.
type StopRequest struct{ Request RequestIdentity }

// KeyScriptRequest asks the agent to run one registered maintenance key script with its parameters, from its
// first step, or from the step a stopped attempt reached when ResumeStep is set.
type KeyScriptRequest struct {
	Request RequestIdentity
	Script  string
	// Version is the reviewed script version the journal validated the parameters against; the host refuses to run
	// another one.
	Version    int
	Parameters map[string]string
	ResumeStep *int
}

// BrowserControl is one browser writer's operation the journal relays to the program's input gate: the operation,
// the take and grant it names, whether a take renews its grant, the process generation it was meant for, and for an
// input its sequence, the prompt revision the writer saw, its kind (text, key or paste), the text, Enter, the named
// key and a draft choice.
type BrowserControl struct {
	Request        RequestIdentity
	Operation      string
	TakeID         string
	GrantID        string
	Renew          bool
	Generation     uint64
	Sequence       uint64
	PromptRevision uint64
	Text           string
	Enter          bool
	Choice         string
	InputType      string
	Key            string
	Rows           int
	Columns        int
	SubmissionID   string
	// Value is a private submission's value: written once, never logged or kept.
	Value string
}

// BrowserControlled carries out browser writers' operations; a driver without a terminal does not.
type BrowserControlled interface {
	ControlFromBrowser(ctx context.Context, control BrowserControl) (OperationResult, error)
}

// Recorded keeps an operator's recording of the program's screen output, started and stopped on request; a driver
// without a terminal does not.
type Recorded interface {
	StartRecording(ctx context.Context, request RequestIdentity) (OperationResult, error)
	StopRecording(ctx context.Context, request RequestIdentity) (OperationResult, error)
}

// Bootstrapper proves a start's conversation without a turn: it binds the program's own conversation, sends no text,
// and answers the binding it holds. A driver without it proves its conversation with its first turn.
type Bootstrapper interface {
	Bootstrap(ctx context.Context, request RequestIdentity) (OperationResult, error)
}

// KeyScriptRunner runs registered key scripts; a driver with no terminal answers with OutcomeTerminalRequired.
type KeyScriptRunner interface {
	RunKeyScript(ctx context.Context, request KeyScriptRequest) (OperationResult, error)
}

// Progress is how far a request got, in the journal's words.
type Progress string

const (
	ProgressStaged            Progress = "staged"
	ProgressApplying          Progress = "applying"
	ProgressApplied           Progress = "applied"
	ProgressDeliveryUncertain Progress = "delivery_uncertain"
	ProgressFailed            Progress = "failed"
	ProgressUnavailable       Progress = "unavailable"
	// ProgressCancelled is a request a browser take settled before it was submitted: nothing of it reached the program.
	ProgressCancelled Progress = "cancelled"
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
	HoldNeedsAttention Hold = "needs_attention"
	// HoldNavigationNeeded is a key script stopped on a menu it could not be certain of, for the main agent.
	HoldNavigationNeeded Hold = "navigation_needed"
)

// RefusalReason is why the host refused an operation, from the closed set the journal mirrors in
// App\Agents\Enums\HostWakeRefusal; any other failure carries none and stays a generic refusal.
type RefusalReason string

const (
	RefusalContainerUnavailable           RefusalReason = "container-unavailable"
	RefusalImageUnverified                RefusalReason = "image-unverified"
	RefusalCapacityUnavailable            RefusalReason = "capacity-unavailable"
	RefusalProtectedAccountFolderRejected RefusalReason = "protected-account-folder-rejected"
	// RefusalPinnedBuildMissing: the host does not run the build the runtime was pinned to, so it never starts the
	// runtime on another build.
	RefusalPinnedBuildMissing RefusalReason = "pinned-build-missing"
	// RefusalNoObservation answers Check status when the host keeps no ready report of the runtime's start.
	RefusalNoObservation RefusalReason = "no_observation"
)

// StartRefused is the failure of an operation the host refused for an allowlisted reason before it created any process
// of the agent; only code that knows the agent was never started returns it.
type StartRefused struct {
	Reason RefusalReason
	Cause  error
}

func (refused StartRefused) Error() string {
	return string(refused.Reason) + ": " + refused.Cause.Error()
}

func (refused StartRefused) Unwrap() error {
	return refused.Cause
}

// RefuseStart names why the agent was never started, so the report carries the reason and that no process exists.
func RefuseStart(reason RefusalReason, cause error) error {
	return StartRefused{Reason: reason, Cause: cause}
}

// StartRefusalOf is the allowlisted refusal an error carries, if it carries one.
func StartRefusalOf(err error) (StartRefused, bool) {
	var refused StartRefused
	found := errors.As(err, &refused)

	return refused, found
}

// OperationResult is what a driver reports for one attempt: its progress, the binding it actually used, how it ended
// and why the runtime is held, if it is. A refusal for an allowlisted reason names it, and NoProcessCreated is true
// only when the driver knows the agent was never started.
type OperationResult struct {
	Request          RequestIdentity
	Progress         Progress
	ActualBinding    string
	Outcome          Outcome
	Hold             Hold
	RefusalReason    RefusalReason
	NoProcessCreated bool
	// Script is where a key script run stopped, for the loop to report; nil for every other operation and for a
	// driver that could not run the script at all.
	Script *keyscripts.Result
	// TurnEnd is what the host saw when a turn ended, for the journal to judge; nil for every other report.
	TurnEnd *TurnEnd
}

// IsHeld is whether the driver holds the agent after the operation, waiting on the user or a menu.
func (result OperationResult) IsHeld() bool {
	return result.Hold != "" && result.Hold != HoldNone
}

// AgentDriver carries out the six operations on one running agent. Starting a agent is the driver factory's job,
// never a seventh operation.
type AgentDriver interface {
	Deliver(ctx context.Context, delivery Delivery) (OperationResult, error)
	Wake(ctx context.Context, wake WakeRequest) (OperationResult, error)
	ChangeModel(ctx context.Context, change ModelChange) (OperationResult, error)
	ChangeEffort(ctx context.Context, change EffortChange) (OperationResult, error)
	Interrupt(ctx context.Context, interrupt InterruptRequest) (OperationResult, error)
	Stop(ctx context.Context, stop StopRequest) (OperationResult, error)
}
