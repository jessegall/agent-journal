package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/host"
)

// unreachable is a transport with the network off: every call fails before it leaves the machine.
type unreachable struct{}

func (unreachable) RoundTrip(*http.Request) (*http.Response, error) {
	return nil, errors.New("the network is off")
}

func disconnecting(state string, disabled *[]string) dispatcher {
	return dispatcher{
		stateFolder: state,
		wake:        func(string, string) error { return nil },
		grant:       noGrant,
		transport:   &http.Client{Transport: unreachable{}},
		commandPath: "/opt/journal/bin/journal",
		disableService: func(bindingID string) error {
			*disabled = append(*disabled, bindingID)
			return nil
		},
	}
}

// gitIn runs git in the folder with a fixed author and no user configuration, and answers what it printed.
func gitIn(t *testing.T, folder string, arguments ...string) string {
	t.Helper()
	command := exec.Command("git", append([]string{"-C", folder, "-c", "user.name=t", "-c", "user.email=t@t"}, arguments...)...)
	command.Env = append(os.Environ(), "GIT_CONFIG_GLOBAL=/dev/null", "GIT_CONFIG_NOSYSTEM=1")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("git %v: %v: %s", arguments, err, output)
	}

	return strings.TrimSpace(string(output))
}

func TestADisconnectCutShortAfterTheServiceIsFinishedByResumeWithNoConnectionFileAndNoNetwork(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	connection := host.ConnectionState{Folder: state, CanonicalRoot: root}
	record := host.DisconnectRecord{BindingID: "binding-shop", RootID: "root-shop", CanonicalRoot: root,
		Service: "nl.journal.relay.binding-shop", Done: []host.DisconnectStep{host.StepFence, host.StepService}}
	if err := record.Save(state); err != nil {
		t.Fatal(err)
	}
	if err := connection.Fence(); err != nil {
		t.Fatal(err)
	}
	if err := os.Remove(filepath.Join(root, ".journal", "connection.json")); err != nil {
		t.Fatal(err)
	}
	disabled := []string{}
	commands := disconnecting(state, &disabled)

	printed, refusal, code := answer(commands, []string{"disconnect", "--resume", "binding-shop"}, realTempDir(t), "")

	if code != 0 {
		t.Fatalf("the resume answered %q, %q, %d", printed, refusal, code)
	}
	for _, shown := range []string{"/opt/journal/bin/journal disconnect --resume binding-shop", "Disconnected " + root,
		"Server revocation was not checked"} {
		if !strings.Contains(printed, shown) {
			t.Fatalf("the resume printed %q, without %q", printed, shown)
		}
	}
	if len(disabled) != 0 {
		t.Fatalf("the service was disabled again: %v", disabled)
	}
	if _, err := connection.Binding(); err == nil {
		t.Fatal("the binding's private state is still there")
	}
	if _, err := host.DisconnectOf(state, "binding-shop"); !errors.Is(err, host.ErrNoDisconnect) {
		t.Fatalf("the cleanup record was not finished: %v", err)
	}
}

func TestADisconnectKeepsACleanWorktreeAheadOfMainAndADirtyOneEachWithItsReason(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	gitIn(t, root, "init", "-b", "main")
	if err := os.WriteFile(filepath.Join(root, "README"), []byte("shop\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	gitIn(t, root, "add", "README")
	gitIn(t, root, "commit", "-m", "first")
	base := gitIn(t, root, "rev-parse", "HEAD")
	worktrees := host.NativeWorktrees{Root: root, Git: "git"}
	prepared := map[string]host.WorktreeReceipt{}
	for _, child := range []string{"ahead", "dirty", "merged"} {
		receipt, err := worktrees.Prepare(context.Background(), host.WorktreeClaim{ClaimID: "claim-" + child, Generation: 1,
			ChildID: child, Writes: true, BaseOID: base})
		if err != nil {
			t.Fatal(err)
		}
		prepared[child] = receipt
	}
	gitIn(t, prepared["ahead"].Path, "commit", "--allow-empty", "-m", "ahead of main")
	if err := os.WriteFile(filepath.Join(prepared["dirty"].Path, "draft.txt"), []byte("work\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	disabled := []string{}

	printed, refusal, code := answer(disconnecting(state, &disabled), []string{"disconnect", "--yes"}, root, "")

	if code != 0 {
		t.Fatalf("the disconnect answered %q, %q, %d", printed, refusal, code)
	}
	for _, shown := range []string{
		"Kept work in progress at " + prepared["ahead"].Path + ": unpublished commits",
		"Kept work in progress at " + prepared["dirty"].Path + ": the checkout has uncommitted work",
	} {
		if !strings.Contains(printed, shown) {
			t.Fatalf("the disconnect printed %q, without %q", printed, shown)
		}
	}
	if _, err := os.Stat(prepared["merged"].Path); !os.IsNotExist(err) {
		t.Fatalf("the clean worktree reachable from main was not retired: %v", err)
	}
	if _, err := os.Stat(filepath.Join(prepared["dirty"].Path, "draft.txt")); err != nil {
		t.Fatalf("the dirty worktree lost its work: %v", err)
	}
	if _, err := os.Stat(filepath.Join(root, ".journal", "receipts")); err != nil {
		t.Fatalf("the receipts that prove whose the kept worktrees are went: %v", err)
	}
}

func TestADisconnectWithAnUnacknowledgedReceiptAsksBeforeDiscardingIt(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	relay := host.RelayFolder(state, "binding-shop")
	if err := os.MkdirAll(relay, 0o700); err != nil {
		t.Fatal(err)
	}
	reports := &host.StartReports{Folder: relay}
	if err := reports.Queue(host.StartReport{StartKey: "start-1", Kind: host.NotifyStopped}); err != nil {
		t.Fatal(err)
	}
	disabled := []string{}
	commands := disconnecting(state, &disabled)

	printed, refusal, code := answer(commands, []string{"disconnect", "--yes"}, root, "")

	if code == 0 || !strings.Contains(refusal, "1 of them could not be sent") || !strings.Contains(refusal, "--discard-receipts") {
		t.Fatalf("the disconnect went on past the receipt: %q, %q, %d", printed, refusal, code)
	}
	if count, _ := reports.Count(); count != 1 {
		t.Fatalf("the receipt was not kept: %d", count)
	}
	if _, err := (host.ConnectionState{Folder: state, CanonicalRoot: root}).Binding(); err != nil {
		t.Fatalf("the binding went before the receipt was settled: %v", err)
	}
	if _, refusal, code := answer(commands, []string{"status"}, root, ""); code == 0 ||
		!strings.Contains(refusal, "being disconnected") {
		t.Fatalf("the fenced folder still ran a verb: %q, %d", refusal, code)
	}

	printed, refusal, code = answer(commands, []string{"disconnect", "--resume", "binding-shop", "--discard-receipts"}, root, "")

	if code != 0 || !strings.Contains(printed, "Discarded 1 start reports") || !strings.Contains(printed, "Disconnected "+root) {
		t.Fatalf("the discarding resume answered %q, %q, %d", printed, refusal, code)
	}
}
