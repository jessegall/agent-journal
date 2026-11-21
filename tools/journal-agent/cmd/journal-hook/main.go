// Command journal-hook is the native hook adapter of a machine connected to a server journal. Until it asks the
// server, it blocks every call: exit status 2 is the blocking reply of both pinned providers' command hooks.
package main

import (
	"fmt"
	"os"
)

// blockingExit is the exit status a provider reads as a blocked call, with standard error as the reason.
const blockingExit = 2

func main() {
	fmt.Fprintln(os.Stderr, "journal-hook: this connected machine cannot ask the journal yet, so the call is blocked")
	os.Exit(blockingExit)
}
