package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

type grantSource struct {
	snapshot []byte
	err      error
}

func (source grantSource) OutputGrants(context.Context, string) ([]byte, error) {
	return source.snapshot, source.err
}

func TestASnapshotIsSavedAsTheJournalSealedIt(t *testing.T) {
	folder := t.TempDir()

	err := RefreshOutputGrants(context.Background(), grantSource{snapshot: []byte(`{"generation":2}`)}, "start-1",
		folder)
	if err != nil {
		t.Fatal(err)
	}

	content, err := os.ReadFile(filepath.Join(folder, OutputGrantsName))
	if err != nil || string(content) != `{"generation":2}` {
		t.Fatalf("snapshot %q %v", content, err)
	}
}

func TestAFailedRefreshRemovesTheStaleSnapshot(t *testing.T) {
	folder := t.TempDir()
	if err := WritePrivateFile(filepath.Join(folder, OutputGrantsName), []byte(`{"generation":1}`)); err != nil {
		t.Fatal(err)
	}

	err := RefreshOutputGrants(context.Background(), grantSource{err: errors.New("journal away")}, "start-1", folder)

	if err == nil {
		t.Fatal("a failed refresh reported success")
	}
	if _, statError := os.Stat(filepath.Join(folder, OutputGrantsName)); !errors.Is(statError, os.ErrNotExist) {
		t.Fatal("a stale snapshot was kept after a failed refresh")
	}
}
