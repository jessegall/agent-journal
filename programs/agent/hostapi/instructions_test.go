package hostapi

import (
	"context"
	"errors"

	"journal-agent/client"
)

// testInstructions are the parts of a host a test holds, the others left out, so the test sends its instruction through the
// protocol's strict dispatch as the host does.
type testInstructions struct {
	*ProcessTable
	ProcessInput
	reads *ProjectReads
}

// ReadProject reads through the test's project reads; a test without them carries no project read.
func (instructions testInstructions) ReadProject(ctx context.Context, instruction Instruction, read client.ProjectRead) (Empty, error) {
	if instructions.reads == nil {
		return Empty{}, errors.New("this test carries no project reads")
	}
	return instructions.reads.ReadProject(ctx, instruction, read)
}

// Upgrade is no instruction a test of hostapi carries.
func (testInstructions) Upgrade(context.Context, Instruction, UpgradePlan) (UpgradeStarted, error) {
	return UpgradeStarted{}, errors.New("this test carries no upgrade")
}

// carry is the executor of the instruction type, as the host's dispatch runs it, over the test's parts.
func carry(instructions testInstructions, instructionType string) Executor {
	return Executors(instructions)[instructionType]
}
