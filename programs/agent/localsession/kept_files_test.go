package localsession

import (
	"os"
	"path/filepath"
	"testing"
)

func TestAKeptFileReachesTheNextSessionAndALogoutStartsSignedOut(t *testing.T) {
	kept := KeptFiles{StateFolder: t.TempDir(), BindingID: "binding1"}
	first := filepath.Join(t.TempDir(), "account", "credential.json")
	second := filepath.Join(t.TempDir(), "account", "credential.json")
	if err := os.MkdirAll(filepath.Dir(first), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(first, []byte("signed in"), 0o600); err != nil {
		t.Fatal(err)
	}

	before := kept.HoldsAny()
	if err := kept.Keep([]string{first}); err != nil {
		t.Fatal(err)
	}
	if err := kept.Provide([]string{second}); err != nil {
		t.Fatal(err)
	}
	provided, _ := os.ReadFile(second)
	if err := kept.Logout(); err != nil {
		t.Fatal(err)
	}

	if before || string(provided) != "signed in" || kept.HoldsAny() || kept.Generation() != 2 {
		t.Fatalf("held before %v, provided %q, held after logout %v, generation %d", before, provided, kept.HoldsAny(), kept.Generation())
	}
}

func TestAFileNotKeptYetIsLeftForTheSessionToMake(t *testing.T) {
	kept := KeptFiles{StateFolder: t.TempDir(), BindingID: "binding1"}
	path := filepath.Join(t.TempDir(), "credential.json")

	if err := kept.Provide([]string{path}); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(path); !os.IsNotExist(err) {
		t.Fatalf("a file nobody kept was made: %v", err)
	}
}
