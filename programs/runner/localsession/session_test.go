package localsession

import (
	"errors"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"journal-runner/hostapi"
)

func plannedSession(t *testing.T, argv []string) Session {
	t.Helper()
	installation := t.TempDir()
	return Session{
		Root: t.TempDir(), RuntimeID: "runtime1", SessionID: "session1", Installation: installation,
		Programs: map[string]string{"PROGRAM_EXECUTABLE": filepath.Join(installation, "bin", "program")},
		Plan: hostapi.OpenPlan{
			Argv:        argv,
			Environment: []string{"HOME={folder:home}", "PATH={host:INSTALLATION}/bin"},
			Folders:     []string{"home", "account"},
			KeptFiles:   []string{"{folder:account}/credential.json"},
		},
	}
}

func TestASessionRunsTheSealedProgramWithThePlansEnvironmentAndKeptFiles(t *testing.T) {
	session := plannedSession(t, []string{"{host:PROGRAM_EXECUTABLE}", "--session-id", "session1"})

	prepared, err := session.Prepare([]string{"--verbose"})
	if err != nil {
		t.Fatal(err)
	}

	plan := filepath.Join(session.Folder(), "plan")
	environment := strings.Join(prepared.Command.Env, "\n")
	if prepared.Command.Path != session.Programs["PROGRAM_EXECUTABLE"] ||
		!slices.Equal(prepared.Command.Args[1:], []string{"--session-id", "session1", "--verbose"}) ||
		!strings.Contains(environment, "HOME="+filepath.Join(plan, "home")) ||
		!strings.Contains(environment, "JOURNAL_SESSION_RUN="+session.RunFolder()) ||
		!slices.Equal(prepared.KeptFiles, []string{filepath.Join(plan, "account", "credential.json")}) {
		t.Fatalf("the session was prepared as %v %v, keeping %v", prepared.Command.Args, prepared.Command.Env, prepared.KeptFiles)
	}
}

func TestAProgramTheInstallationDidNotSealOrAnOverridingArgumentIsRefused(t *testing.T) {
	if _, err := plannedSession(t, []string{"/usr/bin/other"}).Prepare(nil); !errors.Is(err, ErrProgramNotSealed) {
		t.Errorf("an unsealed program was not refused: %v", err)
	}
	if _, err := plannedSession(t, []string{"{host:PROGRAM_EXECUTABLE}"}).Prepare([]string{"--settings=x"}); !errors.Is(err, ErrSettingsOverride) {
		t.Errorf("an overriding argument was not refused: %v", err)
	}
}
