package programs

import (
	_ "embed"
	"encoding/json"
	"os"
)

// The program table the journal ships, written from its providers by scripts/program_table.py.
//
//go:embed programs.json
var shippedTable []byte

// Program is one agent program's row of the program table: its hook names under the journal's event names, the hooks
// the events whose answer takes lines, how a refusal is printed, its tools' categories,
// the fields its rewritten tool input must carry, the decoder that reads its body, how it reads a hook's matcher, how
// long a hook with no timeout runs and the most seconds it gives a SessionEnd hook.
type Program struct {
	Events         map[string]string         `json:"events"`
	Matchers       map[string]string         `json:"matchers"`
	LineEvents     []string                  `json:"line_events"`
	PlainOutput    []string                  `json:"plain_output_events"`
	Refusals       map[string]string         `json:"refusals"`
	ToolCategories map[string]string         `json:"tool_categories"`
	Decoder        string                    `json:"decoder"`
	Rewrites       map[string]map[string]any `json:"rewrites"`
	Halts          map[string]string         `json:"halts"`
	// MatcherStyle is how the program reads a hook's matcher: "names_or_regex" or "regex".
	MatcherStyle           string `json:"matcher_style"`
	DefaultHookSeconds     int    `json:"default_hook_seconds"`
	SessionEndLimitSeconds int    `json:"session_end_limit_seconds"`
	// WakeAnswer is how the program is woken by its wake hook: "exit_with_stderr", "block_with_reason", or empty when
	// it has none.
	WakeAnswer string `json:"wake_answer"`
	// WakeSeconds is the timeout of the program's wake hook entry, 0 when it has none.
	WakeSeconds int `json:"wake_seconds"`
	// EntryFields are the fields of a hook entry the program honours, OutputFields the fields of an answer it reads.
	EntryFields  []string `json:"entry_fields"`
	OutputFields []string `json:"output_fields"`
}

// Table is every agent program the hook knows: the shipped ones, with the project's own laid over them.
type Table struct {
	Events   []string           `json:"events"`
	Programs map[string]Program `json:"programs"`
}

// LoadTable reads the shipped table and lays the project's rows over it, one program row at a time; a project file
// that is missing or does not read leaves the shipped table.
func LoadTable(projectFile string) Table {
	var table Table
	if err := json.Unmarshal(shippedTable, &table); err != nil {
		panic("the shipped program table does not read: " + err.Error())
	}
	var project Table
	text, err := os.ReadFile(projectFile)
	if err != nil || json.Unmarshal(text, &project) != nil {
		return table
	}
	for name, program := range project.Programs {
		table.Programs[name] = program
	}
	return table
}

// AcceptsLines says whether the program reads lines in its answer to the event.
func (program Program) AcceptsLines(event string) bool {
	return contains(program.LineEvents, event)
}

// TakesPlainOutput says the program reads a hook's plain text output on this event: as context for the agent, or on an
// event that takes no lines as instructions, such as a compaction summary's.
func (program Program) TakesPlainOutput(event string) bool {
	return contains(program.PlainOutput, event)
}

// HonoursEntryField says the program honours this field of a hook entry, such as "if" or "async".
func (program Program) HonoursEntryField(name string) bool {
	return contains(program.EntryFields, name)
}

// PassesOutputField says the program reads this field of a hook's answer, such as "continue".
func (program Program) PassesOutputField(name string) bool {
	return contains(program.OutputFields, name)
}

func contains(names []string, name string) bool {
	for _, listed := range names {
		if listed == name {
			return true
		}
	}
	return false
}
