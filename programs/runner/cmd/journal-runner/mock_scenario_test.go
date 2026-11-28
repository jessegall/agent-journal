//go:build mock

package main

import (
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// terminalTurn is the recorded terminal of the terminal-turn scenario, with its fixture.
func terminalTurn(t *testing.T) (recorded.Scenario, recorded.Exchange, recording.Fixture) {
	t.Helper()
	scenario := recorded.MustLoad(t, "terminal-turn")
	for _, exchange := range scenario.ExchangesOn(recording.WireDriver) {
		if exchange.Opening.Mode == "terminal" {
			fixture, err := recording.Load(exchange.Folder)
			if err != nil {
				t.Fatal(err)
			}
			return scenario, exchange, fixture
		}
	}
	t.Fatal("the terminal-turn scenario holds no terminal")
	return recorded.Scenario{}, recorded.Exchange{}, recording.Fixture{}
}

func typedOf(fixture recording.Fixture) []byte {
	var typed bytes.Buffer
	for _, input := range fixture.Inputs {
		typed.Write(input.Bytes)
	}
	return typed.Bytes()
}

func TestARecordedTerminalTurnPlaysWhatItPrintedAsItIsTyped(t *testing.T) {
	_, exchange, fixture := terminalTurn(t)
	var played bytes.Buffer

	if err := playExchange(exchange, bytes.NewReader(typedOf(fixture)), &played, nil); err != nil {
		t.Fatal(err)
	}

	var printed bytes.Buffer
	for _, chunk := range fixture.Output {
		printed.Write(chunk.Bytes)
	}
	if !bytes.Equal(played.Bytes(), printed.Bytes()) {
		t.Fatalf("the turn played %d bytes, not the %d it printed", played.Len(), printed.Len())
	}
}

func TestEachRecordedHookRunsAsTheStartsSettingsConfigureIt(t *testing.T) {
	scenario, exchange, fixture := terminalTurn(t)
	folder := t.TempDir()
	heard := filepath.Join(folder, "heard")
	settings := filepath.Join(folder, "settings.json")
	content := `{"hooks":{"SessionStart":[{"hooks":[{"type":"command","command":"cat >> ` + heard + `"}]}]}}`
	if err := os.WriteFile(settings, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	hooks, err := recordedHooksOf(scenario, exchange, settings)
	if err != nil {
		t.Fatal(err)
	}

	if err := playExchange(exchange, bytes.NewReader(typedOf(fixture)), &bytes.Buffer{}, hooks); err != nil {
		t.Fatal(err)
	}

	ran, _ := os.ReadFile(heard)
	if !strings.Contains(string(ran), `"hook_event_name":"SessionStart"`) {
		t.Fatalf("the SessionStart hook ran with %q, not the recorded native body", ran)
	}
}

func TestAStartThatNamesNoModelIsRefused(t *testing.T) {
	if err := assertModelNamed([]string{"--settings", "/tmp/journal-session/settings.json"}); !errors.Is(err, errNoModel) {
		t.Fatalf("a start without a model was answered %v", err)
	}
	if err := assertModelNamed([]string{"--version"}); err != nil {
		t.Fatalf("the version probe was refused: %v", err)
	}
}
