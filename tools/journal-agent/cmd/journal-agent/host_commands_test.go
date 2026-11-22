package main

import (
	"context"
	"encoding/json"
	"errors"
	"net"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/creack/pty"
	"golang.org/x/term"

	"journal-agent/client"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/keyscripts"
	"journal-agent/profiles"
)

// rule is the row of ─ Claude Code draws above and below its composer.
var rule = strings.Repeat("─", 40)

// fakeProgram plays Claude Code on the far side of a PTY: it draws an empty composer, and draws each key it is sent
// into the composer as the program echoes it; everything it got is kept.
type fakeProgram struct {
	tty      *os.File
	mutex    sync.Mutex
	received strings.Builder
}

func (program *fakeProgram) run() {
	program.draw("")
	buffer := make([]byte, 256)
	for {
		count, err := program.tty.Read(buffer)
		if err != nil {
			return
		}
		program.mutex.Lock()
		program.received.Write(buffer[:count])
		typed := strings.TrimSuffix(program.received.String(), "\r")
		program.mutex.Unlock()
		program.draw(typed)
	}
}

func (program *fakeProgram) draw(composer string) {
	_, _ = program.tty.WriteString("\x1b[2J\x1b[1;1H" + rule + "\x1b[2;1H❯ " + composer + "\x1b[3;1H" + rule +
		"\x1b[2;" + strconv.Itoa(3+len([]rune(composer))) + "H")
}

func (program *fakeProgram) keys() string {
	program.mutex.Lock()
	defer program.mutex.Unlock()

	return program.received.String()
}

// openedTerminal starts the fake program behind a listening attach socket and opens runtime-1 on it.
func openedTerminal(t *testing.T) (*host.AttachSocket, host.Terminal, *fakeProgram) {
	t.Helper()
	folder, err := os.MkdirTemp("/tmp", "ja")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { os.RemoveAll(folder) })
	program := &fakeProgram{}
	starts := 0
	socket := &host.AttachSocket{Folder: folder, Layout: layoutOf, Start: func(host.AttachRequest) (*os.File, error) {
		starts++
		terminal, tty, err := pty.Open()
		if err != nil {
			return nil, err
		}
		if _, err := term.MakeRaw(int(tty.Fd())); err != nil {
			return nil, err
		}
		program.tty = tty
		go program.run()
		return terminal, nil
	}}
	listener, err := socket.Listen()
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { listener.Close() })

	request := host.AttachRequest{RuntimeID: "runtime-1", Driver: "claude", Command: []string{"claude"}, Rows: 12, Columns: 40}
	opened, err := socket.Open(request)
	if err != nil {
		t.Fatal(err)
	}
	again, err := socket.Open(request)
	if err != nil || again.Gate != opened.Gate || starts != 1 {
		t.Fatalf("a second open started the program again (%d starts, %v)", starts, err)
	}

	return socket, opened, program
}

func TestAKeyScriptOfAServedTerminalRunsOnTheLiveScreenAndGate(t *testing.T) {
	_, opened, program := openedTerminal(t)
	driver := terminalDriverOf(profiles.ClaudeCode{}, opened, 3, "conversation-1")
	var mutex sync.Mutex
	var steps []string
	driver.ReportProgressTo(func(progress keyscripts.Progress) {
		mutex.Lock()
		defer mutex.Unlock()
		steps = append(steps, progress.Name)
	})

	script := contracts.KeyScriptRequest{
		Request:    contracts.RequestIdentity{RuntimeID: "runtime-1", RequestID: "request-1", Attempt: 1},
		Script:     "ChangeModel",
		Version:    2,
		Parameters: map[string]string{"model": "GPT-6"},
	}
	result, _ := driver.RunKeyScript(context.Background(), script)

	mutex.Lock()
	defer mutex.Unlock()
	if !slices.Equal(steps, []string{"type /model", "run /model"}) || program.keys() != "/model\r" {
		t.Fatalf("the run confirmed %q and sent %q", steps, program.keys())
	}
	if result.Script == nil || result.Script.Outcome != keyscripts.ScriptFailed || driver.Generation() != 3 {
		t.Fatalf("a picker that never showed ended %+v in generation %d", result, driver.Generation())
	}
}

func TestAUserAttachedToAServedTerminalTypesThroughItsGate(t *testing.T) {
	socket, opened, program := openedTerminal(t)

	connection, err := net.Dial("unix", socket.Path())
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Close()
	request := host.AttachRequest{RuntimeID: "runtime-1", Rows: 12, Columns: 40}
	if err := host.WriteAttachRequest(connection, request); err != nil {
		t.Fatal(err)
	}
	if err := host.WriteKeys(connection, []byte("hi")); err != nil {
		t.Fatal(err)
	}

	deadline := time.Now().Add(2 * time.Second)
	for program.keys() != "hi" && time.Now().Before(deadline) {
		time.Sleep(10 * time.Millisecond)
	}
	if program.keys() != "hi" || opened.Gate.UserInputs() != 1 {
		t.Fatalf("the program got %q after %d inputs of the user", program.keys(), opened.Gate.UserInputs())
	}
}

func TestATerminalStartCarriesTheGrantsCredentialAndGeneration(t *testing.T) {
	folder := t.TempDir()
	grant := client.Grant{Token: "launch-token", Runtime: client.RuntimeStart{Folder: folder, ProcessGeneration: 4}}

	launch, err := startOf(profiles.ClaudeCode{}, folder, "http://journal.test", "", "runtime-1", grant,
		[]string{"LANG=C"}, nil, nil, "claude")
	if err != nil {
		t.Fatal(err)
	}

	if launch.RuntimeID != "runtime-1" || launch.Command[0] != "claude" || launch.Folder != folder {
		t.Fatalf("the launch is %+v", launch)
	}
	for _, wanted := range []string{"JOURNAL_START_TOKEN=launch-token", "JOURNAL_PROCESS_GENERATION=4"} {
		if !slices.Contains(launch.Env, wanted) {
			t.Fatalf("the launch's environment has no %s", wanted)
		}
	}
}

// The Codex terminal starts the interactive client in its own PTY: no exec, no JSON stream, and the grant's
// credential and generation in its environment like every terminal start.
func TestACodexTerminalStartLaunchesTheInteractiveClient(t *testing.T) {
	folder := t.TempDir()
	grant := client.Grant{Token: "launch-token", Runtime: client.RuntimeStart{Folder: folder, ProcessGeneration: 2}}

	launch, err := startOf(profiles.Codex{}, folder, "http://journal.test", "", "runtime-1", grant,
		[]string{"LANG=C"}, nil, nil, "codex")
	if err != nil {
		t.Fatal(err)
	}

	if launch.Command[0] != "codex" || slices.Contains(launch.Command, "exec") || slices.Contains(launch.Command, "--json") {
		t.Fatalf("the codex terminal launches %v, want the interactive client", launch.Command)
	}
	if !slices.Contains(launch.Env, "JOURNAL_PROCESS_GENERATION=2") {
		t.Fatalf("the codex terminal's environment has no process generation: %v", launch.Env)
	}
}

// A contained host checks an account start in a protected-account container against the protected platform's
// native evidence, needs no local installation for it, and refuses a grant that names no container.
func TestAContainedAccountStartIsCheckedAgainstItsContainersProtection(t *testing.T) {
	state := t.TempDir()
	containers := host.Containers{Rules: host.ContainerRules{AgentImage: "sha256:image"}}
	grant := client.Grant{
		Runtime:   client.RuntimeStart{Driver: "claude", DriverBuild: "2.1.323"},
		Container: json.RawMessage(`{"launchProfile":"protected-account"}`),
	}
	claim := client.ClaimedStart{Recipe: client.AccountRecipe{DriverVersion: "2.1.323"}}
	allowed := containedPrerequisites(state, "", containers)

	if err := allowed(grant, claim); err == nil || errors.Is(err, errNoInstallation) {
		t.Fatalf("a protected start without evidence was answered %v, want a refusal for the missing evidence", err)
	}

	evidence := `{"claude@2.1.323/linux-container-protected@sha256:image": {"account-secrets": "run 1",
		"foreign-history": "run 1", "keychain": "run 1", "control-sockets": "run 1", "process-inspection": "run 1",
		"install-writes": "run 1"}}`
	if err := os.WriteFile(filepath.Join(state, "native-evidence.json"), []byte(evidence), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := allowed(grant, claim); err != nil {
		t.Fatalf("a protected start with every item shown was refused: %v", err)
	}

	grant.Container = nil
	if err := allowed(grant, claim); !errors.Is(err, errNoContainer) {
		t.Fatalf("a start with no container was answered %v, want errNoContainer", err)
	}
}
