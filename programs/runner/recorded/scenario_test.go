package recorded

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-runner/recording"
)

func TestARecordedScenarioLoadsWithItsExchangesAndCalls(t *testing.T) {
	scenario := MustLoad(t, "host", "folders")

	if scenario.Manifest.Driver != "host" || len(scenario.Exchanges) != len(scenario.Manifest.Exchanges) {
		t.Fatalf("loaded %s with %d exchanges of %v", scenario.Manifest.Driver, len(scenario.Exchanges), scenario.Manifest.Exchanges)
	}
	calls, err := scenario.Calls(recording.WireHost)
	if err != nil || len(calls) == 0 || calls[0].Answered.Path == "" {
		t.Fatalf("the host calls are %v, %v", calls, err)
	}
	if _, found := scenario.Exchange(scenario.Manifest.Exchanges[0]); !found {
		t.Fatalf("the exchange %s is not found by name", scenario.Manifest.Exchanges[0])
	}
}

func TestAScenarioNeverRecordedIsMissing(t *testing.T) {
	root, _ := Root()

	_, err := Load(root, "host", "never-recorded")

	if !errors.Is(err, ErrRecordingMissing) || !strings.Contains(err.Error(), "host/never-recorded") {
		t.Fatalf("loading an unrecorded scenario gave %v", err)
	}
}

// A recording whose scenario changed after it was made is stale, in the words the PHP side uses.
func TestARecordingOfAChangedScenarioIsStale(t *testing.T) {
	root, _ := Root()
	copied := t.TempDir()
	copyTree(t, filepath.Join(root, "resources/recordings/host/folders"), filepath.Join(copied, "resources/recordings/host/folders"))
	definition := filepath.Join(copied, "resources/recordings/scenarios/host/folders.json")
	copyFile(t, filepath.Join(root, "resources/recordings/scenarios/host/folders.json"), definition)
	changed, _ := os.ReadFile(definition)
	if err := os.WriteFile(definition, append(changed, '\n'), 0o644); err != nil {
		t.Fatal(err)
	}

	_, err := Load(copied, "host", "folders")

	if !errors.Is(err, ErrRecordingStale) || !strings.Contains(err.Error(), staleScenario) {
		t.Fatalf("loading a changed scenario gave %v", err)
	}
}

func copyTree(t *testing.T, from, to string) {
	t.Helper()
	err := filepath.Walk(from, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		relative, _ := filepath.Rel(from, path)
		copyFile(t, path, filepath.Join(to, relative))
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}

func copyFile(t *testing.T, from, to string) {
	t.Helper()
	content, err := os.ReadFile(from)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Dir(to), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(to, content, 0o644); err != nil {
		t.Fatal(err)
	}
}
