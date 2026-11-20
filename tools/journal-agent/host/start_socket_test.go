package host

import (
	"os"
	"path/filepath"
	"testing"
)

func TestTheStartSocketListensInItsOwnOwnerOnlyFolder(t *testing.T) {
	// A Unix socket path holds at most about a hundred bytes, more than the test's own temporary folder leaves.
	folder, err := os.MkdirTemp("/tmp", "socket")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { os.RemoveAll(folder) })

	listener, err := StartSocket{Folder: folder}.Listen()
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()

	info, err := os.Stat(filepath.Join(folder, StartSocketName))
	if err != nil || info.Mode().Perm() != 0o600 {
		t.Fatalf("the socket is %v, %v; want mode 600", info.Mode().Perm(), err)
	}
}

func TestAStartSocketFolderOthersCanReadIsRefused(t *testing.T) {
	folder := filepath.Join(t.TempDir(), "sockets")
	if err := os.Mkdir(folder, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(folder, 0o755); err != nil {
		t.Fatal(err)
	}

	if _, err := (StartSocket{Folder: folder}).Listen(); err == nil {
		t.Fatal("a folder others can read was used for the start socket")
	}
}
