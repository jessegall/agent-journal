package main

import (
	"encoding/json"
	"io"

	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
)

// parseShell writes the parts of the shell line read from input as the hook sends them, so the server judges a line
// it rewrote by the same parser as the line the agent asked for.
func parseShell(input io.Reader, output io.Writer, table string) error {
	line, err := io.ReadAll(input)
	if err != nil {
		return err
	}
	return json.NewEncoder(output).Encode(classify.ClassifierOf(table).Line(string(line)))
}
