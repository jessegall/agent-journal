package main

import (
	"flag"
	"fmt"
	"slices"

	"journal-agent/hostapi"
)

// assertDeclaredFlags refuses a command whose flags differ from those protocol/host.json declares for it, naming the
// first that differs, so a flag is never added or dropped on one side alone.
func assertDeclaredFlags(flags *flag.FlagSet) error {
	declared, known := hostapi.HostCommandFlags[flags.Name()]
	if !known {
		return fmt.Errorf("host protocol 1 declares no flags for the command %s", flags.Name())
	}
	defined := []string{}
	flags.VisitAll(func(each *flag.Flag) { defined = append(defined, each.Name) })
	for _, name := range defined {
		if !slices.Contains(declared, name) {
			return fmt.Errorf("the command %s takes the flag %s, which host protocol 1 does not declare", flags.Name(), name)
		}
	}
	for _, name := range declared {
		if !slices.Contains(defined, name) {
			return fmt.Errorf("host protocol 1 declares the flag %s, which the command %s does not take", name, flags.Name())
		}
	}

	return nil
}
