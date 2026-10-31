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
	Launch      string
	Programs    Table
}

// The keys a tool's input names its file by, as version 4's Provider.PATH_KEYS.
var pathKeys = []string{"file_path", "path", "notebook_path"}

type decoder func(name string, body []byte, program Program, context Context) (event.HookEvent, bool, error)

// The decoders a program row may name: common reads the fields every program shares, codex adds Codex's shell list
// and patch files.
var decoders = map[string]decoder{"common": commonEvent, "codex": codexEvent}

// Prepared reads the body of one hook of the program through the decoder its table row names; skip says the hook goes
// to no one, as a subagent's own hooks outside its program's subagent events go by.
func Prepared(name string, body []byte, context Context) (prepared event.HookEvent, skip bool, err error) {
	program, listed := context.Programs.Programs[name]
	if !listed {
		return event.HookEvent{}, true, fmt.Errorf("unknown agent program %q", name)
	}
	decode, present := decoders[program.Decoder]
	if !present {
		return event.HookEvent{}, true, fmt.Errorf("agent program %q names the decoder %q, which this journal-hook does not have", name, program.Decoder)
	}
	return decode(name, body, program, context)
}

// readBody reads the fields every program sends, and skips a subagent's hook its program does not pass on.
func readBody(body []byte, program Program) (commonBody, bool, error) {
	var read commonBody
	if err := json.Unmarshal(body, &read); err != nil {
		return read, true, err
	}
	return read, read.AgentID != nil && !program.IsSubagentEvent(read.HookEventName), nil
}

// The fields of a hook body both programs send.
type commonBody struct {
	HookEventName string    `json:"hook_event_name"`
	SessionID     string    `json:"session_id"`
	ToolName      string    `json:"tool_name"`
	ToolInput     toolInput `json:"tool_input"`
	Prompt        *string   `json:"prompt"`
	AgentID       *string   `json:"agent_id"`
	Cwd           string    `json:"cwd"`
	ToolResponse  any       `json:"tool_response"`
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
		if text, present := value.(string); present {
			input.texts = append(input.texts, text)
		}
	}
	return nil
}

func preparedFrom(programName string, program Program, body []byte, read commonBody, context Context) (event.HookEvent, bool, error) {
	name, listed := program.Events[read.HookEventName]
	if !listed {
		return event.HookEvent{}, true, fmt.Errorf("%s sends no %q hook", programName, read.HookEventName)
	}
	prepared := event.HookEvent{
		Version:      event.Version,
		Program:      programName,
		AcceptsLines: program.AcceptsLines(name),
		Event:        name,
		Session:      read.SessionID,
		Firing:       context.Firing,
		FiredAtMs:    context.FiredAtMs,
		Actor:        context.Actor,
		Environment:  context.Environment,
		Launch:       context.Launch,
		Raw:          json.RawMessage(body),
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
		if value, present := input[key].(string); present && value != "" {
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
	if text, present := value.(string); present {
		return text
	}
	return fmt.Sprint(value)
}

// toolCategory is the category the program's row gives the tool, other for a tool it does not name.
func toolCategory(program Program, name string) string {
	if category, listed := program.ToolCategories[name]; listed {
		return category
	}
	return "other"
}
