package hostapi

import (
	"context"
	"errors"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

var (
	testSecret = []byte("the-instruction-secret")
	testNow    = time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)
)

func signedInstruction(id, processID string, sequence uint64) Instruction {
	instruction := Instruction{
		ID:        id,
		Sequence:  sequence,
		Type:      "write_keys",
		ProcessID: processID,
		Payload:   `{"bytes":"aGk=","as_user":true}`,
		ExpiresAt: testNow.Add(5 * time.Second),
	}
	instruction.Signature = Sign(testSecret, instruction)
	return instruction
}

func testVerifier() Verifier {
	return Verifier{Secret: testSecret, Now: func() time.Time { return testNow }}
}

func TestTheJournalsSignatureOfAFixedInstructionIsAccepted(t *testing.T) {
	vectors, _ := loadConformance(t)
	fixed := vectors.Instructions[0].Instruction
	if string(testSecret) != vectors.Secret || Sign(testSecret, fixed) != fixed.Signature {
		t.Fatalf("the committed instruction signs to %s, not the one the journal makes", Sign(testSecret, fixed))
	}
	if err := testVerifier().Verify(signedInstruction("a", "p", 1)); err != nil {
		t.Fatalf("a signed instruction in time is refused: %v", err)
	}
}

func TestAnUnsignedAlteredOrExpiredInstructionIsRefused(t *testing.T) {
	unsigned := signedInstruction("a", "p", 1)
	unsigned.Signature = ""
	altered := signedInstruction("a", "p", 1)
	altered.Payload = `{"bytes":"cm0gLXJm","as_user":true}`
	expired := signedInstruction("a", "p", 1)
	expired.ExpiresAt = testNow
	expired.Signature = Sign(testSecret, expired)

	for name, test := range map[string]struct {
		instruction Instruction
		refusal     Refusal
	}{
		"unsigned": {unsigned, Unsafe},
		"altered":  {altered, Unsafe},
		"expired":  {expired, Expired},
	} {
		var refusal RefusalError
		if err := testVerifier().Verify(test.instruction); !errors.As(err, &refusal) || refusal.Refusal != test.refusal {
			t.Errorf("the %s instruction is not refused as %s: %v", name, test.refusal, err)
		}
	}
}

func TestAnInstructionHandedOutAgainIsAnsweredFromTheRecordAcrossARestart(t *testing.T) {
	state := t.TempDir()
	var runs atomic.Int32
	executors := map[string]Executor{"write_keys": func(context.Context, Instruction) (map[string]any, error) {
		runs.Add(1)
		return map[string]any{"written": 3}, nil
	}}
	var answers []Answer
	var mutex sync.Mutex
	report := func(_ Instruction, answer Answer) {
		mutex.Lock()
		defer mutex.Unlock()
		answers = append(answers, answer)
	}

	first, err := OpenAnsweredRecord(state)
	if err != nil {
		t.Fatal(err)
	}
	dispatcher := NewDispatcher(testVerifier(), first, executors, report)
	dispatcher.Submit(context.Background(), signedInstruction("a", "p", 1))
	dispatcher.Wait()

	restarted, err := OpenAnsweredRecord(state)
	if err != nil {
		t.Fatal(err)
	}
	NewDispatcher(testVerifier(), restarted, executors, report).Submit(context.Background(), signedInstruction("a", "p", 1))

	if runs.Load() != 1 {
		t.Fatalf("the instruction ran %d times", runs.Load())
	}
	if len(answers) != 2 || answers[1].Status != Done || answers[1].Facts["written"] != float64(3) {
		t.Fatalf("the repeated instruction was not answered from the record: %+v", answers)
	}
}

func TestAnInstructionTheHostStoppedInIsRefusedUnlessItCanRunTwice(t *testing.T) {
	state := t.TempDir()
	var runs atomic.Int32
	run := func(context.Context, Instruction) (map[string]any, error) {
		runs.Add(1)
		return nil, nil
	}
	executors := map[string]Executor{"write_keys": run, "snapshot": run}
	crashed, err := OpenAnsweredRecord(state)
	if err != nil {
		t.Fatal(err)
	}
	keys := signedInstruction("keys", "p", 1)
	snapshot := signedInstruction("shot", "p", 2)
	snapshot.Type = "snapshot"
	snapshot.Signature = Sign(testSecret, snapshot)
	for _, instruction := range []Instruction{keys, snapshot} {
		if err := crashed.Start(instruction, testVerifier().Now()); err != nil {
			t.Fatal(err)
		}
	}

	restarted, err := OpenAnsweredRecord(state)
	if err != nil {
		t.Fatal(err)
	}
	answers := map[string]Answer{}
	var mutex sync.Mutex
	dispatcher := NewDispatcher(testVerifier(), restarted, executors, func(_ Instruction, answer Answer) {
		mutex.Lock()
		defer mutex.Unlock()
		answers[answer.InstructionID] = answer
	})
	dispatcher.Submit(context.Background(), keys)
	dispatcher.Submit(context.Background(), snapshot)
	dispatcher.Wait()

	if answers["keys"].Refusal != HostRestarted || answers["shot"].Status != Done || runs.Load() != 1 {
		t.Fatalf("an interrupted write ran again or a snapshot did not: %+v, %d runs", answers, runs.Load())
	}
}

func TestOneProcesssInstructionsRunInSequenceAndTwoProcessesAtOnce(t *testing.T) {
	release := make(chan struct{})
	started := make(chan string, 8)
	var instruction []string
	var mutex sync.Mutex
	executors := map[string]Executor{"write_keys": func(_ context.Context, current Instruction) (map[string]any, error) {
		started <- current.ID
		if current.ID == "first-of-p" {
			<-release
		}
		mutex.Lock()
		instruction = append(instruction, current.ID)
		mutex.Unlock()
		return nil, nil
	}}
	record, err := OpenAnsweredRecord(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	dispatcher := NewDispatcher(testVerifier(), record, executors, func(Instruction, Answer) {})

	dispatcher.Submit(context.Background(), signedInstruction("first-of-p", "p", 1))
	dispatcher.Submit(context.Background(), signedInstruction("second-of-p", "p", 2))
	dispatcher.Submit(context.Background(), signedInstruction("first-of-q", "q", 1))

	seen := map[string]bool{<-started: true, <-started: true}
	if !seen["first-of-p"] || !seen["first-of-q"] {
		t.Fatalf("the two processes did not run at once: %v", seen)
	}
	close(release)
	dispatcher.Wait()

	if position(instruction, "first-of-p") > position(instruction, "second-of-p") {
		t.Fatalf("one process's instructions ran out of sequence: %v", instruction)
	}
}

func position(list []string, value string) int {
	for index, item := range list {
		if item == value {
			return index
		}
	}
	return -1
}

func TestOnlyTheHostsOwnPlaceholdersAreFilled(t *testing.T) {
	placeholders := Placeholders{
		Folders:   map[string]string{"workspace": "/state/folders/01j"},
		HostNames: map[string]string{"HOME": "/home/agent"},
	}

	filled, err := placeholders.Fill("{folder:workspace}/notes in {host:HOME}")
	if err != nil || filled != "/state/folders/01j/notes in /home/agent" {
		t.Fatalf("the host's own placeholders were not filled: %q, %v", filled, err)
	}
	for _, text := range []string{"{env:SECRET}", "{folder:elsewhere}", "{host:PATH}"} {
		if _, err := placeholders.Fill(text); err == nil {
			t.Errorf("the placeholder in %q was filled", text)
		}
	}
}
