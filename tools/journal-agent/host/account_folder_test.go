package host

import (
	"context"
	"encoding/base64"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// accountFolderFixture makes a journal root with one private account folder holding a sign-in file, owned by the
// test's own user, as the sign-in runner leaves one.
func accountFolderFixture(t *testing.T) (string, string) {
	if exec.Command("stat", "-c", "%u", "/").Run() != nil {
		t.Skip("the check needs GNU stat; run it in the golang image")
	}

	root := t.TempDir()
	folder := filepath.Join(root, "accounts", "a1")
	for _, step := range []error{
		os.Chmod(root, 0o755),
		os.MkdirAll(folder, 0o700),
		os.Chmod(filepath.Join(root, "accounts"), 0o755),
		os.Chmod(folder, 0o700),
		os.WriteFile(filepath.Join(folder, ".credentials.json"), []byte("{}"), 0o600),
		os.Mkdir(filepath.Join(folder, "projects"), 0o700),
	} {
		if step != nil {
			t.Fatal(step)
		}
	}

	return root, folder
}

func runAccountFolderCheck(root string) error {
	output, err := exec.Command("sh", "-c", accountFolderScript(root, "a1", os.Getuid(), os.Getuid())).CombinedOutput()
	if err == nil {
		return nil
	}

	return accountFolderRefusal(string(output), err)
}

func TestAnAccountFolderTheSignInRunnerMadePassesTheCheck(t *testing.T) {
	root, _ := accountFolderFixture(t)

	if err := runAccountFolderCheck(root); err != nil {
		t.Fatalf("a private folder was refused: %v", err)
	}
}

func TestAnAccountFolderThatIsNotPrivateIsRefusedNamingThePathAndReason(t *testing.T) {
	cases := map[string]struct {
		change func(root, folder string) error
		want   string
	}{
		"a folder with mode 0750": {func(_, folder string) error { return os.Chmod(folder, 0o750) },
			"accounts/a1 is not owned"},
		"a file 0644": {func(_, folder string) error { return os.Chmod(filepath.Join(folder, ".credentials.json"), 0o644) },
			".credentials.json is readable or writable by group or other"},
		"a link out of the folder": {func(root, folder string) error { return os.Symlink(root, filepath.Join(folder, "out")) },
			"out is a link leading out of the folder"},
		"a linked account folder": {func(root, folder string) error {
			real := filepath.Join(root, "elsewhere")
			if err := os.Rename(folder, real); err != nil {
				return err
			}
			return os.Symlink(real, folder)
		}, "accounts/a1 is a link"},
		"an accounts root writable by others": {func(root, _ string) error {
			return os.Chmod(filepath.Join(root, "accounts"), 0o777)
		}, "accounts is writable by group or other"},
	}
	for name, test := range cases {
		root, folder := accountFolderFixture(t)
		if err := test.change(root, folder); err != nil {
			t.Fatal(err)
		}

		err := runAccountFolderCheck(root)
		if !errors.Is(err, ErrAccountFolderUnsafe) || !strings.Contains(err.Error(), test.want) {
			t.Fatalf("%s gave %v", name, err)
		}
	}
}

func TestAnAccountFolderOwnedByAnotherUserIsRefused(t *testing.T) {
	if os.Getuid() != 0 {
		t.Skip("handing a folder to another user needs root; run it in the golang image")
	}

	root, folder := accountFolderFixture(t)
	if err := os.Chown(folder, 4242, 4242); err != nil {
		t.Fatal(err)
	}

	if err := runAccountFolderCheck(root); !errors.Is(err, ErrAccountFolderUnsafe) ||
		!strings.Contains(err.Error(), "accounts/a1 is not owned") {
		t.Fatalf("another user's folder gave %v", err)
	}
}

func TestTheHostMakesTheHistoryFolderAsTheProgramBeforeItChecksTheAccount(t *testing.T) {
	folder := t.TempDir()
	log := filepath.Join(folder, "calls.log")
	docker := filepath.Join(folder, "docker")
	if err := os.WriteFile(docker, []byte("#!/bin/sh\necho \"$*\" >> "+log+"\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	containers := Containers{Docker: docker, Rules: ContainerRules{AgentImage: "sha256:image"}}

	if err := containers.CheckAccountFolder(context.Background(), "a1"); err != nil {
		t.Fatal(err)
	}

	content, err := os.ReadFile(log)
	if err != nil {
		t.Fatal(err)
	}
	runs := strings.Split(strings.TrimPrefix(string(content), "run "), "\nrun ")
	if len(runs) != 2 {
		t.Fatalf("docker ran %d times: %v", len(runs), runs)
	}
	made, checked := runs[0], runs[1]
	if !strings.Contains(made, "--user "+agentUser) || !strings.Contains(made, "source=/srv/journal/accounts/a1,target=/account") ||
		!strings.Contains(made, "mkdir -m 0700 /account/projects") || strings.Contains(made, "target=/srv/journal") {
		t.Fatalf("the history folder was made by %q", made)
	}
	if !strings.Contains(checked, "source=/srv/journal,target=/srv/journal,readonly") {
		t.Fatalf("the check ran as %q", checked)
	}
}

func TestTheHostMakesAnAccountFolderAsRootForTheProgramAndKeepsTheRootRoots(t *testing.T) {
	folder := t.TempDir()
	log := filepath.Join(folder, "calls.log")
	docker := filepath.Join(folder, "docker")
	if err := os.WriteFile(docker, []byte("#!/bin/sh\necho \"$*\" >> "+log+"\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	containers := Containers{Docker: docker, Rules: ContainerRules{AgentImage: "sha256:image"}}

	if err := containers.MakeAccountFolder(context.Background(), "a1", "operation-1"); err != nil {
		t.Fatal(err)
	}
	if err := containers.MakeAccountFolder(context.Background(), "../a1", "operation-1"); !errors.Is(err, ErrAccountFolderUnsafe) {
		t.Fatalf("a path for an id was answered %v", err)
	}
	if err := containers.MakeAccountFolder(context.Background(), "a1", "../x"); !errors.Is(err, ErrAccountFolderUnsafe) {
		t.Fatalf("a path for an operation was answered %v", err)
	}

	content, err := os.ReadFile(log)
	if err != nil {
		t.Fatal(err)
	}
	made := string(content)
	for _, want := range []string{"--user 0:0", "--cap-drop ALL", "--cap-add CHOWN", "source=/srv/journal/accounts,target=/accounts",
		"chown 0:0 /accounts && chmod 0755 /accounts", `mkdir -m 0700 "$folder"`, `chown 10001:10001 "$folder" && chmod 0700 "$folder"`,
		`mkdir -m 0700 "$folder/projects"`} {
		if !strings.Contains(made, want) {
			t.Fatalf("the folder was made without %q: %s", want, made)
		}
	}
}

func TestTheHostWritesAnAccountFileForTheProgramAndRefusesAPathForAName(t *testing.T) {
	folder := t.TempDir()
	log := filepath.Join(folder, "calls.log")
	docker := filepath.Join(folder, "docker")
	if err := os.WriteFile(docker, []byte("#!/bin/sh\necho \"$*\" >> "+log+"\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	containers := Containers{Docker: docker, Rules: ContainerRules{AgentImage: "sha256:image"}}
	content := []byte("include_local = false\n")

	if err := containers.WriteAccountFile(context.Background(), "a1", "environments.toml", content); err != nil {
		t.Fatal(err)
	}
	for _, name := range []string{"../config.toml", "sub/file", ""} {
		if err := containers.WriteAccountFile(context.Background(), "a1", name, content); !errors.Is(err, ErrAccountFolderUnsafe) {
			t.Fatalf("the name %q was answered %v", name, err)
		}
	}
	if err := containers.WriteAccountFile(context.Background(), "../a1", "environments.toml", content); !errors.Is(err, ErrAccountFolderUnsafe) {
		t.Fatalf("a path for an id was answered %v", err)
	}

	calls, err := os.ReadFile(log)
	if err != nil {
		t.Fatal(err)
	}
	written := string(calls)
	if strings.Count(written, "run --rm") != 1 {
		t.Fatalf("a refused file still ran a container: %s", written)
	}
	for _, want := range []string{"--user 0:0", "--cap-drop ALL", "source=/srv/journal/accounts,target=/accounts",
		base64.StdEncoding.EncodeToString(content), `[ -L "/accounts/a1/environments.toml" ]`,
		`chown 10001:10001 "/accounts/a1/environments.toml.new"`, `chmod 0600 "/accounts/a1/environments.toml.new"`,
		`mv -f "/accounts/a1/environments.toml.new" "/accounts/a1/environments.toml"`} {
		if !strings.Contains(written, want) {
			t.Fatalf("the file was written without %q: %s", want, written)
		}
	}
}

func TestAFolderMakeSentAgainFindsItsOwnFolderAndAnotherMakeIsRefused(t *testing.T) {
	root := t.TempDir()
	bin := t.TempDir()
	if err := os.WriteFile(filepath.Join(bin, "chown"), []byte("#!/bin/sh\nexit 0\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	accounts := filepath.Join(root, "accounts")
	if err := os.Mkdir(accounts, 0o755); err != nil {
		t.Fatal(err)
	}
	run := func(operation string) (string, error) {
		command := exec.Command("sh", "-c", makeAccountFolderScript(accounts, "a1", operation, "10001"))
		command.Env = append(os.Environ(), "PATH="+bin+":"+os.Getenv("PATH"))
		output, err := command.CombinedOutput()

		return string(output), err
	}

	if output, err := run("operation-1"); err != nil {
		t.Fatalf("the first make failed: %v: %s", err, output)
	}
	if err := os.Chmod(filepath.Join(accounts, "a1"), 0o755); err != nil {
		t.Fatal(err)
	}
	if output, err := run("operation-1"); err != nil {
		t.Fatalf("the same make sent again failed: %v: %s", err, output)
	}
	info, err := os.Stat(filepath.Join(accounts, "a1"))
	if err != nil || info.Mode().Perm() != 0o700 {
		t.Fatalf("the folder sent again was left %v, %v", info, err)
	}
	if output, err := run("operation-2"); err == nil || !strings.Contains(output, "another sign-in made this folder") {
		t.Fatalf("another make of the same folder was answered %v: %s", err, output)
	}
}
