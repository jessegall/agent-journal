package release

import (
	"context"
	"errors"
	"io/fs"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/host"
)

// releaseServer serves a release folder under /releases/<version>/<target>/<name>, as the journal's routes do.
func releaseServer(t *testing.T, folder string) *httptest.Server {
	t.Helper()

	return httptest.NewTLSServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		parts := strings.SplitN(strings.TrimPrefix(request.URL.Path, "/releases/1.0.0/"), "/", 2)
		http.ServeFile(writer, request, filepath.Join(folder, parts[0], ProgramName))
	}))
}

func TestTheInstallerVerifiesDownloadsAndSealsTheTarget(t *testing.T) {
	folder, content, signature, publicKey := signedRelease(t)
	server := releaseServer(t, folder)
	defer server.Close()
	installer := Installer{Origin: server.URL, Target: Targets[0], Transport: server.Client(), PublicKey: publicKey}
	into := filepath.Join(realFolder(t), "installation")

	if err := installer.Install(context.Background(), content, signature, into); err != nil {
		t.Fatal(err)
	}
	if err := installer.Install(context.Background(), content, signature, into); err != nil {
		t.Fatalf("installing again into the installed folder: %v", err)
	}
	t.Cleanup(func() { unsealFolders(into) })

	installed, err := os.ReadFile(filepath.Join(into, ProgramName))
	if err != nil || string(installed) != "program for "+Targets[0].String() {
		t.Fatalf("installed %q, %v", installed, err)
	}
}

func TestTheInstallerRefusesAManifestNotSignedByThePinnedKey(t *testing.T) {
	folder, content, signature, publicKey := signedRelease(t)
	server := releaseServer(t, folder)
	defer server.Close()
	signature[3] ^= 0x10
	installer := Installer{Origin: server.URL, Target: Targets[0], Transport: server.Client(), PublicKey: publicKey}

	err := installer.Install(context.Background(), content, signature, filepath.Join(realFolder(t), "installation"))
	if !errors.Is(err, ErrSignatureInvalid) {
		t.Fatalf("Install = %v, want ErrSignatureInvalid", err)
	}
}

// realFolder is a temporary folder named by its real path, private to its owner, as an installation's parent must be.
func realFolder(t *testing.T) string {
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

func TestTheInstallerStopsAtARedirectedReleaseFileAndInstallsNothing(t *testing.T) {
	folder, content, signature, publicKey := signedRelease(t)
	direct := releaseServer(t, folder)
	defer direct.Close()
	redirecting := httptest.NewTLSServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		http.Redirect(writer, request, direct.URL+request.URL.Path, http.StatusFound)
	}))
	defer redirecting.Close()
	installer := Installer{Origin: redirecting.URL, Target: Targets[0], Transport: redirecting.Client(), PublicKey: publicKey}
	into := filepath.Join(realFolder(t), "installation")

	err := installer.Install(context.Background(), content, signature, into)

	if !errors.Is(err, ErrRedirected) {
		t.Fatalf("Install = %v, want ErrRedirected", err)
	}
	if _, statErr := os.Stat(filepath.Join(into, ProgramName)); !errors.Is(statErr, os.ErrNotExist) {
		t.Fatalf("a redirected release left %s installed: %v", ProgramName, statErr)
	}
}

// unsealFolders makes every folder of a sealed installation writable again, so the test's folder can be removed.
func unsealFolders(into string) {
	_ = filepath.WalkDir(into, func(path string, entry fs.DirEntry, err error) error {
		if err == nil && entry.IsDir() {
			_ = os.Chmod(path, 0o700)
		}
		return nil
	})
}

// linkedOfficialProgram writes a stand-in official program into a folder of its own, linked from a bin folder as an
// official installer links it, and answers the bin folder to search.
func linkedOfficialProgram(t *testing.T, program, content string) string {
	t.Helper()
	versions, bin := filepath.Join(t.TempDir(), "versions"), filepath.Join(t.TempDir(), "bin")
	for _, folder := range []string{versions, bin} {
		if err := os.MkdirAll(folder, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.WriteFile(filepath.Join(versions, program+"-pinned"), []byte(content), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(filepath.Join(versions, program+"-pinned"), filepath.Join(bin, program)); err != nil {
		t.Fatal(err)
	}

	return bin
}

func installWith(t *testing.T, programPath string) string {
	t.Helper()
	folder, content, signature, publicKey := signedRelease(t)
	server := releaseServer(t, folder)
	defer server.Close()
	installer := Installer{
		Origin: server.URL, Target: Targets[0], Transport: server.Client(), PublicKey: publicKey, ProgramPath: programPath,
	}
	into := filepath.Join(realFolder(t), "installation")
	if err := installer.Install(context.Background(), content, signature, into); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { unsealFolders(into) })

	return into
}

func TestTheInstallerSealsTheOfficialProviderThatReportsThePinnedBuild(t *testing.T) {
	program := "#!/bin/sh\necho '" + providerProfiles["claude-code"].Build() + " (Claude Code)'\n"
	into := installWith(t, linkedOfficialProgram(t, "claude", program))

	installed, err := os.ReadFile(filepath.Join(into, "bin", "claude"))
	if err != nil || string(installed) != program {
		t.Fatalf("bin/claude is %q, %v; want the official program", installed, err)
	}
	if _, err := (host.Installation{Folder: into}).Verify(); err != nil {
		t.Fatalf("the installation with the imported program does not verify: %v", err)
	}
	off, err := ProvidersOff(into)
	if err != nil || len(off) != 1 || off[0].Name != "codex" {
		t.Fatalf("providers off = %v, %v; want only codex, which is not on the PATH", off, err)
	}
}

func TestTheInstallerLeavesADriverOffWhoseOfficialInstallIsNotThePinnedNativeProgram(t *testing.T) {
	for name, program := range map[string]string{
		"another build":    "#!/bin/sh\necho '0.0.1 (Claude Code)'\n",
		"the npm launcher": "#!/usr/bin/env node\nconsole.log('" + providerProfiles["claude-code"].Build() + " (Claude Code)')\n",
	} {
		t.Run(name, func(t *testing.T) {
			into := installWith(t, linkedOfficialProgram(t, "claude", program))

			if _, err := os.Stat(filepath.Join(into, "bin", "claude")); !errors.Is(err, os.ErrNotExist) {
				t.Fatalf("bin/claude was installed from %s: %v", name, err)
			}
			off, err := ProvidersOff(into)
			if err != nil || len(off) != 2 || off[0].Name != "claude-code" || off[0].Reason == "" {
				t.Fatalf("providers off = %v, %v; want claude-code with its reason first", off, err)
			}
		})
	}
}
