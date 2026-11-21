package main

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"journal-agent/host"
	"journal-agent/release"
)

func TestOneRunBuildsTheSignedRemoteProjectRelease(t *testing.T) {
	publicKey, privateKey, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatal(err)
	}
	encoded, err := x509.MarshalPKCS8PrivateKey(privateKey)
	if err != nil {
		t.Fatal(err)
	}
	keyPath := filepath.Join(t.TempDir(), "release.key")
	if err := os.WriteFile(keyPath, pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: encoded}), 0o600); err != nil {
		t.Fatal(err)
	}
	folder := filepath.Join(t.TempDir(), "release")

	if err := run([]string{"--version", "1.0.0", "--signing-key", keyPath, "--out", folder, "--module", "../.."}); err != nil {
		t.Fatal(err)
	}

	manifest, err := os.ReadFile(filepath.Join(folder, release.ManifestName))
	if err != nil {
		t.Fatal(err)
	}
	signature, err := os.ReadFile(filepath.Join(folder, release.SignatureName))
	if err != nil {
		t.Fatal(err)
	}

	t.Run("each target verifies and lists every profile file with its measured size", func(t *testing.T) {
		for _, target := range release.Targets {
			installation, err := release.Verify(manifest, signature, publicKey, target, folder)
			if err != nil {
				t.Fatalf("%s: %v", target, err)
			}
			if len(installation.Artifacts) != len(release.RemoteProject.Files) {
				t.Fatalf("%s: %d artifacts, the profile has %d files", target, len(installation.Artifacts), len(release.RemoteProject.Files))
			}
			for index, artifact := range installation.Artifacts {
				file, err := os.Stat(artifact.Source)
				if err != nil {
					t.Fatal(err)
				}
				if artifact.Name != release.RemoteProject.Files[index].Name || file.Size() != artifact.Size || file.Size() == 0 {
					t.Fatalf("%s: %s records %d bytes, the file %s has %d", target, artifact.Name, artifact.Size, artifact.Source, file.Size())
				}
			}
		}
	})

	t.Run("the providers arrive from their official installs", func(t *testing.T) {
		var parsed release.Manifest
		if err := json.Unmarshal(manifest, &parsed); err != nil {
			t.Fatal(err)
		}
		if parsed.Profile != "remote-project" || len(parsed.Providers) != 2 {
			t.Fatalf("profile %q with providers %+v", parsed.Profile, parsed.Providers)
		}
		for _, provider := range parsed.Providers {
			if provider.Acquisition != release.OfficialInstallImport || provider.Build == "" || provider.Check == "" {
				t.Fatalf("provider %+v names no official install check", provider)
			}
		}
	})

	t.Run("the hook templates run the hook adapter on every native event", func(t *testing.T) {
		here := release.Target{OS: "darwin", Arch: "arm64"}
		for _, name := range []string{"hooks/claude-code/settings.json", "hooks/codex/hooks.json"} {
			content, err := os.ReadFile(filepath.Join(folder, here.Folder(), name))
			if err != nil {
				t.Fatal(err)
			}
			if !strings.Contains(string(content), release.HookEntryPlaceholder) || !strings.Contains(string(content), "PreToolUse") {
				t.Fatalf("%s holds no PreToolUse hook running %s:\n%s", name, release.HookEntryPlaceholder, content)
			}
		}
	})

	t.Run("journal-agent installation verifies the installed profile and refuses a changed or missing file", func(t *testing.T) {
		here := release.Target{OS: runtime.GOOS, Arch: runtime.GOARCH}
		verified, err := release.Verify(manifest, signature, publicKey, here, folder)
		if err != nil {
			t.Fatal(err)
		}
		installed := filepath.Join(realTempDir(t), "installation")
		if err := host.Install(verified, installed); err != nil {
			t.Fatal(err)
		}
		t.Cleanup(func() { unseal(installed) })
		program := filepath.Join(installed, "bin", release.ProgramName)

		if printed, err := exec.Command(program, "installation", "--folder", installed).CombinedOutput(); err != nil {
			t.Fatalf("installation --folder refused a fresh install: %v\n%s", err, printed)
		}

		template := filepath.Join(installed, "hooks", "codex", "hooks.json")
		unseal(installed)
		if err := os.Chmod(template, 0o600); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(template, []byte("{}"), 0o600); err != nil {
			t.Fatal(err)
		}
		if err := os.Chmod(template, 0o444); err != nil {
			t.Fatal(err)
		}
		reseal(t, installed)
		printed, err := exec.Command(program, "installation", "--folder", installed).CombinedOutput()
		if err == nil || !strings.Contains(string(printed), host.ErrInstallationChanged.Error()) {
			t.Fatalf("a changed template: installation --folder = %v\n%s", err, printed)
		}

		unseal(installed)
		if err := os.Remove(template); err != nil {
			t.Fatal(err)
		}
		reseal(t, installed)
		if printed, err := exec.Command(program, "installation", "--folder", installed).CombinedOutput(); err == nil {
			t.Fatalf("a missing template: installation --folder verified\n%s", printed)
		}
	})

	t.Run("Verify refuses a flipped signature byte, a wrong target and a changed or missing file", func(t *testing.T) {
		flipped := append([]byte(nil), signature...)
		flipped[len(flipped)-1] ^= 0x80
		if _, err := release.Verify(manifest, flipped, publicKey, release.Targets[0], folder); !errors.Is(err, release.ErrSignatureInvalid) {
			t.Fatalf("a flipped signature byte: Verify = %v, want ErrSignatureInvalid", err)
		}

		wrongTarget := release.Target{OS: "freebsd", Arch: "arm64"}
		if _, err := release.Verify(manifest, signature, publicKey, wrongTarget, folder); !errors.Is(err, release.ErrTargetMissing) {
			t.Fatalf("a wrong target: Verify = %v, want ErrTargetMissing", err)
		}

		changed := filepath.Join(folder, release.Targets[3].Folder(), "bin", release.ProgramName)
		binary, err := os.OpenFile(changed, os.O_APPEND|os.O_WRONLY, 0)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := binary.Write([]byte{0}); err != nil {
			t.Fatal(err)
		}
		binary.Close()
		if _, err := release.Verify(manifest, signature, publicKey, release.Targets[3], folder); !errors.Is(err, release.ErrArtifactChanged) {
			t.Fatalf("a changed binary: Verify = %v, want ErrArtifactChanged", err)
		}

		missing := filepath.Join(folder, release.Targets[2].Folder(), "bin", "journal-hook")
		if err := os.Remove(missing); err != nil {
			t.Fatal(err)
		}
		if _, err := release.Verify(manifest, signature, publicKey, release.Targets[2], folder); !errors.Is(err, release.ErrArtifactMissing) {
			t.Fatalf("a missing file: Verify = %v, want ErrArtifactMissing", err)
		}
	})
}

func TestRunRefusesASigningKeyInsideTheRepository(t *testing.T) {
	err := run([]string{"--version", "1.0.0", "--signing-key", "main.go", "--out", filepath.Join(t.TempDir(), "release")})
	if !errors.Is(err, release.ErrSigningKeyInRepository) {
		t.Fatalf("run = %v, want ErrSigningKeyInRepository", err)
	}
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

// unseal makes a sealed installation's folders writable again so the test can change or remove it.
func unseal(folder string) {
	_ = filepath.WalkDir(folder, func(path string, entry os.DirEntry, err error) error {
		if err == nil && entry.IsDir() {
			_ = os.Chmod(path, 0o700)
		}

		return nil
	})
}

// reseal makes the installation's folders read-only again, as Install leaves them.
func reseal(t *testing.T, folder string) {
	t.Helper()
	err := filepath.WalkDir(folder, func(path string, entry os.DirEntry, err error) error {
		if err == nil && entry.IsDir() {
			return os.Chmod(path, 0o555)
		}

		return err
	})
	if err != nil {
		t.Fatal(err)
	}
}
