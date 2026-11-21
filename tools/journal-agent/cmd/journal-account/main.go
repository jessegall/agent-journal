// Command journal-account is the account helper of a machine connected to a server journal: it signs a provider
// account in on this machine. Until sign-in arrives it refuses, so no provider starts without an isolated sign-in.
package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Fprintln(os.Stderr, "journal-account: signing in on a connected machine arrives with the next release")
	os.Exit(1)
}
