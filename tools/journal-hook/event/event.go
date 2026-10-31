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

const Version = 1

type HookEvent struct {
	Version     int             `json:"version"`
	Program     string          `json:"program"`
	Event       string          `json:"event"`
	Session     string          `json:"session"`
	Firing      string          `json:"firing"`
	FiredAtMs   int64           `json:"fired_at_ms"`
	Actor       string          `json:"actor"`
	Environment string          `json:"environment"`
	Subagent    string          `json:"subagent"`
	Tool        *Tool           `json:"tool"`
	Prompt      *string         `json:"prompt"`
	Raw         json.RawMessage `json:"raw"`
}

type Tool struct {
	Name     string     `json:"name"`
	Category string     `json:"kind"`
	Shell    *ShellLine `json:"shell,omitempty"`
	Files    []string   `json:"files"`
	Diff     *DiffCount `json:"diff"`
}

type ShellLine struct {
	Line          string   `json:"line"`
	Parts         []Part   `json:"parts"`
	Redirects     []string `json:"redirects"`
	Category      string   `json:"kind"`
	IsJournalOnly bool     `json:"is_journal_only"`
	ParseError    string   `json:"parse_error"`
}

type Part struct {
	Text           string         `json:"text"`
	Program        string         `json:"program"`
	Subcommand     string         `json:"subcommand,omitempty"`
	Arguments      []string       `json:"arguments"`
	Classification Classification `json:"classification"`
	ReadPaths      []string       `json:"read_paths,omitempty"`
	WritePaths     []string       `json:"write_paths,omitempty"`
	JoinedBy       string         `json:"joined_by,omitempty"`
	PipedInto      *int           `json:"piped_into,omitempty"`
}

type Classification struct {
	Category string   `json:"kind"`
	Effects  []string `json:"effects"`
}

type DiffCount struct {
	Path         string `json:"path"`
	Existed      bool   `json:"existed"`
	LinesAdded   int    `json:"lines_added"`
	LinesRemoved int    `json:"lines_removed"`
}

// The schema wants a list wherever it names one, so a list left empty is written [] and never null.

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
