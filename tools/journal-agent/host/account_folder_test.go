package host

import (
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
