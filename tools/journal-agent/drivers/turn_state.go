package drivers

import (
	"context"
	"sync"

	"journal-agent/drivers/contracts"
)

// turnState is what a driver that runs one turn at a time keeps under its lock: the effort staged for the next turn
// and the channel that delivers the end of the current one.
type turnState struct {
	mutex    sync.Mutex
	effort   string
	finished chan error
}

// Finished delivers the end of the current turn: nil for a normal end, which leaves the runtime eligible for the
// next turn; an error fails that turn and the host holds the runtime instead of running it again.
func (state *turnState) Finished() <-chan error {
	state.mutex.Lock()
	defer state.mutex.Unlock()
	return state.finished
}

// ChangeEffort is staged for the next turn.
func (state *turnState) ChangeEffort(_ context.Context, change contracts.EffortChange) (
	contracts.OperationResult, error) {
	state.mutex.Lock()
	defer state.mutex.Unlock()
	state.effort = change.Effort
	return staged(change.Request), nil
}
