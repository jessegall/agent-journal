package release

import (
	"crypto/ed25519"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// SecondStageName is the installer the first-stage script checks against the manifest and runs.
const SecondStageName = "scripts/install-relay.sh"

// OfficialInstallImport is how a provider the release cannot ship arrives: its official local install is checked
// against the release manifest and imported into the sealed installation.
const OfficialInstallImport = "official-install-import"

// Sources are the folders a release is built from, the repository and the journal-agent module inside it, and the
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

// Provider is a pinned agent driver the profile runs, shipped apart from the core files and never taken from PATH.
type Provider struct {
	Name        string `json:"name"`
	Executable  string `json:"executable"`
	Build       string `json:"build"`
	Acquisition string `json:"acquisition"`
	Check       string `json:"check"`
}

// Profile is every file one kind of installation needs, and the providers it runs.
type Profile struct {
	Name      string
	Files     []ProfileFile
	Providers []Provider
}

// RemoteProject is the installation of a machine connected to a server journal: the native host and dispatcher,
// the command, hook and account adapters that stand in for the PHP ones, the managed hook templates and the
// no-keychain shim, which the start environment keeps first on PATH.
var RemoteProject = Profile{
	Name: "remote-project",
	Files: []ProfileFile{
		{Name: "bin/" + ProgramName, Source: GoProgram{Package: "./cmd/journal-agent"}, Executable: true},
		{Name: "bin/journal", Source: GoProgram{Package: "./cmd/journal"}, Executable: true},
		{Name: "bin/journal-hook", Source: GoProgram{Package: "./cmd/journal-hook"}, Executable: true},
		{Name: "bin/journal-account", Source: GoProgram{Package: "./cmd/journal-account"}, Executable: true},
		{Name: "journal/tools/accounts/no-keychain/security", Source: RepositoryFile{Path: "tools/accounts/no-keychain/security"}, Executable: true},
		{Name: SecondStageName, Source: RepositoryFile{Path: "tools/journal-agent/scripts/install-relay.sh"}},
	},
}

// ProvidersFile is the repository's list of the providers a release imports, each with its program and the build the
// journal pins; the journal's own tests keep it equal to its pins.
const ProvidersFile = "resources/drivers/providers.json"

// ReadProviders reads the providers a release imports from the repository, each an official install the installer
// takes from the machine's PATH once it reports the pinned build.
func ReadProviders(repository string) ([]Provider, error) {
	content, err := os.ReadFile(filepath.Join(repository, ProvidersFile))
	if err != nil {
		return nil, err
	}
	var providers []Provider
	if err := json.Unmarshal(content, &providers); err != nil {
		return nil, fmt.Errorf("reading %s failed: %w", ProvidersFile, err)
	}
	for index, provider := range providers {
		providers[index].Acquisition = OfficialInstallImport
		providers[index].Check = fmt.Sprintf("the official %s install on the machine's PATH is the native program and "+
			"reports build %s; otherwise the driver stays off and journal status says why", provider.Executable, provider.Build)
	}

	return providers, nil
}

// GoProgram is a program of the journal-agent module, cross-compiled for the target with cgo off.
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
