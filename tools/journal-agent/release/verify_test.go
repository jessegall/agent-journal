package release

import (
	"crypto/ed25519"
	"errors"
	"os"
	"path/filepath"
	"testing"

	"journal-agent/host"
)

// signedRelease writes one small file per target into a release folder, measured and signed like Build does.
func signedRelease(t *testing.T) (string, []byte, []byte, ed25519.PublicKey) {
	t.Helper()
	publicKey, privateKey, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatal(err)
	}

	folder := t.TempDir()
	manifest := Manifest{Version: "1.0.0", HostProtocolVersion: 1}
	for _, target := range Targets {
		source := filepath.Join(target.Folder(), ProgramName)
		path := filepath.Join(folder, source)
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(path, []byte("program for "+target.String()), 0o755); err != nil {
			t.Fatal(err)
		}
		measured, err := measure(path)
		if err != nil {
			t.Fatal(err)
		}
		artifact := host.Artifact{Name: ProgramName, Source: source, SHA256: measured.SHA256, Size: measured.Size}
		manifest.Targets = append(manifest.Targets, TargetArtifacts{Target: target, Artifacts: []host.Artifact{artifact}})
	}

	if err := writeSigned(manifest, folder, privateKey); err != nil {
		t.Fatal(err)
	}

	content, signature := readSigned(t, folder)

	return folder, content, signature, publicKey
}

func readSigned(t *testing.T, folder string) ([]byte, []byte) {
	t.Helper()
	content, err := os.ReadFile(filepath.Join(folder, ManifestName))
	if err != nil {
		t.Fatal(err)
	}
	signature, err := os.ReadFile(filepath.Join(folder, SignatureName))
	if err != nil {
		t.Fatal(err)
	}

	return content, signature
}

func TestVerifyAcceptsEveryTargetOfASignedRelease(t *testing.T) {
	folder, content, signature, publicKey := signedRelease(t)

	for _, target := range Targets {
		installation, err := Verify(content, signature, publicKey, target, folder)
		if err != nil {
			t.Fatalf("%s: %v", target, err)
		}
		want := filepath.Join(folder, target.Folder(), ProgramName)
		if len(installation.Artifacts) != 1 || installation.Artifacts[0].Source != want {
			t.Fatalf("%s: verified %+v, want one artifact from %s", target, installation.Artifacts, want)
		}
	}
}

func TestVerifyRefusesAFlippedSignatureByte(t *testing.T) {
	folder, content, signature, publicKey := signedRelease(t)
	signature[0] ^= 0x01

	_, err := Verify(content, signature, publicKey, Targets[0], folder)
	if !errors.Is(err, ErrSignatureInvalid) {
		t.Fatalf("Verify = %v, want ErrSignatureInvalid", err)
	}
}

func TestVerifyRefusesAnotherKeysSignature(t *testing.T) {
	folder, content, signature, _ := signedRelease(t)
	otherKey, _, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatal(err)
	}

	_, err = Verify(content, signature, otherKey, Targets[0], folder)
	if !errors.Is(err, ErrSignatureInvalid) {
		t.Fatalf("Verify = %v, want ErrSignatureInvalid", err)
	}
}

func TestVerifyRefusesATargetNotInTheManifest(t *testing.T) {
	folder, content, signature, publicKey := signedRelease(t)

	_, err := Verify(content, signature, publicKey, Target{OS: "windows", Arch: "amd64"}, folder)
	if !errors.Is(err, ErrTargetMissing) {
		t.Fatalf("Verify = %v, want ErrTargetMissing", err)
	}
}

func TestVerifyRefusesAChangedFile(t *testing.T) {
	folder, content, signature, publicKey := signedRelease(t)
	target := Targets[2]
	path := filepath.Join(folder, target.Folder(), ProgramName)
	if err := os.WriteFile(path, []byte("program for "+target.String()+"!"), 0o755); err != nil {
		t.Fatal(err)
	}

	_, err := Verify(content, signature, publicKey, target, folder)
	if !errors.Is(err, ErrArtifactChanged) {
		t.Fatalf("Verify = %v, want ErrArtifactChanged", err)
	}
}

func TestVerifyRefusesASizeOtherThanTheManifests(t *testing.T) {
	folder := t.TempDir()
	publicKey, privateKey, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatal(err)
	}
	target := Targets[0]
	source := filepath.Join(target.Folder(), ProgramName)
	if err := os.MkdirAll(filepath.Join(folder, target.Folder()), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(folder, source), []byte("program"), 0o755); err != nil {
		t.Fatal(err)
	}
	measured, err := measure(filepath.Join(folder, source))
	if err != nil {
		t.Fatal(err)
	}
	artifact := host.Artifact{Name: ProgramName, Source: source, SHA256: measured.SHA256, Size: measured.Size + 1}
	manifest := Manifest{Version: "1.0.0", Targets: []TargetArtifacts{{Target: target, Artifacts: []host.Artifact{artifact}}}}
	if err := writeSigned(manifest, folder, privateKey); err != nil {
		t.Fatal(err)
	}
	content, signature := readSigned(t, folder)

	_, err = Verify(content, signature, publicKey, target, folder)
	if !errors.Is(err, ErrArtifactChanged) {
		t.Fatalf("Verify = %v, want ErrArtifactChanged", err)
	}
}
