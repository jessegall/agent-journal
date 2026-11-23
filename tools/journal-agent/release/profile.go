package release

import (
	"crypto/ed25519"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"journal-agent/profiles"
	"journal-agent/profiles/contracts"
)

// SecondStageName is the installer the first-stage script checks against the manifest and runs.
const SecondStageName = "scripts/install-relay.sh"

// HookEntryPlaceholder stands in a hook template for the sealed absolute path of the installed hook adapter; the
// project setup replaces it once the installation folder is known.
const HookEntryPlaceholder = "{{hook-entry}}"

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
		{Name: "hooks/claude-code/settings.json", Source: HookTemplate{Profile: profiles.ClaudeCode{}, File: "settings.json"}},
		{Name: "hooks/codex/hooks.json", Source: HookTemplate{Profile: profiles.Codex{}, File: "hooks.json"}},
	},
	Providers: []Provider{
		officialInstall("claude-code", profiles.ClaudeCode{}),
		officialInstall("codex", profiles.Codex{}),
	},
}

// officialInstall is a provider the release does not redistribute: it is imported from the official install.
func officialInstall(name string, profile contracts.DriverProfile) Provider {
	return Provider{
		Name:        name,
		Build:       profile.Build(),
		Acquisition: OfficialInstallImport,
		Check: fmt.Sprintf("the official %s install reports build %s, and each file imported from it has the SHA-256 "+
			"and size this manifest records for the target; until the manifest records them the driver stays off",
			profile.Driver(), profile.Build()),
	}
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

// HookTemplate is the settings file a provider's start profile writes with every native hook running the hook
// adapter, its path left as HookEntryPlaceholder.
type HookTemplate struct {
	Profile contracts.DriverProfile
	File    string
}

func (template HookTemplate) write(_ Sources, _ Target, path string) error {
	files, err := template.Profile.SettingsFiles(contracts.BaseStart{HookCommand: HookEntryPlaceholder}.Terminal(false))
	if err != nil {
		return err
	}

	for _, file := range files {
		if file.Name == template.File {
			return os.WriteFile(path, file.Content, 0o644)
		}
	}

	return fmt.Errorf("the %s profile writes no %s", template.Profile.Driver(), template.File)
}
