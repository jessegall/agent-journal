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
	finished chan contracts.TurnEnd
}

// Finished delivers what the host saw when the current turn ended, for the journal to judge.
func (state *turnState) Finished() <-chan contracts.TurnEnd {
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
