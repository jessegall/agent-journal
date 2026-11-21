package host

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"slices"
)

// stopReceiptsName keeps, privately, the runtimes whose session stopped and whose stop the journal has not taken yet.
const stopReceiptsName = "stop-receipts.json"

// StopReporter gives the journal a runtime's stop receipt.
type StopReporter interface {
	ReportRuntimeStopped(ctx context.Context, bindingID string, runtimeID string) error
}

// QueueStopReceipt keeps the runtime's stop receipt before it is sent, so a device away from the journal sends it
// once it is back.
func (state ConnectionState) QueueStopReceipt(runtimeID string) error {
	pending, err := state.PendingStopReceipts()
	if err != nil {
		return err
	}
	if slices.Contains(pending, runtimeID) {
		return nil
	}
	if err := os.MkdirAll(state.folder(), stateFolderMode); err != nil {
		return err
	}

	return writePrivateJSON(filepath.Join(state.folder(), stopReceiptsName), append(pending, runtimeID))
}

// PendingStopReceipts are the runtimes whose stop the journal has not taken yet.
func (state ConnectionState) PendingStopReceipts() ([]string, error) {
	content, err := os.ReadFile(filepath.Join(state.folder(), stopReceiptsName))
	if errors.Is(err, os.ErrNotExist) {
		return []string{}, nil
	}
	if err != nil {
		return nil, err
	}
	pending := []string{}

	return pending, json.Unmarshal(content, &pending)
}

// SendStopReceipts sends every kept stop receipt and forgets each the journal took; the rest stay for the next try.
func (state ConnectionState) SendStopReceipts(ctx context.Context, bindingID string, reporter StopReporter) error {
	pending, err := state.PendingStopReceipts()
	if err != nil {
		return err
	}
	kept := []string{}
	var failures []error
	for _, runtimeID := range pending {
		if err := reporter.ReportRuntimeStopped(ctx, bindingID, runtimeID); err != nil {
			kept = append(kept, runtimeID)
			failures = append(failures, err)
		}
	}

	return errors.Join(append(failures, writePrivateJSON(filepath.Join(state.folder(), stopReceiptsName), kept))...)
}
