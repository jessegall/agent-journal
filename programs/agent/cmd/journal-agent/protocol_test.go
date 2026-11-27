package main

import (
	"maps"
	"slices"
	"testing"

	"journal-agent/hostapi"
)

// A connected host carries out exactly the instruction types protocol/host.json names: none missing, none of its own.
func TestTheHostCarriesOutEveryInstructionOfTheProtocol(t *testing.T) {
	connected := hostInstructions{ProcessTable: &hostapi.ProcessTable{}, reads: &hostapi.ProjectReads{}, upgrade: &bindingUpgrade{}}
	executors := connected.executors()

	carried := slices.Sorted(maps.Keys(executors))
	named := slices.Sorted(maps.Keys(hostapi.InstructionTypes))
	if !slices.Equal(carried, named) {
		t.Fatalf("the host carries out %v, the protocol names %v", carried, named)
	}
}
