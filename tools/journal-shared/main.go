// Command journal-shared is the server a team shares documents, sequences and checks through. Run as
// journal-shared serve [--listen <host:port>], or as journal-shared --version.
package main

import (
	"fmt"
	"os"
)

// version is set by the release build with -ldflags "-X main.version=<version>".
var version = "dev"

// protocol is the number of the HTTP API; it only rises for a change that older journals cannot read.
const protocol = 1

func main() {
	if len(os.Args) == 2 && os.Args[1] == "--version" {
		fmt.Printf("journal-shared %s protocol %d\n", version, protocol)
		return
	}
	if len(os.Args) >= 2 && os.Args[1] == "serve" {
		os.Exit(serve(os.Args[2:]))
	}
	fmt.Fprintln(os.Stderr, "usage: journal-shared serve [--listen <host:port>] | journal-shared --version")
	os.Exit(2)
}
