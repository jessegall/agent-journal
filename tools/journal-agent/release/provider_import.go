package release

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"

	"journal-agent/host"
)

// ProvidersFileName is the installation's record of the providers it left off, each with the plain reason journal
// status shows.
const ProvidersFileName = "providers.json"

// ProviderOff is a provider the installation does not run, and why.
type ProviderOff struct {
	Name   string `json:"name"`
	Reason string `json:"reason"`
}

// ProviderImport is what the installer took from the machine's official provider installs: the programs to seal
// into the installation, and the providers left off.
type ProviderImport struct {
	Artifacts []host.Artifact
	Off       []ProviderOff
}

// importProviders looks up each provider's official program on the search path, resolving links, and imports it
// when it is the native program and reports the pinned build.
func importProviders(providers []Provider, searchPath string) ProviderImport {
	imported := ProviderImport{}
	for _, provider := range providers {
		artifact, err := importProvider(provider, searchPath)
		if err != nil {
			imported.Off = append(imported.Off, ProviderOff{Name: provider.Name, Reason: err.Error()})
			continue
		}
		imported.Artifacts = append(imported.Artifacts, artifact)
	}

	return imported
}

func importProvider(provider Provider, searchPath string) (host.Artifact, error) {
	profile, isKnown := providerProfiles[provider.Name]
	if !isKnown {
		return host.Artifact{}, fmt.Errorf("this installer does not know the provider %s", provider.Name)
	}
	program := profile.Driver()
	found, err := findProgram(program, searchPath)
	if err != nil {
		return host.Artifact{}, err
	}
	resolved, err := filepath.EvalSymlinks(found)
	if err != nil {
		return host.Artifact{}, err
	}
	if isNodeScript(resolved) {
		return host.Artifact{}, fmt.Errorf("the official %s on the PATH (%s) is the npm package's script, not the "+
			"native program: install the native build of %s, then install again", program, resolved, provider.Name)
	}
	reported, err := exec.Command(resolved, "--version").Output()
	if err != nil {
		return host.Artifact{}, fmt.Errorf("the official %s (%s) did not report its build: %w", program, resolved, err)
	}
	if err := profile.CheckBuild(string(reported)); err != nil {
		return host.Artifact{}, err
	}
	measured, err := measure(resolved)
	if err != nil {
		return host.Artifact{}, err
	}

	return host.Artifact{Name: "bin/" + program, Source: resolved, SHA256: measured.SHA256, Executable: true}, nil
}

// findProgram is the first executable of the name in the folders of the search path.
func findProgram(name, searchPath string) (string, error) {
	for _, folder := range filepath.SplitList(searchPath) {
		candidate := filepath.Join(folder, name)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() && info.Mode()&0o111 != 0 {
			return candidate, nil
		}
	}

	return "", fmt.Errorf("no official %s install is on the PATH: install it, then install again", name)
}

// isNodeScript tells the npm package's launcher, which needs its package folder beside it, from a native program.
func isNodeScript(path string) bool {
	file, err := os.Open(path)
	if err != nil {
		return false
	}
	defer file.Close()
	head := make([]byte, 128)
	read, _ := io.ReadFull(file, head)
	firstLine, _, _ := bytes.Cut(head[:read], []byte("\n"))

	return bytes.HasPrefix(firstLine, []byte("#!")) && bytes.Contains(firstLine, []byte("node"))
}

// providersFile writes the providers left off into the staging folder and answers it as an artifact.
func providersFile(off []ProviderOff, staging string) (host.Artifact, error) {
	content, err := json.Marshal(off)
	if err != nil {
		return host.Artifact{}, err
	}
	path := filepath.Join(staging, ProvidersFileName)
	if err := os.WriteFile(path, content, 0o600); err != nil {
		return host.Artifact{}, err
	}
	measured, err := measure(path)
	if err != nil {
		return host.Artifact{}, err
	}

	return host.Artifact{Name: ProvidersFileName, Source: path, SHA256: measured.SHA256}, nil
}

// ProvidersOff reads which providers an installation left off, and why.
func ProvidersOff(installation string) ([]ProviderOff, error) {
	content, err := os.ReadFile(filepath.Join(installation, ProvidersFileName))
	if err != nil {
		return nil, err
	}
	var off []ProviderOff

	return off, json.Unmarshal(content, &off)
}
