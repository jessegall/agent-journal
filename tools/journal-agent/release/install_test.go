package release

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
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
	t.Cleanup(func() { _ = os.Chmod(into, 0o700) })

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
