package mcprelay

import (
	"encoding/json"

	"journal-runner/hookadapter"
)

// hookTool is the tool a driver's mcp_tool hooks call on this relay: the relay answers it itself, through the hook
// adapter with the start's grant and its sealed replies, and never sends it to the journal as a tool of its own.
const hookTool = "hook"

// HookAnswerer answers one native hook call, as journal-hook does: the journal's reply, or the sealed file's when the
// journal is away or slow.
type HookAnswerer func(native []byte) hookadapter.Reply

// isHookCall is whether the frame calls the relay's hook tool.
func (frame frame) isHookCall() bool {
	name, named := frame.name()

	return frame.method == "tools/call" && named && name == hookTool && frame.isRequest()
}

// answerHook answers a hook call with the adapter's reply as the tool's text: the reply's standard output when it
// passed, an error result with its standard error otherwise. A call the driver cancelled meanwhile gets no answer.
func (relay *Relay) answerHook(called frame) {
	defer relay.hooks.Done()
	native := called.params["arguments"]
	if len(native) == 0 {
		native = json.RawMessage("{}")
	}
	reply := relay.Hook(native)
	if relay.forgetHook(string(called.id)) {
		return
	}
	text, isError := reply.Stdout, reply.ExitCode != 0
	if isError {
		text = reply.Stderr
	}
	line, _ := json.Marshal(map[string]any{
		"jsonrpc": "2.0",
		"id":      called.id,
		"result":  map[string]any{"content": []map[string]any{{"type": "text", "text": text}}, "isError": isError},
	})
	relay.write(line)
}

// startHook runs the hook call beside the frames the journal answers, so a slow hook holds up no tool call.
func (relay *Relay) startHook(called frame) {
	relay.mutex.Lock()
	if relay.runningHooks == nil {
		relay.runningHooks = map[string]bool{}
	}
	relay.runningHooks[string(called.id)] = false
	relay.mutex.Unlock()
	relay.hooks.Add(1)
	go relay.answerHook(called)
}

// cancelHook marks a running hook call cancelled, so its answer is not written; whether one was running.
func (relay *Relay) cancelHook(id string) bool {
	_, running := relay.runningHooks[id]
	if running {
		relay.runningHooks[id] = true
	}

	return running
}

// forgetHook ends the hook call's run and answers whether the driver cancelled it.
func (relay *Relay) forgetHook(id string) bool {
	relay.mutex.Lock()
	defer relay.mutex.Unlock()
	cancelled := relay.runningHooks[id]
	delete(relay.runningHooks, id)

	return cancelled
}

// initializedLocally is the answer to an initialize the journal did not answer: the version the driver asked for and
// the tools capability, so the driver's hooks reach this relay while the journal is away.
func (relay *Relay) initializedLocally(asked frame) {
	var params struct {
		ProtocolVersion string `json:"protocolVersion"`
	}
	raw, _ := json.Marshal(asked.params)
	_ = json.Unmarshal(raw, &params)
	if asked.protocolVersion() == "" {
		relay.negotiated = params.ProtocolVersion
	}
	line, _ := json.Marshal(map[string]any{
		"jsonrpc": "2.0",
		"id":      asked.id,
		"result": map[string]any{
			"protocolVersion": params.ProtocolVersion,
			"capabilities":    map[string]any{"tools": map[string]any{}},
			"serverInfo":      map[string]any{"name": "journal", "version": "relay"},
		},
	})
	relay.write(line)
}
