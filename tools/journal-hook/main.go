// Command journal-hook is the hook the agent programs run: it reads the hook body on stdin, prepares the HookEvent and
// hands it to the journal's Python server. Run as journal-hook <program> <project root>.
package main

import (
	"io"
	"os"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

func main() {
	begun := time.Now()
	if len(os.Args) < 3 {
		os.Exit(0)
	}
	program, root := os.Args[1], os.Args[2]
	folder, _ := os.Getwd()
	context, skip := hookContext(os.Getenv, root, folder, os.Getpid(), begun)
	if skip {
		os.Exit(0)
	}
	body, err := io.ReadAll(os.Stdin)
	if err != nil {
		os.Exit(0)
	}
	_, skip, err = programs.Prepared(program, body, context)
	if skip || err != nil {
		os.Exit(0)
	}
}
