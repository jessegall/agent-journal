// Command journal-init is the entrypoint of a protected-account container: journal-init -- <program argv>.
package main

import (
	"os"

	"journal-agent/bootstrap"
)

func main() {
	os.Exit(bootstrap.Main(bootstrap.ContainerLayout, os.Args[1:]))
}
