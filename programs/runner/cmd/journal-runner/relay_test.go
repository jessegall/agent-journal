package main

import (
	"context"
	"net/http"
	"testing"
	"time"

	"journal-runner/client"
	"journal-runner/device"
	"journal-runner/host"
	"journal-runner/hostapi"
	"journal-runner/hostapitest"
)

func TestAConnectedRelayPlaysItsRecordedJournal(t *testing.T) {
	for _, name := range []string{"first-claim", "answer-order", "refused-read"} {
		t.Run(name, func(t *testing.T) {
			scenario, inventory := hostapitest.Connected(t, name)
			wire := hostapitest.Replay(t, scenario)
			root := t.TempDir()
			state := device.ConnectionState{Folder: t.TempDir(), CanonicalRoot: root}
			binding := device.Binding{
				Enrollment:    device.Enrollment{JournalURL: wire.URL, HostID: "test-host", Secret: hostapitest.EnrollmentSecret},
				BindingID:     "test-binding",
				CanonicalRoot: root,
			}
			if err := state.SaveBinding(binding); err != nil {
				t.Fatal(err)
			}

			transport := &http.Client{}
			relay := bindingRelay{
				state: state, binding: binding, installation: host.Installation{Folder: t.TempDir()},
				release: inventory.Release, transport: transport, idle: &hostapi.IdleWindow{},
			}
			ctx, stop := context.WithTimeout(t.Context(), 10*time.Second)
			defer stop()
			journal := client.ForRemoteProject(binding.Enrollment, transport)
			if _, err := relay.serveInstructions(ctx, journal, stop); err != nil {
				t.Fatal(err)
			}

			select {
			case <-wire.FirstClaim:
			case <-ctx.Done():
				t.Fatal("the relay did not claim instructions")
			}
			ticker := time.NewTicker(10 * time.Millisecond)
			defer ticker.Stop()
			for !wire.Calls.IsPlayedWhole() {
				select {
				case <-ctx.Done():
					wire.Calls.AssertPlayedWhole(t)
					return
				case <-ticker.C:
				}
			}
		})
	}
}
