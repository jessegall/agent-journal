// Package recorded reads the scenarios the journal recorded under resources/recordings, as the PHP Recordings does: a
// scenario never recorded, or recorded before its scenario, the host protocol, the format or the agent image's
// programs changed, fails by name.
package recorded

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"testing"

	"journal-agent/hostapi"
	"journal-agent/recording"
)

// Format is the recording format this reader reads, the PHP RecordingManifest::FORMAT.
const Format = 2

// ErrRecordingMissing is returned for a scenario with no recording folder or no definition.
var ErrRecordingMissing = errors.New("the scenario is not recorded")

// ErrRecordingStale is returned for a recording made before what it stands for changed.
var ErrRecordingStale = errors.New("the recording is stale")

// The reasons a recording is stale, in the words of the PHP StaleReason.
const (
	staleFormat        = "the recording format changed"
	staleProtocol      = "the host protocol is newer than the recording"
	staleScenario      = "the scenario changed"
	staleImagePrograms = "the agent image's programs changed"
)

// Manifest is a recording's scenario.json, as the PHP RecordingManifest writes it.
type Manifest struct {
	Format        int      `json:"format"`
	Protocol      int      `json:"protocol"`
	ScenarioHash  string   `json:"scenario_hash"`
	Driver        string   `json:"driver"`
	Build         string   `json:"build"`
	ImagePrograms string   `json:"image_programs"`
	RecordedAt    string   `json:"recorded_at"`
	Exchanges     []string `json:"exchanges"`
}

// Exchange is one recorded exchange: how it opened and every event after, and the folder that holds it.
type Exchange struct {
	Name    string            `json:"-"`
	Folder  string            `json:"-"`
	Opening recording.Opening `json:"opening"`
	Events  []recording.Event `json:"events"`
}

// Scenario is one recorded scenario with its manifest and its exchanges in order.
type Scenario struct {
	Name      string
	Manifest  Manifest
	Exchanges []Exchange
}

// Load reads the recorded scenario of the driver (or host or installation) under the repository root.
func Load(root, driver, name string) (Scenario, error) {
	scenario := driver + "/" + name
	definition := filepath.Join(root, "resources/recordings/scenarios", driver, name+".json")
	definitionHash, err := fileDigest(definition)
	if err != nil {
		return Scenario{}, fmt.Errorf("%w: %s has no definition in resources/recordings/scenarios", ErrRecordingMissing, scenario)
	}
	folder, err := folderOf(root, driver, name)
	if err != nil {
		return Scenario{}, err
	}
	var manifest Manifest
	if err := readJSON(filepath.Join(folder, "scenario.json"), &manifest); err != nil {
		return Scenario{}, fmt.Errorf("%w: %s has no recording in %s", ErrRecordingMissing, scenario, folder)
	}
	programs, err := imagePrograms()
	if err != nil {
		return Scenario{}, fmt.Errorf("reading the agent image's programs: %w", err)
	}
	if reason := manifest.staleReason(definitionHash, programs); reason != "" {
		return Scenario{}, fmt.Errorf("%w: %s: %s", ErrRecordingStale, scenario, reason)
	}
	exchanges := []Exchange{}
	for _, name := range manifest.Exchanges {
		exchange := Exchange{Name: name, Folder: filepath.Join(folder, "exchanges", name)}
		if err := readJSON(filepath.Join(exchange.Folder, "exchange.json"), &exchange); err != nil {
			return Scenario{}, fmt.Errorf("reading exchange %s of %s: %w", name, scenario, err)
		}
		exchanges = append(exchanges, exchange)
	}
	return Scenario{Name: scenario, Manifest: manifest, Exchanges: exchanges}, nil
}

// MustLoad reads the recorded scenario from the repository the test runs in, failing the test by name when it cannot.
func MustLoad(t testing.TB, driver, name string) Scenario {
	t.Helper()
	root, err := Root()
	if err != nil {
		t.Fatal(err)
	}
	scenario, err := Load(root, driver, name)
	if err != nil {
		t.Fatal(err)
	}
	return scenario
}

// Exchange is the exchange of that name.
func (scenario Scenario) Exchange(name string) (Exchange, bool) {
	for _, exchange := range scenario.Exchanges {
		if exchange.Name == name {
			return exchange, true
		}
	}
	return Exchange{}, false
}

// ExchangesOn are the exchanges that crossed the wire, in order.
func (scenario Scenario) ExchangesOn(wire recording.Wire) []Exchange {
	exchanges := []Exchange{}
	for _, exchange := range scenario.Exchanges {
		if exchange.Opening.Wire == wire {
			exchanges = append(exchanges, exchange)
		}
	}
	return exchanges
}

// Calls are the calls that crossed the wire, in the order they were answered.
func (scenario Scenario) Calls(wire recording.Wire) ([]Call, error) {
	calls := []Call{}
	for _, exchange := range scenario.ExchangesOn(wire) {
		answered, err := exchange.calls()
		if err != nil {
			return nil, err
		}
		calls = append(calls, answered...)
	}
	return calls, nil
}

func (manifest Manifest) staleReason(definitionHash, imagePrograms string) string {
	switch {
	case manifest.Format != Format:
		return staleFormat
	case manifest.Protocol < hostapi.Protocol:
		return staleProtocol
	case manifest.ScenarioHash != definitionHash:
		return staleScenario
	case manifest.ImagePrograms != imagePrograms:
		return staleImagePrograms
	}
	return ""
}

func readJSON(file string, into any) error {
	content, err := os.ReadFile(file)
	if err != nil {
		return err
	}
	return json.Unmarshal(content, into)
}
