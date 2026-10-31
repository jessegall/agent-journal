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
// a subagent's run still sends, the events whose answer takes lines, how a refusal is printed, its tools' categories,
// and the decoder that reads its body.
type Program struct {
	Events         map[string]string `json:"events"`
	SubagentEvents []string          `json:"subagent_events"`
	LineEvents     []string          `json:"line_events"`
	Refusals       map[string]string `json:"refusals"`
	ToolCategories map[string]string `json:"tool_categories"`
	Decoder        string            `json:"decoder"`
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

// IsSubagentEvent says whether a subagent's hook of this name still reaches the journal.
func (program Program) IsSubagentEvent(hookName string) bool {
	return contains(program.SubagentEvents, hookName)
}

func contains(names []string, name string) bool {
	for _, listed := range names {
		if listed == name {
			return true
		}
	}
	return false
}
