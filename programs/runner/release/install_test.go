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
	"strings"
	"testing"

	"journal-runner/host"
	"journal-runner/hostapi"
	"journal-runner/recorded"
)

const relayContent = "#!/bin/sh\necho relay\n"

// A connected machine installs a release with the journal's listed programs on its PATH:
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
	first := recorded.MustProbe(t, "version").Printed(os.Getenv)
	second := recorded.MustProbe(t, "second-version").Printed(os.Getenv)
	firstProgram := agentProgram()
	firstProgram.Build = strings.Fields(first)[0]
	secondProgram := Program{Name: "second-agent", Executable: "second", Build: strings.Fields(second)[1],
		Check: []string{"--version"}, HostName: "SECOND_EXECUTABLE"}
	listed := listOf(t, firstProgram, secondProgram)
	programs, err := ParseProgramList(listed)
	if err != nil {
		t.Fatal(err)
	}
	path := t.TempDir()
	writeProgram(t, path, firstProgram.Executable, first)
	writeProgram(t, path, secondProgram.Executable, second)
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
	if len(allowed.Programs) != len(programs) {
		t.Fatalf("the allow list does not name both sealed programs: %+v", allowed.Programs)
	}
	for _, program := range programs {
		if allowed.Programs[program.HostName] == "" {
			t.Fatalf("the allow list does not name %s: %+v", program.HostName, allowed.Programs)
		}
	}

	programs[1].Build = "0.0.0"
	unknown := programs[1]
	refusedList, err := json.Marshal(ProgramList{Programs: programs})
	if err != nil {
		t.Fatal(err)
	}
	refused := InstallationFolder(t.TempDir(), "6.0.0", refusedList)
	if err := installer.Install(context.Background(), manifest, signature, programs, refused); err != nil {
		t.Fatal(err)
	}
	off, err := ProvidersOff(refused)
	if err != nil || len(off) != 1 || off[0].Name != unknown.Name || !strings.Contains(off[0].Reason, unknown.Build) {
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
	script := "#!/bin/sh\nprintf '%s' '" + strings.ReplaceAll(reported, "'", "'\\''") + "'\n"
	if err := os.WriteFile(filepath.Join(folder, name), []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
}
