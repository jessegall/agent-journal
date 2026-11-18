package host

import (
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func TestTheEnrollmentIsStoredForTheOwnerOnly(t *testing.T) {
	state := State{Folder: filepath.Join(t.TempDir(), "state")}

	if err := state.Save(Enrollment{JournalURL: "https://journal.test", HostID: "host", Secret: "secret"}); err != nil {
		t.Fatal(err)
	}

	info, err := os.Stat(filepath.Join(state.Folder, enrollmentName))
	if err != nil || info.Mode().Perm() != 0o600 {
		t.Fatalf("got %v, %v", info.Mode().Perm(), err)
	}
	loaded, err := state.Load()
	if err != nil || loaded.Secret != "secret" {
		t.Fatalf("got %+v, %v", loaded, err)
	}
}

func TestAStateOthersCanReadIsRefused(t *testing.T) {
	state := State{Folder: filepath.Join(t.TempDir(), "state")}
	if err := state.Save(Enrollment{HostID: "host", Secret: "secret"}); err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(filepath.Join(state.Folder, enrollmentName), 0o644); err != nil {
		t.Fatal(err)
	}

	if _, err := state.Load(); !errors.Is(err, ErrStateTooOpen) {
		t.Fatalf("got %v", err)
	}
}
