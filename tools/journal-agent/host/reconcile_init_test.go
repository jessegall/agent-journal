package host

import (
	"context"
	"net/http"
	"testing"
)

// User message 19586: a session whose host restarted is no longer served, so it is stopped by itself and marked so.
func TestASessionContainerFoundRunningWhenTheHostStartsIsRemovedAndCountsAsExited(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("journal-session-7", map[string]string{installationLabel: "journal", sessionLabel: "session-7"}, true)

	sessions, err := ContainerSessionsOf(context.Background(), containers, "journal")
	if err != nil {
		t.Fatal(err)
	}

	if _, held := daemon.Container("journal-session-7"); held || sessions["session-7"].Running {
		t.Fatalf("a container nothing serves stayed: %+v", sessions)
	}
	if sessions.reconcileContainer(StartRecord{SessionID: "session-7"}) != Exited {
		t.Fatal("a removed container was not reported exited")
	}
}

func TestASessionContainerThatCouldNotBeRemovedNeedsAttention(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("journal-session-7", map[string]string{installationLabel: "journal", sessionLabel: "session-7"}, true)
	daemon.Refuse(http.MethodDelete, "/containers/", http.StatusInternalServerError, daemonRefusal, 1)

	sessions, err := ContainerSessionsOf(context.Background(), containers, "journal")
	if err != nil {
		t.Fatal(err)
	}

	if sessions.reconcileContainer(StartRecord{SessionID: "session-7"}) != NeedsAttention {
		t.Fatalf("a container that still runs was reported as %+v", sessions)
	}
}

func TestAStoppedSessionContainerIsLeftForItsCleanup(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("journal-session-7", map[string]string{installationLabel: "journal", sessionLabel: "session-7"}, false)

	sessions, err := ContainerSessionsOf(context.Background(), containers, "journal")
	if err != nil {
		t.Fatal(err)
	}

	if _, held := daemon.Container("journal-session-7"); !held || sessions["session-7"].Running {
		t.Fatalf("a stopped container was removed or counted as running: %+v", sessions)
	}
}
