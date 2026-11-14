// Command journal-shared is the server a team shares documents, sequences and checks through. Run as
// journal-shared serve, journal-shared user ..., journal-shared token ..., journal-shared item ..., or
// journal-shared --version.
package main

import (
	"fmt"
	"io"
	"os"
)

// version is set by the release build with -ldflags "-X main.version=<version>".
var version = "dev"

// protocol is the number of the HTTP API; it only rises for a change that older journals cannot read.
const protocol = 1

const usage = "usage: journal-shared serve | user add|role|remove|tokens | token new|revoke | item history|purge | backup <file> | --version"

func main() {
	os.Exit(run(os.Args[1:], os.Stdout, os.Stderr))
}

func run(arguments []string, output, errs io.Writer) int {
	if len(arguments) == 0 {
		fmt.Fprintln(errs, usage)
		return 2
	}
	var err error
	switch {
	case len(arguments) == 1 && arguments[0] == "--version":
		fmt.Fprintf(output, "journal-shared %s protocol %d\n", version, protocol)
	case arguments[0] == "serve":
		err = serve(arguments[1:], errs)
	case arguments[0] == "user" && len(arguments) > 1:
		err = userCommand(arguments[1], arguments[2:], output, errs)
	case arguments[0] == "token" && len(arguments) > 1:
		err = tokenCommand(arguments[1], arguments[2:], output, errs)
	case arguments[0] == "backup":
		err = backupCommand(arguments[1:], output, errs)
	case arguments[0] == "item" && len(arguments) > 1:
		err = itemCommand(arguments[1], arguments[2:], output, errs)
	default:
		fmt.Fprintln(errs, usage)
		return 2
	}
	if err != nil {
		fmt.Fprintln(errs, "journal-shared: "+err.Error())
		return 1
	}
	return 0
}
