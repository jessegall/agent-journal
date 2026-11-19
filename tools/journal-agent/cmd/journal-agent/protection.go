package main

import (
	"encoding/json"
	"flag"
	"os"

	"journal-agent/host"
)

// protection prints which items of a program's protected arrangement this host can enforce, and why any is missing.
func protection(arguments []string) error {
	flags := flag.NewFlagSet("protection", flag.ContinueOnError)
	program := flags.String("program", "", "the agent program: claude or codex")
	build := flags.String("build", "", "the pinned build the arrangement is for")
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	capability, err := host.InspectProtection(*program, *build, host.NativeEvidence{Folder: *stateFolder})
	if err != nil {
		return err
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(capability)
}
