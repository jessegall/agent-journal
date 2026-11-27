// Package release builds, signs and verifies the journal-runner release a connected machine installs.
package release

import (
	"encoding/json"
	"fmt"

	"journal-runner/host"
)

const (
	// ManifestName is the file of the release folder that holds the manifest's signed bytes.
	ManifestName = "manifest.json"
	// SignatureName is the file of the release folder that holds the ed25519 signature over ManifestName.
	SignatureName = "manifest.json.sig"
)

// Target is one operating system and processor architecture a release ships for, as GOOS and GOARCH name them.
type Target struct {
	OS   string `json:"os"`
	Arch string `json:"arch"`
}

// Targets are the platforms every release is built for.
var Targets = []Target{
	{OS: "darwin", Arch: "arm64"},
	{OS: "darwin", Arch: "amd64"},
	{OS: "linux", Arch: "arm64"},
	{OS: "linux", Arch: "amd64"},
}

// String is the target as os/arch.
func (target Target) String() string {
	return target.OS + "/" + target.Arch
}

// Folder is the folder of the release that holds this target's files.
func (target Target) Folder() string {
	return target.OS + "-" + target.Arch
}

// TargetArtifacts are the files one target installs, each Source a path inside the release folder, and what the
// machine needs before it installs them.
type TargetArtifacts struct {
	Target
	Prerequisites []string        `json:"prerequisites"`
	Artifacts     []host.Artifact `json:"artifacts"`
}

// Capabilities are what every release built here does for a connected machine; the server offers a public install
// line only for a release that lists all it requires.
var Capabilities = []string{"enrollment", "presence", "commands", "child-worktrees"}

// prerequisitesOf are the programs a target's machine needs before it installs the release.
func prerequisitesOf(target Target) []string {
	if target.OS == "linux" {
		return []string{"git", "curl", "systemd --user (optional, for journal service)"}
	}

	return []string{"git", "curl"}
}

// Manifest is what one release holds: its version, the installation profile it was built from and the files of each
// target.
type Manifest struct {
	Version      string            `json:"version"`
	Profile      string            `json:"profile"`
	Capabilities []string          `json:"capabilities"`
	Targets      []TargetArtifacts `json:"targets"`
}

// Bytes are the canonical bytes of the manifest: the ones written to ManifestName and signed.
func (manifest Manifest) Bytes() ([]byte, error) {
	return json.Marshal(manifest)
}

// artifactsOf are the files the manifest records for the target.
func (manifest Manifest) artifactsOf(target Target) (TargetArtifacts, error) {
	for _, targetArtifacts := range manifest.Targets {
		if targetArtifacts.Target == target {
			return targetArtifacts, nil
		}
	}

	return TargetArtifacts{}, fmt.Errorf("%w: %s is not in release %s", ErrTargetMissing, target, manifest.Version)
}
