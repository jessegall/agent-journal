package hostapi

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
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
	Labels      host.StartLabels        `json:"labels"`
	Size        TerminalSize            `json:"size"`
	Files       []PlanFile              `json:"files"`
	Folders     []string                `json:"folders"`
	Inherit     []string                `json:"inherit"`
	SideSockets []string                `json:"side_sockets"`
	// ReadFiles are files the host opens read-only for a process on this host, handed over as its descriptors 3 on,
	// such as a token it reads on a descriptor instead of from its environment.
	ReadFiles []string `json:"read_files,omitempty"`
	// ShieldRules are the screens of a terminal whose frames the host shields before they leave.
	ShieldRules []ShieldRule `json:"shield_rules,omitempty"`
	// Fence is the session the process runs for, whose run_fenced orders close its admission; empty for none.
	Fence string `json:"fence,omitempty"`
	// KeptFiles are the files a device keeps for its binding between two sessions, such as the program's sign-in,
	// named as the process sees them.
	KeptFiles []string `json:"kept_files,omitempty"`
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
	// keptPath is where the plans of the held processes that can outlive the host are kept, so a host that restarted
	// adopts them again.
	keptPath string
	// stateFolder holds each process's files folder, which the host writes from the process's plan.
	stateFolder string
	// hostNames are the names on the installer's list a plan may name as {host:<NAME>}.
	hostNames map[string]string
	// allowed are the only programs a connected host opens; nil on a co-located host.
	allowed *AllowedPrograms

	mutex     sync.Mutex
	processes map[string]*heldProcess
	// fences are the fences a run_fenced order closed, each until its deadline, so one left closed opens again.
	fences map[string]time.Time
}

// keptProcess is what the host keeps on disk of one process it holds that can outlive it: a container, or a native
// process without a terminal, whose output goes to its spool and whose process group is named by its pid.
type keptProcess struct {
	Plan       OpenPlan `json:"plan"`
	Generation int      `json:"generation"`
	Pid        int      `json:"pid,omitempty"`
}

// heldProcess is one process the host holds, contained or native.
type heldProcess struct {
	id   string
	plan OpenPlan
	// generation and identity change as the process is healed, while the inventory and the order that opened it read
	// them, so they are read and written under their own lock.
	stateMutex sync.Mutex
	generation int
	identity   string
	terminal   host.TerminalStream
	input      io.WriteCloser
	native     *exec.Cmd
	// pid names the process group of a native process, a child of this host or one it adopted after a restart.
	pid      int
	stopping atomic.Bool
	// finished closes once a native process ended for good, so its spool is read to its end before its exit report.
	finished chan struct{}
	exited   chan struct{}
	// drained closes once the output of a container without a terminal was read to its end, so its exit is reported
	// only after everything it printed was sent.
	drained chan struct{}
}

// OpenProcessTable holds processes on the daemon of these containers, keeps their output, reports through the queue
// and keeps the plans of its containers in the state folder.
func OpenProcessTable(stateFolder string, containers host.Containers, reports *ReportQueue, outputs *Outputs) *ProcessTable {
	return &ProcessTable{
		containers:  containers,
		reports:     reports,
		outputs:     outputs,
		keptPath:    filepath.Join(stateFolder, "orders", "processes.json"),
		stateFolder: stateFolder,
		processes:   map[string]*heldProcess{},
		fences:      map[string]time.Time{},
	}
}

// NameHost gives the names a plan may name as {host:<NAME>}, such as the journal's URL as this host reaches it.
func (table *ProcessTable) NameHost(names map[string]string) {
	table.hostNames = names
}

// Adopt takes back every process the host held before it restarted: a container still running is attached again and
// watched, with no new report, so the inventory lists it under its identity; one that is gone is reported lost. A
// native process is followed on in its spool, whether it still runs or ended while the host was away.
func (table *ProcessTable) Adopt(ctx context.Context) error {
	kept, err := table.readKept()
	if err != nil {
		return err
	}
	for id, container := range kept {
		held := &heldProcess{id: id, plan: container.Plan, generation: container.Generation, exited: make(chan struct{})}
		if err := table.outputs.Open(id, held.plan); err != nil {
			return err
		}
		if container.Pid != 0 && held.plan.Type == "terminal" {
			table.endOrphanedTerminal(held, container.Pid)
			continue
		}
		if container.Pid != 0 {
			table.adoptNative(held, container.Pid)
			continue
		}
		if err := table.reattach(ctx, held); err != nil {
			table.keep(held)
			table.end(held, ProcessReport{ProcessID: id, Report: "lost", Evidence: "not found after the host restarted: " + err.Error()})
			continue
		}
		table.keep(held)
		go table.watchContainer(held)
	}
	return nil
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
		"run_fenced":     table.runFenced,
		"allow_images":   table.allowImages,
		"make_folder":    table.makeFolder,
		"remove_folder":  table.removeFolder,
		"folder_use":     table.folderUse,
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
			Identity:       held.currentIdentity(),
			Container:      held.containerName(),
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
	if err := table.admit(plan); err != nil {
		return nil, err
	}
	if !host.IsPinnedReference(plan.Container.Image) {
		return nil, RefusalError{Refusal: Unsafe, Reason: "the image " + plan.Container.Image + " is not pinned by digest"}
	}
	if plan, err = table.placeContainerFiles(ctx, order.ProcessID, plan); err != nil {
		return nil, err
	}
	if err := table.requireListed(plan); err != nil {
		return nil, err
	}
	held := &heldProcess{id: order.ProcessID, plan: plan, exited: make(chan struct{})}
	if err := table.outputs.Open(held.id, plan); err != nil {
		return nil, err
	}
	closeSides, err := table.listenSideSockets(held)
	if err != nil {
		return nil, err
	}
	if err := table.startContainer(ctx, held); err != nil {
		closeSides()
		return nil, err
	}
	table.keep(held)
	go table.watchContainer(held)
	identity, generation := held.state()
	return map[string]any{"identity": identity, "generation": generation}, nil
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
	labels := plan.Labels
	labels.Start = held.id
	if _, err := table.containers.Create(ctx, *plan.Container, held.containerName(), labels, process); err != nil {
		return err
	}
	if err := table.containers.Start(ctx, held.containerName()); err != nil {
		return err
	}
	return table.attachContainer(ctx, held)
}

// attachContainer attaches to the container's terminal, names its instance and reports it running.
func (table *ProcessTable) attachContainer(ctx context.Context, held *heldProcess) error {
	if err := table.reattach(ctx, held); err != nil {
		return err
	}
	report := "running"
	identity, generation := held.state()
	if generation > 0 {
		report = "restarted"
	}
	table.saveKept()
	return table.reports.Add(ProcessReport{ProcessID: held.id, Report: report, Identity: identity, Generation: generation})
}

// reattach names the running container's instance and attaches to its terminal.
func (table *ProcessTable) reattach(ctx context.Context, held *heldProcess) error {
	identity, err := table.containers.InstanceID(ctx, held.containerName())
	if err != nil {
		return err
	}
	held.setIdentity(identity)
	if held.plan.Container.IsAttachable {
		terminal, err := table.containers.AttachTerminal(ctx, held.containerName(), held.plan.Size.Rows, held.plan.Size.Columns)
		if err != nil {
			return err
		}
		held.terminal = terminal
		go table.copyOutput(held.id, terminal)
		return nil
	}
	return table.followPipes(ctx, held)
}

// followPipes reads a container without a terminal from its log, from its first start on, past the bytes the spool
// already counted, so a host that restarted goes on where it was and nothing is sent twice.
func (table *ProcessTable) followPipes(ctx context.Context, held *heldProcess) error {
	printed, err := table.containers.FollowOutput(ctx, held.containerName())
	if err != nil {
		return err
	}
	counted := table.outputs.SpoolOffset(held.id)
	drained := make(chan struct{})
	held.drained = drained
	go func() {
		<-held.exited
		_ = printed.Close()
	}()
	go func() {
		defer close(drained)
		if _, err := io.CopyN(io.Discard, printed, counted); err != nil {
			return
		}
		table.copyOutput(held.id, printed)
	}()
	return nil
}

// awaitDrained waits a while for the output of a container without a terminal to be read to its end.
func (held *heldProcess) awaitDrained() {
	if held.drained == nil {
		return
	}
	select {
	case <-held.drained:
	case <-time.After(5 * time.Second):
	}
}

// watchContainer waits for each exit of the container: a crash of a process healed on a crash starts it again,
// anything else ends it with one exit report.
func (table *ProcessTable) watchContainer(held *heldProcess) {
	ctx := context.Background()
	for {
		exit, err := table.containers.ExitOf(ctx, held.containerName())
		if err != nil {
			table.end(held, ProcessReport{ProcessID: held.id, Report: "lost", Evidence: err.Error()})
			return
		}
		if held.isStopping() || held.plan.Restart != "on_crash" || exit.Code == 0 {
			code := exit.Code
			held.awaitDrained()
			table.end(held, ProcessReport{ProcessID: held.id, Report: "exited", ExitCode: &code, Evidence: exit.Evidence()})
			return
		}
		held.nextGeneration()
		if err := table.containers.Start(ctx, held.containerName()); err != nil {
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
	if err := table.admit(plan); err != nil {
		return nil, err
	}
	if plan, err = writePlanFiles(table.stateFolder, order.ProcessID, plan, table.hostNames); err != nil {
		return nil, err
	}
	if err := table.requireListed(plan); err != nil {
		return nil, err
	}
	held := &heldProcess{id: order.ProcessID, plan: plan, exited: make(chan struct{})}
	if err := table.outputs.Open(held.id, plan); err != nil {
		return nil, err
	}
	closeSides, err := table.listenSideSockets(held)
	if err != nil {
		return nil, err
	}
	// A process opened again for a conversation that already went on, as after a restart of the host, resumes it.
	if err := table.startNative(held, plan.restartArgv()); err != nil {
		closeSides()
		return nil, err
	}
	table.keep(held)
	go table.watchNative(held)
	identity, generation := held.state()
	return map[string]any{"identity": identity, "generation": generation}, nil
}

// startNative starts the process as a child of the host in its own process group, behind a terminal or pipes.
func (table *ProcessTable) startNative(held *heldProcess, argv []string) error {
	if len(argv) == 0 {
		return RefusalError{Refusal: Unsafe, Reason: "the order names no program"}
	}
	command := exec.Command(argv[0], argv[1:]...)
	command.Dir = held.plan.Folder
	command.Env = held.plan.Environment
	files, err := host.OpenReadFiles(held.plan.ReadFiles)
	if err != nil {
		return RefusalError{Refusal: Unsafe, Reason: "a file the order hands the process cannot be read: " + err.Error()}
	}
	// The process holds its own copies of the descriptors once it started; the host's close with this start.
	defer host.CloseFiles(files)
	command.ExtraFiles = files
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
		spool, err := openSpool(table.stateFolder, held.id)
		if err != nil {
			return err
		}
		// The error output goes to the same spool in the order it was printed, as a program may print its sign-in line
		// there; a host that drops it would read every such program as saying nothing.
		command.Stdout = spool
		command.Stderr = spool
		err = command.Start()
		_ = spool.Close()
		if err != nil {
			return err
		}
		held.input = input
		if held.finished == nil {
			held.finished = make(chan struct{})
			table.followSpool(held, 0)
		}
	}
	held.native = command
	held.pid = command.Process.Pid
	held.setIdentity(fmt.Sprintf("pid:%d", command.Process.Pid))
	report := "running"
	identity, generation := held.state()
	if generation > 0 {
		report = "restarted"
	}
	return table.reports.Add(ProcessReport{ProcessID: held.id, Report: report, Identity: identity, Generation: generation})
}

func (table *ProcessTable) watchNative(held *heldProcess) {
	for {
		err := held.native.Wait()
		code := held.native.ProcessState.ExitCode()
		signal := signalOf(held.native.ProcessState)
		if held.isStopping() || held.plan.Restart != "on_crash" || (err == nil && code == 0) {
			held.finish()
			held.awaitDrained()
			table.end(held, ProcessReport{ProcessID: held.id, Report: "exited", ExitCode: &code, Signal: signal,
				Evidence: fmt.Sprintf("the process exited with %d", code)})
			return
		}
		held.nextGeneration()
		if startErr := table.startNative(held, held.plan.restartArgv()); startErr != nil {
			held.finish()
			table.end(held, ProcessReport{ProcessID: held.id, Report: "lost", Evidence: startErr.Error()})
			return
		}
		table.saveKept()
	}
}

// restartArgv is what a process runs when it is opened or healed: its restart argv once its restart file exists, its
// argv otherwise.
func (plan OpenPlan) restartArgv() []string {
	if len(plan.RestartArgv) == 0 || plan.RestartWhen.Folder == "" {
		return plan.Argv
	}
	if !hasFileNamed(plan.RestartWhen.Folder, plan.RestartWhen.Glob) {
		return plan.Argv
	}
	return plan.RestartArgv
}

// hasFileNamed is whether a file whose name matches the glob lies anywhere under the folder, as a program keeps its
// transcripts in a folder per project.
func hasFileNamed(folder, glob string) bool {
	found := errors.New("found")
	err := filepath.WalkDir(folder, func(_ string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return nil
		}
		if matched, _ := filepath.Match(glob, entry.Name()); matched && !entry.IsDir() {
			return found
		}
		return nil
	})
	return errors.Is(err, found)
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
	if held.pid != 0 {
		number, known := signalNumbers[plan.Signal]
		if !known {
			return nil, RefusalError{Refusal: Unsafe, Reason: "unknown signal " + plan.Signal}
		}
		return nil, host.OwnedGroupOf(held.pid).Signal(number)
	}
	return nil, table.containers.Kill(ctx, held.containerName(), plan.Signal)
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
	if held.pid != 0 {
		host.OwnedGroupOf(held.pid).Stop(host.StopStagesOf(grace, force))
	} else {
		seconds := max(1, int(grace/time.Second))
		_ = table.containers.Stop(ctx, held.containerName(), seconds)
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
	table.processes[held.id] = held
	table.mutex.Unlock()
	table.saveKept()
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
	report.Identity, report.Generation = held.state()
	table.writeKept(held)
	_ = table.reports.Add(report)
	close(held.exited)
}

// saveKept writes the plans of the processes that still run, so a restart adopts those that can outlive the host and
// ends what is left of the others.
func (table *ProcessTable) saveKept() {
	table.writeKept(nil)
}

// writeKept writes the plans of the processes that still run and can outlive the host but the one ending, if any.
func (table *ProcessTable) writeKept(ending *heldProcess) {
	table.mutex.Lock()
	kept := map[string]keptProcess{}
	for id, held := range table.processes {
		select {
		case <-held.exited:
			continue
		default:
		}
		// A native terminal cannot outlive the host, but is kept by its pid so a restart can end what is left of it.
		if held == ending || (!held.canOutliveHost() && held.pid == 0) {
			continue
		}
		_, generation := held.state()
		kept[id] = keptProcess{Plan: held.plan, Generation: generation, Pid: held.pid}
	}
	table.mutex.Unlock()
	content, err := json.Marshal(kept)
	if err != nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(table.keptPath), 0o700); err != nil {
		return
	}
	temporary := table.keptPath + ".new"
	if err := os.WriteFile(temporary, content, 0o600); err == nil {
		_ = os.Rename(temporary, table.keptPath)
	}
}

func (table *ProcessTable) readKept() (map[string]keptProcess, error) {
	return readKeptAt(table.keptPath)
}

// LiveKeptProcesses are the ids of the processes the table in the state folder kept whose process group still runs,
// as a disconnect asks once the relay that held them stopped.
func LiveKeptProcesses(stateFolder string) ([]string, error) {
	kept, err := readKeptAt(filepath.Join(stateFolder, "orders", "processes.json"))
	if err != nil {
		return nil, err
	}
	live := []string{}
	for id, process := range kept {
		if process.Pid != 0 && isGroupAlive(process.Pid) {
			live = append(live, id)
		}
	}
	sort.Strings(live)
	return live, nil
}

func readKeptAt(path string) (map[string]keptProcess, error) {
	kept := map[string]keptProcess{}
	content, err := os.ReadFile(path)
	if errors.Is(err, fs.ErrNotExist) {
		return kept, nil
	}
	if err != nil {
		return nil, err
	}
	return kept, json.Unmarshal(content, &kept)
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

// state is the process's identity and generation as they are now.
func (held *heldProcess) state() (string, int) {
	held.stateMutex.Lock()
	defer held.stateMutex.Unlock()
	return held.identity, held.generation
}

func (held *heldProcess) currentIdentity() string {
	identity, _ := held.state()
	return identity
}

func (held *heldProcess) setIdentity(identity string) {
	held.stateMutex.Lock()
	defer held.stateMutex.Unlock()
	held.identity = identity
}

// nextGeneration counts one more start of the healed process.
func (held *heldProcess) nextGeneration() {
	held.stateMutex.Lock()
	defer held.stateMutex.Unlock()
	held.generation++
}

// containerName is the name the host gives the container of a process: fixed by the process id, so a host that
// restarted finds the container again.
func (held *heldProcess) containerName() string {
	return "journal-process-" + held.id
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
