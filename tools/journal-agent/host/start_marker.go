package host

import (
	"encoding/json"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
)

// StartMarker is written before the host starts a program, so a restarted host knows what it may already be running.
type StartMarker struct {
	RuntimeID         string   `json:"runtime_id"`
	ProcessGeneration int      `json:"process_generation"`
	Command           []string `json:"command"`
	ProcessID         int      `json:"process_id"`
	StartIdentity     string   `json:"start_identity"`
}

// Reconciliation is what a restarted host concluded about one marker: a process counts as exited only when its whole
// group is gone, never because a question about it failed.
type Reconciliation string

const (
	// Adopted: the marked process still runs and is provably the one this host started.
	Adopted Reconciliation = "adopted"
	// Exited: the marked process is gone.
	Exited Reconciliation = "exited"
	// NeedsAttention: the host cannot prove what runs; it starts nothing and a person must look.
	NeedsAttention Reconciliation = "needs_attention"
)

var errNoStartIdentity = errors.New("the process start identity cannot be read")

// Markers keeps the start markers in the host's private state folder.
type Markers struct{ Folder string }

// Write saves the marker before the program starts, replacing the old one in one step; Started records the process
// once it runs.
func (markers Markers) Write(marker StartMarker) error {
	content, err := json.Marshal(marker)
	if err != nil {
		return err
	}
	return writePrivateFile(markers.pathOf(marker.RuntimeID), content)
}

// Started records the running process and its start identity on the runtime's marker.
func (markers Markers) Started(marker StartMarker, processID int) error {
	identity, err := startIdentityOf(processID)
	if err != nil {
		return err
	}
	marker.ProcessID = processID
	marker.StartIdentity = identity
	return markers.Write(marker)
}

// Remove drops the marker of a runtime whose program ended.
func (markers Markers) Remove(runtimeID string) error {
	err := os.Remove(markers.pathOf(runtimeID))
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	return err
}

// Reconcile reads every marker after a restart and says, per runtime, what still runs. It never starts anything.
func (markers Markers) Reconcile() (map[string]Reconciliation, error) {
	entries, err := os.ReadDir(markers.Folder)
	if errors.Is(err, os.ErrNotExist) {
		return map[string]Reconciliation{}, nil
	}
	if err != nil {
		return nil, err
	}
	outcomes := map[string]Reconciliation{}
	for _, entry := range entries {
		if strings.HasPrefix(entry.Name(), ".") {
			continue
		}
		content, err := os.ReadFile(filepath.Join(markers.Folder, entry.Name()))
		if err != nil {
			return nil, err
		}
		var marker StartMarker
		if err := json.Unmarshal(content, &marker); err != nil {
			outcomes[strings.TrimSuffix(entry.Name(), ".json")] = NeedsAttention
			continue
		}
		outcomes[marker.RuntimeID] = reconcile(marker)
	}
	return outcomes, nil
}

// MayStartAgain answers whether a runtime whose marker needed attention may be started again: only once the journal
// shows a newer process generation for it, which an operator's reassignment gives after proving the old one stopped.
func MayStartAgain(marker StartMarker, journalGeneration int) bool {
	return journalGeneration > marker.ProcessGeneration
}

func reconcile(marker StartMarker) Reconciliation {
	if marker.ProcessID == 0 || marker.StartIdentity == "" {
		return NeedsAttention
	}
	if processGone(marker.ProcessID) {
		return Exited
	}
	identity, err := startIdentityOf(marker.ProcessID)
	if err != nil || identity != marker.StartIdentity {
		return NeedsAttention
	}
	return Adopted
}

// processGone answers whether the system has no process of that id; a failed question is not an answer.
func processGone(processID int) bool {
	return errors.Is(syscall.Kill(processID, 0), syscall.ESRCH)
}

func (markers Markers) pathOf(runtimeID string) string {
	return filepath.Join(markers.Folder, runtimeID+".json")
}

// startIdentityOf reads when the process started, which together with its id tells it apart from a later process
// that reused the id.
var startIdentityOf = func(processID int) (string, error) {
	output, err := exec.Command("ps", "-o", "lstart=", "-p", strconv.Itoa(processID)).Output()
	identity := strings.TrimSpace(string(output))
	if err != nil || identity == "" {
		return "", errNoStartIdentity
	}
	return identity, nil
}
