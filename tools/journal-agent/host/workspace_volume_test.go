package host

import (
	"context"
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"journal-agent/dockerstandin"
)

const testDeployKey = "-----BEGIN OPENSSH PRIVATE KEY-----\nkey-material\n-----END OPENSSH PRIVATE KEY-----\n"

// readingInput makes every container of the daemon read its standard input to the end, print the text and end with
// the exit code, as a clone does with its deploy key.
func readingInput(daemon *dockerstandin.Daemon, text string, code int) {
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program {
		return dockerstandin.ReadingInput(text, code)
	}
}

func TestTheDeployKeyReachesTheCloneOnStandardInputAlone(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	readingInput(daemon, "", 0)

	err := containers.FillWorkspace(context.Background(), "journal-workspace-7", "git@example.test:team/app.git",
		"abc123", []byte(testDeployKey))
	if err != nil {
		t.Fatalf("a clean clone gave %v", err)
	}

	clone := daemon.Created()[0]
	if strings.Contains(scriptOf(clone)+strings.Join(clone.Config.Env, " "), "key-material") {
		t.Fatal("the deploy key is in an argument or environment value of the clone")
	}

	if clone.Typed() != testDeployKey {
		t.Fatalf("the deploy key did not reach the clone on standard input: %q", clone.Typed())
	}

	if _, made := daemon.Volume("journal-workspace-7"); !made || len(daemon.Containers()) != 0 {
		t.Fatal("the workspace volume was not made, or the clone's container stayed")
	}
	if mountIn(t, clone.HostConfig.Mounts, workspaceTarget).Source != "journal-workspace-7" || !clone.HostConfig.ReadonlyRootfs ||
		!slices.Equal(clone.HostConfig.CapDrop, []string{"ALL"}) || clone.HostConfig.NetworkMode == "none" {
		t.Fatalf("the clone ran as %+v", clone.HostConfig)
	}
	for _, want := range []string{"'--no-hardlinks'", "'-B' 'version-6' 'abc123'", "'remote' 'remove' 'origin'"} {
		if !strings.Contains(scriptOf(clone), want) {
			t.Fatalf("the clone lacks %q in %s", want, scriptOf(clone))
		}
	}
}

func TestAFailedCloneNamesItsCauseAndRemovesTheVolume(t *testing.T) {
	cases := map[string]error{
		"git@example.test: Permission denied (publickey).": ErrDeployKeyRefused,
		"ERROR: Repository not found.":                     ErrRepositoryNotFound,
		"ssh: Could not resolve hostname example.test":     ErrRepositoryHostUnreachable,
		"something else": ErrWorkspaceCloneFailed,
	}

	for printed, want := range cases {
		containers, daemon := standIn(t, containedRules)
		readingInput(daemon, printed+"\n", 128)

		err := containers.FillWorkspace(context.Background(), "journal-workspace-7", "git@example.test:team/app.git",
			"abc123", []byte(testDeployKey))
		if !errors.Is(err, want) {
			t.Fatalf("%q gave %v, not %v", printed, err, want)
		}

		if strings.Contains(err.Error(), "example.test") {
			t.Fatalf("the error repeats what the clone printed: %v", err)
		}

		if _, kept := daemon.Volume("journal-workspace-7"); kept {
			t.Fatalf("%q left its half-filled volume", printed)
		}
	}
}

func TestADeployKeyIsReadFromItsEnvironmentsSecret(t *testing.T) {
	DeployKeyFolder = t.TempDir()
	if err := os.WriteFile(filepath.Join(DeployKeyFolder, "deploy_key_main"), []byte(testDeployKey), 0o600); err != nil {
		t.Fatal(err)
	}

	if key, err := ReadDeployKey("deploy_key_main"); err != nil || string(key) != testDeployKey {
		t.Fatalf("the secret gave %q, %v", key, err)
	}

	if _, err := ReadDeployKey("deploy_key_other"); !errors.Is(err, ErrDeployKeyMissing) {
		t.Fatalf("a missing secret gave %v", err)
	}
}

func TestAGitWorkspaceIsFilledBeforeItsFirstContainerAndLeftAloneOnceItExists(t *testing.T) {
	DeployKeyFolder = t.TempDir()
	if err := os.WriteFile(filepath.Join(DeployKeyFolder, "deploy_key_main"), []byte(testDeployKey), 0o600); err != nil {
		t.Fatal(err)
	}
	source := &WorkspacePreparation{Clone: &WorkspaceClone{Volume: "journal-workspace-main",
		Repository: "git@example.test:team/app.git", Revision: "main", DeployKeySecret: "deploy_key_main"}}

	empty, emptyDaemon := standIn(t, containedRules)
	readingInput(emptyDaemon, "", 0)
	if err := empty.PrepareWorkspace(context.Background(), source); err != nil {
		t.Fatal(err)
	}
	if _, made := emptyDaemon.Volume("journal-workspace-main"); !made || len(emptyDaemon.Created()) != 1 {
		t.Fatalf("an empty workspace was not filled: %v", emptyDaemon.Requests())
	}

	filled, filledDaemon := standIn(t, containedRules)
	filledDaemon.AddVolume("journal-workspace-main", nil)
	if err := filled.PrepareWorkspace(context.Background(), source); err != nil {
		t.Fatal(err)
	}
	if len(filledDaemon.Created()) != 0 || filledDaemon.Asked(http.MethodPost, "/volumes/create") {
		t.Fatalf("a filled workspace was cloned again: %v", filledDaemon.Requests())
	}
}

func TestAWorkspaceSourceThatReachesOutsideIsRefusedBeforeAnything(t *testing.T) {
	containers, daemon := standIn(t, containedRules)

	for source, want := range map[*WorkspacePreparation]error{
		{Clone: &WorkspaceClone{Volume: "other-workspace-main", Repository: "r", Revision: "main", DeployKeySecret: "k"}}: ErrManifestUnsafe,
		{Folder: "../etc"}: ErrWorkspaceFolderNameInvalid,
	} {
		if err := containers.PrepareWorkspace(context.Background(), source); !errors.Is(err, want) {
			t.Fatalf("%+v gave %v, want %v", *source, err, want)
		}
	}
	if _, err := ReadDeployKey("../deploy_key_main"); !errors.Is(err, ErrDeployKeyMissing) {
		t.Fatalf("a secret name with a path gave %v", err)
	}
	if len(daemon.Requests()) != 0 {
		t.Fatalf("the daemon was asked: %v", daemon.Requests())
	}
}
