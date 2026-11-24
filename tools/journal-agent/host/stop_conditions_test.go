package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"testing"
	"time"

	"journal-agent/client"
)

type recordedFence struct {
	closed  bool
	running []string
}

func (fence *recordedFence) CloseAdmission()            { fence.closed = true }
func (fence *recordedFence) RunningProcesses() []string { return fence.running }

func shellCondition(key string, seconds int, script string) client.StopConditionRun {
	return client.StopConditionRun{
		Key:            key,
		DefinitionHash: strings.Repeat("a", 64),
		Executable:     "/bin/sh",
		Arguments:      []string{"-c", script},
		Directory:      "workspace",
		TimeoutSeconds: seconds,
		OutputBytes:    65536,
	}
}

func attemptOf(seconds int, conditions ...client.StopConditionRun) client.PendingStopAttempt {
	return client.PendingStopAttempt{ID: "attempt-1", AttemptSeconds: seconds, Conditions: conditions}
}

func runAttempt(t *testing.T, attempt client.PendingStopAttempt) []client.StopConditionResult {
	t.Helper()
	results, err := StopConditionRunner{Workspace: t.TempDir()}.Run(context.Background(), attempt, &recordedFence{})
	if err != nil {
		t.Fatalf("run: %v", err)
	}
	return results
}

func TestADirtyWriterFailsWithASummaryAndACleanOnePasses(t *testing.T) {
	results := runAttempt(t, attemptOf(10,
		shellCondition("dirty", 5, "echo 'NOTE is not committed'; exit 3"),
		client.StopConditionRun{Key: "clean", Executable: "/usr/bin/true", TimeoutSeconds: 5, OutputBytes: 64},
	))

	if results[0].Status != StopFailed || *results[0].ExitCode != 3 ||
		!strings.Contains(results[0].Summary, "NOTE is not committed") {
		t.Fatalf("dirty: %+v", results[0])
	}
	if results[1].Status != StopPassed || *results[1].ExitCode != 0 {
		t.Fatalf("clean: %+v", results[1])
	}
}

func TestAConditionPastItsDeadlineIsKilledWithItsChildrenAndTimesOut(t *testing.T) {
	workspace := t.TempDir()
	pidFile := filepath.Join(workspace, "child.pid")
	condition := shellCondition("sleeper", 1, "sleep 30 & echo $! > child.pid; wait")
	started := time.Now()

	results, err := StopConditionRunner{Workspace: workspace}.Run(
		context.Background(),
		attemptOf(10, condition),
		&recordedFence{},
	)

	if err != nil || results[0].Status != StopTimedOut {
		t.Fatalf("%v: %+v", err, results)
	}
	if elapsed := time.Since(started); elapsed > 5*time.Second {
		t.Fatalf("the stop took %s", elapsed)
	}
	text, _ := os.ReadFile(pidFile)
	var child int
	for _, digit := range strings.TrimSpace(string(text)) {
		child = child*10 + int(digit-'0')
	}
	if child <= 0 || syscall.Kill(child, 0) == nil {
		t.Fatalf("the background child %d still runs", child)
	}
}

func TestAStillRunningBackgroundWriterRefusesTheStopBeforeAnyCheck(t *testing.T) {
	fence := &recordedFence{running: []string{"process:writer-7"}}

	_, err := StopConditionRunner{Workspace: t.TempDir()}.Run(
		context.Background(),
		attemptOf(10, shellCondition("clean", 5, "touch ran")),
		fence,
	)

	if !errors.Is(err, ErrModelProcessRunning) || !strings.Contains(err.Error(), "process:writer-7") || !fence.closed {
		t.Fatalf("%v, closed %v", err, fence.closed)
	}
}

func TestAMissingExecutableFailsToStartAndTheBudgetLeavesTheRestNotRun(t *testing.T) {
	results := runAttempt(t, attemptOf(1,
		client.StopConditionRun{Key: "missing", Executable: "/no/such/check", TimeoutSeconds: 1, OutputBytes: 64},
		shellCondition("slow", 1, "sleep 2"),
		shellCondition("late", 1, "true"),
	))

	if results[0].Status != StopFailedToStart || results[1].Status != StopTimedOut || results[2].Status != StopNotRun {
		t.Fatalf("%+v", results)
	}
}

func TestOutputPastTheLimitIsCutWithAMarker(t *testing.T) {
	condition := shellCondition("loud", 5, "yes x | head -c 5000")
	condition.OutputBytes = 100

	result := runAttempt(t, attemptOf(10, condition))[0]

	if !result.IsTruncated || !strings.HasSuffix(*result.Output, TruncatedMarker) ||
		len(*result.Output) != 100+len(TruncatedMarker) {
		t.Fatalf("%+v", result)
	}
}

func TestAConditionSeesNoVariableOfTheHost(t *testing.T) {
	t.Setenv("JOURNAL_HOST_SECRET", "secret")

	result := runAttempt(t, attemptOf(10, shellCondition("env", 5, "env")))[0]

	if strings.Contains(*result.Output, "JOURNAL_HOST_SECRET") || !strings.Contains(*result.Output, "PATH=") {
		t.Fatalf("environment: %s", *result.Output)
	}
}
