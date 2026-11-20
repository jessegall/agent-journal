package host

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"journal-agent/client"
)

// The statuses a stop condition ends in, as App\Hooks\Enums\StopResultType names them.
const (
	StopPassed        = "passed"
	StopFailed        = "failed"
	StopTimedOut      = "timed_out"
	StopFailedToStart = "failed_to_start"
	StopCancelled     = "cancelled"
	StopUnknown       = "unknown"
	StopNotRun        = "not_run"
)

// StopSummaryBytes bounds a result's summary, as App\Hooks\Values\StopResultReport::SUMMARY_BYTES does.
const StopSummaryBytes = 2048

// TruncatedMarker ends an output that was cut at its condition's output limit.
const TruncatedMarker = "\n[output truncated]\n"

// stopConditionStages bound the end of a condition past its deadline: the group has two seconds after the graceful
// signal, then the force signal and two more seconds to prove it empty.
var stopConditionStages = StopStages{Grace: 2 * time.Second, Force: 2 * time.Second, Poll: 20 * time.Millisecond}

var (
	// ErrModelProcessRunning refuses to run the conditions while a process the model started still runs: a
	// background writer could change the workspace after the checks read it.
	ErrModelProcessRunning = errors.New("a model-controlled process is still running")
	// ErrStopUnverified means a condition outlived its deadline and its process group could not be proven gone: the
	// attempt stays unresolved and execution stays fenced.
	ErrStopUnverified = errors.New("a stop condition's process could not be proven ended")
)

// StopFence is how the runner closes new action admission for the session before it reads the workspace, and asks
// which model-controlled processes still run, each by a scoped reference.
type StopFence interface {
	CloseAdmission()
	RunningProcesses() []string
}

// StopConditionRunner runs one attempt's frozen conditions serially, in declaration order, as absolute executables
// with argv in a sanitized environment that carries no credentials, never a shell line.
type StopConditionRunner struct {
	Workspace string
	Now       func() time.Time
}

// Run closes the fence, refuses while a model process still runs, then runs each condition within its own deadline
// and the attempt's remaining time; the conditions past the budget, or after a cancellation, are not run.
func (runner StopConditionRunner) Run(
	ctx context.Context,
	attempt client.PendingStopAttempt,
	fence StopFence,
) ([]client.StopConditionResult, error) {
	fence.CloseAdmission()
	if running := fence.RunningProcesses(); len(running) > 0 {
		return nil, fmt.Errorf("%w: %s", ErrModelProcessRunning, strings.Join(running, ", "))
	}
	budgetEnds := runner.now().Add(time.Duration(attempt.AttemptSeconds) * time.Second)
	results := make([]client.StopConditionResult, 0, len(attempt.Conditions))
	var unverified error
	for _, condition := range attempt.Conditions {
		remaining := budgetEnds.Sub(runner.now())
		if ctx.Err() != nil || remaining <= 0 {
			results = append(results, runner.notRun(condition))
			continue
		}
		result, proven := runner.runOne(ctx, condition, remaining)
		if !proven {
			unverified = fmt.Errorf("%w: %s", ErrStopUnverified, condition.Key)
		}
		results = append(results, result)
	}
	return results, unverified
}

func (runner StopConditionRunner) runOne(
	ctx context.Context,
	condition client.StopConditionRun,
	remaining time.Duration,
) (client.StopConditionResult, bool) {
	deadline := min(time.Duration(condition.TimeoutSeconds)*time.Second, remaining)
	output := &boundedOutput{limit: condition.OutputBytes}
	command := exec.Command(condition.Executable, condition.Arguments...)
	command.Dir = runner.folderOf(condition)
	command.Env = runner.environment()
	command.Stdout = output
	command.Stderr = output
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	result := client.StopConditionResult{
		ConditionKey:   condition.Key,
		DefinitionHash: condition.DefinitionHash,
		StartedAt:      runner.timestamp(),
	}
	if !filepath.IsAbs(condition.Executable) {
		return runner.ended(result, StopFailedToStart, "the executable is not an absolute path", output), true
	}
	if err := command.Start(); err != nil {
		return runner.ended(result, StopFailedToStart, err.Error(), output), true
	}
	group := OwnedGroupOf(command.Process.Pid)
	exited := make(chan error, 1)
	go func() { exited <- command.Wait() }()
	timer := time.NewTimer(deadline)
	defer timer.Stop()
	select {
	case err := <-exited:
		return runner.exitedWith(result, err, output), true
	case <-timer.C:
		proven := group.Stop(stopConditionStages) == StopProven
		<-exited
		return runner.ended(result, StopTimedOut, fmt.Sprintf("ran past its %s deadline", deadline), output), proven
	case <-ctx.Done():
		proven := group.Stop(stopConditionStages) == StopProven
		<-exited
		return runner.ended(result, StopCancelled, "the attempt was cancelled", output), proven
	}
}

// exitedWith maps how the process ended: only exit zero passes, any other exit or a signal fails, and an end the
// host cannot read is unknown.
func (runner StopConditionRunner) exitedWith(
	result client.StopConditionResult,
	err error,
	output *boundedOutput,
) client.StopConditionResult {
	if err == nil {
		code := 0
		result.ExitCode = &code
		return runner.ended(result, StopPassed, "", output)
	}
	var exit *exec.ExitError
	if !errors.As(err, &exit) {
		return runner.ended(result, StopUnknown, err.Error(), output)
	}
	if status, ok := exit.Sys().(syscall.WaitStatus); ok && status.Signaled() {
		signal := status.Signal().String()
		result.Signal = &signal
		return runner.ended(result, StopFailed, "ended by "+signal, output)
	}
	code := exit.ExitCode()
	result.ExitCode = &code
	return runner.ended(result, StopFailed, fmt.Sprintf("exited with %d", code), output)
}

func (runner StopConditionRunner) ended(
	result client.StopConditionResult,
	status string,
	reason string,
	output *boundedOutput,
) client.StopConditionResult {
	ended := runner.timestamp()
	text := output.String()
	result.Status = status
	result.EndedAt = &ended
	result.Output = &text
	result.Truncated = output.truncated
	result.Summary = summaryOf(reason, output.kept.String())
	return result
}

func (runner StopConditionRunner) notRun(condition client.StopConditionRun) client.StopConditionResult {
	return client.StopConditionResult{
		ConditionKey:   condition.Key,
		DefinitionHash: condition.DefinitionHash,
		Status:         StopNotRun,
		StartedAt:      runner.timestamp(),
		Summary:        "not run: the attempt's time ran out or it was cancelled",
	}
}

// folderOf is the workspace for the condition's "workspace" folder, else a folder inside it.
func (runner StopConditionRunner) folderOf(condition client.StopConditionRun) string {
	if condition.Directory == "" || condition.Directory == "workspace" {
		return runner.Workspace
	}
	return filepath.Join(runner.Workspace, filepath.Clean("/"+condition.Directory))
}

// environment carries no variable of the host's own: no credential, token or account folder reaches a condition.
func (runner StopConditionRunner) environment() []string {
	return []string{"PATH=/usr/local/bin:/usr/bin:/bin", "HOME=" + runner.Workspace, "LANG=C.UTF-8", "TZ=UTC"}
}

func (runner StopConditionRunner) now() time.Time {
	if runner.Now != nil {
		return runner.Now()
	}
	return time.Now()
}

func (runner StopConditionRunner) timestamp() string {
	return runner.now().UTC().Format(time.RFC3339Nano)
}

// summaryOf is the reason followed by the end of the output, within StopSummaryBytes.
func summaryOf(reason, output string) string {
	text := strings.TrimSpace(strings.Join([]string{reason, strings.TrimSpace(output)}, "\n"))
	if len(text) <= StopSummaryBytes {
		return text
	}
	return text[len(text)-StopSummaryBytes:]
}

// boundedOutput keeps a condition's output up to its limit and marks the rest as cut; writing past the limit never
// blocks the process, so output cannot extend a deadline.
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
		return output.kept.String() + TruncatedMarker
	}
	return output.kept.String()
}

