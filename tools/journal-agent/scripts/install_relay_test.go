// Package scripts holds the shell scripts a release ships; its tests run them against stub programs.
package scripts

import (
	"crypto/sha256"
	"encoding/hex"
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

// stubCurl copies the file a URL names from the fixture folder, as the journal's release routes would serve it, and
// prints the status curl's -w asks for; with REDIRECT set it answers a redirect and writes nothing.
const stubCurl = `#!/bin/sh
out=""
url=""
while [ $# -gt 0 ]; do
    case "$1" in
        -o) out=$2; shift 2 ;;
        --proto | --max-redirs | -w) shift 2 ;;
        -*) shift ;;
        *) url=$1; shift ;;
    esac
done
if [ -n "${REDIRECT:-}" ]; then
    printf 302
    exit 0
fi
cp "$FIXTURE/${url#https://journal.example.com/}" "$out" && printf 200
`

// stubProgram stands in for journal-agent: install-release lays out an installation, connect records its ticket.
const stubProgram = `#!/bin/sh
case "$1" in
    install-release)
        while [ $# -gt 0 ]; do [ "$1" = --into ] && into=$2; shift; done
        mkdir -p "$into/bin"
        cp "$0" "$into/bin/journal-agent"
        printf '#!/bin/sh\necho dispatcher\n' >"$into/bin/journal"
        chmod +x "$into/bin/journal"
        echo install >>"$RECORD"
        ;;
    connect)
        read -r ticket
        echo "connect $ticket" >>"$RECORD"
        exit "${CONNECT_EXIT:-0}"
        ;;
esac
`

// installRelay is one run of install-relay.sh in a fake home, against a fake journal.
type installRelay struct {
	t         *testing.T
	home      string
	root      string
	stubs     string
	downloads string
	record    string
	// extra are more environment entries of the run, such as the stub connect's exit code.
	extra []string
}

func newInstallRelay(t *testing.T) installRelay {
	t.Helper()
	base, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	run := installRelay{
		t:         t,
		home:      filepath.Join(base, "home"),
		root:      filepath.Join(base, "my project"),
		stubs:     filepath.Join(base, "stubs"),
		downloads: filepath.Join(base, "downloads"),
		record:    filepath.Join(base, "record"),
	}
	fixture := filepath.Join(base, "fixture")
	target := release.Target{OS: runtime.GOOS, Arch: runtime.GOARCH}
	for _, folder := range []string{run.home, run.root, run.stubs, run.downloads, filepath.Join(fixture, "releases/1.0.0", target.Folder(), "bin")} {
		if err := os.MkdirAll(folder, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	run.write(filepath.Join(run.stubs, "curl"), stubCurl)
	program := filepath.Join(fixture, "releases/1.0.0", target.Folder(), "bin/journal-agent")
	run.write(program, stubProgram)
	digest := sha256.Sum256([]byte(stubProgram))
	manifest, err := release.Manifest{Version: "1.0.0", HostProtocolVersion: 2, Targets: []release.TargetArtifacts{{
		Target: target,
		Artifacts: []host.Artifact{{
			Name: "bin/journal-agent", Source: target.Folder() + "/bin/journal-agent",
			SHA256: hex.EncodeToString(digest[:]), Size: int64(len(stubProgram)), Executable: true,
		}},
	}}}.Bytes()
	if err != nil {
		t.Fatal(err)
	}
	run.write(filepath.Join(run.downloads, "manifest.json"), string(manifest))
	run.write(filepath.Join(run.downloads, "manifest.json.sig"), "signature")
	run.git("init", "-q")
	t.Setenv("FIXTURE", fixture)

	return run
}

func (run installRelay) write(path string, content string) {
	run.t.Helper()
	if err := os.WriteFile(path, []byte(content), 0o755); err != nil {
		run.t.Fatal(err)
	}
}

func (run installRelay) git(arguments ...string) {
	run.t.Helper()
	command := exec.Command("git", append([]string{"-C", run.root}, arguments...)...)
	if printed, err := command.CombinedOutput(); err != nil {
		run.t.Fatalf("git %v: %v\n%s", arguments, err, printed)
	}
}

// install runs the script in the project folder with the ticket on standard input and answers what it printed.
func (run installRelay) install(path string) (string, error) {
	script, err := filepath.Abs("install-relay.sh")
	if err != nil {
		run.t.Fatal(err)
	}
	command := exec.Command("/bin/sh", script, "https://journal.example.com", "1.0.0", run.downloads)
	command.Dir = run.root
	command.Stdin = strings.NewReader("the-ticket\n")
	command.Env = append([]string{
		"PATH=" + path, "HOME=" + run.home, "SHELL=/bin/zsh", "RECORD=" + run.record, "FIXTURE=" + os.Getenv("FIXTURE"),
	}, run.extra...)
	printed, err := command.CombinedOutput()

	return string(printed), err
}

func (run installRelay) recorded() string {
	content, _ := os.ReadFile(run.record)

	return string(content)
}

func (run installRelay) systemPath() string {
	return run.stubs + ":/usr/bin:/bin"
}

func TestOnACleanCheckoutTheScriptInstallsAndHandsTheTicketToConnect(t *testing.T) {
	run := newInstallRelay(t)

	printed, err := run.install(run.systemPath())
	if err != nil {
		t.Fatalf("install failed: %v\n%s", err, printed)
	}

	if run.recorded() != "install\nconnect the-ticket\n" {
		t.Fatalf("recorded %q\n%s", run.recorded(), printed)
	}
	link, err := os.Readlink(filepath.Join(run.home, ".local/bin/journal"))
	if err != nil || link != filepath.Join(run.home, ".journal-agent/releases/1.0.0/bin/journal") {
		t.Fatalf("the journal command links to %q, %v", link, err)
	}
	if !strings.Contains(printed, run.root) || !strings.Contains(printed, "journal status") {
		t.Fatalf("the script printed no root or command:\n%s", printed)
	}
}

func TestARerunReusesTheInstalledCommandAndChangesNoShellFile(t *testing.T) {
	run := newInstallRelay(t)
	if printed, err := run.install(run.systemPath()); err != nil {
		t.Fatalf("first install failed: %v\n%s", err, printed)
	}
	startup, err := os.ReadFile(filepath.Join(run.home, ".zshrc"))
	if err != nil {
		t.Fatal(err)
	}

	again := filepath.Join(run.home, ".local/bin") + ":" + run.systemPath()
	if printed, err := run.install(again); err != nil {
		t.Fatalf("rerun failed: %v\n%s", err, printed)
	}

	rerun, err := os.ReadFile(filepath.Join(run.home, ".zshrc"))
	if err != nil || string(rerun) != string(startup) || strings.Count(string(rerun), "# journal: the journal command") != 1 {
		t.Fatalf("the rerun changed .zshrc:\n%s", rerun)
	}
}

func TestEachRefusalStopsBeforeTheTicketIsSpent(t *testing.T) {
	cases := map[string]struct {
		prepare func(run installRelay) string
		message string
	}{
		"a tracked .journal": {func(run installRelay) string {
			run.write(filepath.Join(run.root, ".journal"), "tracked")
			run.git("add", ".journal")
			return run.systemPath()
		}, "is tracked by Git"},
		"a linked .journal": {func(run installRelay) string {
			if err := os.Symlink(run.home, filepath.Join(run.root, ".journal")); err != nil {
				t.Fatal(err)
			}
			return run.systemPath()
		}, "is a link"},
		"a version 5 .journal": {func(run installRelay) string {
			if err := os.MkdirAll(filepath.Join(run.root, ".journal/bin"), 0o755); err != nil {
				t.Fatal(err)
			}
			return run.systemPath()
		}, "version 5 installation"},
		"a foreign journal on PATH": {func(run installRelay) string {
			run.write(filepath.Join(run.stubs, "journal"), "#!/bin/sh\n")
			return run.systemPath()
		}, "another journal command wins on PATH at " + "STUBS/journal"},
		"an unsupported processor": {func(run installRelay) string {
			run.write(filepath.Join(run.stubs, "uname"), "#!/bin/sh\n[ \"$1\" = -m ] && echo sparc64 || echo Linux\n")
			return run.systemPath()
		}, "(Linux sparc64) is not supported. This release has builds for"},
	}

	for name, refusal := range cases {
		t.Run(name, func(t *testing.T) {
			run := newInstallRelay(t)
			path := refusal.prepare(run)

			printed, err := run.install(path)

			want := strings.ReplaceAll(refusal.message, "STUBS", run.stubs)
			if err == nil || !strings.Contains(printed, want) {
				t.Fatalf("want a refusal naming %q, got %v:\n%s", want, err, printed)
			}
			if strings.Contains(run.recorded(), "connect") {
				t.Fatalf("the ticket was handed on after a refusal: %q", run.recorded())
			}
		})
	}
}

func TestAConnectedInstallEndsWithZeroAndTheConnectedLine(t *testing.T) {
	run := newInstallRelay(t)

	printed, err := run.install(run.systemPath())

	if err != nil || !strings.Contains(printed, "journal: connected.") {
		t.Fatalf("a clean install ended %v:\n%s", err, printed)
	}
}

func TestAnInstallWhoseRelayHasNotReachedTheJournalEndsWithTwoAndNoConnectedLine(t *testing.T) {
	run := newInstallRelay(t)
	run.extra = []string{"CONNECT_EXIT=2"}

	printed, err := run.install(run.systemPath())

	var exited *exec.ExitError
	if !errors.As(err, &exited) || exited.ExitCode() != 2 {
		t.Fatalf("a pending first contact ended %v:\n%s", err, printed)
	}
	if strings.Contains(printed, "journal: connected.") || !strings.Contains(printed, "status") {
		t.Fatalf("a pending install printed:\n%s", printed)
	}
}

func TestAFailedConnectOrDamagedOrRedirectedDownloadEndsNonzeroWithoutTheConnectedLine(t *testing.T) {
	cases := map[string]struct {
		extra   []string
		damage  bool
		message string
	}{
		"a failed connect":      {extra: []string{"CONNECT_EXIT=1"}, message: "the connect step failed"},
		"a damaged download":    {damage: true, message: "the verification step failed"},
		"a redirected download": {extra: []string{"REDIRECT=1"}, message: "answered 302"},
	}
	for name, failure := range cases {
		t.Run(name, func(t *testing.T) {
			run := newInstallRelay(t)
			run.extra = failure.extra
			if failure.damage {
				target := release.Target{OS: runtime.GOOS, Arch: runtime.GOARCH}
				run.write(filepath.Join(os.Getenv("FIXTURE"), "releases/1.0.0", target.Folder(), "bin/journal-agent"), "damaged")
			}

			printed, err := run.install(run.systemPath())

			if err == nil || strings.Contains(printed, "journal: connected.") || !strings.Contains(printed, failure.message) {
				t.Fatalf("want a failure naming %q, got %v:\n%s", failure.message, err, printed)
			}
		})
	}
}
