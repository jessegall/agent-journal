package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

const testDeployKey = "-----BEGIN OPENSSH PRIVATE KEY-----\nkey-material\n-----END OPENSSH PRIVATE KEY-----\n"

// recordingDocker is a docker that writes each call's arguments and standard input to the folder, one file each, and
// answers a run with the given script.
func recordingDocker(t *testing.T, onRun string) (Containers, string) {
	t.Helper()
	folder := t.TempDir()
	answer := `n=$(ls "` + folder + `" | wc -l | tr -d ' '); echo "$@" > "` + folder + `/call-$n"; ` +
		`if [ "$3" = run ]; then cat > "` + folder + `/stdin-$n"; ` + onRun + `; fi`
	containers := fakeImageDocker(t, answer)
	containers.Rules = containedRules

	return containers, folder
}

func recorded(t *testing.T, folder, prefix string) string {
	t.Helper()
	matches, _ := filepath.Glob(filepath.Join(folder, prefix+"*"))
	var text strings.Builder
	for _, match := range matches {
		content, err := os.ReadFile(match)
		if err != nil {
			t.Fatal(err)
		}
		text.Write(content)
	}

	return text.String()
}

func TestTheDeployKeyReachesTheCloneOnStandardInputAlone(t *testing.T) {
	containers, folder := recordingDocker(t, "exit 0")

	err := containers.FillWorkspace(context.Background(), "journal-workspace-7", "git@example.test:team/app.git",
		"abc123", []byte(testDeployKey))
	if err != nil {
		t.Fatalf("a clean clone gave %v", err)
	}

	calls := recorded(t, folder, "call-")
	if strings.Contains(calls, "key-material") {
		t.Fatal("the deploy key is in a docker argument or environment value")
	}

	if recorded(t, folder, "stdin-") != testDeployKey {
		t.Fatal("the deploy key did not reach the clone on standard input")
	}

	for _, want := range []string{"volume create", "journal-workspace-7", "target=/workspace", "--cap-drop ALL",
		"--read-only", "--rm", "'--no-hardlinks'", "'-B' 'version-6' 'abc123'", "'remote' 'remove' 'origin'"} {
		if !strings.Contains(calls, want) {
			t.Fatalf("the clone lacks %q in %s", want, calls)
		}
	}
}

func TestAFailedCloneNamesItsCauseAndRemovesTheVolume(t *testing.T) {
	cases := map[string]error{
		"echo 'git@example.test: Permission denied (publickey).' >&2; exit 128": ErrDeployKeyRefused,
		"echo 'ERROR: Repository not found.' >&2; exit 128":                     ErrRepositoryNotFound,
		"echo 'ssh: Could not resolve hostname example.test' >&2; exit 128":     ErrRepositoryHostUnreachable,
		"echo 'something else' >&2; exit 1":                                     ErrWorkspaceCloneFailed,
	}

	for onRun, want := range cases {
		containers, folder := recordingDocker(t, onRun)

		err := containers.FillWorkspace(context.Background(), "journal-workspace-7", "git@example.test:team/app.git",
			"abc123", []byte(testDeployKey))
		if !errors.Is(err, want) {
			t.Fatalf("%q gave %v, not %v", onRun, err, want)
		}

		if strings.Contains(err.Error(), "example.test") {
			t.Fatalf("the error repeats what the clone printed: %v", err)
		}

		if !strings.Contains(recorded(t, folder, "call-"), "volume rm --force journal-workspace-7") {
			t.Fatalf("%q left its half-filled volume", onRun)
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

	folder := t.TempDir()
	empty := fakeImageDocker(t, `n=$(ls "`+folder+`" | wc -l | tr -d ' '); echo "$@" > "`+folder+`/call-$n"; `+
		`if [ "$3" = volume ] && [ "$4" = inspect ]; then exit 1; fi; if [ "$3" = run ]; then cat > /dev/null; fi`)
	empty.Rules = containedRules
	if err := empty.PrepareWorkspace(context.Background(), source); err != nil {
		t.Fatal(err)
	}
	if calls := recorded(t, folder, "call-"); !strings.Contains(calls, "volume create") || !strings.Contains(calls, " run ") {
		t.Fatalf("an empty workspace was not filled: %s", calls)
	}

	filled, filledFolder := recordingDocker(t, "exit 0")
	if err := filled.PrepareWorkspace(context.Background(), source); err != nil {
		t.Fatal(err)
	}
	if calls := recorded(t, filledFolder, "call-"); strings.Contains(calls, " run ") || strings.Contains(calls, "volume create") {
		t.Fatalf("a filled workspace was cloned again: %s", calls)
	}
}

func TestAWorkspaceSourceThatReachesOutsideIsRefusedBeforeAnything(t *testing.T) {
	containers, folder := recordingDocker(t, "exit 0")

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
	if calls := recorded(t, folder, "call-"); calls != "" {
		t.Fatalf("docker was called: %s", calls)
	}
}
