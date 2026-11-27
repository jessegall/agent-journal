package hostapi

import (
	"context"
)

// PrivateValuePuller pulls a private submission's value from the journal, once.
type PrivateValuePuller func(ctx context.Context, submission string) (PrivateValue, error)

// ProcessInput carries out the orders that write into a process, read its screen or record it.
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
func (input ProcessInput) OpenPrivate(_ context.Context, order Order) (map[string]any, error) {
	return nil, input.outputs.OpenPrivate(order.ProcessID)
}

// WritePrivate pulls the submission's value from the journal and writes it once; neither the order nor its answer
// holds the value.
func (input ProcessInput) WritePrivate(ctx context.Context, order Order, write PrivateWrite) (map[string]any, error) {
	if !input.outputs.IsPrivate(order.ProcessID) {
		return nil, RefusalError{Refusal: Unsafe, Reason: "a private value is written only while the entry is private"}
	}
	pulled, err := input.pull(ctx, write.Submission)
	if err != nil {
		return nil, err
	}
	return nil, input.table.Write(order.ProcessID, []byte(pulled.Value))
}

// ClosePrivate lets the process's frames leave again once its screen has redrawn.
func (input ProcessInput) ClosePrivate(_ context.Context, order Order) (map[string]any, error) {
	input.outputs.ClosePrivate(order.ProcessID)
	return nil, nil
}

// WriteKeys writes the user's keys at once and raises the input generation; any other write only while the rows it
// was meant for and the input generation are as the journal saw them.
func (input ProcessInput) WriteKeys(_ context.Context, order Order, write KeyWrite) (map[string]any, error) {
	screen, found := input.outputs.ScreenOf(order.ProcessID)
	if !found {
		return nil, RefusalError{Refusal: NotRunning, Reason: "the process has no terminal"}
	}
	if write.AsUser {
		if err := input.table.Write(order.ProcessID, write.Bytes); err != nil {
			return nil, err
		}
		input.outputs.Typed(order.ProcessID, write.Bytes, false)
		return map[string]any{"input_generation": screen.RaiseInputGeneration()}, nil
	}
	if write.IfRows == nil || write.IfInputGeneration == nil {
		return nil, RefusalError{Refusal: Unsafe, Reason: "a key write of the journal names its rows and input generation"}
	}
	facts := map[string]any{
		"row_hash":         screen.RowsHash(write.IfRows.From, write.IfRows.To),
		"input_generation": screen.InputGeneration(),
	}
	if facts["row_hash"] != write.IfRows.Hash || screen.InputGeneration() != *write.IfInputGeneration {
		return facts, RefusalError{Refusal: GuardMoved, Reason: "the rows or the input moved since the journal saw them"}
	}
	if err := input.table.Write(order.ProcessID, write.Bytes); err != nil {
		return nil, err
	}
	input.outputs.Typed(order.ProcessID, write.Bytes, false)
	return facts, nil
}

func (input ProcessInput) WriteStdin(_ context.Context, order Order, write StdinWrite) (map[string]any, error) {
	input.outputs.Typed(order.ProcessID, write.Bytes, false)
	return nil, input.table.Write(order.ProcessID, write.Bytes)
}

func (input ProcessInput) CloseStdin(_ context.Context, order Order) (map[string]any, error) {
	return nil, input.table.CloseInput(order.ProcessID)
}

func (input ProcessInput) Stream(_ context.Context, order Order, plan StreamPlan) (map[string]any, error) {
	return nil, input.outputs.Stream(order.ProcessID, plan.FramesPerSecond)
}

func (input ProcessInput) Snapshot(_ context.Context, order Order) (map[string]any, error) {
	return nil, input.outputs.Snapshot(order.ProcessID)
}

func (input ProcessInput) Record(_ context.Context, order Order) (map[string]any, error) {
	plan, err := input.table.PlanOf(order.ProcessID)
	if err != nil {
		return nil, err
	}
	input.outputs.Record(order.ProcessID, plan)
	return nil, nil
}

func (input ProcessInput) StopRecording(_ context.Context, order Order) (map[string]any, error) {
	folder, err := input.outputs.StopRecording(order.ProcessID)
	if err != nil {
		return nil, err
	}
	return map[string]any{"folder": folder}, nil
}
