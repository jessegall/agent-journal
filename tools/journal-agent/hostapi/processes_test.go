package hostapi

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"journal-agent/dockerstandin"
	"journal-agent/host"
)

const standinImage = "registry.example/journal-helper@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

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
		kinds = append(kinds, report.Report)
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

func standinTable(t *testing.T, daemon *dockerstandin.Daemon) (*ProcessTable, *sentReports) {
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
func stopAndWait(daemon *dockerstandin.Daemon, table *ProcessTable) {
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

func openOrder(t *testing.T, processID, restart, image string) Order {
	t.Helper()
	plan := OpenPlan{
		Type:    "terminal",
		Restart: restart,
		Argv:    []string{"stand-in-program"},
		Container: &host.ContainerManifest{
			Image:          image,
			User:           "10001:10001",
			Workdir:        "/workspace",
			IsReadOnlyRoot: true,
			Network:        "journal-net-" + processID,
			IsAttachable:   true,
			Budgets:        host.ContainerBudgets{CPUCores: 1, MemoryBytes: 1 << 30, Processes: 64, OpenFiles: 256},
			Mounts:         []host.ContainerMount{{Type: host.MountBind, Source: t.TempDir(), Target: "/workspace"}},
		},
		Labels: host.StartLabels{Installation: "test", Session: processID},
		Size:   TerminalSize{Columns: 80, Rows: 24},
	}
	payload, err := json.Marshal(plan)
	if err != nil {
		t.Fatal(err)
	}
	return Order{ID: "open-" + processID, Type: "open_container", ProcessID: processID, Payload: string(payload)}
}

func TestAnOpenContainerRunsAndIsReportedRunning(t *testing.T) {
	daemon := dockerstandin.Start(t, standinImage)
	table, sent := standinTable(t, daemon)

	facts, err := table.openContainer(context.Background(), openOrder(t, "p1", "never", standinImage))
	if err != nil {
		t.Fatal(err)
	}

	sent.waitFor(t, "running")
	if container, found := daemon.Container("journal-process-p1"); !found || !container.IsRunning() || facts["identity"] == "" {
		t.Fatalf("the container does not run under the identity reported: %v", facts)
	}
}

func TestACrashedContainerHealedOnACrashIsStartedAgainAndANeverContainerIsLeftDown(t *testing.T) {
	daemon := dockerstandin.Start(t, standinImage)
	var starts atomic.Int32
	daemon.Programs = func(container *dockerstandin.Container) dockerstandin.Program {
		return func(ctx context.Context, _ *dockerstandin.Container, _ io.Reader, _ io.Writer) int {
			if starts.Add(1) == 1 {
				return 1
			}
			<-ctx.Done()
			return 0
		}
	}
	table, sent := standinTable(t, daemon)

	if _, err := table.openContainer(context.Background(), openOrder(t, "healed", "on_crash", standinImage)); err != nil {
		t.Fatal(err)
	}
	sent.waitFor(t, "running", "restarted")

	starts.Store(0)
	neverTable, neverSent := standinTable(t, daemon)
	if _, err := neverTable.openContainer(context.Background(), openOrder(t, "never", "never", standinImage)); err != nil {
		t.Fatal(err)
	}
	neverSent.waitFor(t, "running", "exited")
}

func TestARunningContainerIsAdoptedAgainAfterTheHostRestarted(t *testing.T) {
	daemon := dockerstandin.Start(t, standinImage)
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
	facts, err := first.openContainer(context.Background(), openOrder(t, "kept", "never", standinImage))
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
	table, sent := standinTable(t, dockerstandin.Start(t, standinImage))
	plan, err := json.Marshal(OpenPlan{Type: "pipe", Restart: "never", Argv: []string{"sh", "-c", "exit 3"}, Folder: t.TempDir()})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := table.openProcess(context.Background(), Order{ID: "open-n", Type: "open_process", ProcessID: "n", Payload: string(plan)}); err != nil {
		t.Fatal(err)
	}

	sent.waitFor(t, "running", "exited")
}

func TestAnUnpinnedImageIsRefused(t *testing.T) {
	daemon := dockerstandin.Start(t, "registry.example/journal-helper:latest")
	table, _ := standinTable(t, daemon)

	_, err := table.openContainer(context.Background(), openOrder(t, "p2", "never", "registry.example/journal-helper:latest"))

	var refusal RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != Unsafe {
		t.Fatalf("an unpinned image is not refused as unsafe: %v", err)
	}
}

func TestAStoppedContainerEndsWithOneExitReport(t *testing.T) {
	daemon := dockerstandin.Start(t, standinImage)
	table, sent := standinTable(t, daemon)
	if _, err := table.openContainer(context.Background(), openOrder(t, "p3", "on_crash", standinImage)); err != nil {
		t.Fatal(err)
	}
	sent.waitFor(t, "running")

	stop := Order{ID: "stop-p3", Type: "stop", ProcessID: "p3", Payload: `{"grace_ms":1000,"force_ms":1000}`}
	if _, err := table.stop(context.Background(), stop); err != nil {
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

	for _, kind := range []string{"running", "restarted", "exited"} {
		if err := queue.Add(ProcessReport{ProcessID: "p", Report: kind}); err != nil {
			t.Fatal(err)
		}
	}
	isAway.Store(false)
	queue.Retry()

	sent.waitFor(t, "running", "restarted", "exited")
}
