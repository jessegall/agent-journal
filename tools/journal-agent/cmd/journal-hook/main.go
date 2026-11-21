// Command journal-hook is the native hook adapter of a machine connected to a server journal: a provider runs it on
// every hook event, and it answers with the journal's reply through the session's relay, or with the provider's own
// blocking reply when the journal cannot be asked in time.
package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"

	"journal-agent/hookadapter"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Fprintln(os.Stderr, "usage: journal-hook <claude-code|codex>")
		os.Exit(2)
	}
	native, err := io.ReadAll(os.Stdin)
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-hook:", err)
		os.Exit(2)
	}

	// The run folder only locates the session socket; the relay serving it holds the runtime's authority.
	runFolder := os.Getenv("JOURNAL_SESSION_RUN")
	adapter := hookadapter.Adapter{
		Ask:             hookadapter.AskThroughSocket(filepath.Join(runFolder, hookadapter.SocketName), os.Args[1]),
		PreparationFile: filepath.Join(runFolder, "prepared"),
	}
	reply := adapter.Answer(native)
	fmt.Fprint(os.Stdout, reply.Stdout)
	fmt.Fprint(os.Stderr, reply.Stderr)
	os.Exit(reply.ExitCode)
}
