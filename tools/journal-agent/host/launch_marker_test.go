package host

import (
	"os"
	"testing"
)

func TestAMarkerWrittenBeforeTheSpawnNeedsAttention(t *testing.T) {
	markers := Markers{Folder: t.TempDir()}
	if err := markers.Write(LaunchMarker{RuntimeID: "runtime", ProcessGeneration: 1, Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}

	outcomes, err := markers.Reconcile()

	if err != nil || outcomes["runtime"] != NeedsAttention {
		t.Fatalf("got %v, %v", outcomes, err)
	}
}

func TestALiveMarkedProcessIsAdoptedNotStartedAgain(t *testing.T) {
	markers := Markers{Folder: t.TempDir()}
	if err := markers.Started(LaunchMarker{RuntimeID: "runtime", ProcessGeneration: 1}, os.Getpid()); err != nil {
		t.Fatal(err)
	}

	outcomes, err := markers.Reconcile()

	if err != nil || outcomes["runtime"] != Adopted {
		t.Fatalf("got %v, %v", outcomes, err)
	}
}

func TestAProcessWhoseStartDiffersNeedsAttention(t *testing.T) {
	markers := Markers{Folder: t.TempDir()}
	if err := markers.Write(LaunchMarker{RuntimeID: "runtime", ProcessID: os.Getpid(), StartIdentity: "another start"}); err != nil {
		t.Fatal(err)
	}

	outcomes, _ := markers.Reconcile()

	if outcomes["runtime"] != NeedsAttention {
		t.Fatalf("got %v", outcomes)
	}
}
