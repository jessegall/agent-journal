// Command journal is the native journal command of a machine connected to a server journal. Until its verbs arrive
// it answers every one with a refusal, so nothing runs on a connected machine unseen.
package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Fprintln(os.Stderr, "journal: this connected machine does not run journal commands yet; they arrive with the next release")
	os.Exit(1)
}
