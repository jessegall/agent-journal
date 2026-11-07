// Command gen writes the shipped command table in the form the hook decodes at start, to command_table.gob in the
// folder it runs in; go generate runs it in the classify package's folder.
package main

import (
	"os"

	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
)

func main() {
	if err := os.WriteFile("command_table.gob", classify.EncodedShipped(), 0o644); err != nil {
		panic(err)
	}
}
