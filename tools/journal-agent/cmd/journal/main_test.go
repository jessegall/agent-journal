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

// answeringJournal is a transport whose journal answers every call with the binding ready, last in contact at contact.
type answeringJournal struct{ contact time.Time }

func (journal answeringJournal) RoundTrip(request *http.Request) (*http.Response, error) {
	body, err := json.Marshal(map[string]any{"readiness": "ready", "lastContactAt": journal.contact, "serverTime": time.Now()})
	if err != nil {
		return nil, err
	}

	return &http.Response{StatusCode: http.StatusOK, Header: http.Header{"Content-Type": {"application/json"}},
		Body: io.NopCloser(bytes.NewReader(body)), Request: request}, nil
}

// reachable is a transport to a journal that answers.
func reachable() *http.Client {
	return &http.Client{Transport: answeringJournal{contact: time.Date(2026, 11, 21, 9, 30, 0, 0, time.UTC)}}
}

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
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }, grant: noGrant,
		transport: reachable()}

	for _, folder := range []string{root, nested} {
		printed, _, code := answer(commands, []string{"status"}, folder, "")
		if code != 0 || !strings.HasPrefix(printed, "Enrolled with https://journal.example.com\n") ||
			!strings.Contains(printed, "Folder my shop on ") || !strings.Contains(printed, "Last confirmed contact ") {
			t.Fatalf("from %s: %q, %d", folder, printed, code)
		}
	}
}

func TestStatusTellsTheLastConfirmedContactFromAFailedRefreshAndPrintsNoSecret(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	connection := host.ConnectionState{Folder: state, CanonicalRoot: root}
	binding, err := connection.Binding()
	if err != nil {
		t.Fatal(err)
	}
	binding.Secret = "host-secret-never-shown"
	if err := connection.SaveBinding(binding); err != nil {
		t.Fatal(err)
	}
	acknowledged := time.Date(2026, 11, 20, 18, 5, 0, 0, time.UTC)
	if err := connection.SaveRelayReport(host.RelayReport{BindingID: "binding-shop", AcknowledgedAt: acknowledged,
		Readiness: "ready"}); err != nil {
		t.Fatal(err)
	}
	nested := filepath.Join(root, "src")
	if err := os.MkdirAll(nested, 0o755); err != nil {
		t.Fatal(err)
	}
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }, grant: noGrant,
		transport: reachable()}

	printed, _, code := answer(commands, []string{"status"}, nested, "")

	for _, shown := range []string{"Enrolled with https://journal.example.com", "binding binding-shop",
		"Last confirmed contact " + localMoment(time.Date(2026, 11, 21, 9, 30, 0, 0, time.UTC)), "Readiness ready"} {
		if code != 0 || !strings.Contains(printed, shown) || strings.Contains(printed, "Refresh failed") {
			t.Fatalf("the refreshed status printed %q, %d, without %q", printed, code, shown)
		}
	}

	commands.transport = &http.Client{Transport: unreachable{}}
	printed, refusal, code := answer(commands, []string{"status"}, nested, "")

	if code == 0 || !strings.Contains(printed, "Last confirmed contact "+localMoment(acknowledged)) ||
		!strings.Contains(printed, "Refresh failed: ") {
		t.Fatalf("the status with the server stopped printed %q, %d", printed, code)
	}
	if strings.Contains(printed+refusal, binding.Secret) {
		t.Fatal("the status printed the host's secret")
	}
	if kept, err := connection.RelayReport(); err != nil || !kept.AcknowledgedAt.Equal(acknowledged) {
		t.Fatalf("the failed refresh changed the kept report: %+v, %v", kept, err)
	}
}

func TestTwoConnectedRootsShowTheirOwnProjects(t *testing.T) {
	state := realTempDir(t)
	parent := realTempDir(t)
	shop := connectedFolder(t, state, parent, "shop")
	blog := connectedFolder(t, state, parent, "blog")
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }, grant: noGrant,
		transport: reachable()}

	shopStatus, _, _ := answer(commands, []string{"status"}, shop, "")
	blogStatus, _, _ := answer(commands, []string{"status"}, blog, "")

	if !strings.Contains(shopStatus, "Folder shop on ") || !strings.Contains(blogStatus, "Folder blog on ") {
		t.Fatalf("statuses %q and %q", shopStatus, blogStatus)
	}
}

func TestAStoppedRelayIsStartedByTheCommand(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	woken := []string{}
	commands := dispatcher{stateFolder: state, grant: noGrant, transport: reachable(),
		wake: func(_ string, bindingID string) error {
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
		disableService: func(bindingID string) error {
			disabled = append(disabled, bindingID)
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

// cuttingJournal drops the connection of every command it is sent, after reading its request id, and answers a
// status lookup of binding-shop with the run's recorded frames; another binding's lookup is refused.
func cuttingJournal(t *testing.T, asked *string) *httptest.Server {
	t.Helper()

	return httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.URL.Path == "/api/project-commands" {
			var command client.ProjectCommand
			_ = json.NewDecoder(request.Body).Decode(&command)
			*asked = command.RequestKey
			connection, _, err := writer.(http.Hijacker).Hijack()
			if err == nil {
				connection.Close()
			}
			return
		}
		var lookup map[string]string
		_ = json.NewDecoder(request.Body).Decode(&lookup)
		if lookup["binding"] != "binding-shop" {
			writer.WriteHeader(http.StatusForbidden)
			_, _ = writer.Write([]byte(`{"code":"forbidden","message":"not the binding of the calling agent"}`))
			return
		}
		_ = json.NewEncoder(writer).Encode(client.CommandStatus{State: "failed", Frames: []client.CommandFrame{
			{Sequence: 1, Stream: "stdout", Text: "Tasks\n"}, {Sequence: 2, Stream: "exit", ExitCode: 3},
		}})
	}))
}

func TestACommandCutOffPrintsItsRequestIDAndItsStatusReadsTheOriginalFramesAndExitCode(t *testing.T) {
	asked := ""
	server := cuttingJournal(t, &asked)
	defer server.Close()
	state := realTempDir(t)
	parent := realTempDir(t)
	shop := connectedFolder(t, state, parent, "shop")
	blog := connectedFolder(t, state, parent, "blog")
	commands := forwarding(t, server, state)

	_, refusal, code := answer(commands, []string{"task", "list"}, shop, "")

	if code == 0 || asked == "" || !strings.Contains(refusal, "Outcome unknown") ||
		!strings.Contains(refusal, "journal command status "+asked) {
		t.Fatalf("the cut-off command answered %q, %d for request %q", refusal, code, asked)
	}

	printed, _, code := answer(commands, []string{"command", "status", asked}, shop, "")

	if code != 3 || printed != "Tasks\n" {
		t.Fatalf("the status printed %q and exited %d", printed, code)
	}
	if _, refusal, code := answer(commands, []string{"command", "status", asked}, blog, ""); code == 0 ||
		!strings.Contains(refusal, "not the binding") {
		t.Fatalf("another binding's lookup answered %q, %d", refusal, code)
	}
}
