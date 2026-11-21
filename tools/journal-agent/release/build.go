package release

import (
	"crypto/ed25519"
	"fmt"
	"os"
	"path/filepath"

	"journal-agent/client"
	"journal-agent/host"
)

// ProgramName is the name of the journal-agent binary, in the release and in the installation's bin folder.
const ProgramName = "journal-agent"

// Build writes every file of the profile for every target into the new release folder, cross-compiling the
// programs from the sources, records the SHA-256 and byte size it measures of each file, and writes the manifest
// and its signature beside them.
func Build(profile Profile, sources Sources, folder string, version string, key ed25519.PrivateKey) (Manifest, error) {
	if version == "" {
		return Manifest{}, fmt.Errorf("a release needs a version")
	}

	if err := os.Mkdir(folder, 0o755); err != nil {
		return Manifest{}, err
	}

	manifest := Manifest{
		Version:             version,
		HostProtocolVersion: client.RemoteProjectProtocolVersion,
		Profile:             profile.Name,
		Providers:           profile.Providers,
	}
	for _, target := range Targets {
		targetArtifacts := TargetArtifacts{Target: target}
		for _, file := range profile.Files {
			artifact, err := buildFile(file, sources, folder, target)
			if err != nil {
				return Manifest{}, err
			}

			targetArtifacts.Artifacts = append(targetArtifacts.Artifacts, artifact)
		}

		manifest.Targets = append(manifest.Targets, targetArtifacts)
	}

	if err := writeSigned(manifest, folder, key); err != nil {
		return Manifest{}, err
	}

	return manifest, nil
}

// buildFile writes one profile file for one target under the target's folder and measures what it wrote.
func buildFile(file ProfileFile, sources Sources, folder string, target Target) (host.Artifact, error) {
	source := filepath.Join(target.Folder(), file.Name)
	path, err := filepath.Abs(filepath.Join(folder, source))
	if err != nil {
		return host.Artifact{}, err
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return host.Artifact{}, err
	}

	if err := file.Source.write(sources, target, path); err != nil {
		return host.Artifact{}, err
	}

	measured, err := measure(path)
	if err != nil {
		return host.Artifact{}, err
	}

	return host.Artifact{
		Name: file.Name, Source: source, SHA256: measured.SHA256, Size: measured.Size, Executable: file.Executable,
	}, nil
}

// writeSigned writes the manifest's canonical bytes and the detached ed25519 signature over exactly those bytes.
func writeSigned(manifest Manifest, folder string, key ed25519.PrivateKey) error {
	content, err := manifest.Bytes()
	if err != nil {
		return err
	}

	if err := os.WriteFile(filepath.Join(folder, ManifestName), content, 0o644); err != nil {
		return err
	}

	return os.WriteFile(filepath.Join(folder, SignatureName), ed25519.Sign(key, content), 0o644)
}
