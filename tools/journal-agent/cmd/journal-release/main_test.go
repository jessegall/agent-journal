package main

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"os"
	"path/filepath"
	"testing"

	"journal-agent/release"
)

func TestOneRunBuildsFourSignedBinariesThatVerify(t *testing.T) {
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
	for _, target := range release.Targets {
		installation, err := release.Verify(manifest, signature, publicKey, target, folder)
		if err != nil {
			t.Fatalf("%s: %v", target, err)
		}
		binary, err := os.Stat(installation.Artifacts[0].Source)
		if err != nil {
			t.Fatal(err)
		}
		if binary.Size() != installation.Artifacts[0].Size || binary.Size() == 0 {
			t.Fatalf("%s: the manifest records %d bytes, the binary has %d", target, installation.Artifacts[0].Size, binary.Size())
		}
	}

	flipped := append([]byte(nil), signature...)
	flipped[len(flipped)-1] ^= 0x80
	if _, err := release.Verify(manifest, flipped, publicKey, release.Targets[0], folder); !errors.Is(err, release.ErrSignatureInvalid) {
		t.Fatalf("a flipped signature byte: Verify = %v, want ErrSignatureInvalid", err)
	}

	wrongTarget := release.Target{OS: "freebsd", Arch: "arm64"}
	if _, err := release.Verify(manifest, signature, publicKey, wrongTarget, folder); !errors.Is(err, release.ErrTargetMissing) {
		t.Fatalf("a wrong target: Verify = %v, want ErrTargetMissing", err)
	}

	changed := filepath.Join(folder, release.Targets[3].Folder(), release.ProgramName)
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
}

func TestRunRefusesASigningKeyInsideTheRepository(t *testing.T) {
	err := run([]string{"--version", "1.0.0", "--signing-key", "main.go", "--out", filepath.Join(t.TempDir(), "release")})
	if !errors.Is(err, release.ErrSigningKeyInRepository) {
		t.Fatalf("run = %v, want ErrSigningKeyInRepository", err)
	}
}
