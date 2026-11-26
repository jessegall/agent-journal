package hostapi

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"testing"

	"journal-agent/host"
)

func TestAConnectedHostOpensOnlyItsSealedPrograms(t *testing.T) {
	table := OpenProcessTable(t.TempDir(), host.Containers{}, nil, nil)
	table.AllowOnly(&AllowedPrograms{Programs: map[string]string{"AGENT_EXECUTABLE": "/sealed/bin/agent"}})

	listed := table.requireListed(OpenPlan{Argv: []string{"/sealed/bin/agent", "--print"}})
	unlisted := table.requireListed(OpenPlan{Argv: []string{"/bin/sh", "-c", "id"}})
	healed := table.requireListed(OpenPlan{Argv: []string{"/sealed/bin/agent"}, RestartArgv: []string{"/usr/bin/env"}})

	var refusal RefusalError
	if listed != nil {
		t.Fatalf("a sealed program was refused: %v", listed)
	}
	if !errors.As(unlisted, &refusal) || !errors.As(healed, &refusal) || refusal.Refusal != Unsafe {
		t.Fatalf("an unlisted program was opened: %v, %v", unlisted, healed)
	}
}

func TestACoLocatedHostOpensAnyProgram(t *testing.T) {
	table := OpenProcessTable(t.TempDir(), host.Containers{}, nil, nil)

	if err := table.requireListed(OpenPlan{Argv: []string{"/bin/sh"}}); err != nil {
		t.Fatalf("a co-located host refused a program: %v", err)
	}
}

func TestEachReleaseReadsItsOwnListAndAReleaseWithoutOneAllowsNothing(t *testing.T) {
	state := t.TempDir()
	path := AllowedProgramsFile(state, "6.1.0")
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		t.Fatal(err)
	}
	content, _ := json.Marshal(AllowedPrograms{Release: "6.1.0", Programs: map[string]string{"OTHER_EXECUTABLE": "/r/bin/other"}})
	if err := os.WriteFile(path, content, 0o600); err != nil {
		t.Fatal(err)
	}

	listed, err := LoadAllowedPrograms(state, "6.1.0")
	if err != nil {
		t.Fatal(err)
	}
	other, err := LoadAllowedPrograms(state, "6.0.0")
	if err != nil {
		t.Fatal(err)
	}

	if !listed.Permits("/r/bin/other") || other.Permits("/r/bin/other") || len(other.Programs) != 0 {
		t.Fatalf("the lists read as %+v and %+v", listed, other)
	}
}
