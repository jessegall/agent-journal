package hostapi

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"slices"
	"sync"
	"testing"
	"time"

	"journal-runner/dockermock"
	"journal-runner/host"
)

// containedTable is a process table on a contained host whose Docker daemon is the mock; what a container run reads on
// its input comes back, and each run ends with the exit code given.
func containedTable(t *testing.T, runExit int) (*ProcessTable, *dockermock.Daemon, func() []byte) {
	t.Helper()
	daemon := dockermock.Start(t, mockImage)
	var mutex sync.Mutex
	var written []byte
	daemon.Programs = func(container *dockermock.Container) dockermock.Program {
		if container.Config.Tty {
			return nil
		}
		return func(_ context.Context, run *dockermock.Container, input io.Reader, _ io.Writer) int {
			if !run.Config.OpenStdin {
				return runExit
			}
			read, _ := io.ReadAll(input)
			mutex.Lock()
			written = read
			mutex.Unlock()
			return runExit
		}
	}
	allowed := host.NewAllowedImages()
	allowed.Replace([]string{mockImage})
	rules := host.ContainerRules{Arrangement: host.Contained, InstallationName: "journal", Allowed: allowed, DataFolder: "/srv/data"}
	containers, err := host.ContainersOn(daemon.Host(), rules)
	if err != nil {
		t.Fatal(err)
	}
	queue, err := OpenReportQueue(t.TempDir(), (&sentReports{}).send)
	if err != nil {
		t.Fatal(err)
	}
	runQueue(t, queue)
	state := t.TempDir()
	table := OpenProcessTable(state, containers, queue, NewOutputs(state, func(string, Output) error { return nil }, time.Now))
	t.Cleanup(func() { stopAndWait(daemon, table) })

	return table, daemon, func() []byte {
		mutex.Lock()
		defer mutex.Unlock()
		return written
	}
}

// containedManifest is a whole manifest as the journal sends it, with nothing for the host to add.
func containedManifest() host.ContainerManifest {
	return host.ContainerManifest{
		Name:                "journal-process-p1",
		Image:               mockImage,
		User:                "10001:10001",
		Workdir:             "/work",
		IsReadOnlyRoot:      true,
		BlocksNewPrivileges: true,
		Network:             "journal-net-s1",
		Mounts:              []host.ContainerMount{{Type: host.MountDaemonBind, Source: "/srv/data/sessions/s1/p1/files", Target: "/files"}},
		Tmpfs:               []host.ContainerTmpfs{{Target: "/tmp", Options: "size=1024"}},
		Labels:              []host.ContainerLabel{{Name: "journal.session", Value: "s1"}},
		Budgets:             host.ContainerBudgets{CPUCores: 1, MemoryBytes: 1 << 30, Processes: 64, OpenFiles: 256},
		IsAttachable:        true,
		Restart:             "no",
	}
}

func containedInstruction(t *testing.T, change func(plan *OpenPlan)) Instruction {
	t.Helper()
	manifest := containedManifest()
	plan := OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096,
		Type:      "terminal",
		Restart:   "never",
		Argv:      []string{"program", "--settings", "/files/settings.json"},
		Container: &manifest,
		Size:      TerminalSize{Columns: 80, Rows: 24},
	}
	change(&plan)
	payload, err := json.Marshal(plan)
	if err != nil {
		t.Fatal(err)
	}
	return Instruction{ID: "open-p1", Type: "open_container", ProcessID: "p1", Payload: string(payload)}
}

func TestAContainedPlanOpensTheContainerItsManifestDescribes(t *testing.T) {
	table, daemon, _ := containedTable(t, 0)

	if _, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), containedInstruction(t, func(*OpenPlan) {})); err != nil {
		t.Fatal(err)
	}

	session, found := daemon.Container("journal-process-p1")
	if !found {
		t.Fatal("the container was not created under the name the journal gave it")
	}
	if !slices.Equal(session.Config.Cmd, []string{"program", "--settings", "/files/settings.json"}) {
		t.Fatalf("the container runs %v", session.Config.Cmd)
	}
	if session.Config.Labels["journal.session"] != "s1" || session.Config.Labels["journal.installation"] != "journal" {
		t.Fatalf("the container carries the labels %v", session.Config.Labels)
	}
	if len(session.HostConfig.Mounts) != 1 || session.HostConfig.Mounts[0].Source != "/srv/data/sessions/s1/p1/files" {
		t.Fatalf("the container mounts %v", session.HostConfig.Mounts)
	}
	if session.HostConfig.Tmpfs["/tmp"] != "size=1024" || len(session.HostConfig.Tmpfs) != 1 {
		t.Fatalf("the container's memory folders are %v", session.HostConfig.Tmpfs)
	}
}

func TestEachPreparationRunsToItsEndWithItsInputBeforeTheContainer(t *testing.T) {
	table, daemon, written := containedTable(t, 0)
	preparation := host.ContainerRun{DeadlineMs: 30000, Manifest: containedManifest(), Command: []string{"sh", "-c", "cat"}, Input: []byte("the files")}
	preparation.Manifest.Name, preparation.Manifest.IsAttachable = "", false

	instruction := containedInstruction(t, func(plan *OpenPlan) { plan.Container.Preparations = []host.ContainerRun{preparation} })
	if _, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), instruction); err != nil {
		t.Fatal(err)
	}

	if string(written()) != "the files" {
		t.Fatalf("the preparation read %q", written())
	}
	if _, found := daemon.Container("journal-process-p1"); !found {
		t.Fatal("the container was not created after its preparation")
	}
}

func TestAFailedPreparationRefusesTheContainer(t *testing.T) {
	table, daemon, _ := containedTable(t, 1)
	preparation := host.ContainerRun{DeadlineMs: 30000, Manifest: containedManifest(), Command: []string{"sh", "-c", "exit 1"}}
	preparation.Manifest.Name, preparation.Manifest.IsAttachable = "", false

	instruction := containedInstruction(t, func(plan *OpenPlan) { plan.Container.Preparations = []host.ContainerRun{preparation} })
	_, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), instruction)

	if !errors.Is(err, host.ErrPreparationFailed) {
		var refusal RefusalError
		if !errors.As(err, &refusal) {
			t.Fatalf("the open was not refused: %v", err)
		}
	}
	if _, found := daemon.Container("journal-process-p1"); found {
		t.Fatal("the container was created although its preparation failed")
	}
}

func TestAContainedPlanWithoutAContainerNameIsRefused(t *testing.T) {
	table, _, _ := containedTable(t, 0)

	_, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), containedInstruction(t, func(plan *OpenPlan) {
		plan.Container.Name = ""
	}))

	var refusal RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != Unsafe {
		t.Fatalf("the plan was not refused as unsafe: %v", err)
	}
}

func TestAContainerRunAnswersItsExitCodeAndOutput(t *testing.T) {
	table, _, _ := containedTable(t, 3)
	run := host.ContainerRun{DeadlineMs: 30000, Manifest: containedManifest(), Command: []string{"sh", "-c", "exit 3"}, OutputLimit: 100}
	run.Manifest.Name, run.Manifest.IsAttachable = "", false

	results, err := table.RunContainers(context.Background(), Instruction{}, ContainerRuns{Runs: []host.ContainerRun{run}})
	if err != nil {
		t.Fatal(err)
	}

	if len(results.Results) != 1 || results.Results[0].ExitCode != 3 {
		t.Fatalf("the run answered %+v", results)
	}
}
