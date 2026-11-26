// Package drivers holds the agent drivers: the terminal driver keeps one interactive driver open, and the app-server
// driver talks to its owner process.
package drivers

import (
	"errors"

	"journal-agent/drivers/contracts"
	"journal-agent/host"
)

// BypassLogName is the file in a runtime's settings folder where the hook relay writes the calls it answered alone
// while the journal could not be reached, to send them once it answers again.
const BypassLogName = "bypasses.jsonl"

// ErrTurnRunning is returned when a turn is asked for while the previous one still runs.
var ErrTurnRunning = errors.New("a turn is still running")

func alreadyIdle(request contracts.RequestIdentity) contracts.OperationResult {
	return contracts.OperationResult{
		Request:  request,
		Progress: contracts.ProgressApplied,
		Outcome:  contracts.OutcomeAlreadyIdle,
	}
}

// stopResult reports a stop: applied once the exit is proven, unconfirmed while it is not, and refused for a process
// that is not the one the host started.
func stopResult(request contracts.RequestIdentity, outcome host.StopOutcome) contracts.OperationResult {
	switch outcome {
	case host.StopProven:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed}
	case host.StopNotOwned:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeRefused}
	default:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeStopUnconfirmed}
	}
}

func staged(request contracts.RequestIdentity) contracts.OperationResult {
	return contracts.OperationResult{Request: request, Progress: contracts.ProgressStaged, Hold: contracts.HoldNone}
}

// WithoutJournalVariables keeps the host's own journal variables out of a started process: only the start token the
// driver adds itself may reach it, never the host secret.
func WithoutJournalVariables(environment []string) []string {
	kept := make([]string, 0, len(environment))
	for _, entry := range environment {
		if len(entry) >= 8 && entry[:8] == "JOURNAL_" {
			continue
		}
		kept = append(kept, entry)
	}
	return kept
}
