package host

import (
	"errors"
	"os"
	"runtime"
	"testing"
)

// probeVariable makes the test binary act as the protection probe program instead of running the tests.
const probeVariable = "JOURNAL_AGENT_PROTECTION_PROBE"

func TestTheLocalProjectConfinementKeepsAStartInsideItsAssignedFolder(t *testing.T) {
	program, err := os.Executable()
	if err != nil {
		t.Fatal(err)
	}
	t.Setenv(probeVariable, "1")
	state := t.TempDir()

	report, err := ProbeLocalProjectProtection([]string{program, "-test.run=^$"}, state)
	if runtime.GOOS != "darwin" && errors.Is(err, ErrLocalProjectUnprotected) {
		t.Skipf("this machine has no confinement: %v", err)
	}
	if err != nil {
		t.Fatal(err)
	}

	want := map[string]string{
		"write inside the assigned folder":                "allowed",
		"write outside the assigned folder":               "refused",
		"read the private state folder":                   "refused",
		"connect to a socket outside the assigned folder": "refused",
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

func TestTheProbeRefusesAnUnknownAction(t *testing.T) {
	if err := RunProtectionProbe("delete", t.TempDir()); err == nil {
		t.Fatal("an unknown probe action ran")
	}
}
