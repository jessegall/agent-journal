package host

import (
	"context"
	"encoding/json"
	"maps"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func labels() StartLabels {
	return StartLabels{Installation: "install-1", Start: "start-7", Session: "session-7"}
}

// installationLabels are the labels of a container of the installation the tests sweep, running the session.
func installationLabels(session string) map[string]string {
	return map[string]string{installationLabel: labels().Installation, sessionLabel: session}
}

// removalInProgress is how a daemon refuses to remove a container another caller is removing at that moment.
const removalInProgress = "removal of container c1 " + removalUnderWay

func TestAContainerAnotherCallerIsRemovingIsAskedForAgainUntilItIsGone(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("c1", nil, false)
	daemon.Refuse(http.MethodDelete, "/containers/c1", http.StatusConflict, removalInProgress, 1)

	if err := containers.Remove(context.Background(), "c1", 1); err != nil {
		t.Fatalf("a removal already under way gave %v", err)
	}

	asked := slices.DeleteFunc(daemon.Requests(), func(request string) bool {
		return !strings.HasPrefix(request, http.MethodDelete)
	})
	if _, held := daemon.Container("c1"); held || len(asked) != 2 {
		t.Fatalf("the removal was asked for %v, not once more after the one under way", asked)
	}
}

func TestACreatedContainerCarriesTheStartLabels(t *testing.T) {
	options, err := manifest().CreateOptions("helper-7", labels(), localRules)
	if err != nil {
		t.Fatal(err)
	}

	want := map[string]string{installationLabel: "install-1", startLabel: "start-7", sessionLabel: "session-7"}
	if !maps.Equal(options.Config.Labels, want) {
		t.Fatalf("the labels are %v", options.Config.Labels)
	}
}

func TestACleanupRemovesTheTransientResourcesAndKeepsTheWorkspace(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("journal-session-7", installationLabels("session-7"), true)
	if err := containers.EnsureNetwork(context.Background(), "journal-session-7", labels()); err != nil {
		t.Fatal(err)
	}
	runtimes := t.TempDir()
	workspace := filepath.Join(t.TempDir(), "helper-7")
	for _, folder := range []string{filepath.Join(runtimes, "session-7"), workspace} {
		if err := os.MkdirAll(folder, 0o700); err != nil {
			t.Fatal(err)
		}
	}
	cleanup := StartCleanup{Containers: containers, Installation: "journal", RuntimeFolders: runtimes, StopSeconds: 10}
	pending := PendingCleanup{SessionID: "session-7", Remaining: []CleanupStep{CleanupContainer, CleanupNetwork, CleanupRuntime}}

	report := cleanup.CleanUp(context.Background(), pending)

	if report.Failure != "" || len(report.Removed) != 3 {
		t.Fatalf("the cleanup reported %+v", report)
	}
	_, hasContainer := daemon.Container("journal-session-7")
	_, hasNetwork := daemon.Network("journal-session-7")
	if hasContainer || hasNetwork || !daemon.WasAsked(http.MethodPost, "/containers/journal-session-7/stop?t=10") {
		t.Fatalf("the container or its network is still there, or it was not stopped within its bound: %v", daemon.Requests())
	}
	if _, err := os.Stat(filepath.Join(runtimes, "session-7")); !os.IsNotExist(err) {
		t.Fatal("the runtime folder is still there")
	}
	if _, err := os.Stat(workspace); err != nil {
		t.Fatal("the workspace was removed")
	}
}

func TestACleanupRunTwiceAfterACrashFindsEverythingGoneAndChangesNothing(t *testing.T) {
	containers, _ := standIn(t, localRules)
	cleanup := StartCleanup{Containers: containers, Installation: "journal", RuntimeFolders: t.TempDir(), StopSeconds: 10}
	pending := PendingCleanup{SessionID: "session-7", Remaining: []CleanupStep{CleanupContainer, CleanupNetwork, CleanupRuntime}}

	report := cleanup.CleanUp(context.Background(), pending)

	if report.Failure != "" || len(report.Removed) != 3 {
		t.Fatalf("a second pass reported %+v", report)
	}
}

func TestAnOrphanAfterARestartIsFencedAndAStrangerIsUntouched(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("orphan", installationLabels("session-9"), true)
	live := daemon.AddContainer("live", installationLabels("session-8"), true)
	stranger := daemon.AddContainer("stranger", map[string]string{sessionLabel: "session-9"}, true)

	outcomes, err := SweepOrphans(context.Background(), containers, "install-1",
		func(session string) bool { return session == "session-8" }, 10)

	if err != nil {
		t.Fatal(err)
	}
	if len(outcomes) != 1 || outcomes[0] != (OrphanOutcome{Session: "session-9", Outcome: Exited}) {
		t.Fatalf("the sweep concluded %+v", outcomes)
	}
	if _, held := daemon.Container("orphan"); held || !live.IsRunning() || !stranger.IsRunning() {
		t.Fatalf("the sweep left the orphan or touched more than it: %v", daemon.Requests())
	}
}

func TestAnOrphanWhoseExitCannotBeConfirmedIsNeverReportedIdle(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("stuck", installationLabels("session-9"), true)
	daemon.Refuse(http.MethodPost, "/stop", http.StatusInternalServerError, daemonRefusal, 5)

	outcomes, err := SweepOrphans(context.Background(), containers, "install-1", func(string) bool { return false }, 10)

	if err != nil || len(outcomes) != 1 || outcomes[0].Outcome != NeedsAttention {
		t.Fatalf("the sweep concluded %+v, %v", outcomes, err)
	}
}

func TestAContainerThatBindsAnAccountIsFoundByItsLabel(t *testing.T) {
	containers, daemon := standIn(t, localRules)
	daemon.AddContainer("journal-session-7", map[string]string{accountLabel: "7"}, false)

	bound, err := containers.BindsAccount(context.Background(), "7")
	free, freeErr := containers.BindsAccount(context.Background(), "8")
	if err != nil || freeErr != nil || !bound || free {
		t.Fatalf("account 7 is bound %v (%v) and account 8 %v (%v)", bound, err, free, freeErr)
	}
}

// cleanupJournal plays the journal's cleanup routes: it lists its pending cleanups and keeps each report.
type cleanupJournal struct {
	pending []PendingCleanup
	reports map[string]CleanupReport
}

func (journal *cleanupJournal) PendingCleanups(_ context.Context, answer any) error {
	listed, err := json.Marshal(map[string]any{"pending": journal.pending})
	if err != nil {
		return err
	}
	return json.Unmarshal(listed, answer)
}

func (journal *cleanupJournal) NotifyCleanup(_ context.Context, sessionID string, report any) error {
	journal.reports[sessionID] = report.(CleanupReport)
	return nil
}

func TestARoundRunsEveryPendingCleanupAndReportsIt(t *testing.T) {
	containers, _ := standIn(t, localRules)
	cleanup := StartCleanup{Containers: containers, Installation: "journal", RuntimeFolders: t.TempDir(), StopSeconds: 10}
	journal := &cleanupJournal{
		pending: []PendingCleanup{{SessionID: "session-7", Remaining: []CleanupStep{CleanupContainer, CleanupNetwork, CleanupRuntime}}},
		reports: map[string]CleanupReport{},
	}

	if err := cleanup.RunPending(context.Background(), journal); err != nil {
		t.Fatal(err)
	}

	report, reported := journal.reports["session-7"]
	if !reported || report.Failure != "" || len(report.Removed) != 3 {
		t.Fatalf("the round reported %+v", journal.reports)
	}
}
