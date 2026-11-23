package host

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"sync"

	"journal-agent/client"
)

// ReadyObservations keeps, per runtime, the report that proved its start's conversation, in one owner-only file, so
// Check status can send that exact report again after the journal lost it, also after a restart.
type ReadyObservations struct {
	Folder string
	mutex  sync.Mutex
}

const readyObservationsName = "ready-observations.json"

// Keep saves the runtime's ready report; one of an older process generation never replaces a newer one.
func (observations *ReadyObservations) Keep(runtimeID string, report client.RequestReport) error {
	observations.mutex.Lock()
	defer observations.mutex.Unlock()
	kept, err := observations.read()
	if err != nil {
		return err
	}
	if earlier, found := kept[runtimeID]; found && earlier.ProcessGeneration > report.ProcessGeneration {
		return nil
	}
	kept[runtimeID] = report
	return observations.write(kept)
}

// Of answers the runtime's kept ready report, if it has one.
func (observations *ReadyObservations) Of(runtimeID string) (client.RequestReport, bool, error) {
	observations.mutex.Lock()
	defer observations.mutex.Unlock()
	kept, err := observations.read()
	if err != nil {
		return client.RequestReport{}, false, err
	}
	report, found := kept[runtimeID]
	return report, found, nil
}

// Forget removes the ready report of a runtime that stopped or exited.
func (observations *ReadyObservations) Forget(runtimeID string) error {
	observations.mutex.Lock()
	defer observations.mutex.Unlock()
	kept, err := observations.read()
	if err != nil {
		return err
	}
	delete(kept, runtimeID)
	return observations.write(kept)
}

func (observations *ReadyObservations) read() (map[string]client.RequestReport, error) {
	kept := map[string]client.RequestReport{}
	content, err := os.ReadFile(filepath.Join(observations.Folder, readyObservationsName))
	if errors.Is(err, os.ErrNotExist) {
		return kept, nil
	}
	if err != nil {
		return nil, err
	}
	return kept, json.Unmarshal(content, &kept)
}

func (observations *ReadyObservations) write(kept map[string]client.RequestReport) error {
	return writePrivateJSON(filepath.Join(observations.Folder, readyObservationsName), kept)
}
