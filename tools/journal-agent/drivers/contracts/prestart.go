package contracts

import "context"

// Capability is one operation a driver reports its support for, as the journal's DriverCapability enum names it.
type Capability string

const (
	CapabilityRun          Capability = "run"
	CapabilityWatch        Capability = "watch"
	CapabilityType         Capability = "type"
	CapabilityPaste        Capability = "paste"
	CapabilityResize       Capability = "resize"
	CapabilityPrivateEntry Capability = "private-entry"
	CapabilityKeyScripts   Capability = "key-scripts"
	CapabilityInterrupt    Capability = "interrupt"
	CapabilityTurnModel    Capability = "turn-model"
	CapabilityTurnEffort   Capability = "turn-effort"
	CapabilityAttachments  Capability = "attachments"
	CapabilityHookMethods  Capability = "hook-methods"
	CapabilitySignIn       Capability = "sign-in"
	CapabilityExactResume  Capability = "exact-resume"
)

// SupportState says whether a driver can do an operation now.
type SupportState string

const (
	SupportAllowed                SupportState = "allowed"
	SupportTemporarilyUnavailable SupportState = "temporarily-unavailable"
	SupportUnsupported            SupportState = "unsupported"
)

// Support is one operation's state, with the reason the user reads when it is not allowed.
type Support struct {
	State  SupportState
	Reason string
}

// SupportSnapshot is what a driver can do on one bound host; an operation it names nothing for is unsupported.
type SupportSnapshot map[Capability]Support

// BoundTarget is the host a driver's support is asked for.
type BoundTarget struct{ HostID string }

// Descriptor is what a registered driver is: its opaque key, the family and mode it is chosen by, and its label.
type Descriptor struct {
	Key    string
	Family string
	Mode   string
	Label  string
}

// BindingIdentity names the running generation of one binding that every operation is fenced by.
type BindingIdentity struct {
	BindingID  string
	Generation uint64
}

// EventCursor is where a reader of a running driver's events goes on from: the last sequence it saw.
type EventCursor struct{ Sequence uint64 }

// RuntimeEvent is one generation-bound event a running driver reports: readiness, request progress, a script step,
// a turn's end or the runtime's exit, each with its request, turn and monotonic sequence.
type RuntimeEvent struct {
	Binding  BindingIdentity
	Sequence uint64
	Kind     string
	Request  RequestIdentity
	Turn     int
}

// NavigationRequest is one typed round of a menu navigation.
type NavigationRequest struct {
	Request RequestIdentity
	Round   []byte
}

// AccountRequest is a step of an account action: status, begin, finish, poll or cancel.
type AccountRequest struct {
	Request RequestIdentity
	Action  string
}

// StartRequest is an authorized start or resume of one binding, carried from the journal's grant.
type StartRequest struct {
	Request RequestIdentity
	Binding BindingIdentity
}

// Driver is a registered driver before it runs: what it is, what it can do on a host, its account actions, and its
// start and resume, which hand back the running implementation to the serving loop.
type Driver interface {
	Descriptor() Descriptor
	Capabilities(ctx context.Context, target BoundTarget) (SupportSnapshot, error)
	Account(ctx context.Context, request AccountRequest) (OperationResult, error)
	Start(ctx context.Context, request StartRequest) (RunningDriver, error)
	Resume(ctx context.Context, request StartRequest) (RunningDriver, error)
}

// RunningDriver is one running binding: the lifecycle every driver offers, plus its binding, its current support,
// its event stream and the optional operations, each of which answers a typed unsupported result when it cannot.
type RunningDriver interface {
	AgentDriver
	Binding() BindingIdentity
	Capabilities(ctx context.Context, target BoundTarget) (SupportSnapshot, error)
	Observe(ctx context.Context, cursor EventCursor) (<-chan RuntimeEvent, error)
	RunKeyScript(ctx context.Context, request KeyScriptRequest) (OperationResult, error)
	Navigate(ctx context.Context, request NavigationRequest) (OperationResult, error)
}

// Unsupported is the typed answer of an optional operation a driver does not do: unavailable, and no process made.
func Unsupported(request RequestIdentity) OperationResult {
	return OperationResult{
		Request:          request,
		Progress:         ProgressUnavailable,
		Outcome:          OutcomeRefused,
		NoProcessCreated: true,
	}
}

// SupportOf answers an operation's support, unsupported when the snapshot names nothing for it.
func (snapshot SupportSnapshot) SupportOf(capability Capability) Support {
	support, found := snapshot[capability]
	if !found {
		return Support{State: SupportUnsupported, Reason: "the driver does not report this operation"}
	}

	return support
}
