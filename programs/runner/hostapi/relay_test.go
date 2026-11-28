package hostapi_test

import (
	"context"
	"encoding/base64"
	"errors"
	"testing"
	"time"

	"journal-runner/client"
	"journal-runner/host"
	"journal-runner/hostapi"
	"journal-runner/hostapitest"
	"journal-runner/recorded"
	"journal-runner/recording"
)

func TestAClaimedInstructionIsAnsweredByRoute(t *testing.T) {
	scenario, inventory := hostapitest.Connected(t, "answer-order")
	wire := hostapitest.Replay(t, scenario)
	journal := hostapi.Journal{
		Client: client.New(client.Enrollment{
			JournalURL: wire.URL, HostID: "test-host", Secret: hostapitest.EnrollmentSecret,
		}),
		Protocol: hostapi.RelayProtocolVersion,
	}
	ctx, stop := context.WithTimeout(t.Context(), 5*time.Second)
	defer stop()

	record, err := hostapi.OpenAnsweredRecord(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	clock := &hostapi.JournalClock{Host: time.Now}
	idle := &hostapi.IdleWindow{}
	reads := hostapi.ProjectReads{Reader: host.ProjectReader{Root: t.TempDir()}, Journal: journal}
	executors := map[string]hostapi.Executor{
		"read_project": func(ctx context.Context, instruction hostapi.Instruction) (map[string]any, error) {
			read, err := hostapi.DecodePayload[client.ProjectRead](instruction)
			if err != nil {
				return nil, err
			}
			_, err = reads.ReadProject(ctx, instruction, read)
			return nil, err
		},
	}
	dispatcher := hostapi.NewDispatcher(hostapi.Verifier{
		Secret: hostapi.InstructionSecretOf(hostapitest.EnrollmentSecret), Now: clock.Now,
	}, record, executors, func(instruction hostapi.Instruction, answer hostapi.Answer) {
		if err := journal.AnswerInstruction(ctx, instruction.ID, answer); err != nil {
			t.Error(err)
		}
		stop()
	})
	relay := hostapi.Relay{
		Journal: journal, Dispatcher: dispatcher, Record: record, Clock: clock, Idle: idle, RetryAfter: time.Millisecond,
	}

	// The CLI replay covers startup and its inventory. Start this layer with the same recorded inventory.
	if err := journal.NotifyInventory(ctx, inventory); err != nil {
		t.Fatal(err)
	}
	if err := relay.Claim(ctx); !errors.Is(err, context.Canceled) {
		t.Fatalf("claiming did not stop after the instruction answer: %v", err)
	}
	dispatcher.Wait()
	wire.Calls.AssertPlayedWhole(t)
	claim := recordedClaim(t, scenario)
	if id := claim.Instructions[0].ID; record.AnsweredThrough() != id {
		t.Fatalf("the answered record does not name %s: %s", id, record.AnsweredThrough())
	}
	now := time.Now()
	window := time.Duration(claim.IdleWindowSeconds) * time.Second
	if idle.HasPassedSince(now) || !idle.HasPassedSince(now.Add(-window-time.Second)) {
		t.Fatalf("the relay did not use the recorded idle window of %s", window)
	}
}

func TestAnInstructionsExpiryHoldsAgainstAHostClockMinutesOffBothWays(t *testing.T) {
	scenario, _ := hostapitest.Connected(t, "answer-order")
	instruction := recordedClaim(t, scenario).Instructions[0]
	secret := hostapi.InstructionSecretOf(hostapitest.EnrollmentSecret)
	instruction.Signature = hostapi.Sign(secret, instruction)
	for name, offset := range map[string]time.Duration{"fast": 5 * time.Minute, "slow": -5 * time.Minute} {
		t.Run(name, func(t *testing.T) {
			journalNow := instruction.ExpiresAt.Add(-time.Second)
			clock := &hostapi.JournalClock{Host: func() time.Time { return journalNow.Add(offset) }}
			clock.Observe(journalNow)
			verifier := hostapi.Verifier{Secret: secret, Now: clock.Now}

			if err := verifier.Verify(instruction); err != nil {
				t.Fatalf("the host rejects a live instruction: %v", err)
			}
			journalNow = journalNow.Add(2 * time.Second)
			if err := verifier.Verify(instruction); err == nil {
				t.Fatal("the host accepts the same instruction after expiry")
			}
		})
	}
}

func recordedClaim(t *testing.T, scenario recorded.Scenario) hostapi.ClaimedInstructions {
	t.Helper()
	calls, err := scenario.Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	for _, call := range calls {
		body, err := base64.StdEncoding.DecodeString(call.Answered.Body)
		if err != nil {
			t.Fatal(err)
		}
		instructions, _ := hostapitest.ClaimedOf(call, body)
		if len(instructions) > 0 {
			claim, err := hostapi.ReadWirePayload[hostapi.ClaimedInstructions](body)
			if err != nil {
				t.Fatal(err)
			}
			return claim
		}
	}
	t.Fatal("the connected recording contains no instruction")
	return hostapi.ClaimedInstructions{}
}
