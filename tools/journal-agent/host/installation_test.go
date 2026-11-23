package host

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func TestAnInstallationIsPublishedSealedAndVerified(t *testing.T) {
	sources := realTempDir(t)
	program := writeSource(t, sources, "claude", "#!/bin/sh\necho 2.1.323\n")
	relay := writeSource(t, sources, "relay.php", "<?php echo 'relay';\n")
	folder := filepath.Join(realTempDir(t), "installation")

	err := Install(InstallationManifest{Artifacts: []Artifact{
		{Name: "bin/claude", Source: program.path, SHA256: program.digest, Executable: true},
		{Name: "relay/relay.php", Source: relay.path, SHA256: relay.digest},
	}}, folder)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { unseal(folder) })

	verified, err := Installation{Folder: folder}.Verify()
	if err != nil {
		t.Fatal(err)
	}
	if len(verified) != 2 || verified[0].Path != filepath.Join(folder, "bin/claude") {
		t.Fatalf("verified %+v", verified)
	}
	info, err := os.Stat(filepath.Join(folder, "bin"))
	if err != nil {
		t.Fatal(err)
	}
	if info.Mode().Perm() != installedFolderMode {
		t.Fatalf("an installed folder has mode %o", info.Mode().Perm())
	}
}

// A first install has no releases folder yet, as ~/.journal-agent/releases on a new machine: it is made.
func TestAFirstInstallMakesTheReleasesFolder(t *testing.T) {
	sources := realTempDir(t)
	program := writeSource(t, sources, "claude", "#!/bin/sh\necho 2.1.323\n")
	folder := filepath.Join(realTempDir(t), ".journal-agent", "releases", "1.0.0")

	err := Install(InstallationManifest{Artifacts: []Artifact{
		{Name: "bin/claude", Source: program.path, SHA256: program.digest, Executable: true},
	}}, folder)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { unseal(folder) })

	if _, err := (Installation{Folder: folder}).Verify(); err != nil {
		t.Fatal(err)
	}
}

func TestADigestThatDiffersInstallsNothing(t *testing.T) {
	sources := realTempDir(t)
	program := writeSource(t, sources, "claude", "#!/bin/sh\n")
	parent := realTempDir(t)
	folder := filepath.Join(parent, "installation")

	err := Install(InstallationManifest{Artifacts: []Artifact{
		{Name: "bin/claude", Source: program.path, SHA256: digestOf("something else"), Executable: true},
	}}, folder)

	if !errors.Is(err, ErrInstallationChanged) {
		t.Fatalf("got %v, want ErrInstallationChanged", err)
	}
	entries, _ := os.ReadDir(parent)
	if len(entries) != 0 {
		t.Fatalf("a refused installation left %d entries", len(entries))
	}
}

func TestAnExistingInstallationIsNeverReplaced(t *testing.T) {
	folder := realTempDir(t)

	err := Install(InstallationManifest{}, folder)

	if !errors.Is(err, ErrInstallationExists) {
		t.Fatalf("got %v, want ErrInstallationExists", err)
	}
}

func TestAChangedInstalledFileIsRefused(t *testing.T) {
	sources := realTempDir(t)
	program := writeSource(t, sources, "claude", "#!/bin/sh\n")
	folder := filepath.Join(realTempDir(t), "installation")
	if err := Install(InstallationManifest{Artifacts: []Artifact{
		{Name: "claude", Source: program.path, SHA256: program.digest, Executable: true},
	}}, folder); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { unseal(folder) })
	installed := filepath.Join(folder, "claude")
	unseal(folder)
	if err := os.Chmod(installed, 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(installed, []byte("#!/bin/sh\nexit 0\n"), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(installed, installedProgramMode); err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(folder, installedFolderMode); err != nil {
		t.Fatal(err)
	}

	if _, err := (Installation{Folder: folder}).Verify(); !errors.Is(err, ErrInstallationChanged) {
		t.Fatalf("got %v, want ErrInstallationChanged", err)
	}
}

func TestAnInstallationOthersCanWriteIntoIsRefused(t *testing.T) {
	sources := realTempDir(t)
	program := writeSource(t, sources, "claude", "#!/bin/sh\n")
	parent := realTempDir(t)
	folder := filepath.Join(parent, "installation")
	if err := Install(InstallationManifest{Artifacts: []Artifact{
		{Name: "claude", Source: program.path, SHA256: program.digest, Executable: true},
	}}, folder); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { unseal(folder) })
	if err := os.Chmod(parent, 0o777); err != nil {
		t.Fatal(err)
	}

	if _, err := (Installation{Folder: folder}).Verify(); !errors.Is(err, ErrInstallationWritable) {
		t.Fatalf("got %v, want ErrInstallationWritable", err)
	}
}

type source struct{ path, digest string }

func writeSource(t *testing.T, folder, name, content string) source {
	t.Helper()
	path := filepath.Join(folder, name)
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	return source{path: path, digest: digestOf(content)}
}

func digestOf(content string) string {
	sum := sha256.Sum256([]byte(content))
	return hex.EncodeToString(sum[:])
}

// realTempDir is a temporary folder named by its real path, with no link above it, as an installation must be.
func realTempDir(t *testing.T) string {
	t.Helper()
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(folder, 0o700); err != nil {
		t.Fatal(err)
	}
	return folder
}

// unseal makes a sealed installation writable again so the test can remove it.
func unseal(folder string) {
	_ = filepath.WalkDir(folder, func(path string, entry os.DirEntry, err error) error {
		if err == nil && entry.IsDir() {
			_ = os.Chmod(path, 0o700)
		}
		return nil
	})
}
