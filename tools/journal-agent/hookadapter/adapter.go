// Package hookadapter answers a provider's native hook calls on a machine connected to a server journal: it asks
// the journal, and when it cannot it gives the provider's own blocking reply, never only a nonzero exit.
package hookadapter

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"slices"
	"time"
)

// Budget is the longest a hook call waits for the journal, retry included.
const Budget = 5 * time.Second

const (
	preparationPending = "preparation-pending: the journal has not prepared this context yet, so tools wait until " +
		"its context and state reach the driver."
	journalAway = "the journal could not be asked in time, so this call is refused."
)

// knownEvents are the native events the journal answers; any other is refused by name.
var knownEvents = []string{"SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop", "SessionEnd"}

// toolEvents are the events of a guarded tool call.
var toolEvents = []string{"PreToolUse", "PostToolUse"}

// ErrUnknownEvent is returned for a native event the journal does not answer.
var ErrUnknownEvent = errors.New("the journal answers no such hook event")

// Reply is what the provider reads back: the hook's standard output, standard error and exit code.
type Reply struct {
	Stdout   string `json:"stdout"`
	Stderr   string `json:"stderr"`
	ExitCode int    `json:"exitCode"`
}

// Adapter answers one hook call of one runtime.
type Adapter struct {
	// Ask sends the native call to the journal with the runtime's authority and answers the journal's reply.
	Ask func(ctx context.Context, native []byte) (Reply, error)
	// PreparationFile records the runtime's prepared context generation: opened by SessionStart, prepared by a
	// valid reply to it.
	PreparationFile string
}

// Answer gives the provider its reply to the native call: the journal's, or the native blocking reply when the
// journal is away, slow, malformed or the context is not prepared yet. A late success allows nothing.
func (adapter Adapter) Answer(native []byte) Reply {
	event, err := eventOf(native)
	if err != nil {
		return Reply{Stderr: err.Error() + "\n", ExitCode: 2}
	}
	if slices.Contains(toolEvents, event) && !adapter.isPrepared() {
		return refusal(event, preparationPending)
	}
	if event == "SessionStart" {
		_ = os.Remove(adapter.PreparationFile)
	}

	ctx, cancel := context.WithTimeout(context.Background(), Budget)
	defer cancel()
	reply, err := adapter.Ask(ctx, native)
	if err != nil && ctx.Err() == nil {
		reply, err = adapter.Ask(ctx, native)
	}
	if err != nil || ctx.Err() != nil {
		return refusal(event, journalAway)
	}

	if event == "SessionStart" {
		_ = os.WriteFile(adapter.PreparationFile, []byte("prepared\n"), 0o600)
	}

	return reply
}

func (adapter Adapter) isPrepared() bool {
	_, err := os.Stat(adapter.PreparationFile)

	return err == nil
}

// eventOf is the native call's event name, refused when it is not one the journal answers.
func eventOf(native []byte) (string, error) {
	var call struct {
		Event string `json:"hook_event_name"`
	}
	if err := json.Unmarshal(native, &call); err != nil {
		return "", err
	}
	if !slices.Contains(knownEvents, call.Event) {
		return "", errors.Join(ErrUnknownEvent, errors.New(call.Event))
	}

	return call.Event, nil
}

// refusal is the provider's own blocking reply to the event: a PreToolUse deny, a UserPromptSubmit block, else an
// empty answer that lets nothing through that a guarded call would need.
func refusal(event string, reason string) Reply {
	var body any
	switch event {
	case "PreToolUse":
		body = map[string]any{"hookSpecificOutput": map[string]string{
			"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": reason,
		}}
	case "UserPromptSubmit":
		body = map[string]string{"decision": "block", "reason": reason}
	default:
		body = map[string]string{}
	}
	content, _ := json.Marshal(body)

	return Reply{Stdout: string(content)}
}
