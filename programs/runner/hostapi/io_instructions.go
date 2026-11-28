package hostapi

import (
	"context"
	"time"
)

// PrivateValuePuller pulls a private submission's value from the journal, once.
type PrivateValuePuller func(ctx context.Context, submission string) (PrivateValue, error)

// ProcessInput carries out the instructions that write to a pipe process.
type ProcessInput struct {
	table   *ProcessTable
	outputs *Outputs
	pull    PrivateValuePuller
}

// NewProcessInput writes into the table's processes, reads their output and pulls private values with pull.
func NewProcessInput(table *ProcessTable, outputs *Outputs, pull PrivateValuePuller) ProcessInput {
	return ProcessInput{table: table, outputs: outputs, pull: pull}
}

// OpenPrivate holds back the pipe's output until its private entry ends.
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

// ClosePrivate lets the pipe's subsequent output leave again.
func (input ProcessInput) ClosePrivate(_ context.Context, instruction Instruction) (Empty, error) {
	input.outputs.ClosePrivate(instruction.ProcessID)
	return Empty{}, nil
}

func (input ProcessInput) WriteKeys(_ context.Context, _ Instruction, _ KeyWrite) (KeysWritten, error) {
	return KeysWritten{}, RefusalError{Refusal: NotRunning, Reason: "the process has no terminal"}
}

func (input ProcessInput) WriteStdin(_ context.Context, instruction Instruction, write StdinWrite) (Empty, error) {
	return Empty{}, input.table.Write(instruction.ProcessID, write.Bytes)
}

func (input ProcessInput) CloseStdin(_ context.Context, instruction Instruction) (Empty, error) {
	return Empty{}, input.table.CloseInput(instruction.ProcessID)
}

func (input ProcessInput) Stream(_ context.Context, _ Instruction, _ StreamPlan) (Empty, error) {
	return Empty{}, RefusalError{Refusal: NotRunning, Reason: "the process has no screen"}
}

func (input ProcessInput) Snapshot(_ context.Context, _ Instruction) (Empty, error) {
	return Empty{}, RefusalError{Refusal: NotRunning, Reason: "the process has no screen"}
}
