package hostapi

import (
	"context"
	"encoding/json"
	"errors"
	"testing"
	"time"

	"journal-agent/dockermock"
)

func fencedInstruction(t *testing.T, plan FencedPlan) Instruction {
	t.Helper()
	payload, err := json.Marshal(plan)
	if err != nil {
		t.Fatal(err)
	}
	return Instruction{ID: "fenced", Type: "run_fenced", Payload: string(payload)}
}

func openFencedProcess(t *testing.T, table *ProcessTable, processID, fence string) error {
	t.Helper()
	plan, err := json.Marshal(OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, Type: "pipe", Restart: "never", Argv: []string{"sleep", "30"}, Folder: t.TempDir(), Fence: fence})
	if err != nil {
		t.Fatal(err)
	}
	_, err = carry(testInstructions{ProcessTable: table}, "open_process")(context.Background(), Instruction{ID: "open-" + processID, Type: "open_process", ProcessID: processID, Payload: string(plan)})
	return err
}

func resultsOf(t *testing.T, facts map[string]any) []FencedResult {
	t.Helper()
	encoded, err := json.Marshal(facts)
	if err != nil {
		t.Fatal(err)
	}
	var reply FencedResults
	if err := json.Unmarshal(encoded, &reply); err != nil || len(reply.Results) == 0 {
		t.Fatalf("the answer holds no results: %v", facts)
	}
	return reply.Results
}

func TestEachFencedRunEndsWithItsStatusAndOutputInOrder(t *testing.T) {
	table, _ := mockTable(t, dockermock.Start(t, mockImage))
	folder := t.TempDir()
	runs := []FencedRun{
		{Argv: []string{"/bin/sh", "-c", "echo clean"}, Folder: folder, DeadlineMs: 5000, OutputLimit: 1024},
		{Argv: []string{"/bin/sh", "-c", "echo dirty; exit 2"}, Folder: folder, DeadlineMs: 5000, OutputLimit: 1024},
		{Argv: []string{"/bin/sh", "-c", "sleep 5"}, Folder: folder, DeadlineMs: 100, OutputLimit: 1024},
		{Argv: []string{"sh", "-c", "true"}, Folder: folder, DeadlineMs: 5000, OutputLimit: 1024},
		{Argv: []string{"/bin/sh", "-c", "printf 0123456789"}, Folder: folder, DeadlineMs: 5000, OutputLimit: 4},
	}

	facts, err := carry(testInstructions{ProcessTable: table}, "run_fenced")(context.Background(), fencedInstruction(t, FencedPlan{Fence: "s1", BudgetMs: 30000, Runs: runs}))
	if err != nil {
		t.Fatal(err)
	}

	results := resultsOf(t, facts)
	statuses := []string{}
	for _, result := range results {
		statuses = append(statuses, result.Status)
	}
	want := []string{fencedPassed, fencedFailed, fencedTimedOut, fencedFailedToStart, fencedPassed}
	if len(statuses) != len(want) {
		t.Fatalf("statuses %v, want %v", statuses, want)
	}
	for index := range want {
		if statuses[index] != want[index] {
			t.Fatalf("statuses %v, want %v", statuses, want)
		}
	}
	if *results[0].Output != "clean\n" || *results[1].ExitCode != 2 || !results[4].Truncated || *results[4].Output != "0123"+fencedTruncatedMarker {
		t.Fatalf("results do not hold what each run printed: %+v", results)
	}
}

func TestARunPastTheBudgetIsNotRun(t *testing.T) {
	table, _ := mockTable(t, dockermock.Start(t, mockImage))
	folder := t.TempDir()
	runs := []FencedRun{
		{Argv: []string{"/bin/sh", "-c", "sleep 5"}, Folder: folder, DeadlineMs: 5000, OutputLimit: 1024},
		{Argv: []string{"/bin/sh", "-c", "true"}, Folder: folder, DeadlineMs: 5000, OutputLimit: 1024},
	}

	facts, err := carry(testInstructions{ProcessTable: table}, "run_fenced")(context.Background(), fencedInstruction(t, FencedPlan{Fence: "s1", BudgetMs: 200, Runs: runs}))
	if err != nil {
		t.Fatal(err)
	}

	results := resultsOf(t, facts)
	if results[0].Status != fencedTimedOut || results[1].Status != fencedNotRun {
		t.Fatalf("the budget did not bound the runs: %+v", results)
	}
}

func TestALiveProcessOfTheFenceRefusesTheRunButOneWaitingOnItDoesNot(t *testing.T) {
	table, _ := mockTable(t, dockermock.Start(t, mockImage))
	if err := openFencedProcess(t, table, "agent", "s1"); err != nil {
		t.Fatal(err)
	}
	if err := openFencedProcess(t, table, "other-session", "s2"); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		_, _ = carry(testInstructions{ProcessTable: table}, "stop")(context.Background(), stopInstruction(t, "agent"))
	})
	t.Cleanup(func() {
		_, _ = carry(testInstructions{ProcessTable: table}, "stop")(context.Background(), stopInstruction(t, "other-session"))
	})
	run := []FencedRun{{Argv: []string{"/bin/sh", "-c", "true"}, Folder: t.TempDir(), DeadlineMs: 5000, OutputLimit: 64}}

	_, refused := carry(testInstructions{ProcessTable: table}, "run_fenced")(context.Background(), fencedInstruction(t, FencedPlan{Fence: "s1", BudgetMs: 5000, Runs: run}))
	_, waited := carry(testInstructions{ProcessTable: table}, "run_fenced")(context.Background(), fencedInstruction(t, FencedPlan{Fence: "s1", Waiting: []string{"agent"}, BudgetMs: 5000, Runs: run}))

	var refusal RefusalError
	if !errors.As(refused, &refusal) || refusal.Refusal != Fenced {
		t.Fatalf("a live process of the fence did not refuse the run: %v", refused)
	}
	if waited != nil {
		t.Fatalf("the process waiting on the run refused it: %v", waited)
	}
}

func TestAProcessOfAClosedFenceIsRefusedUntilItsDeadlinePasses(t *testing.T) {
	table, _ := mockTable(t, dockermock.Start(t, mockImage))
	table.closeFence("s1", time.Now().Add(time.Hour))

	refused := openFencedProcess(t, table, "during", "s1")
	other := openFencedProcess(t, table, "elsewhere", "s2")
	table.closeFence("s1", time.Now().Add(-time.Second))
	afterDeadline := openFencedProcess(t, table, "after", "s1")
	for _, id := range []string{"elsewhere", "after"} {
		t.Cleanup(func() {
			_, _ = carry(testInstructions{ProcessTable: table}, "stop")(context.Background(), stopInstruction(t, id))
		})
	}

	var refusal RefusalError
	if !errors.As(refused, &refusal) || refusal.Refusal != Fenced {
		t.Fatalf("a process of the closed fence was admitted: %v", refused)
	}
	if other != nil || afterDeadline != nil {
		t.Fatalf("a process of another fence or past the deadline was refused: %v, %v", other, afterDeadline)
	}
}

func TestTheFenceOpensAgainOnceTheRunsEnd(t *testing.T) {
	table, _ := mockTable(t, dockermock.Start(t, mockImage))
	run := []FencedRun{{Argv: []string{"/bin/sh", "-c", "true"}, Folder: t.TempDir(), DeadlineMs: 5000, OutputLimit: 64}}

	if _, err := carry(testInstructions{ProcessTable: table}, "run_fenced")(context.Background(), fencedInstruction(t, FencedPlan{Fence: "s1", BudgetMs: 5000, Runs: run})); err != nil {
		t.Fatal(err)
	}

	if err := openFencedProcess(t, table, "next", "s1"); err != nil {
		t.Fatalf("the fence stayed closed after its runs: %v", err)
	}
	t.Cleanup(func() {
		_, _ = carry(testInstructions{ProcessTable: table}, "stop")(context.Background(), stopInstruction(t, "next"))
	})
}

func stopInstruction(t *testing.T, processID string) Instruction {
	t.Helper()
	return Instruction{ID: "stop-" + processID, Type: "stop", ProcessID: processID, Payload: `{"grace_ms":200,"force_ms":200}`}
}
