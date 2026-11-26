// Package hookadapter answers a provider's native hook calls: it asks the journal, and when the journal cannot answer
// in its budget it answers from the start's sealed reply file, which the journal wrote in the provider's own shape.
package hookadapter

import (
	"context"
	"encoding/json"
	"os"
	"slices"
)

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
	// RepliesFile is the start's sealed reply file, with its key file beside it.
	RepliesFile string
	// PreparationFile records the runtime's prepared context generation: opened by SessionStart, prepared by a
	// valid reply to it.
	PreparationFile string
}

// Answer gives the provider its reply to the native call: the journal's, or the file's when the journal is away,
// slow or the context is not prepared yet. A reply file that is missing or tampered with refuses every call.
func (adapter Adapter) Answer(native []byte) Reply {
	replies, err := LoadReplies(adapter.RepliesFile)
	if err != nil {
		return Reply{Stderr: err.Error() + "\n", ExitCode: 2}
	}
	call := callOf(native)
	if !slices.Contains(replies.Events, call.Event) {
		return replies.UnknownEvent
	}
	if call.Event == "PreToolUse" && slices.Contains(replies.SpawnTools, call.Tool) {
		return replies.answer(reasonSpawn, call.Event)
	}
	if slices.Contains(replies.ToolEvents, call.Event) && !adapter.isPrepared() {
		return replies.answer(reasonUnprepared, call.Event)
	}
	if call.Event == "SessionStart" {
		_ = os.Remove(adapter.PreparationFile)
	}

	reply, err := adapter.askWithin(native, replies)
	if err != nil {
		return replies.answer(reasonAway, call.Event)
	}
	if call.Event == "SessionStart" {
		_ = os.WriteFile(adapter.PreparationFile, []byte("prepared\n"), 0o600)
	}

	return reply
}

// askWithin asks the journal, again up to the file's retries, all within its budget; a late answer allows nothing.
func (adapter Adapter) askWithin(native []byte, replies Replies) (Reply, error) {
	ctx, cancel := context.WithTimeout(context.Background(), replies.budget())
	defer cancel()
	reply, err := adapter.Ask(ctx, native)
	for retry := 0; err != nil && ctx.Err() == nil && retry < replies.Retries; retry++ {
		reply, err = adapter.Ask(ctx, native)
	}
	if err == nil && ctx.Err() != nil {
		err = ctx.Err()
	}

	return reply, err
}

func (adapter Adapter) isPrepared() bool {
	_, err := os.Stat(adapter.PreparationFile)

	return err == nil
}

// nativeCall is the part of a native call the adapter reads: its event and, for a tool call, its tool.
type nativeCall struct {
	Event string `json:"hook_event_name"`
	Tool  string `json:"tool_name"`
}

// callOf reads the native call; a call that is not JSON has no event, which the file answers as unknown.
func callOf(native []byte) nativeCall {
	var call nativeCall
	_ = json.Unmarshal(native, &call)

	return call
}
