package hostapi

import (
	"context"
	"time"
)

// PrivateValuePuller pulls a private submission's value from the journal, once.
type PrivateValuePuller func(ctx context.Context, submission string) (PrivateValue, error)

// ProcessInput carries out the instructions that write into a process, read its screen or record it.
type ProcessInput struct {
	table   *ProcessTable
	outputs *Outputs
	pull    PrivateValuePuller
}

// NewProcessInput writes into the table's processes, reads their output and pulls private values with pull.
func NewProcessInput(table *ProcessTable, outputs *Outputs, pull PrivateValuePuller) ProcessInput {
	return ProcessInput{table: table, outputs: outputs, pull: pull}
}

// OpenPrivate stops every frame and recording of the process from leaving until the screen redraws after
// close_private, and answers once they are stopped.
func (input ProcessInput) OpenPrivate(_ context.Context, instruction Instruction, entry PrivateEntry) (Empty, error) {
	return Empty{}, input.outputs.OpenPrivate(instruction.ProcessID, time.Duration(entry.DeadlineMs)*time.Millisecond)
}

// WritePrivate pulls the submission's value from the journal and writes it once; neither the instruction nor its answer
// holds the value.
func (input ProcessInput) WritePrivate(ctx context.Context, instruction Instruction, write PrivateWrite) (Empty, error) {
	if !input.outputs.IsPrivate(instruction.ProcessID) {
		return Empty{}, RefusalError{Refusal: Unsafe, Reason: "a private value is written only while the entry is private"}
	}
	pulled, err := input.pull(ctx, write.Submission)
	if err != nil {
		return Empty{}, err
	}
	return Empty{}, input.table.Write(instruction.ProcessID, []byte(pulled.Value))
}

// ClosePrivate lets the process's frames leave again once its screen has redrawn.
func (input ProcessInput) ClosePrivate(_ context.Context, instruction Instruction) (Empty, error) {
	input.outputs.ClosePrivate(instruction.ProcessID)
	return Empty{}, nil
}

// WriteKeys writes the user's keys at once and raises the input generation; any other write only while the rows it
// was meant for and the input generation are as the journal saw them.
func (input ProcessInput) WriteKeys(_ context.Context, instruction Instruction, write KeyWrite) (KeysWritten, error) {
	screen, found := input.outputs.ScreenOf(instruction.ProcessID)
	if !found {
		return KeysWritten{}, RefusalError{Refusal: NotRunning, Reason: "the process has no terminal"}
	}
	if write.AsUser {
		if err := input.table.Write(instruction.ProcessID, write.Bytes); err != nil {
			return KeysWritten{}, err
		}
		return KeysWritten{InputGeneration: screen.RaiseInputGeneration()}, nil
	}
	if write.IfRows == nil || write.IfInputGeneration == nil {
		return KeysWritten{}, RefusalError{Refusal: Unsafe, Reason: "a key write of the journal names its rows and input generation"}
	}
	seen := KeysWritten{RowHash: screen.RowsHash(write.IfRows.From, write.IfRows.To), InputGeneration: screen.InputGeneration()}
	if seen.RowHash != write.IfRows.Hash || seen.InputGeneration != *write.IfInputGeneration {
		return seen, RefusalError{Refusal: GuardMoved, Reason: "the rows or the input moved since the journal saw them"}
	}
	if err := input.table.Write(instruction.ProcessID, write.Bytes); err != nil {
		return KeysWritten{}, err
	}
	return seen, nil
}

func (input ProcessInput) WriteStdin(_ context.Context, instruction Instruction, write StdinWrite) (Empty, error) {
	return Empty{}, input.table.Write(instruction.ProcessID, write.Bytes)
}

func (input ProcessInput) CloseStdin(_ context.Context, instruction Instruction) (Empty, error) {
	return Empty{}, input.table.CloseInput(instruction.ProcessID)
}

func (input ProcessInput) Stream(_ context.Context, instruction Instruction, plan StreamPlan) (Empty, error) {
	return Empty{}, input.outputs.Stream(instruction.ProcessID, plan.FramesPerSecond)
}

func (input ProcessInput) Snapshot(_ context.Context, instruction Instruction) (Empty, error) {
	return Empty{}, input.outputs.Snapshot(instruction.ProcessID)
}
