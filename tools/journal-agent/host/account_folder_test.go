package host

import (
	"context"
	"encoding/base64"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"journal-agent/dockerstandin"
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

// imageRules are the rules of a host whose agent image the stand-in daemon holds.
var imageRules = ContainerRules{AgentImage: "sha256:image"}

func TestTheHostMakesTheHistoryFolderAsTheProgramBeforeItChecksTheAccount(t *testing.T) {
	containers, daemon := standIn(t, imageRules)

	if err := containers.CheckAccountFolder(context.Background(), "a1"); err != nil {
		t.Fatal(err)
	}

	runs := daemon.Created()
	if len(runs) != 3 || len(daemon.Containers()) != 0 {
		t.Fatalf("the daemon ran %d containers and still holds %d", len(runs), len(daemon.Containers()))
	}
	made, keptPrivate, checked := runs[0], runs[1], runs[2]
	for _, run := range runs {
		if run.Config.User != agentUser || run.HostConfig.NetworkMode != "none" || run.Config.Image != imageRules.AgentImage {
			t.Fatalf("a check ran as %s on network %s from %s", run.Config.User, run.HostConfig.NetworkMode, run.Config.Image)
		}
	}
	account := mountIn(t, keptPrivate.HostConfig.Mounts, "/account")
	if account.Source != "/srv/journal/accounts/a1" || account.ReadOnly || !strings.Contains(scriptOf(keptPrivate), "chmod go-rwx") {
		t.Fatalf("the account's files were kept private by %q on %+v", scriptOf(keptPrivate), account)
	}
	history := mountIn(t, made.HostConfig.Mounts, "/account")
	if history.Source != "/srv/journal/accounts/a1" || len(made.HostConfig.Mounts) != 1 ||
		!strings.Contains(scriptOf(made), "mkdir -m 0700 /account/projects") {
		t.Fatalf("the history folder was made by %q on %+v", scriptOf(made), made.HostConfig.Mounts)
	}
	if root := mountIn(t, checked.HostConfig.Mounts, journalRoot); root.Source != journalRoot || !root.ReadOnly {
		t.Fatalf("the check ran on %+v", root)
	}
}

func TestAnAccountFolderTheCheckRefusesIsNamedWithItsPathAndReason(t *testing.T) {
	containers, daemon := standIn(t, imageRules)
	open := "/srv/journal/accounts/a1/.credentials.json"
	daemon.Programs = func(created *dockerstandin.Container) dockerstandin.Program {
		if !strings.Contains(scriptOf(created), "refuse()") {
			return nil
		}

		return dockerstandin.Printing("is-open\t"+open+"\n", 1)
	}

	err := containers.CheckAccountFolder(context.Background(), "a1")
	if !errors.Is(err, ErrAccountFolderUnsafe) || !strings.Contains(err.Error(), open+" is-open") {
		t.Fatalf("a refused account folder gave %v", err)
	}
}

func TestTheHostMakesAnAccountFolderAsRootForTheProgramAndKeepsTheRootRoots(t *testing.T) {
	containers, daemon := standIn(t, imageRules)

	if err := containers.MakeAccountFolder(context.Background(), "a1", "operation-1"); err != nil {
		t.Fatal(err)
	}
	if err := containers.MakeAccountFolder(context.Background(), "../a1", "operation-1"); !errors.Is(err, ErrAccountFolderUnsafe) {
		t.Fatalf("a path for an id was answered %v", err)
	}
	if err := containers.MakeAccountFolder(context.Background(), "a1", "../x"); !errors.Is(err, ErrAccountFolderUnsafe) {
		t.Fatalf("a path for an operation was answered %v", err)
	}

	runs := daemon.Created()
	if len(runs) != 1 {
		t.Fatalf("a refused make still ran a container: %d ran", len(runs))
	}
	run := runs[0]
	if run.Config.User != "0:0" || !slices.Equal(run.HostConfig.CapDrop, []string{"ALL"}) ||
		!slices.Equal(run.HostConfig.CapAdd, dockerstandin.Capabilities(accountFolderCapabilities...)) ||
		mountIn(t, run.HostConfig.Mounts, "/accounts").Source != accountsFolder {
		t.Fatalf("the folder was made as %s with %v on %+v", run.Config.User, run.HostConfig.CapAdd, run.HostConfig.Mounts)
	}
	made := scriptOf(run)
	for _, want := range []string{"chown 0:0 /accounts && chmod 0755 /accounts", `mkdir -m 0700 "$folder"`,
		`chown 10001:10001 "$folder" && chmod 0700 "$folder"`, `mkdir -m 0700 "$folder/projects"`,
		// The mark is the program's and private, or the start's own folder check refuses it (23 November).
		`chown 10001:10001 "$mark" && chmod 0600 "$mark"`} {
		if !strings.Contains(made, want) {
			t.Fatalf("the folder was made without %q: %s", want, made)
		}
	}
}

func TestTheHostWritesAnAccountFileForTheProgramAndRefusesAPathForAName(t *testing.T) {
	containers, daemon := standIn(t, imageRules)
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

	runs := daemon.Created()
	if len(runs) != 1 {
		t.Fatalf("a refused file still ran a container: %d ran", len(runs))
	}
	run := runs[0]
	if run.Config.User != "0:0" || !slices.Equal(run.HostConfig.CapDrop, []string{"ALL"}) ||
		mountIn(t, run.HostConfig.Mounts, "/accounts").Source != accountsFolder {
		t.Fatalf("the file was written as %s on %+v", run.Config.User, run.HostConfig.Mounts)
	}
	written := scriptOf(run)
	for _, want := range []string{base64.StdEncoding.EncodeToString(content), `[ -L "/accounts/a1/environments.toml" ]`,
		`chown 10001:10001 "/accounts/a1/environments.toml.new"`, `chmod 0600 "/accounts/a1/environments.toml.new"`,
		`mv -f "/accounts/a1/environments.toml.new" "/accounts/a1/environments.toml"`} {
		if !strings.Contains(written, want) {
			t.Fatalf("the file was written without %q: %s", want, written)
		}
	}
}

func TestAnAccountFileTheContainerCannotWriteNamesTheProgramsOwnWords(t *testing.T) {
	containers, daemon := standIn(t, imageRules)
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program {
		return dockerstandin.Printing(daemonRefusal+"\n", 1)
	}

	err := containers.WriteAccountFile(context.Background(), "a1", "environments.toml", []byte("x"))
	var exited ExitedWith
	if !errors.As(err, &exited) || exited != 1 || !strings.Contains(err.Error(), daemonRefusal) {
		t.Fatalf("a failed write gave %v", err)
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
	mark, err := os.Stat(filepath.Join(accounts, "a1", folderOperationMark))
	if err != nil || mark.Mode().Perm() != 0o600 {
		t.Fatalf("the operation mark was left %v, %v: the start's folder check refuses a file others can read", mark, err)
	}
	if output, err := run("operation-2"); err == nil || !strings.Contains(output, "another sign-in made this folder") {
		t.Fatalf("another make of the same folder was answered %v: %s", err, output)
	}
}

// A folder the client made with a wider mode, such as its cache, is made private before the check, a link is left
// alone, and a file that was private stays as it was.
func TestFilesTheClientLeftOpenAreMadePrivateBeforeTheCheck(t *testing.T) {
	folder := t.TempDir()
	cache := filepath.Join(folder, "cache")
	if err := os.Mkdir(cache, 0o755); err != nil {
		t.Fatal(err)
	}
	open := filepath.Join(cache, "entry")
	if err := os.WriteFile(open, []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	outside := filepath.Join(t.TempDir(), "outside")
	if err := os.WriteFile(outside, []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(outside, filepath.Join(folder, "link")); err != nil {
		t.Fatal(err)
	}

	if output, err := exec.Command("sh", "-c", keepPrivateScript(folder)).CombinedOutput(); err != nil {
		t.Fatalf("keeping the files private failed: %v: %s", err, output)
	}

	for path, want := range map[string]os.FileMode{cache: 0o700, open: 0o600, outside: 0o644} {
		info, err := os.Stat(path)
		if err != nil || info.Mode().Perm() != want {
			t.Fatalf("%s was left %v, %v, want %o", path, info, err, want)
		}
	}
}
