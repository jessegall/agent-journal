package device

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"slices"
)

// disconnectsFolderName holds one private cleanup record per binding being disconnected, outside the binding's own
// state, so a disconnect cut short is finished from the record alone.
const disconnectsFolderName = "disconnects"

// fenceName marks, in the connection's private folder, that a disconnect began: no new work is admitted for it.
const fenceName = "disconnecting"

// DisconnectStep is one step of a disconnect; the steps run in the order of DisconnectSteps.
type DisconnectStep string

const (
	StepFence   DisconnectStep = "fence new work"
	StepService DisconnectStep = "disable the relay service"
	StepRelay   DisconnectStep = "stop the relay and its children"
	StepSignIns DisconnectStep = "remove this folder's sign-ins"
	StepState   DisconnectStep = "remove the folder's setup and connection state"
)

// DisconnectSteps are every step of a disconnect, in order.
var DisconnectSteps = []DisconnectStep{
	StepFence, StepService, StepRelay, StepSignIns, StepState,
}

// ErrNoDisconnect is returned for a binding with no disconnect left to finish.
var ErrNoDisconnect = errors.New("no disconnect of this binding is left to finish")

// DisconnectRecord is the private record of one disconnect, written before anything is removed: the binding, its
// root, the service that keeps its relay running and the steps already done.
type DisconnectRecord struct {
	BindingID     string           `json:"binding_id"`
	RootID        string           `json:"root_id"`
	CanonicalRoot string           `json:"canonical_root"`
	JournalURL    string           `json:"journal_url"`
	Service       string           `json:"service"`
	Done          []DisconnectStep `json:"done"`
}

// DisconnectOf is the cleanup record of the binding's disconnect; ErrNoDisconnect while none is left to finish.
func DisconnectOf(stateFolder string, bindingID string) (DisconnectRecord, error) {
	content, err := os.ReadFile(disconnectPath(stateFolder, bindingID))
	if errors.Is(err, os.ErrNotExist) {
		return DisconnectRecord{}, ErrNoDisconnect
	}
	if err != nil {
		return DisconnectRecord{}, err
	}
	var record DisconnectRecord

	return record, json.Unmarshal(content, &record)
}

// Save keeps the record privately, replaced in one step.
func (record DisconnectRecord) Save(stateFolder string) error {
	if err := os.MkdirAll(filepath.Join(stateFolder, disconnectsFolderName), stateFolderMode); err != nil {
		return err
	}

	return writePrivateJSON(disconnectPath(stateFolder, record.BindingID), record)
}

// Remaining are the steps not done yet, in order.
func (record DisconnectRecord) Remaining() []DisconnectStep {
	remaining := []DisconnectStep{}
	for _, step := range DisconnectSteps {
		if !slices.Contains(record.Done, step) {
			remaining = append(remaining, step)
		}
	}

	return remaining
}

// Finish removes the record once every step is done: it is the last thing a disconnect removes.
func (record DisconnectRecord) Finish(stateFolder string) error {
	return removePrivateFile(disconnectPath(stateFolder, record.BindingID))
}

// Connection is the private state of the folder being disconnected, from the record alone.
func (record DisconnectRecord) Connection(stateFolder string) ConnectionState {
	return ConnectionState{Folder: stateFolder, CanonicalRoot: record.CanonicalRoot}
}

func disconnectPath(stateFolder string, bindingID string) string {
	return filepath.Join(stateFolder, disconnectsFolderName, bindingID+".json")
}

// Fence marks the connection as being disconnected: its relay stops admitting work and nothing wakes it again.
func (state ConnectionState) Fence() error {
	if err := os.MkdirAll(state.folder(), stateFolderMode); err != nil {
		return err
	}

	return WritePrivateFile(filepath.Join(state.folder(), fenceName), []byte("disconnecting\n"))
}

// IsFenced is whether a disconnect of the connection began.
func (state ConnectionState) IsFenced() bool {
	_, err := os.Stat(filepath.Join(state.folder(), fenceName))

	return err == nil
}

// RelayFolder is the binding relay's own folder beside the connection state: its sockets, start records and the
// start reports the journal has not acknowledged.
func RelayFolder(stateFolder string, bindingID string) string {
	return filepath.Join(stateFolder, "relays", bindingID)
}
