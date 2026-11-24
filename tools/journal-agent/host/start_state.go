package host

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"

	"journal-agent/client"
)

// StartStage is how far the host got with one runtime's start; each stage is saved before the step it allows.
type StartStage string

const (
	// GrantHeld: the one-use start grant is saved; no account was asked for yet.
	GrantHeld StartStage = "grant_held"
	// ClaimRequested: the account claim was sent; its answer may have been lost.
	ClaimRequested StartStage = "claim_requested"
	// ClaimHeld: the claimed start and its recipe are saved.
	ClaimHeld StartStage = "claim_held"
	// Prepared: every prerequisite of the start held; the program may be released.
	Prepared StartStage = "prepared"
	// ReleasePending: the program is about to be spawned, or may have been.
	ReleasePending StartStage = "release_pending"
	// ExecutionKnown: the program runs, under the process identity saved with it.
	ExecutionKnown StartStage = "execution_known"
	// ExitKnown: the program and every process it started ended.
	ExitKnown StartStage = "exit_known"
	// ReportAcknowledged: the journal acknowledged the start's last report; the record can go.
	ReportAcknowledged StartStage = "report_acknowledged"
)

// ExecutionIdentity tells the running program apart from any later process that reuses its id.
type ExecutionIdentity struct {
	ProcessID     int    `json:"process_id"`
	StartIdentity string `json:"start_identity"`
}

// StartRecord is one runtime's start as the host saved it in its private state. It holds the start token and the
// account recipe, so it is never logged.
type StartRecord struct {
	RuntimeID         string               `json:"runtime_id"`
	SessionID         string               `json:"session_id"`
	ProcessGeneration int                  `json:"process_generation"`
	Stage             StartStage           `json:"stage"`
	Grant             client.Grant         `json:"grant"`
	Claim             *client.ClaimedStart `json:"claim,omitempty"`
	Execution         *ExecutionIdentity   `json:"execution,omitempty"`
	ExitCode          *int                 `json:"exit_code,omitempty"`
}

// RunsInContainer is whether the start runs in a container of the agent daemon, labelled with its session, as its
// grant names one: that container, not a process group of this host, proves whether it still runs.
func (record StartRecord) RunsInContainer() bool {
	return record.Grant.HasContainer()
}

// Recovery is what a restarted host may do with a start it saved.
type Recovery string

const (
	// ContinuePreparing: nothing was released; the saved grant and claim are used again, no new token is asked for.
	ContinuePreparing Recovery = "continue_preparing"
	// ReconcileClaim: the claim's answer may have been lost; only the journal's reconciliation settles it.
	ReconcileClaim Recovery = "reconcile_claim"
	// ProveExecution: the program may run; its process identity decides, never the absence of its process id.
	ProveExecution Recovery = "prove_execution"
	// NotifyExit: the program ended and the journal has not acknowledged it yet.
	NotifyExit Recovery = "report_exit"
	// Forget: the journal acknowledged the end; the record is done.
	Forget Recovery = "forget"
)

// StartStates keeps the start records in the host's private state folder, one file a runtime, each replaced in one
// step.
type StartStates struct{ Folder string }

// ErrStartRecordTooOpen is returned for a start record others can read.
var ErrStartRecordTooOpen = errors.New("a start record is readable by others")

// Save replaces the runtime's record.
func (states StartStates) Save(record StartRecord) error {
	return writePrivateJSON(states.pathOf(record.RuntimeID), record)
}

// Load reads the runtime's record; found is false when the host saved none.
func (states StartStates) Load(runtimeID string) (record StartRecord, found bool, err error) {
	path := states.pathOf(runtimeID)
	content, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return StartRecord{}, false, nil
	}
	if err != nil {
		return StartRecord{}, false, err
	}
	if err := requireOwnerOnly(path, secretFileMode); err != nil {
		return StartRecord{}, false, errors.Join(ErrStartRecordTooOpen, err)
	}
	return record, true, json.Unmarshal(content, &record)
}

// Unfinished are the records whose program may still run: its process group still holds a process, or the system
// could not say. A process id that now names another program is not the child.
func (states StartStates) Unfinished() ([]StartRecord, error) {
	records, err := states.All()
	if err != nil {
		return nil, err
	}
	unfinished := []StartRecord{}
	for _, record := range records {
		if record.Stage != ExecutionKnown || record.Execution == nil {
			continue
		}
		group := record.group()
		if group.IsOwned() && group.Members() != NoMembers {
			unfinished = append(unfinished, record)
		}
	}

	return unfinished, nil
}

// group is the process group the program of a record with a known execution runs in.
func (record StartRecord) group() OwnedGroup {
	return OwnedGroup{Pid: record.Execution.ProcessID, StartIdentity: record.Execution.StartIdentity}
}

// Remove drops the runtime's record once nothing is left to report.
func (states StartStates) Remove(runtimeID string) error {
	return removePrivateFile(states.pathOf(runtimeID))
}

// All reads every saved record, for a restarted host to recover.
func (states StartStates) All() ([]StartRecord, error) {
	entries, err := os.ReadDir(states.Folder)
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var records []StartRecord
	for _, entry := range entries {
		if strings.HasPrefix(entry.Name(), ".") || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}
		record, _, err := states.Load(strings.TrimSuffix(entry.Name(), ".json"))
		if err != nil {
			return nil, err
		}
		records = append(records, record)
	}
	return records, nil
}

// Recovery says what a restarted host may do with the record: work not yet released goes on from what was saved,
// work that may have been released is proven or reconciled, never started again blindly.
func (record StartRecord) Recovery() Recovery {
	switch record.Stage {
	case GrantHeld, ClaimHeld, Prepared:
		return ContinuePreparing
	case ClaimRequested:
		return ReconcileClaim
	case ExitKnown:
		return NotifyExit
	case ReportAcknowledged:
		return Forget
	default:
		return ProveExecution
	}
}

func (states StartStates) pathOf(runtimeID string) string {
	return filepath.Join(states.Folder, runtimeID+".json")
}
