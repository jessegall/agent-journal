package hostapi

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"
	"syscall"
	"time"

	"journal-agent/host"
)

// The statuses a fenced run ends in, as the journal's stop condition results name them.
const (
	fencedPassed        = "passed"
	fencedFailed        = "failed"
	fencedTimedOut      = "timed_out"
	fencedFailedToStart = "failed_to_start"
	fencedCancelled     = "cancelled"
	fencedUnknown       = "unknown"
	fencedNotRun        = "not_run"
)

// fencedSummaryBytes bounds a result's summary, as the journal's stop condition results keep it.
const fencedSummaryBytes = 2048

// fencedTruncatedMarker ends an output that was cut at its run's output limit.
const fencedTruncatedMarker = "\n[output truncated]\n"

// fencedStages bound the end of a run past its deadline: the group has two seconds after the graceful signal, then
// the force signal and two more seconds to prove it empty.
var fencedStages = host.StopStages{Grace: 2 * time.Second, Force: 2 * time.Second, Poll: 20 * time.Millisecond}

// fencedEnvironment carries no variable of the host's own: no credential, token or account folder reaches a run.
var fencedEnvironment = []string{"PATH=/usr/local/bin:/usr/bin:/bin", "LANG=C.UTF-8", "TZ=UTC"}

// RunFenced closes admission for the fence's processes, refuses while one of them other than those waiting still runs,
// then runs each program in turn within its deadline and the budget; the fence opens again when the runs end, or at
// the budget's end if the host never got there.
func (table *ProcessTable) RunFenced(ctx context.Context, instruction Instruction, plan FencedPlan) (FencedResults, error) {
	if plan.Fence == "" {
		return FencedResults{}, RefusalError{Refusal: Unsafe, Reason: "run_fenced names no fence"}
	}
	budget := time.Duration(plan.BudgetMs) * time.Millisecond
	table.closeFence(plan.Fence, time.Now().Add(budget+fencedStages.Grace+fencedStages.Force))
	defer table.openFence(plan.Fence)
	if running := table.liveOfFence(plan.Fence, plan.Waiting); len(running) > 0 {
		return FencedResults{}, RefusalError{Refusal: Fenced, Reason: "a process of the fence still runs: " + strings.Join(running, ", ")}
	}
	budgetEnds := time.Now().Add(budget)
	results := make([]FencedResult, 0, len(plan.Runs))
	for _, run := range plan.Runs {
		remaining := time.Until(budgetEnds)
		if ctx.Err() != nil || remaining <= 0 {
			results = append(results, FencedResult{Status: fencedNotRun, StartedAt: fencedNow()})
			continue
		}
		results = append(results, runOne(ctx, run, remaining))
	}

	return FencedResults{Results: results}, nil
}

// admit refuses a process whose fence a run_fenced instruction holds closed.
func (table *ProcessTable) admit(plan OpenPlan) error {
	if plan.Fence == "" {
		return nil
	}
	table.mutex.Lock()
	defer table.mutex.Unlock()
	if closedUntil, closed := table.fences[plan.Fence]; closed && time.Now().Before(closedUntil) {
		return RefusalError{Refusal: Fenced, Reason: "the fence of the process is closed while its conditions run"}
	}

	return nil
}

func (table *ProcessTable) closeFence(fence string, until time.Time) {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	table.fences[fence] = until
}

func (table *ProcessTable) openFence(fence string) {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	delete(table.fences, fence)
}

// liveOfFence are the live processes of the fence, apart from those that wait on the run.
func (table *ProcessTable) liveOfFence(fence string, waiting []string) []string {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	live := []string{}
	for id, held := range table.processes {
		if held.plan.Fence != fence || slices.Contains(waiting, id) {
			continue
		}
		select {
		case <-held.exited:
		default:
			live = append(live, id)
		}
	}
	slices.Sort(live)

	return live
}

func runOne(ctx context.Context, run FencedRun, remaining time.Duration) FencedResult {
	deadline := min(time.Duration(run.DeadlineMs)*time.Millisecond, remaining)
	output := &boundedOutput{limit: run.OutputLimit}
	result := FencedResult{StartedAt: fencedNow()}
	if len(run.Argv) == 0 || !filepath.IsAbs(run.Argv[0]) {
		return ended(result, fencedFailedToStart, "the executable is not an absolute path", output)
	}
	if !filepath.IsAbs(run.Folder) {
		return ended(result, fencedFailedToStart, "the folder is not an absolute path", output)
	}
	command := exec.Command(run.Argv[0], run.Argv[1:]...)
	command.Dir = run.Folder
	command.Env = append(slices.Clone(fencedEnvironment), "HOME="+run.Folder)
	command.Stdout = output
	command.Stderr = output
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := command.Start(); err != nil {
		return ended(result, fencedFailedToStart, err.Error(), output)
	}
	group := host.OwnedGroupOf(command.Process.Pid)
	exited := make(chan error, 1)
	go func() { exited <- command.Wait() }()
	timer := time.NewTimer(deadline)
	defer timer.Stop()
	select {
	case err := <-exited:
		return exitedWith(result, err, output)
	case <-timer.C:
		group.Stop(fencedStages)
		<-exited
		return ended(result, fencedTimedOut, fmt.Sprintf("ran past its %s deadline", deadline), output)
	case <-ctx.Done():
		group.Stop(fencedStages)
		<-exited
		return ended(result, fencedCancelled, "the run was cancelled", output)
	}
}

// exitedWith maps how the program ended: only exit zero passes, any other exit or a signal fails, and an end the host
// cannot read is unknown.
func exitedWith(result FencedResult, err error, output *boundedOutput) FencedResult {
	if err == nil {
		code := 0
		result.ExitCode = &code
		return ended(result, fencedPassed, "", output)
	}
	var exit *exec.ExitError
	if !errors.As(err, &exit) {
		return ended(result, fencedUnknown, err.Error(), output)
	}
	if status, ok := exit.Sys().(syscall.WaitStatus); ok && status.Signaled() {
		signal := status.Signal().String()
		result.Signal = &signal
		return ended(result, fencedFailed, "ended by "+signal, output)
	}
	code := exit.ExitCode()
	result.ExitCode = &code

	return ended(result, fencedFailed, fmt.Sprintf("exited with %d", code), output)
}

func ended(result FencedResult, status string, reason string, output *boundedOutput) FencedResult {
	endedAt := fencedNow()
	text := output.String()
	result.Status = status
	result.EndedAt = &endedAt
	result.Output = &text
	result.Truncated = output.truncated
	result.Summary = summaryOf(reason, output.kept.String())

	return result
}

func fencedNow() string {
	return time.Now().UTC().Format(time.RFC3339Nano)
}

// summaryOf is the reason followed by the end of the output, within fencedSummaryBytes.
func summaryOf(reason, output string) string {
	text := strings.TrimSpace(strings.Join([]string{reason, strings.TrimSpace(output)}, "\n"))
	if len(text) <= fencedSummaryBytes {
		return text
	}

	return text[len(text)-fencedSummaryBytes:]
}

// boundedOutput keeps a run's output up to its limit and marks the rest as cut; writing past the limit never blocks
// the program, so output cannot extend a deadline.
type boundedOutput struct {
	limit     int
	kept      bytes.Buffer
	truncated bool
}

func (output *boundedOutput) Write(content []byte) (int, error) {
	room := output.limit - output.kept.Len()
	if room >= len(content) {
		output.kept.Write(content)
		return len(content), nil
	}
	if room > 0 {
		output.kept.Write(content[:room])
	}
	output.truncated = true

	return len(content), nil
}

func (output *boundedOutput) String() string {
	if output.truncated {
		return output.kept.String() + fencedTruncatedMarker
	}

	return output.kept.String()
}
