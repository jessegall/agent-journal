package main

import (
	"fmt"

	"journal-agent/host"
)

// protectionProbe is the program the local-project probe starts under the confinement: it tries one action.
func protectionProbe(arguments []string) error {
	if len(arguments) != 2 {
		return fmt.Errorf("usage: journal-agent protection-probe write|read|connect <path>")
	}
	return host.RunProtectionProbe(arguments[0], arguments[1])
}
