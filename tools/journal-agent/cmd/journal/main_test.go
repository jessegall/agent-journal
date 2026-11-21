package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"journal-agent/client"
	"journal-agent/host"
)

// answer runs the dispatcher and answers what it printed to standard output and error, and its exit code.
func answer(commands dispatcher, arguments []string, folder string, stdin string) (string, string, int) {
	var stdout, stderr bytes.Buffer
	code := commands.run(arguments, folder, []byte(stdin), &stdout, &stderr)

	return stdout.String(), stderr.String(), code
}

func noGrant(host.Binding) (client.StartGrant, bool) { return client.StartGrant{}, false }

// connectedFolder makes a folder connected to a binding of its own in the state folder, as connect leaves it.
func connectedFolder(t *testing.T, stateFolder string, parent string, name string) string {
	t.Helper()
	root := filepath.Join(parent, name)
	if err := os.MkdirAll(filepath.Join(root, ".journal"), 0o700); err != nil {
		t.Fatal(err)
	}
	binding := host.Binding{
		Enrollment:    host.Enrollment{JournalURL: "https://journal.example.com", HostID: "host-" + name},
		ProjectID:     "project-" + name,
		BindingID:     "binding-" + name,
		RootID:        "root-" + name,
		CanonicalRoot: root,
	}
	state := host.ConnectionState{Folder: stateFolder, CanonicalRoot: root}
	if err := state.SaveBinding(binding); err != nil {
		t.Fatal(err)
	}
	content := `{"protocol":2,"binding":"binding-` + name + `","project":"project-` + name + `","host":"host-` + name +
		`","origin":"https://journal.example.com","rootId":"root-` + name + `"}`
	if err := os.WriteFile(filepath.Join(root, ".journal/connection.json"), []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := state.SaveRelayReport(host.RelayReport{ReportedAt: time.Now(), ExpiresAt: time.Now().Add(time.Minute)}); err != nil {
		t.Fatal(err)
	}

	return root
}

// realTempDir is a temporary folder by its real path, as the dispatcher resolves the folder it runs in.
func realTempDir(t *testing.T) string {
	t.Helper()
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}

	return folder
}

func TestStatusAnswersFromTheRootAndANestedFolderInAPathWithSpaces(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "my shop")
	nested := filepath.Join(root, "src", "deep folder")
	if err := os.MkdirAll(nested, 0o755); err != nil {
		t.Fatal(err)
	}
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }, grant: noGrant}

	for _, folder := range []string{root, nested} {
		printed, _, code := answer(commands, []string{"status"}, folder, "")
		if code != 0 || !strings.HasPrefix(printed, "Connected to https://journal.example.com · my shop · ") ||
			!strings.Contains(printed, "last contact ") {
			t.Fatalf("from %s: %q, %d", folder, printed, code)
		}
	}
}

func TestTwoConnectedRootsShowTheirOwnProjects(t *testing.T) {
	state := realTempDir(t)
	parent := realTempDir(t)
	shop := connectedFolder(t, state, parent, "shop")
	blog := connectedFolder(t, state, parent, "blog")
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }, grant: noGrant}

	shopStatus, _, _ := answer(commands, []string{"status"}, shop, "")
	blogStatus, _, _ := answer(commands, []string{"status"}, blog, "")

	if !strings.Contains(shopStatus, " · shop · ") || !strings.Contains(blogStatus, " · blog · ") {
		t.Fatalf("statuses %q and %q", shopStatus, blogStatus)
	}
}

func TestAStoppedRelayIsStartedByTheCommand(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	woken := []string{}
	commands := dispatcher{stateFolder: state, grant: noGrant, wake: func(_ string, bindingID string) error {
		woken = append(woken, bindingID)
		return nil
	}}

	if _, _, code := answer(commands, []string{"status"}, root, ""); code != 0 {
		t.Fatal("status failed")
	}
	unlock, err := host.ConnectionState{Folder: state, CanonicalRoot: root}.LockRelay()
	if err != nil {
		t.Fatal(err)
	}
	defer unlock()
	if _, _, code := answer(commands, []string{"status"}, root, ""); code != 0 {
		t.Fatal("status failed")
	}

	if len(woken) != 1 || woken[0] != "binding-shop" {
		t.Fatalf("woke %v, want the stopped relay once", woken)
	}
}

func TestAMovedRootIsRefusedAndAnUnconnectedFolderSaysSo(t *testing.T) {
	state := realTempDir(t)
	parent := realTempDir(t)
	root := connectedFolder(t, state, parent, "shop")
	moved := filepath.Join(parent, "shop moved")
	if err := os.Rename(root, moved); err != nil {
		t.Fatal(err)
	}
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }, grant: noGrant}

	if _, refusal, code := answer(commands, []string{"status"}, moved, ""); code == 0 ||
		!strings.Contains(refusal, root) || !strings.Contains(refusal, moved) {
		t.Fatalf("a moved root answered %q, %d", refusal, code)
	}
	printed, _, code := answer(commands, []string{"status"}, realTempDir(t), "")
	if code != 0 || !strings.HasPrefix(printed, "Not connected") {
		t.Fatalf("an unconnected folder answered %q, %d", printed, code)
	}
}

// fakeCommands answers a project command with the stdin it was sent echoed on standard output and the exit code the
// verb named, as the server streams a verb's frames.
func fakeCommands(t *testing.T) *httptest.Server {
	t.Helper()

	return httptest.NewTLSServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		var command client.ProjectCommand
		_ = json.NewDecoder(request.Body).Decode(&command)
		code := 0
		if command.Argv[0] == "task" && command.Argv[1] == "show" {
			code = 3
		}
		frames := []client.CommandFrame{
			{Sequence: 1, Stream: "stdout", Text: strings.Join(command.Argv, " ") + "\n"},
			{Sequence: 2, Stream: "stdout", Text: command.Stdin},
			{Sequence: 3, Stream: "exit", ExitCode: code},
		}
		_ = json.NewEncoder(writer).Encode(map[string][]client.CommandFrame{"frames": frames})
	}))
}

func forwarding(t *testing.T, server *httptest.Server, state string) dispatcher {
	t.Helper()

	return dispatcher{
		stateFolder: state,
		wake:        func(string, string) error { return nil },
		grant: func(host.Binding) (client.StartGrant, bool) {
			return client.StartGrant{JournalURL: server.URL, Token: "token", ProfileKey: "main-agent", ProfileRevision: 1}, true
		},
		transport: server.Client(),
	}
}

func TestAVerbRunsOnTheServerWithItsOutputStdinAndExitCode(t *testing.T) {
	server := fakeCommands(t)
	defer server.Close()
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	commands := forwarding(t, server, state)

	printed, _, code := answer(commands, []string{"overview"}, root, "")
	if code != 0 || !strings.HasPrefix(printed, "overview\n") {
		t.Fatalf("overview printed %q with %d", printed, code)
	}
	if _, _, code := answer(commands, []string{"task", "show", "999"}, root, ""); code != 3 {
		t.Fatalf("a missing task exited %d, want the verb's own 3", code)
	}
	if printed, _, _ := answer(commands, []string{"task", "log", "1"}, root, "piped text"); !strings.Contains(printed, "piped text") {
		t.Fatalf("the pipe did not reach the verb: %q", printed)
	}
}

func TestWithTheServerDownTheVerbFailsWithItsRequestKey(t *testing.T) {
	server := fakeCommands(t)
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	commands := forwarding(t, server, state)
	server.Close()

	_, refusal, code := answer(commands, []string{"overview"}, root, "")

	if code == 0 || !strings.Contains(refusal, "(request ") {
		t.Fatalf("a verb with the server down answered %q, %d", refusal, code)
	}
}

func TestJournalCodexNamesWhyLocalCodexIsWithheld(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }, grant: noGrant}

	_, refusal, code := answer(commands, []string{"codex"}, root, "")

	if code == 0 || !strings.Contains(refusal, "withheld") {
		t.Fatalf("journal codex answered %q, %d", refusal, code)
	}
}

func TestDisconnectRemovesOneFolderKeepsItsDirtyWorktreeAndLeavesTheOtherConnected(t *testing.T) {
	state := realTempDir(t)
	parent := realTempDir(t)
	shop := connectedFolder(t, state, parent, "shop")
	blog := connectedFolder(t, state, parent, "blog")
	dirty := filepath.Join(shop, ".journal", "worktrees", "feature")
	if err := os.MkdirAll(dirty, 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dirty, "draft.txt"), []byte("work in progress"), 0o600); err != nil {
		t.Fatal(err)
	}
	disabled := []string{}
	commands := dispatcher{
		stateFolder: state,
		wake:        func(string, string) error { return nil },
		grant:       noGrant,
		disableService: func(binding host.Binding) error {
			disabled = append(disabled, binding.BindingID)
			return nil
		},
	}

	if _, _, code := answer(commands, []string{"disconnect"}, shop, ""); code == 0 {
		t.Fatal("disconnect went on without --yes")
	}
	printed, refusal, code := answer(commands, []string{"disconnect", "--yes"}, shop, "")

	if code != 0 {
		t.Fatalf("disconnect answered %q, %d", refusal, code)
	}
	if !strings.Contains(printed, "Kept work in progress at "+dirty) || strings.Contains(printed, "No connected project is left") {
		t.Fatalf("the first disconnect printed %q", printed)
	}
	if _, err := os.Stat(filepath.Join(shop, ".journal", "connection.json")); !os.IsNotExist(err) {
		t.Fatalf("connection.json is still there: %v", err)
	}
	if _, err := os.Stat(filepath.Join(dirty, "draft.txt")); err != nil {
		t.Fatalf("the dirty worktree was not kept: %v", err)
	}
	if _, err := (host.ConnectionState{Folder: state, CanonicalRoot: shop}).Binding(); err == nil {
		t.Fatal("the binding's private state is still there")
	}
	if _, err := (host.ConnectionState{Folder: state, CanonicalRoot: blog}).Binding(); err != nil {
		t.Fatalf("the other folder's binding went too: %v", err)
	}
	if _, err := os.Stat(filepath.Join(blog, ".journal", "connection.json")); err != nil {
		t.Fatalf("the other folder lost its connection: %v", err)
	}

	printed, _, _ = answer(commands, []string{"disconnect", "--yes"}, blog, "")
	if !strings.Contains(printed, "No connected project is left") || len(disabled) != 2 {
		t.Fatalf("the last disconnect printed %q and disabled %v", printed, disabled)
	}
}

func TestAShellUserOutsideAJournalTerminalIsToldToOpenOneBeforeAnyApproval(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	approved := false
	commands := dispatcher{
		stateFolder: state,
		wake:        func(string, string) error { return nil },
		grant:       noGrant,
		approval: func(host.Binding, host.ConnectionState, string, io.Writer) (host.TerminalSignIn, error) {
			approved = true
			return host.TerminalSignIn{}, nil
		},
	}

	_, printed, code := answer(commands, []string{"overview"}, root, "")

	if code == 0 || approved || !strings.Contains(printed, "journal terminal open") {
		t.Fatalf("a shell with no sign-in answered %d, approved %v, printed %q", code, approved, printed)
	}
}
