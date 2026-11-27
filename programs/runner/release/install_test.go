package release

import (
	"context"
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"journal-runner/host"
	"journal-runner/hostapi"
)

const relayContent = "#!/bin/sh\necho relay\n"

// A connected machine installs a release with the official installs of the journal's listed programs on its PATH:
// both listed programs are sealed into the folder named for the version and the list, the allow list names both, a
// rerun rewrites a deleted allow list and changes nothing sealed, and a listed program with an unknown build is left
// off with its reason.
func TestAConnectedInstallSealsTheListedProgramsAndARerunRewritesOnlyTheAllowList(t *testing.T) {
	public, private, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatal(err)
	}
	manifest, signature := signedRelease(t, private)
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Write([]byte(relayContent))
	}))
	defer server.Close()
	listed := []byte(`{"drivers":[` +
		`{"name":"first-program","executable":"first","build":"2.1.323","check":["--version"],"host_name":"FIRST"},` +
		`{"name":"second-program","executable":"second","build":"0.165.0","check":["--version"],"host_name":"SECOND"},` +
		`{"name":"third-program","executable":"third","build":"1.0.0","check":["--version"],"host_name":"THIRD"}]}`)
	programs, err := ParseProgramList(listed)
	if err != nil {
		t.Fatal(err)
	}
	path := t.TempDir()
	writeProgram(t, path, "first", "2.1.323 (First)")
	writeProgram(t, path, "second", "second-cli 0.165.0")
	writeProgram(t, path, "third", "third 0.9.0")
	root, state := t.TempDir(), t.TempDir()
	folder := InstallationFolder(root, "6.0.0", listed)
	installer := Installer{
		Origin:      server.URL,
		Target:      Target{OS: runtime.GOOS, Arch: runtime.GOARCH},
		Transport:   server.Client(),
		PublicKey:   public,
		ProgramPath: path,
	}

	install := func() {
		if err := installer.Install(context.Background(), manifest, signature, programs, folder); err != nil {
			t.Fatal(err)
		}
		if err := WriteAllowList(state, folder, programs); err != nil {
			t.Fatal(err)
		}
	}
	install()
	sealed, err := host.Installation{Folder: folder}.Verify()
	if err != nil {
		t.Fatal(err)
	}
	allowListPath := hostapi.AllowedProgramsFile(state, filepath.Base(folder))
	if err := os.Remove(allowListPath); err != nil {
		t.Fatal(err)
	}
	install()

	resealed, err := host.Installation{Folder: folder}.Verify()
	if err != nil || len(resealed) != len(sealed) {
		t.Fatalf("a rerun changed what was sealed: %v %v", resealed, err)
	}
	var allowed hostapi.AllowedPrograms
	content, err := os.ReadFile(allowListPath)
	if err != nil || json.Unmarshal(content, &allowed) != nil {
		t.Fatalf("the rerun wrote no allow list: %v", err)
	}
	if len(allowed.Programs) != 2 || allowed.Programs["FIRST"] == "" || allowed.Programs["SECOND"] == "" {
		t.Fatalf("the allow list does not name both sealed programs: %+v", allowed.Programs)
	}
	off, err := ProvidersOff(folder)
	if err != nil || len(off) != 1 || off[0].Name != "third-program" {
		t.Fatalf("the program with an unknown build was not left off with its reason: %+v %v", off, err)
	}
}

// signedRelease is a release of one relay file for this machine's target, and its signature.
func signedRelease(t *testing.T, key ed25519.PrivateKey) ([]byte, []byte) {
	t.Helper()
	sum := sha256.Sum256([]byte(relayContent))
	target := Target{OS: runtime.GOOS, Arch: runtime.GOARCH}
	release := Manifest{Version: "6.0.0", Capabilities: Capabilities, Targets: []TargetArtifacts{{
		Target: target,
		Artifacts: []host.Artifact{{
			Name:       "bin/journal-runner",
			Source:     target.Folder() + "/bin/journal-runner",
			SHA256:     hex.EncodeToString(sum[:]),
			Size:       int64(len(relayContent)),
			Executable: true,
		}},
	}}}
	manifest, err := release.Bytes()
	if err != nil {
		t.Fatal(err)
	}

	return manifest, ed25519.Sign(key, manifest)
}

// writeProgram puts a native-looking program on the search path that reports the build line given.
func writeProgram(t *testing.T, folder, name, reported string) {
	t.Helper()
	script := "#!/bin/sh\necho '" + reported + "'\n"
	if err := os.WriteFile(filepath.Join(folder, name), []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
}
