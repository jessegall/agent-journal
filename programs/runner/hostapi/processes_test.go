package hostapi

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"journal-runner/dockermock"
	"journal-runner/host"
)

const mockImage = "registry.example/journal-helper@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

// sentReports collects the reports a queue sends, for a test to wait on.
type sentReports struct {
	mutex   sync.Mutex
	reports []ProcessReport
}

func (sent *sentReports) send(report ProcessReport) error {
	sent.mutex.Lock()
	defer sent.mutex.Unlock()
	sent.reports = append(sent.reports, report)
	return nil
}

func (sent *sentReports) kinds() []string {
	sent.mutex.Lock()
	defer sent.mutex.Unlock()
	kinds := []string{}
	for _, report := range sent.reports {
		kinds = append(kinds, string(report.Report))
	}
	return kinds
}

func (sent *sentReports) waitFor(t *testing.T, wanted ...string) {
	t.Helper()
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		if strings.Join(sent.kinds(), ",") == strings.Join(wanted, ",") {
			return
		}
		time.Sleep(10 * time.Millisecond)
	}
	t.Fatalf("the host reported %v, not %v", sent.kinds(), wanted)
}

func mockTable(t *testing.T, daemon *dockermock.Daemon) (*ProcessTable, *sentReports) {
	t.Helper()
	containers, err := host.ContainersOn(daemon.Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	sent := &sentReports{}
	queue, err := OpenReportQueue(t.TempDir(), sent.send)
	if err != nil {
		t.Fatal(err)
	}
	runQueue(t, queue)
	state := t.TempDir()
	outputs := NewOutputs(state, func(string, Output) error { return nil }, time.Now)
	table := OpenProcessTable(state, containers, queue, outputs)
	t.Cleanup(func() { stopAndWait(daemon, table) })
	return table, sent
}

// runQueue sends the queue's reports until the test ends, and the test waits for it to stop before its folders go.
func runQueue(t *testing.T, queue *ReportQueue) {
	t.Helper()
	stopped, done := make(chan struct{}), make(chan struct{})
	t.Cleanup(func() {
		close(stopped)
		<-done
	})
	go func() {
		queue.Run(stopped)
		close(done)
	}()
}

// stopAndWait stops the daemon and waits for every process of the table to end, so nothing writes into the state
// folder once the test removes it.
func stopAndWait(daemon *dockermock.Daemon, table *ProcessTable) {
	daemon.Stop()
	table.mutex.Lock()
	held := make([]*heldProcess, 0, len(table.processes))
	for _, process := range table.processes {
		held = append(held, process)
	}
	table.mutex.Unlock()
	for _, process := range held {
		select {
		case <-process.exited:
		case <-time.After(5 * time.Second):
		}
	}
}

func openInstruction(t *testing.T, processID, restart, image string) Instruction {
	t.Helper()
	plan := OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096,
		Type:    "terminal",
		Restart: restart,
		Argv:    []string{"mock-program"},
		Container: &host.ContainerManifest{
			Name:           "journal-process-" + processID,
			Image:          image,
			Labels:         []host.ContainerLabel{{Name: "journal.session", Value: processID}},
			User:           "10001:10001",
			Workdir:        "/workspace",
			IsReadOnlyRoot: true,
			Network:        "journal-net-" + processID,
			IsAttachable:   true,
			Budgets:        host.ContainerBudgets{CPUCores: 1, MemoryBytes: 1 << 30, Processes: 64, OpenFiles: 256},
			Mounts:         []host.ContainerMount{{Type: host.MountBind, Source: t.TempDir(), Target: "/workspace"}},
		},
		Size: TerminalSize{Columns: 80, Rows: 24},
	}
	payload, err := json.Marshal(plan)
	if err != nil {
		t.Fatal(err)
	}
	return Instruction{ID: "open-" + processID, Type: "open_container", ProcessID: processID, Payload: string(payload)}
}

func TestAnOpenContainerRunsAndIsReportedRunning(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	table, sent := mockTable(t, daemon)

	facts, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), openInstruction(t, "p1", "never", mockImage))
	if err != nil {
		t.Fatal(err)
	}

	sent.waitFor(t, "running")
	if container, found := daemon.Container("journal-process-p1"); !found || !container.IsRunning() || facts["identity"] == "" {
		t.Fatalf("the container does not run under the identity reported: %v", facts)
	}
}

func TestACrashedContainerHealedOnACrashIsStartedAgainAndANeverContainerIsLeftDown(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	var starts atomic.Int32
	daemon.Programs = func(container *dockermock.Container) dockermock.Program {
		return func(ctx context.Context, _ *dockermock.Container, _ io.Reader, _ io.Writer) int {
			if starts.Add(1) == 1 {
				return 1
			}
			<-ctx.Done()
			return 0
		}
	}
	table, sent := mockTable(t, daemon)

	if _, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), openInstruction(t, "healed", "on_crash", mockImage)); err != nil {
		t.Fatal(err)
	}
	sent.waitFor(t, "running", "restarted")

	starts.Store(0)
	neverTable, neverSent := mockTable(t, daemon)
	if _, err := carry(testInstructions{ProcessTable: neverTable}, "open_container")(context.Background(), openInstruction(t, "never", "never", mockImage)); err != nil {
		t.Fatal(err)
	}
	neverSent.waitFor(t, "running", "exited")
}

func TestARunningContainerIsAdoptedAgainAfterTheHostRestarted(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	containers, err := host.ContainersOn(daemon.Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	state := t.TempDir()
	open := func() (*ProcessTable, *sentReports) {
		sent := &sentReports{}
		queue, err := OpenReportQueue(t.TempDir(), sent.send)
		if err != nil {
			t.Fatal(err)
		}
		runQueue(t, queue)
		outputs := NewOutputs(state, func(string, Output) error { return nil }, time.Now)
		return OpenProcessTable(state, containers, queue, outputs), sent
	}
	first, sent := open()
	facts, err := carry(testInstructions{ProcessTable: first}, "open_container")(context.Background(), openInstruction(t, "kept", "never", mockImage))
	if err != nil {
		t.Fatal(err)
	}
	sent.waitFor(t, "running")

	restarted, again := open()
	if err := restarted.Adopt(context.Background()); err != nil {
		t.Fatal(err)
	}

	inventory := restarted.Inventory()
	if len(inventory) != 1 || inventory[0].Identity != facts["identity"] || !inventory[0].IsAlive || len(again.kinds()) != 0 {
		t.Fatalf("the running container was not adopted under its identity: %+v, reports %v", inventory, again.kinds())
	}
}

func TestANativeProcessThatEndsIsReportedExitedWithItsCode(t *testing.T) {
	table, sent := mockTable(t, dockermock.Start(t, mockImage))
	plan, err := json.Marshal(OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe", Restart: "never", Argv: []string{"sh", "-c", "exit 3"}, Folder: t.TempDir()})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := carry(testInstructions{ProcessTable: table}, "open_process")(context.Background(), Instruction{ID: "open-n", Type: "open_process", ProcessID: "n", Payload: string(plan)}); err != nil {
		t.Fatal(err)
	}

	sent.waitFor(t, "running", "exited")
}

func TestANativeProcessReadsTheFilesItsPlanHandsItOnItsDescriptors(t *testing.T) {
	table, sent := mockTable(t, dockermock.Start(t, mockImage))
	token := filepath.Join(t.TempDir(), "token")
	if err := os.WriteFile(token, []byte("secret\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	plan, err := json.Marshal(OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe", Restart: "never", Folder: t.TempDir(), ReadFiles: []string{token},
		Argv: []string{"sh", "-c", `read line <&3; [ "$line" = secret ] && exit 7; exit 1`}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := carry(testInstructions{ProcessTable: table}, "open_process")(context.Background(), Instruction{ID: "open-r", Type: "open_process", ProcessID: "r", Payload: string(plan)}); err != nil {
		t.Fatal(err)
	}

	sent.waitFor(t, "running", "exited")
	sent.mutex.Lock()
	defer sent.mutex.Unlock()
	if code := sent.reports[1].ExitCode; code == nil || *code != 7 {
		t.Fatalf("the process did not read the handed file on descriptor 3: exit %v", code)
	}
}

func TestAnUnpinnedImageIsRefused(t *testing.T) {
	daemon := dockermock.Start(t, "registry.example/journal-helper:latest")
	table, _ := mockTable(t, daemon)

	_, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), openInstruction(t, "p2", "never", "registry.example/journal-helper:latest"))

	var refusal RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != Unsafe {
		t.Fatalf("an unpinned image is not refused as unsafe: %v", err)
	}
}

func TestAStoppedContainerEndsWithOneExitReport(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	table, sent := mockTable(t, daemon)
	if _, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), openInstruction(t, "p3", "on_crash", mockImage)); err != nil {
		t.Fatal(err)
	}
	sent.waitFor(t, "running")

	stop := Instruction{ID: "stop-p3", Type: "stop", ProcessID: "p3", Payload: `{"grace_ms":1000,"force_ms":1000}`}
	if _, err := carry(testInstructions{ProcessTable: table}, "stop")(context.Background(), stop); err != nil {
		t.Fatal(err)
	}

	sent.waitFor(t, "running", "exited")
}

func TestReportsMadeWhileTheJournalIsAwayAreSentInOrderOnceItIsBack(t *testing.T) {
	var isAway atomic.Bool
	isAway.Store(true)
	sent := &sentReports{}
	queue, err := OpenReportQueue(t.TempDir(), func(report ProcessReport) error {
		if isAway.Load() {
			return errors.New("the journal is away")
		}
		return sent.send(report)
	})
	if err != nil {
		t.Fatal(err)
	}
	stopped := make(chan struct{})
	defer close(stopped)
	go queue.Run(stopped)

	for _, kind := range []ProcessReportType{ProcessReportRunning, ProcessReportRestarted, ProcessReportExited} {
		if err := queue.Add(ProcessReport{ProcessID: "p", Report: kind}); err != nil {
			t.Fatal(err)
		}
	}
	isAway.Store(false)
	queue.Retry()

	sent.waitFor(t, "running", "restarted", "exited")
}

func TestAPipeContainersOutputGoesOnWhereItsSpoolEndedAfterTheHostRestarted(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	printAgain := make(chan struct{})
	daemon.Programs = func(container *dockermock.Container) dockermock.Program {
		return func(ctx context.Context, _ *dockermock.Container, _ io.Reader, output io.Writer) int {
			_, _ = output.Write([]byte("first\n"))
			select {
			case <-printAgain:
			case <-ctx.Done():
				return 1
			}
			_, _ = output.Write([]byte("second\n"))
			return 0
		}
	}
	containers, err := host.ContainersOn(daemon.Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	state := t.TempDir()
	open := func(sent *sentChunks) *ProcessTable {
		queue, err := OpenReportQueue(t.TempDir(), (&sentReports{}).send)
		if err != nil {
			t.Fatal(err)
		}
		runQueue(t, queue)
		return OpenProcessTable(state, containers, queue, NewOutputs(state, sent.send, time.Now))
	}
	before, after := &sentChunks{}, &sentChunks{}
	instruction := openInstruction(t, "turn", "never", mockImage)
	instruction.Payload = strings.Replace(instruction.Payload, `"type":"terminal"`, `"type":"pipe"`, 1)
	instruction.Payload = strings.Replace(instruction.Payload, `"isAttachable":true`, `"isAttachable":false`, 1)
	if _, err := carry(testInstructions{ProcessTable: open(before)}, "open_container")(context.Background(), instruction); err != nil {
		t.Fatal(err)
	}
	waitForText(t, before, "first\n")

	restarted := open(after)
	if err := restarted.Adopt(context.Background()); err != nil {
		t.Fatal(err)
	}
	close(printAgain)

	waitForText(t, after, "second\n")
	t.Cleanup(func() { stopAndWait(daemon, restarted) })
}

// A pipe container whose program prints and exits at once, as a sign-in probe does, has all it printed read.
func TestAPipeContainerThatPrintsAndExitsAtOnceHasItsOutputReadWhole(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	daemon.Programs = func(*dockermock.Container) dockermock.Program {
		return dockermock.Printing("{\"loggedIn\":true}\n", 0)
	}
	containers, err := host.ContainersOn(daemon.Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	state := t.TempDir()
	queue, err := OpenReportQueue(t.TempDir(), (&sentReports{}).send)
	if err != nil {
		t.Fatal(err)
	}
	runQueue(t, queue)
	sent := &sentChunks{}
	table := OpenProcessTable(state, containers, queue, NewOutputs(state, sent.send, time.Now))
	instruction := openInstruction(t, "probe", "never", mockImage)
	instruction.Payload = strings.Replace(instruction.Payload, `"type":"terminal"`, `"type":"pipe"`, 1)
	instruction.Payload = strings.Replace(instruction.Payload, `"isAttachable":true`, `"isAttachable":false`, 1)

	if _, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), instruction); err != nil {
		t.Fatal(err)
	}

	waitForText(t, sent, "{\"loggedIn\":true}\n")
	t.Cleanup(func() { stopAndWait(daemon, table) })
}

// waitForText waits until the chunks of standard output read as the text given.
func waitForText(t *testing.T, sent *sentChunks, text string) {
	t.Helper()
	deadline := time.Now().Add(5 * time.Second)
	for sent.textOf("stdout") != text && time.Now().Before(deadline) {
		time.Sleep(10 * time.Millisecond)
	}
	if got := sent.textOf("stdout"); got != text {
		t.Fatalf("the host sent %q, not %q", got, text)
	}
}

func TestANativePipeProcessPrintsOnAndEndsOnceAfterTheHostRestarted(t *testing.T) {
	containers, err := host.ContainersOn(dockermock.Start(t, mockImage).Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	state, hold := t.TempDir(), filepath.Join(t.TempDir(), "hold")
	if err := os.WriteFile(hold, nil, 0o600); err != nil {
		t.Fatal(err)
	}
	open := func(chunks *sentChunks, reports *sentReports) *ProcessTable {
		queue, err := OpenReportQueue(t.TempDir(), reports.send)
		if err != nil {
			t.Fatal(err)
		}
		runQueue(t, queue)
		return OpenProcessTable(state, containers, queue, NewOutputs(state, chunks.send, time.Now))
	}
	before, after, reports := &sentChunks{}, &sentChunks{}, &sentReports{}
	plan, err := json.Marshal(OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe", Restart: "never", Folder: t.TempDir(),
		Argv: []string{"sh", "-c", `echo first; while [ -e "$0" ]; do sleep 0.05; done; echo second`, hold}})
	if err != nil {
		t.Fatal(err)
	}
	instruction := Instruction{ID: "open-s", Type: "open_process", ProcessID: "s", Payload: string(plan)}
	if _, err := carry(testInstructions{ProcessTable: open(before, &sentReports{})}, "open_process")(context.Background(), instruction); err != nil {
		t.Fatal(err)
	}
	waitForText(t, before, "first\n")

	if err := open(after, reports).Adopt(context.Background()); err != nil {
		t.Fatal(err)
	}
	if err := os.Remove(hold); err != nil {
		t.Fatal(err)
	}

	waitForText(t, after, "second\n")
	reports.waitFor(t, "exited")
}

// A healed process resumes once its restart file lies anywhere under its folder, as a transcript in a project folder.
func TestANativePipeProcessesErrorOutputReachesTheJournalInTheOrderItWasPrinted(t *testing.T) {
	containers, err := host.ContainersOn(dockermock.Start(t, mockImage).Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	reports := &sentReports{}
	queue, err := OpenReportQueue(t.TempDir(), reports.send)
	if err != nil {
		t.Fatal(err)
	}
	runQueue(t, queue)
	state, chunks := t.TempDir(), &sentChunks{}
	table := OpenProcessTable(state, containers, queue, NewOutputs(state, chunks.send, time.Now))
	plan, err := json.Marshal(OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe", Restart: "never", Folder: t.TempDir(),
		Argv: []string{"sh", "-c", `echo out; echo "Logged in using ChatGPT" >&2; echo after`}})
	if err != nil {
		t.Fatal(err)
	}
	instruction := Instruction{ID: "open-e", Type: "open_process", ProcessID: "e", Payload: string(plan)}
	if _, err := carry(testInstructions{ProcessTable: table}, "open_process")(context.Background(), instruction); err != nil {
		t.Fatal(err)
	}

	waitForText(t, chunks, "out\nLogged in using ChatGPT\nafter\n")
	// The process ends and writes its report and state into the test's folders, so the test waits for that first.
	reports.waitFor(t, "running", "exited")
}

func TestAHealedProcessRunsItsRestartArgvOnceItsFileExistsUnderItsFolder(t *testing.T) {
	folder := t.TempDir()
	plan := OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Argv: []string{"program", "--session-id", "c1"}, RestartArgv: []string{"program", "--resume", "c1"},
		RestartWhenFile: &host.RestartFile{Folder: folder, Glob: "*c1.jsonl"}}
	before := plan.restartArgv()
	if err := os.MkdirAll(filepath.Join(folder, "-work"), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(folder, "-work", "c1.jsonl"), []byte("{}"), 0o600); err != nil {
		t.Fatal(err)
	}

	if before[1] != "--session-id" || plan.restartArgv()[1] != "--resume" {
		t.Fatalf("the healed process ran %v before its transcript and %v after", before, plan.restartArgv())
	}
}

// A native terminal lost with its host is ended and reported lost only once its process is gone, so the journal never
// opens it again while the old one still runs.
func TestATerminalLostWithItsHostIsReportedLostOnlyOnceItsProcessEnded(t *testing.T) {
	containers, err := host.ContainersOn(dockermock.Start(t, mockImage).Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	state, ended := t.TempDir(), filepath.Join(t.TempDir(), "ended")
	open := func(reports *sentReports) *ProcessTable {
		queue, err := OpenReportQueue(t.TempDir(), reports.send)
		if err != nil {
			t.Fatal(err)
		}
		runQueue(t, queue)
		return OpenProcessTable(state, containers, queue, NewOutputs(state, (&sentChunks{}).send, time.Now))
	}
	plan, err := json.Marshal(OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "terminal", Restart: "never", Folder: t.TempDir(),
		Size: TerminalSize{Columns: 40, Rows: 5},
		Argv: []string{"sh", "-c", `trap 'touch "$0"; exit 0' HUP; while true; do sleep 0.05; done`, ended}})
	if err != nil {
		t.Fatal(err)
	}
	before := open(&sentReports{})
	if _, err := carry(testInstructions{ProcessTable: before}, "open_process")(context.Background(), Instruction{ID: "open-t", Type: "open_process", ProcessID: "t",
		Payload: string(plan)}); err != nil {
		t.Fatal(err)
	}
	reports := &sentReports{}

	if err := open(reports).Adopt(context.Background()); err != nil {
		t.Fatal(err)
	}

	reports.waitFor(t, "lost")
	if _, err := os.Stat(ended); err != nil {
		t.Fatalf("the terminal was reported lost before its process ended: %v", err)
	}
}
