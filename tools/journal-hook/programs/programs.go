// Package programs reads the hook body an agent program sends into the prepared HookEvent.
package programs

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// Context is what the hook knows besides its body: the environment it runs in, who runs it and when it fired.
type Context struct {
	Environment string
	Actor       string
	Firing      string
	RunScript   string
	Classifier  *classify.Classifier
	FiredAtMs   int64
}

// The event name of the prepared object for each hook event name the agent programs send.
var eventNames = map[string]string{
	"PreToolUse":         "pre_tool_use",
	"PostToolUse":        "post_tool_use",
	"PostToolUseFailure": "post_tool_use_failure",
	"UserPromptSubmit":   "prompt",
	"Stop":               "stop",
	"StopFailure":        "stop_failure",
	"SessionStart":       "session_start",
	"SessionEnd":         "session_end",
	"PreCompact":         "compact",
	"SubagentStart":      "subagent_start",
	"SubagentStop":       "subagent_stop",
	"MessageDisplay":     "message_display",
}

// The keys a tool's input names its file by, as version 4's Provider.PATH_KEYS.
var pathKeys = []string{"file_path", "path", "notebook_path"}

// Prepared reads the body of one hook of the program; skip says the hook goes to no one, as the hook script lets a
// subagent's own hooks go by.
func Prepared(program string, body []byte, context Context) (prepared event.HookEvent, skip bool, err error) {
	switch program {
	case "claude":
		return claudeEvent(body, context)
	case "codex":
		return codexEvent(body, context)
	}
	return event.HookEvent{}, true, fmt.Errorf("unknown agent program %q", program)
}

// The fields of a hook body both programs send.
type commonBody struct {
	HookEventName string    `json:"hook_event_name"`
	SessionID     string    `json:"session_id"`
	ToolName      string    `json:"tool_name"`
	ToolInput     toolInput `json:"tool_input"`
	Prompt        *string   `json:"prompt"`
	AgentID       *string   `json:"agent_id"`
}

// toolInput is a tool's input with its text values kept in the order the body gives them, which a Go map loses.
type toolInput struct {
	values map[string]any
	texts  []string
}

func (input *toolInput) UnmarshalJSON(text []byte) error {
	input.values = map[string]any{}
	decoder := json.NewDecoder(bytes.NewReader(text))
	if opening, err := decoder.Token(); err != nil || opening != json.Delim('{') {
		return err
	}
	for decoder.More() {
		key, err := decoder.Token()
		if err != nil {
			return err
		}
		var value any
		if err := decoder.Decode(&value); err != nil {
			return err
		}
		input.values[key.(string)] = value
		if text, ok := value.(string); ok {
			input.texts = append(input.texts, text)
		}
	}
	return nil
}

func preparedFrom(program string, body []byte, read commonBody, context Context) (event.HookEvent, bool, error) {
	name, known := eventNames[read.HookEventName]
	if !known {
		return event.HookEvent{}, true, fmt.Errorf("unknown hook event %q", read.HookEventName)
	}
	prepared := event.HookEvent{
		Version:     event.Version,
		Program:     program,
		Event:       name,
		Session:     read.SessionID,
		Firing:      context.Firing,
		FiredAtMs:   context.FiredAtMs,
		Actor:       context.Actor,
		Environment: context.Environment,
		Raw:         json.RawMessage(body),
	}
	if read.AgentID != nil {
		prepared.Subagent = *read.AgentID
	}
	if name == "prompt" {
		prompt := ""
		if read.Prompt != nil {
			prompt = *read.Prompt
		}
		prepared.Prompt = &prompt
	}
	return prepared, false, nil
}

func isToolEvent(name string) bool {
	return name == "pre_tool_use" || name == "post_tool_use" || name == "post_tool_use_failure"
}

func filePaths(input map[string]any) []string {
	paths := []string{}
	for _, key := range pathKeys {
		if value, ok := input[key].(string); ok && value != "" {
			paths = append(paths, value)
		}
	}
	return paths
}

// pythonText is str(input.get(key, "")) as version 4 reads a tool's input: no key gives "", a null gives "None".
func pythonText(input map[string]any, key string) string {
	value, present := input[key]
	switch {
	case !present:
		return ""
	case value == nil:
		return "None"
	}
	if text, ok := value.(string); ok {
		return text
	}
	return fmt.Sprint(value)
}

// EventName is the prepared object's name for a hook event name an agent program sends.
func EventName(hookEventName string) (string, bool) {
	name, known := eventNames[hookEventName]
	return name, known
}
