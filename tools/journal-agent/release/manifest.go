// Package release builds, signs and verifies the journal-agent release a connected machine installs.
package release

import (
	"encoding/json"
	"fmt"

	"journal-agent/host"
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

// TargetArtifacts are the files one target installs; each Source is a path inside the release folder.
type TargetArtifacts struct {
	Target
	Artifacts []host.Artifact `json:"artifacts"`
}

// Manifest is what one release holds: its version, the host protocol it speaks, the installation profile it was
// built from with the providers that arrive apart from it, and the files of each target.
type Manifest struct {
	Version             string            `json:"version"`
	HostProtocolVersion int               `json:"hostProtocolVersion"`
	Profile             string            `json:"profile"`
	Providers           []Provider        `json:"providers"`
	Targets             []TargetArtifacts `json:"targets"`
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
