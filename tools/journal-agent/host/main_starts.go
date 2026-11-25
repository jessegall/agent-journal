package host

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
)

// mainStartName is the folder's record of its latest main-runtime start, by the id its device chose.
const mainStartName = "main-start.json"

// MainStart is a start of the binding's main runtime: the id chosen before anything started, and the runtime the
// journal answered once it did. A start with no runtime yet had its answer lost, or was cut short.
type MainStart struct {
	StartID   string `json:"start_id"`
	RuntimeID string `json:"runtime_id,omitempty"`
}

// SaveMainStart keeps the start privately before it is asked for, and again with its runtime once answered.
func (state ConnectionState) SaveMainStart(start MainStart) error {
	return writePrivateJSON(filepath.Join(state.folder(), mainStartName), start)
}

// PendingMainStart is the kept start whose answer never came, to ask for again under its id; ErrNotConnected while
// the latest start was answered, or there is none.
func (state ConnectionState) PendingMainStart() (MainStart, error) {
	content, err := os.ReadFile(filepath.Join(state.folder(), mainStartName))
	if errors.Is(err, os.ErrNotExist) {
		return MainStart{}, ErrNotConnected
	}
	if err != nil {
		return MainStart{}, err
	}
	var start MainStart
	if err := json.Unmarshal(content, &start); err != nil {
		return MainStart{}, err
	}
	if start.RuntimeID != "" {
		return MainStart{}, ErrNotConnected
	}

	return start, nil
}
