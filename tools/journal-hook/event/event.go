// Package event is the prepared object journal-hook hands the Python server, one per hook, in the shape of hook_event.schema.json.
package event

import (
	_ "embed"
	"encoding/json"
)

// Schema is hook_event.schema.json, the shape both Go and Python check the object against.
//
//go:embed hook_event.schema.json
var Schema []byte

const Version = 3

type HookEvent struct {
	Foreign      []ForeignRun    `json:"foreign"`
	Version      int             `json:"version"`
	Program      string          `json:"program"`
	Event        string          `json:"event"`
	Session      string          `json:"session"`
	Firing       string          `json:"firing"`
	FiredAtMs    int64           `json:"fired_at_ms"`
	Actor        string          `json:"actor"`
	Environment  string          `json:"environment"`
	ChildAgent   string          `json:"child_agent"`
	AcceptsLines bool            `json:"accepts_lines"`
	Launch       string          `json:"launch"`
	Role         string          `json:"role"`
	Tool         *Tool           `json:"tool"`
	Prompt       *string         `json:"prompt"`
	Raw          json.RawMessage `json:"raw"`
}

type Tool struct {
	Name     string     `json:"name"`
	Category string     `json:"category"`
	Shell    *ShellLine `json:"shell,omitempty"`
	Files    []string   `json:"files"`
	Diff     *DiffCount `json:"diff"`
	DiffRows []DiffRow  `json:"diff_rows,omitempty"`
}

// DiffRow is one line of a tool's change: added, removed, unchanged or a stretch left out, with its number in the
// file, 0 when the program did not say it, and how many lines a stretch left out hides.
type DiffRow struct {
	LineType string `json:"line_type"`
	Line     int    `json:"line"`
	Text     string `json:"text"`
	Hidden   int    `json:"hidden,omitempty"`
}

type ShellLine struct {
	Aliases []string `json:"aliases,omitempty"`
	// SavedCommandsKnown says the hook read the project's saved commands, so a test or build can be judged by them.
	SavedCommandsKnown bool `json:"saved_commands_known,omitempty"`
	// RetryLoop says the line runs something again until it works.
	RetryLoop     bool     `json:"retry_loop,omitempty"`
	Line          string   `json:"line"`
	Parts         []Part   `json:"parts"`
	Redirects     []string `json:"redirects"`
	IsJournalOnly bool     `json:"is_journal_only"`
	ParseError    string   `json:"parse_error"`
}

type Part struct {
	Text            string         `json:"text"`
	Program         string         `json:"program"`
	Subcommand      string         `json:"subcommand,omitempty"`
	Arguments       []string       `json:"arguments"`
	Classification  Classification `json:"classification"`
	ReadPaths       []string       `json:"read_paths,omitempty"`
	WritePaths      []string       `json:"write_paths,omitempty"`
	JoinedBy        string         `json:"joined_by,omitempty"`
	PipedInto       *int           `json:"piped_into,omitempty"`
	IsFullTestRun   bool           `json:"is_full_test_run,omitempty"`
	SavedCommand    string         `json:"saved_command,omitempty"`
	ReadFlag        string         `json:"read_flag,omitempty"`
	TimeoutDuration *string        `json:"timeout_duration,omitempty"`
	NestedJournalCommands [][]string `json:"nested_journal_commands,omitempty"`
}

type Classification struct {
	Category  string   `json:"category"`
	Effects   []string `json:"effects"`
	Uncertain bool     `json:"uncertain"`
}

type DiffCount struct {
	Path         string `json:"path"`
	Existed      bool   `json:"existed"`
	LinesAdded   int    `json:"lines_added"`
	LinesRemoved int    `json:"lines_removed"`
}

// The schema wants a list wherever it names one, so a list left empty is written [] and never null.

func (hook HookEvent) MarshalJSON() ([]byte, error) {
	type plain HookEvent
	hook.Foreign = listed(hook.Foreign)
	return json.Marshal(plain(hook))
}

func (tool Tool) MarshalJSON() ([]byte, error) {
	type plain Tool
	tool.Files = listed(tool.Files)
	return json.Marshal(plain(tool))
}

func (line ShellLine) MarshalJSON() ([]byte, error) {
	type plain ShellLine
	line.Parts = listed(line.Parts)
	line.Redirects = listed(line.Redirects)
	return json.Marshal(plain(line))
}

func (part Part) MarshalJSON() ([]byte, error) {
	type plain Part
	part.Arguments = listed(part.Arguments)
	return json.Marshal(plain(part))
}

func (classification Classification) MarshalJSON() ([]byte, error) {
	type plain Classification
	classification.Effects = listed(classification.Effects)
	return json.Marshal(plain(classification))
}

func listed[Item any](items []Item) []Item {
	if items == nil {
		return []Item{}
	}
	return items
}
