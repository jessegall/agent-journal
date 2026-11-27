package release

import (
	"crypto/ed25519"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// SecondStageName is the installer the first-stage script checks against the manifest and runs.
const SecondStageName = "scripts/install-relay.sh"

// Sources are the folders a release is built from, the repository and the journal-runner module inside it, and the
// public key every program it builds pins.
type Sources struct {
	Repository string
	Module     string
	PinnedKey  ed25519.PublicKey
}

// FileSource writes one file of a profile for a target to the path given.
type FileSource interface {
	write(sources Sources, target Target, path string) error
}

// ProfileFile is one file the profile installs, by its name inside the installation.
type ProfileFile struct {
	Name       string
	Source     FileSource
	Executable bool
}

// Profile is every file one kind of installation needs.
type Profile struct {
	Name  string
	Files []ProfileFile
}

// RemoteProject is the installation of a machine connected to a server journal: the native host and dispatcher,
// the command, hook and account adapters that stand in for the PHP ones and the no-keychain shim, which the start
// environment keeps first on PATH.
var RemoteProject = Profile{
	Name: "remote-project",
	Files: []ProfileFile{
		{Name: "bin/" + ProgramName, Source: GoProgram{Package: "./cmd/journal-runner"}, Executable: true},
		{Name: "bin/journal", Source: GoProgram{Package: "./cmd/journal"}, Executable: true},
		{Name: "bin/journal-hook", Source: GoProgram{Package: "./cmd/journal-hook"}, Executable: true},
		{Name: "bin/journal-account", Source: GoProgram{Package: "./cmd/journal-account"}, Executable: true},
		{Name: "journal/programs/accounts/no-keychain/security", Source: RepositoryFile{Path: "programs/accounts/no-keychain/security"}, Executable: true},
		{Name: SecondStageName, Source: RepositoryFile{Path: "programs/runner/scripts/install-relay.sh"}},
	},
}

// GoProgram is a program of the journal-runner module, cross-compiled for the target with cgo off.
type GoProgram struct {
	Package string
}

func (program GoProgram) write(sources Sources, target Target, path string) error {
	build := exec.Command("go", "build", "-trimpath", "-ldflags", pinnedKeyFlag(sources.PinnedKey), "-o", path, program.Package)
	build.Dir = sources.Module
	build.Env = append(os.Environ(), "GOOS="+target.OS, "GOARCH="+target.Arch, "CGO_ENABLED=0")
	if printed, err := build.CombinedOutput(); err != nil {
		return fmt.Errorf("building %s for %s failed: %w\n%s", program.Package, target, err, printed)
	}

	return nil
}

// RepositoryFile is a file of the repository, the same for every target.
type RepositoryFile struct {
	Path string
}

func (file RepositoryFile) write(sources Sources, _ Target, path string) error {
	content, err := os.ReadFile(filepath.Join(sources.Repository, file.Path))
	if err != nil {
		return err
	}

	return os.WriteFile(path, content, 0o644)
}
