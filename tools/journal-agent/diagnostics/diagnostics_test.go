package diagnostics

import (
	"os"
	"strings"
	"testing"
	"time"

	"journal-agent/host"
)

func TestTheBundleOfAFailedStartNamesItsIdsAndSideAndHoldsNoSecret(t *testing.T) {
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"}
	binding := host.Binding{BindingID: "binding-1", ProjectID: "project-1", MainAgentID: "agent-1"}
	binding.HostID = "host-1"
	binding.Secret = "host-credential-0123456789"
	if err := state.SaveBinding(binding); err != nil {
		t.Fatal(err)
	}
	signIn := host.TerminalSignIn{Selector: strings.Repeat("a", 32), Reference: "TS-ABCDEFGH", Generation: 1,
		Grant: "device-grant-0123456789"}
	if err := state.SaveSignIn(signIn); err != nil {
		t.Fatal(err)
	}
	log := Log{State: state}
	if err := log.Record(Event{At: time.Now(), Step: "claim", ClaimID: "claim-7"}); err != nil {
		t.Fatal(err)
	}
	failure := Event{At: time.Now(), Step: "start", ClaimID: "claim-7", RuntimeID: "runtime-9", Side: Server,
		Failure: "refused with Bearer host-credential-0123456789 and device-grant-0123456789"}
	if err := log.Record(failure); err != nil {
		t.Fatal(err)
	}

	path, err := Write(binding, state, Install{Release: "1.4.0", Protocol: 2}, t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}

	bundle := string(content)
	for _, want := range []string{"claim-7", "runtime-9", `"side": "server"`, "binding-1", "host-1", "1.4.0"} {
		if !strings.Contains(bundle, want) {
			t.Fatalf("the bundle lacks %q:\n%s", want, bundle)
		}
	}
	for _, secret := range []string{"host-credential-0123456789", "device-grant-0123456789"} {
		if strings.Contains(bundle, secret) {
			t.Fatalf("the bundle holds the secret %q", secret)
		}
	}
}
