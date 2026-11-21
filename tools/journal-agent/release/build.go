package release

import (
	"crypto/ed25519"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"journal-agent/client"
	"journal-agent/host"
)

const (
	// ProgramName is the name of the journal-agent binary, in the release and in the installation.
	ProgramName    = "journal-agent"
	programPackage = "./cmd/journal-agent"
)

// Build cross-compiles journal-agent from the module folder for every target into the new release folder, records
// the SHA-256 and byte size it measures of each binary, and writes the manifest and its signature beside them.
func Build(module string, folder string, version string, key ed25519.PrivateKey) (Manifest, error) {
	if version == "" {
		return Manifest{}, fmt.Errorf("a release needs a version")
	}

	if err := os.Mkdir(folder, 0o755); err != nil {
		return Manifest{}, err
	}

	manifest := Manifest{Version: version, HostProtocolVersion: client.HostProtocolVersion}
	for _, target := range Targets {
		artifact, err := buildProgram(module, folder, target)
		if err != nil {
			return Manifest{}, err
		}

		manifest.Targets = append(manifest.Targets, TargetArtifacts{Target: target, Artifacts: []host.Artifact{artifact}})
	}

	if err := writeSigned(manifest, folder, key); err != nil {
		return Manifest{}, err
	}

	return manifest, nil
}

// buildProgram compiles journal-agent for one target with cgo off and measures the binary it wrote.
func buildProgram(module string, folder string, target Target) (host.Artifact, error) {
	source := filepath.Join(target.Folder(), ProgramName)
	path, err := filepath.Abs(filepath.Join(folder, source))
	if err != nil {
		return host.Artifact{}, err
	}

	build := exec.Command("go", "build", "-trimpath", "-o", path, programPackage)
	build.Dir = module
	build.Env = append(os.Environ(), "GOOS="+target.OS, "GOARCH="+target.Arch, "CGO_ENABLED=0")
	if printed, err := build.CombinedOutput(); err != nil {
		return host.Artifact{}, fmt.Errorf("building %s for %s failed: %w\n%s", ProgramName, target, err, printed)
	}

	measured, err := measure(path)
	if err != nil {
		return host.Artifact{}, err
	}

	return host.Artifact{
		Name: ProgramName, Source: source, SHA256: measured.SHA256, Size: measured.Size, Executable: true,
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
