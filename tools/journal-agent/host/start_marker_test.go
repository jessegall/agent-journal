package host

import (
	"os"
	"testing"
)

func TestAMarkerWrittenBeforeTheSpawnNeedsAttention(t *testing.T) {
	markers := Markers{Folder: t.TempDir()}
	if err := markers.Write(StartMarker{RuntimeID: "runtime", ProcessGeneration: 1, Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}

	outcomes, err := markers.Reconcile()

	if err != nil || outcomes["runtime"] != NeedsAttention {
		t.Fatalf("got %v, %v", outcomes, err)
	}
}

func TestALiveMarkedProcessIsAdoptedNotStartedAgain(t *testing.T) {
	markers := Markers{Folder: t.TempDir()}
	if err := markers.Started(StartMarker{RuntimeID: "runtime", ProcessGeneration: 1}, os.Getpid()); err != nil {
		t.Fatal(err)
	}

	outcomes, err := markers.Reconcile()

	if err != nil || outcomes["runtime"] != Adopted {
		t.Fatalf("got %v, %v", outcomes, err)
	}
}

func TestAProcessWhoseStartDiffersNeedsAttention(t *testing.T) {
	markers := Markers{Folder: t.TempDir()}
	if err := markers.Write(StartMarker{RuntimeID: "runtime", ProcessID: os.Getpid(), StartIdentity: "another start"}); err != nil {
		t.Fatal(err)
	}

	outcomes, _ := markers.Reconcile()

	if outcomes["runtime"] != NeedsAttention {
		t.Fatalf("got %v", outcomes)
	}
}

func TestARuntimeNeedingAttentionStartsAgainOnlyUnderANewerGeneration(t *testing.T) {
	marker := StartMarker{RuntimeID: "runtime", ProcessGeneration: 3}

	if MayStartAgain(marker, 3) || !MayStartAgain(marker, 4) {
		t.Fatal("a runtime needing attention may start only under a newer generation")
	}
}

func TestAMarkedProcessWhoseIdentityCannotBeReadIsNotTakenForExited(t *testing.T) {
	markers := Markers{Folder: t.TempDir()}
	running := startGroup(t, "sleep 30")
	original := startIdentityOf
	t.Cleanup(func() { startIdentityOf = original })
	startIdentityOf = func(int) (string, error) { return "", errNoStartIdentity }
	marker := StartMarker{RuntimeID: "runtime-1", ProcessID: running.Pid, StartIdentity: "Thu Nov 20 01:00:00 2026"}
	if err := markers.Write(marker); err != nil {
		t.Fatal(err)
	}

	outcomes, err := markers.Reconcile()
	if err != nil {
		t.Fatal(err)
	}

	if outcomes["runtime-1"] != NeedsAttention {
		t.Fatalf("a live process whose identity could not be read was %s", outcomes["runtime-1"])
	}
}
