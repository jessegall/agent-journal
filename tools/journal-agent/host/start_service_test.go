package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"testing"

	"journal-agent/client"
)

type startJournal struct {
	grants, claims int
	claimError     error
}

func (journal *startJournal) StartGrant(context.Context, string) (client.Grant, error) {
	journal.grants++
	return client.Grant{Token: "token", Runtime: client.RuntimeStart{SessionID: "session-1", ProgramBuild: "2.1.323"}},
		nil
}

func (journal *startJournal) OutputGrants(context.Context, string) ([]byte, error) {
	return []byte(`{"generation":1,"paths":[],"seal":"s"}`), nil
}

func (journal *startJournal) ClaimStart(_ context.Context, sessionID string) (client.ClaimedStart, error) {
	journal.claims++
	if journal.claimError != nil {
		return client.ClaimedStart{}, journal.claimError
	}
	return client.ClaimedStart{StartKey: "start-1", SessionID: sessionID, Directory: "/accounts/a",
		Recipe: client.AccountRecipe{ProgramVersion: "2.1.323", Arrangement: "direct"}}, nil
}

func preparation(t *testing.T, journal *startJournal, prerequisites error) StartPreparation {
	t.Helper()
	return StartPreparation{
		Journal:        journal,
		States:         StartStates{Folder: filepath.Join(t.TempDir(), "starts")},
		Prerequisites:  func(client.Grant, client.ClaimedStart) error { return prerequisites },
		RuntimesFolder: filepath.Join(t.TempDir(), "runtimes"),
	}
}

func TestAStartIsPreparedFromItsGrantAndItsClaimBothSaved(t *testing.T) {
	journal := &startJournal{}
	starts := preparation(t, journal, nil)

	prepared, err := starts.Prepare(context.Background(), "runtime-1")
	if err != nil {
		t.Fatal(err)
	}

	if prepared.Grant.Token != "token" || prepared.Claim.StartKey != "start-1" {
		t.Fatalf("prepared %+v", prepared)
	}
	record, found, err := starts.States.Load("runtime-1")
	if err != nil || !found || record.Stage != Prepared || record.Claim == nil {
		t.Fatalf("saved %+v (found %v, %v)", record, found, err)
	}
}

func TestARefusedClaimKeepsTheGrantAndAsksForNoNewOne(t *testing.T) {
	journal := &startJournal{claimError: errors.Join(client.ErrConflict, client.ErrRefused)}
	starts := preparation(t, journal, nil)

	if _, err := starts.Prepare(context.Background(), "runtime-1"); !errors.Is(err, client.ErrConflict) {
		t.Fatalf("got %v, want the conflict", err)
	}
	journal.claimError = nil
	if _, err := starts.Prepare(context.Background(), "runtime-1"); err != nil {
		t.Fatal(err)
	}

	if journal.grants != 1 || journal.claims != 2 {
		t.Fatalf("asked %d grants and %d claims, want 1 and 2", journal.grants, journal.claims)
	}
}

func TestALostClaimAnswerIsNeverClaimedAgain(t *testing.T) {
	journal := &startJournal{claimError: errors.Join(client.ErrUncertain, errors.New("connection reset"))}
	starts := preparation(t, journal, nil)

	_, first := starts.Prepare(context.Background(), "runtime-1")
	journal.claimError = nil
	_, second := starts.Prepare(context.Background(), "runtime-1")

	if !errors.Is(first, ErrClaimUncertain) || !errors.Is(second, ErrClaimUncertain) {
		t.Fatalf("got %v and %v, want ErrClaimUncertain both times", first, second)
	}
	if journal.claims != 1 {
		t.Fatalf("claimed %d times, want once", journal.claims)
	}
}

func TestAStartWhosePrerequisitesFailIsNotPreparedAndKeepsItsClaim(t *testing.T) {
	journal := &startJournal{}
	starts := preparation(t, journal, errors.New("no protected installation"))

	_, first := starts.Prepare(context.Background(), "runtime-1")
	_, second := starts.Prepare(context.Background(), "runtime-1")

	if first == nil || second == nil {
		t.Fatal("a start whose prerequisites fail was prepared")
	}
	if journal.grants != 1 || journal.claims != 1 {
		t.Fatalf("asked %d grants and %d claims, want one each", journal.grants, journal.claims)
	}
}

func TestAReleasedStartIsNeverPreparedAgain(t *testing.T) {
	journal := &startJournal{}
	starts := preparation(t, journal, nil)
	if err := starts.States.Save(StartRecord{RuntimeID: "runtime-1", Stage: ReleasePending}); err != nil {
		t.Fatal(err)
	}

	if _, err := starts.Prepare(context.Background(), "runtime-1"); !errors.Is(err, ErrAlreadyReleased) {
		t.Fatalf("got %v, want ErrAlreadyReleased", err)
	}
	if journal.grants != 0 {
		t.Fatal("a released start asked for a new grant")
	}
}

func TestEachStageRecoversItsOwnWay(t *testing.T) {
	recoveries := map[StartStage]Recovery{
		GrantHeld: ContinuePreparing, ClaimRequested: ReconcileClaim, ClaimHeld: ContinuePreparing,
		Prepared: ContinuePreparing, ReleasePending: ProveExecution, ExecutionKnown: ProveExecution,
		ExitKnown: ReportExit, ReportAcknowledged: Forget,
	}
	for stage, want := range recoveries {
		if got := (StartRecord{Stage: stage}).Recovery(); got != want {
			t.Fatalf("stage %s recovers as %s, want %s", stage, got, want)
		}
	}
}

func TestAStartRecordOthersCanReadIsRefused(t *testing.T) {
	states := StartStates{Folder: t.TempDir()}
	if err := states.Save(StartRecord{RuntimeID: "runtime-1", Stage: GrantHeld}); err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(filepath.Join(states.Folder, "runtime-1.json"), 0o644); err != nil {
		t.Fatal(err)
	}

	if _, _, err := states.Load("runtime-1"); !errors.Is(err, ErrStartRecordTooOpen) {
		t.Fatalf("got %v, want ErrStartRecordTooOpen", err)
	}
}
