package host

import (
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func labels() LaunchLabels {
	return LaunchLabels{Installation: "install-1", Launch: "launch-7", Session: "session-7"}
}

// fakeDocker writes a docker stand-in that logs every call and knows only the containers and networks named in
// present; everything else is reported missing, as Docker does.
func fakeDocker(t *testing.T, present string, listed string) (Containers, string) {
	t.Helper()
	folder := t.TempDir()
	log := filepath.Join(folder, "calls.log")
	script := `#!/bin/sh
echo "$*" >> ` + log + `
case "$1" in
ps) printf '` + listed + `' ;;
network) case " ` + present + ` " in *" $3 "*) ;; *) echo "Error: No such network: $3" >&2; exit 1 ;; esac ;;
*) eval "name=\${$#}"; case " ` + present + ` " in *" $name "*) ;; *) echo "Error: No such container: $name" >&2; exit 1 ;; esac ;;
esac
`
	path := filepath.Join(folder, "docker")
	if err := os.WriteFile(path, []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
	return Containers{Docker: path}, log
}

func calls(t *testing.T, log string) []string {
	t.Helper()
	content, _ := os.ReadFile(log)
	return strings.Split(strings.TrimSpace(string(content)), "\n")
}

func TestACreatedContainerCarriesTheLaunchLabels(t *testing.T) {
	arguments, err := manifest().DockerCreateArguments("helper-7", labels(), localRules)
	if err != nil {
		t.Fatal(err)
	}

	for _, want := range []string{"journal.installation=install-1", "journal.launch=launch-7", "journal.session=session-7"} {
		if !slices.Contains(arguments, want) {
			t.Fatalf("the arguments lack %s: %v", want, arguments)
		}
	}
}

func TestACleanupRemovesTheTransientResourcesAndKeepsTheWorkspace(t *testing.T) {
	containers, log := fakeDocker(t, "journal-session-7", "")
	runtimes := t.TempDir()
	workspace := filepath.Join(t.TempDir(), "helper-7")
	for _, folder := range []string{filepath.Join(runtimes, "session-7"), workspace} {
		if err := os.MkdirAll(folder, 0o700); err != nil {
			t.Fatal(err)
		}
	}
	cleanup := LaunchCleanup{Containers: containers, RuntimeFolders: runtimes, StopSeconds: 10}
	pending := PendingCleanup{SessionID: "session-7", Remaining: []CleanupStep{CleanupContainer, CleanupNetwork, CleanupRuntime}}

	report := cleanup.CleanUp(context.Background(), pending)

	if report.Failure != "" || len(report.Removed) != 3 {
		t.Fatalf("the cleanup reported %+v", report)
	}
	if want := []string{"stop --time 10 journal-session-7", "rm --volumes journal-session-7", "network rm journal-session-7"}; !slices.Equal(calls(t, log), want) {
		t.Fatalf("docker was called with %v", calls(t, log))
	}
	if _, err := os.Stat(filepath.Join(runtimes, "session-7")); !os.IsNotExist(err) {
		t.Fatal("the runtime folder is still there")
	}
	if _, err := os.Stat(workspace); err != nil {
		t.Fatal("the workspace was removed")
	}
}

func TestACleanupRunTwiceAfterACrashFindsEverythingGoneAndChangesNothing(t *testing.T) {
	containers, _ := fakeDocker(t, "", "")
	cleanup := LaunchCleanup{Containers: containers, RuntimeFolders: t.TempDir(), StopSeconds: 10}
	pending := PendingCleanup{SessionID: "session-7", Remaining: []CleanupStep{CleanupContainer, CleanupNetwork, CleanupRuntime}}

	report := cleanup.CleanUp(context.Background(), pending)

	if report.Failure != "" || len(report.Removed) != 3 {
		t.Fatalf("a second pass reported %+v", report)
	}
}

func TestAnOrphanAfterARestartIsFencedAndAStrangerIsUntouched(t *testing.T) {
	containers, log := fakeDocker(t, "orphan-id", `orphan-id\tsession-9\nlive-id\tsession-8\n`)

	outcomes, err := SweepOrphans(context.Background(), containers, "install-1",
		func(session string) bool { return session == "session-8" }, 10)

	if err != nil {
		t.Fatal(err)
	}
	if len(outcomes) != 1 || outcomes[0] != (OrphanOutcome{Session: "session-9", Outcome: Exited}) {
		t.Fatalf("the sweep concluded %+v", outcomes)
	}
	all := calls(t, log)
	if !strings.Contains(all[0], "label=journal.installation=install-1") || slices.ContainsFunc(all, func(call string) bool {
		return strings.Contains(call, "live-id")
	}) {
		t.Fatalf("the sweep touched more than the orphan: %v", all)
	}
}

func TestAnOrphanWhoseExitCannotBeConfirmedIsNeverReportedIdle(t *testing.T) {
	containers, _ := fakeDocker(t, "", `stuck-id\tsession-9\n`)
	containers.Docker = writeFailingDocker(t, `stuck-id\tsession-9\n`)

	outcomes, err := SweepOrphans(context.Background(), containers, "install-1", func(string) bool { return false }, 10)

	if err != nil || len(outcomes) != 1 || outcomes[0].Outcome != NeedsAttention {
		t.Fatalf("the sweep concluded %+v, %v", outcomes, err)
	}
}

// writeFailingDocker is a docker stand-in whose stop fails for a reason other than a missing container.
func writeFailingDocker(t *testing.T, listed string) string {
	t.Helper()
	path := filepath.Join(t.TempDir(), "docker")
	script := "#!/bin/sh\ncase \"$1\" in\nps) printf '" + listed + "' ;;\n*) echo 'Error: daemon busy' >&2; exit 1 ;;\nesac\n"
	if err := os.WriteFile(path, []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
	return path
}
