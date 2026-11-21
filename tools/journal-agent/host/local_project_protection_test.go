package host

import (
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

// probeVariable makes the test binary act as the protection probe program instead of running the tests.
const probeVariable = "JOURNAL_AGENT_PROTECTION_PROBE"

func TestTheLocalProjectConfinementKeepsAChildInsideItsOwnCheckout(t *testing.T) {
	program, err := os.Executable()
	if err != nil {
		t.Fatal(err)
	}
	t.Setenv(probeVariable, "1")

	report, err := ProbeLocalProjectProtection([]string{program, "-test.run=^$"})
	if runtime.GOOS != "darwin" && errors.Is(err, ErrLocalProjectUnprotected) {
		t.Skipf("this machine has no confinement: %v", err)
	}
	if err != nil {
		t.Fatal(err)
	}

	want := map[string]string{
		"write inside its own checkout":         "allowed",
		"write inside its own runtime folder":   "allowed",
		"write Git's common directory":          "refused",
		"write a sibling worktree":              "refused",
		"read a sibling worktree":               "refused",
		"read the project's canonical checkout": "refused",
		"write the relay's state":               "refused",
		"connect to a socket of the relay":      "refused",
		"connect to its own Git broker":         "allowed",
		"connect to a sibling's Git broker":     "refused",
	}
	for _, check := range report.Checks {
		if want[check.Action] != check.Observed || !check.Held {
			t.Errorf("%s: observed %s, want %s\n%s", check.Action, check.Observed, want[check.Action], check.Detail)
		}
		delete(want, check.Action)
	}
	if len(want) != 0 || !report.Available {
		t.Fatalf("the report left out %v or is not available: %+v", want, report)
	}
}

func TestAPlatformWithNoConfinementRefusesTheChildStartByName(t *testing.T) {
	if runtime.GOOS == "darwin" || runtime.GOOS == "linux" {
		t.Skip("this platform has a confinement")
	}
	folder := t.TempDir()
	folders := LocalProjectFolders{Checkout: folder, Project: folder, Common: folder, State: folder, Runtime: folder,
		Broker: filepath.Join(folder, BrokerSocketName)}

	if _, err := ConfineChild(folders); !errors.Is(err, ErrLocalProjectUnprotected) {
		t.Fatalf("the child start was not refused by name: %v", err)
	}
}

func TestTheProbeRefusesAnUnknownAction(t *testing.T) {
	if err := RunProtectionProbe("delete", t.TempDir()); err == nil {
		t.Fatal("an unknown probe action ran")
	}
}
