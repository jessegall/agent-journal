package hostapi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/creack/pty"

	"journal-agent/host"
)

// OpenPlan is the payload of open_container and open_process: what runs, how it is healed, its terminal size, and
// for a container its manifest, name and labels.
type OpenPlan struct {
	Type        string                  `json:"type"`
	Restart     string                  `json:"restart"`
	Argv        []string                `json:"argv"`
	RestartArgv []string                `json:"restart_argv"`
	RestartWhen host.RestartFile        `json:"restart_when_file"`
	Environment []string                `json:"environment"`
	Folder      string                  `json:"folder"`
	Isolation   string                  `json:"isolation"`
	Container   *host.ContainerManifest `json:"container"`
	Name        string                  `json:"name"`
	Labels      host.StartLabels        `json:"labels"`
	Size        TerminalSize            `json:"size"`
}

// TerminalSize is a terminal's columns and rows.
type TerminalSize struct {
	Columns uint16 `json:"columns"`
	Rows    uint16 `json:"rows"`
}

// StopPlan is the payload of stop: how long the process gets to end, then how long before it is killed.
type StopPlan struct {
	GraceMs int `json:"grace_ms"`
	ForceMs int `json:"force_ms"`
}

// SignalPlan is the payload of signal.
type SignalPlan struct {
	Signal string `json:"signal"`
}

// RemovePlan is the payload of remove: an ended start's container, network and handed files.
type RemovePlan struct {
	Container string `json:"container"`
	Network   string `json:"network"`
	Session   string `json:"session"`
}

// ProcessTable holds the processes the journal ordered the host to open: it starts each, keeps its terminal or
// pipes, heals a crashed one whose restart policy asks it, and reports each change through the report queue.
type ProcessTable struct {
	containers host.Containers
	reports    *ReportQueue
	outputs    *Outputs

	mutex     sync.Mutex
	processes map[string]*heldProcess
}

// heldProcess is one process the host holds, contained or native.
type heldProcess struct {
	id         string
	plan       OpenPlan
	generation int
	identity   string
	terminal   host.TerminalStream
	input      io.WriteCloser
	native     *exec.Cmd
	stopping   atomic.Bool
	exited     chan struct{}
}

// NewProcessTable holds processes on the daemon of these containers, keeps their output and reports through the
// queue.
func NewProcessTable(containers host.Containers, reports *ReportQueue, outputs *Outputs) *ProcessTable {
	return &ProcessTable{containers: containers, reports: reports, outputs: outputs, processes: map[string]*heldProcess{}}
}

// Executors are the process orders this table carries out.
func (table *ProcessTable) Executors() map[string]Executor {
	return map[string]Executor{
		"open_container": table.openContainer,
		"open_process":   table.openProcess,
		"resize":         table.resize,
		"signal":         table.signal,
		"stop":           table.stop,
		"remove":         table.remove,
	}
}

// Live are the ids of the processes the host holds and that still run.
func (table *ProcessTable) Live() []string {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	live := []string{}
	for id, held := range table.processes {
		select {
		case <-held.exited:
		default:
			live = append(live, id)
		}
	}
	return live
}

// Inventory is every process the host holds, as it reports them after a start.
func (table *ProcessTable) Inventory() []InventoryProcess {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	inventory := []InventoryProcess{}
	for id, held := range table.processes {
		alive := true
		select {
		case <-held.exited:
			alive = false
		default:
		}
		inventory = append(inventory, InventoryProcess{
			ProcessID:      id,
			Identity:       held.identity,
			Container:      held.plan.Name,
			IsAlive:        alive,
			IsTerminalHeld: held.terminal != nil,
			SpoolOffset:    table.outputs.SpoolOffset(id),
		})
	}
	return inventory
}

// PlanOf is what the process was opened with.
func (table *ProcessTable) PlanOf(processID string) (OpenPlan, error) {
	held, err := table.held(processID)
	if err != nil {
		return OpenPlan{}, err
	}
	return held.plan, nil
}

// Write writes into the process's terminal or standard input.
func (table *ProcessTable) Write(processID string, bytes []byte) error {
	held, err := table.held(processID)
	if err != nil {
		return err
	}
	if held.terminal != nil {
		_, err = held.terminal.Write(bytes)
		return err
	}
	if held.input == nil {
		return RefusalError{Refusal: NotRunning, Reason: "the process takes no input"}
	}
	_, err = held.input.Write(bytes)
	return err
}

// CloseInput closes a pipe process's standard input.
func (table *ProcessTable) CloseInput(processID string) error {
	held, err := table.held(processID)
	if err != nil {
		return err
	}
	if held.input == nil {
		return RefusalError{Refusal: NotRunning, Reason: "the process takes no input"}
	}
	return held.input.Close()
}

func (table *ProcessTable) openContainer(ctx context.Context, order Order) (map[string]any, error) {
	plan, err := decodePayload[OpenPlan](order)
	if err != nil {
		return nil, err
	}
	if plan.Container == nil {
		return nil, RefusalError{Refusal: Unsafe, Reason: "open_container names no container"}
	}
	if !host.IsPinnedReference(plan.Container.Image) {
		return nil, RefusalError{Refusal: Unsafe, Reason: "the image " + plan.Container.Image + " is not pinned by digest"}
	}
	held := &heldProcess{id: order.ProcessID, plan: plan, exited: make(chan struct{})}
	if err := table.outputs.Open(held.id, plan); err != nil {
		return nil, err
	}
	if err := table.startContainer(ctx, held); err != nil {
		return nil, err
	}
	table.keep(held)
	go table.watchContainer(held)
	return map[string]any{"identity": held.identity, "generation": held.generation}, nil
}

func (table *ProcessTable) startContainer(ctx context.Context, held *heldProcess) error {
	plan := held.plan
	if err := table.containers.EnsureNetwork(ctx, plan.Container.Network, plan.Labels); err != nil {
		return err
	}
	process := host.ContainerProcess{
		Command:        plan.Argv,
		Environment:    plan.Environment,
		Restart:        plan.RestartArgv,
		RestartWhen:    plan.RestartWhen,
		IsHealedByHost: true,
	}
	if _, err := table.containers.Create(ctx, *plan.Container, plan.Name, plan.Labels, process); err != nil {
		return err
	}
	if err := table.containers.Start(ctx, plan.Name); err != nil {
		return err
	}
	return table.attachContainer(ctx, held)
}

// attachContainer attaches to the container's terminal, names its instance and reports it running.
func (table *ProcessTable) attachContainer(ctx context.Context, held *heldProcess) error {
	identity, err := table.containers.InstanceID(ctx, held.plan.Name)
	if err != nil {
		return err
	}
	held.identity = identity
	if held.plan.Container.IsAttachable {
		terminal, err := table.containers.AttachTerminal(ctx, held.plan.Name, held.plan.Size.Rows, held.plan.Size.Columns)
		if err != nil {
			return err
		}
		held.terminal = terminal
		go table.copyOutput(held.id, terminal)
	}
	report := "running"
	if held.generation > 0 {
		report = "restarted"
	}
	return table.reports.Add(ProcessReport{ProcessID: held.id, Report: report, Identity: identity, Generation: held.generation})
}

// watchContainer waits for each exit of the container: a crash of a process healed on a crash starts it again,
// anything else ends it with one exit report.
func (table *ProcessTable) watchContainer(held *heldProcess) {
	ctx := context.Background()
	for {
		exit, err := table.containers.ExitOf(ctx, held.plan.Name)
		if err != nil {
			table.end(held, ProcessReport{ProcessID: held.id, Report: "lost", Evidence: err.Error()})
			return
		}
		if held.isStopping() || held.plan.Restart != "on_crash" || exit.Code == 0 {
			code := exit.Code
			table.end(held, ProcessReport{ProcessID: held.id, Report: "exited", ExitCode: &code, Evidence: exit.Evidence()})
			return
		}
		held.generation++
		if err := table.containers.Start(ctx, held.plan.Name); err != nil {
			table.end(held, ProcessReport{ProcessID: held.id, Report: "lost", Evidence: "the crashed container could not be started again: " + err.Error()})
			return
		}
		if err := table.attachContainer(ctx, held); err != nil {
			table.end(held, ProcessReport{ProcessID: held.id, Report: "lost", Evidence: err.Error()})
			return
		}
	}
}

func (table *ProcessTable) openProcess(_ context.Context, order Order) (map[string]any, error) {
	plan, err := decodePayload[OpenPlan](order)
	if err != nil {
		return nil, err
	}
	if plan.Isolation != "" && plan.Isolation != "none" {
		return nil, RefusalError{Refusal: Unsafe, Reason: "this host does not launch with " + plan.Isolation}
	}
	held := &heldProcess{id: order.ProcessID, plan: plan, exited: make(chan struct{})}
	if err := table.outputs.Open(held.id, plan); err != nil {
		return nil, err
	}
	if err := table.startNative(held, plan.Argv); err != nil {
		return nil, err
	}
	table.keep(held)
	go table.watchNative(held)
	return map[string]any{"identity": held.identity, "generation": held.generation}, nil
}

// startNative starts the process as a child of the host in its own process group, behind a terminal or pipes.
func (table *ProcessTable) startNative(held *heldProcess, argv []string) error {
	if len(argv) == 0 {
		return RefusalError{Refusal: Unsafe, Reason: "the order names no program"}
	}
	command := exec.Command(argv[0], argv[1:]...)
	command.Dir = held.plan.Folder
	command.Env = held.plan.Environment
	if held.plan.Type == "terminal" {
		terminal, err := pty.StartWithAttrs(command, &pty.Winsize{Rows: held.plan.Size.Rows, Cols: held.plan.Size.Columns},
			&syscall.SysProcAttr{Setsid: true, Setctty: true})
		if err != nil {
			return err
		}
		held.terminal = host.PtyTerminal(terminal)
		go table.copyOutput(held.id, terminal)
	} else {
		command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
		input, err := command.StdinPipe()
		if err != nil {
			return err
		}
		printed, err := command.StdoutPipe()
		if err != nil {
			return err
		}
		if err := command.Start(); err != nil {
			return err
		}
		held.input = input
		go table.copyOutput(held.id, printed)
	}
	held.native = command
	held.identity = fmt.Sprintf("pid:%d", command.Process.Pid)
	report := "running"
	if held.generation > 0 {
		report = "restarted"
	}
	return table.reports.Add(ProcessReport{ProcessID: held.id, Report: report, Identity: held.identity, Generation: held.generation})
}

func (table *ProcessTable) watchNative(held *heldProcess) {
	for {
		err := held.native.Wait()
		code := held.native.ProcessState.ExitCode()
		signal := signalOf(held.native.ProcessState)
		if held.isStopping() || held.plan.Restart != "on_crash" || (err == nil && code == 0) {
			table.end(held, ProcessReport{ProcessID: held.id, Report: "exited", ExitCode: &code, Signal: signal,
				Evidence: fmt.Sprintf("the process exited with %d", code)})
			return
		}
		held.generation++
		if startErr := table.startNative(held, held.plan.restartArgv()); startErr != nil {
			table.end(held, ProcessReport{ProcessID: held.id, Report: "lost", Evidence: startErr.Error()})
			return
		}
	}
}

// restartArgv is what a healed process runs: its restart argv once its restart file exists, its argv otherwise.
func (plan OpenPlan) restartArgv() []string {
	if len(plan.RestartArgv) == 0 || plan.RestartWhen.Folder == "" {
		return plan.Argv
	}
	matches, _ := filepath.Glob(filepath.Join(plan.RestartWhen.Folder, plan.RestartWhen.Glob))
	if len(matches) == 0 {
		return plan.Argv
	}
	return plan.RestartArgv
}

func (table *ProcessTable) resize(_ context.Context, order Order) (map[string]any, error) {
	size, err := decodePayload[TerminalSize](order)
	if err != nil {
		return nil, err
	}
	held, err := table.held(order.ProcessID)
	if err != nil {
		return nil, err
	}
	if held.terminal == nil {
		return nil, RefusalError{Refusal: NotRunning, Reason: "the process has no terminal"}
	}
	return nil, held.terminal.Resize(size.Rows, size.Columns)
}

func (table *ProcessTable) signal(ctx context.Context, order Order) (map[string]any, error) {
	plan, err := decodePayload[SignalPlan](order)
	if err != nil {
		return nil, err
	}
	held, err := table.held(order.ProcessID)
	if err != nil {
		return nil, err
	}
	if held.native != nil {
		number, known := signalNumbers[plan.Signal]
		if !known {
			return nil, RefusalError{Refusal: Unsafe, Reason: "unknown signal " + plan.Signal}
		}
		return nil, host.OwnedGroupOf(held.native.Process.Pid).Signal(number)
	}
	return nil, table.containers.Kill(ctx, held.plan.Name, plan.Signal)
}

// stop ends the process within its grace and force times; its one exit report comes from its watch.
func (table *ProcessTable) stop(ctx context.Context, order Order) (map[string]any, error) {
	plan, err := decodePayload[StopPlan](order)
	if err != nil {
		return nil, err
	}
	held, err := table.held(order.ProcessID)
	if err != nil {
		return nil, err
	}
	held.markStopping()
	grace := time.Duration(plan.GraceMs) * time.Millisecond
	force := time.Duration(plan.ForceMs) * time.Millisecond
	if held.native != nil {
		host.OwnedGroupOf(held.native.Process.Pid).Stop(host.StopStagesOf(grace, force))
	} else {
		seconds := max(1, int(grace/time.Second))
		_ = table.containers.Stop(ctx, held.plan.Name, seconds)
	}
	select {
	case <-held.exited:
		return nil, nil
	case <-time.After(grace + force + 5*time.Second):
		return nil, RefusalError{Refusal: Unsafe, Reason: "the process did not end within its grace and force times"}
	}
}

func (table *ProcessTable) remove(ctx context.Context, order Order) (map[string]any, error) {
	plan, err := decodePayload[RemovePlan](order)
	if err != nil {
		return nil, err
	}
	if plan.Container != "" {
		if err := table.containers.Remove(ctx, plan.Container, 10); err != nil {
			return nil, err
		}
	}
	if plan.Network != "" {
		if err := table.containers.RemoveNetwork(ctx, plan.Network); err != nil {
			return nil, err
		}
	}
	if plan.Session != "" {
		if err := table.containers.RemoveSessionFiles(ctx, plan.Session); err != nil {
			return nil, err
		}
	}
	return nil, nil
}

func (table *ProcessTable) keep(held *heldProcess) {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	table.processes[held.id] = held
}

func (table *ProcessTable) held(processID string) (*heldProcess, error) {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	held, found := table.processes[processID]
	if !found {
		return nil, RefusalError{Refusal: NotRunning, Reason: "the host holds no process " + processID}
	}
	return held, nil
}

func (table *ProcessTable) end(held *heldProcess, report ProcessReport) {
	report.Generation = held.generation
	report.Identity = held.identity
	_ = table.reports.Add(report)
	close(held.exited)
}

func (table *ProcessTable) copyOutput(processID string, printed io.Reader) {
	buffer := make([]byte, 32*1024)
	for {
		count, err := printed.Read(buffer)
		if count > 0 {
			table.outputs.Printed(processID, append([]byte(nil), buffer[:count]...))
		}
		if err != nil {
			return
		}
	}
}

func (held *heldProcess) markStopping() {
	held.stopping.Store(true)
}

func (held *heldProcess) isStopping() bool {
	return held.stopping.Load()
}

var signalNumbers = map[string]syscall.Signal{
	"SIGINT":  syscall.SIGINT,
	"SIGTERM": syscall.SIGTERM,
	"SIGKILL": syscall.SIGKILL,
	"SIGHUP":  syscall.SIGHUP,
	"SIGQUIT": syscall.SIGQUIT,
}

func signalOf(state *os.ProcessState) string {
	status, isWait := state.Sys().(syscall.WaitStatus)
	if !isWait || !status.Signaled() {
		return ""
	}
	return status.Signal().String()
}

// decodePayload reads an order's payload into its shape; a payload of another shape is unsafe.
func decodePayload[T any](order Order) (T, error) {
	var decoded T
	if err := json.Unmarshal([]byte(order.Payload), &decoded); err != nil {
		return decoded, RefusalError{Refusal: Unsafe, Reason: "the payload of " + order.Type + " does not read: " + err.Error()}
	}
	return decoded, nil
}
