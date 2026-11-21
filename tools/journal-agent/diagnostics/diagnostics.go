// Package diagnostics keeps a binding's recent relay events and writes them, with the ids and versions that name the
// install, as one bundle the owner can send; the bundle never carries the credential, a grant, a ticket, an
// environment value or a file's contents.
package diagnostics

import (
	"bufio"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"time"

	"journal-agent/host"
)

// Side says where a failure happened: on this machine or on the journal's server.
type Side string

const (
	Local  Side = "local"
	Server Side = "server"
)

// KeptEvents is how many of the newest events the log keeps.
const KeptEvents = 200

// shownFailures is how many of the newest failures the bundle names apart.
const shownFailures = 5

const logName = "relay-events.jsonl"

// Event is one step of the relay: a claim taken, a runtime started, or a failure and the side it happened on.
type Event struct {
	At        time.Time `json:"at"`
	Step      string    `json:"step"`
	ClaimID   string    `json:"claim_id,omitempty"`
	RuntimeID string    `json:"runtime_id,omitempty"`
	Side      Side      `json:"side,omitempty"`
	Failure   string    `json:"failure,omitempty"`
}

// IsFailure is whether the event records a failure.
func (event Event) IsFailure() bool {
	return event.Failure != ""
}

// Log is the binding's event log in its private state folder.
type Log struct {
	State host.ConnectionState
}

// Record appends the event and keeps only the newest KeptEvents.
func (log Log) Record(event Event) error {
	events, err := log.Events()
	if err != nil {
		return err
	}
	events = append(events, event)
	if len(events) > KeptEvents {
		events = events[len(events)-KeptEvents:]
	}
	var lines strings.Builder
	for _, kept := range events {
		line, err := json.Marshal(kept)
		if err != nil {
			return err
		}
		lines.Write(line)
		lines.WriteByte('\n')
	}

	return host.WritePrivateFile(log.path(), []byte(lines.String()))
}

// Events are the kept events, oldest first.
func (log Log) Events() ([]Event, error) {
	file, err := os.Open(log.path())
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	defer file.Close()
	var events []Event
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		var event Event
		if json.Unmarshal(scanner.Bytes(), &event) == nil {
			events = append(events, event)
		}
	}

	return events, scanner.Err()
}

func (log Log) path() string {
	key := strings.NewReplacer("/", "-", " ", "-").Replace(log.State.CanonicalRoot)

	return filepath.Join(log.State.Folder, "diagnostics", key+"-"+logName)
}

// Install names one installation's release and protocol for the bundle.
type Install struct {
	Release  string
	Protocol int
}

// Bundle is what journal diagnostics writes: the ids and versions that name the install, the relay's recent events
// and its last failures.
type Bundle struct {
	WrittenAt    time.Time `json:"written_at"`
	JournalURL   string    `json:"journal_url"`
	HostID       string    `json:"host_id"`
	ProjectID    string    `json:"project_id"`
	BindingID    string    `json:"binding_id"`
	MainAgentID  string    `json:"main_agent_id"`
	Release      string    `json:"release"`
	Protocol     int       `json:"protocol"`
	RelayRunning bool      `json:"relay_running"`
	RecentEvents []Event   `json:"recent_events"`
	LastFailures []Event   `json:"last_failures"`
}

// Write builds the bundle of the binding and writes it, private, into the folder; every secret the binding holds is
// struck from it, so a failure text that quoted one carries it no further.
func Write(binding host.Binding, state host.ConnectionState, install Install, folder string) (string, error) {
	events, err := Log{State: state}.Events()
	if err != nil {
		return "", err
	}
	bundle := Bundle{
		WrittenAt:    time.Now().UTC(),
		JournalURL:   binding.JournalURL,
		HostID:       binding.HostID,
		ProjectID:    binding.ProjectID,
		BindingID:    binding.BindingID,
		MainAgentID:  binding.MainAgentID,
		Release:      install.Release,
		Protocol:     install.Protocol,
		RelayRunning: state.RelayIsRunning(),
		RecentEvents: events,
		LastFailures: lastFailures(events),
	}
	content, err := json.MarshalIndent(bundle, "", "  ")
	if err != nil {
		return "", err
	}
	path := filepath.Join(folder, "journal-diagnostics-"+bundle.WrittenAt.Format("20060102-150405")+".json")

	return path, host.WritePrivateFile(path, strikeSecrets(content, secretsOf(binding, state)))
}

func lastFailures(events []Event) []Event {
	var failures []Event
	for index := len(events) - 1; index >= 0 && len(failures) < shownFailures; index-- {
		if events[index].IsFailure() {
			failures = append(failures, events[index])
		}
	}

	return failures
}

// secretsOf are the values the binding holds that no bundle may show.
func secretsOf(binding host.Binding, state host.ConnectionState) []string {
	secrets := []string{binding.Secret}
	if grant, err := state.DeviceGrant(); err == nil {
		secrets = append(secrets, grant)
	}

	return secrets
}

func strikeSecrets(content []byte, secrets []string) []byte {
	text := string(content)
	for _, secret := range secrets {
		if secret != "" {
			text = strings.ReplaceAll(text, secret, "[secret]")
		}
	}

	return []byte(text)
}
