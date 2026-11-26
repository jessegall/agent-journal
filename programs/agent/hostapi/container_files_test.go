package hostapi

import (
	"archive/tar"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"slices"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-agent/dockerstandin"
	"journal-agent/host"
)

// containedTable is a process table on a contained host whose agent daemon is the stand-in; the files the host
// writes through its throwaway come back as the throwaway's standard input.
func containedTable(t *testing.T) (*ProcessTable, *dockerstandin.Daemon, func() []byte) {
	t.Helper()
	daemon := dockerstandin.Start(t, standinImage)
	var mutex sync.Mutex
	var written []byte
	daemon.Programs = func(container *dockerstandin.Container) dockerstandin.Program {
		if container.Config.Tty {
			return nil
		}
		return func(_ context.Context, _ *dockerstandin.Container, input io.Reader, _ io.Writer) int {
			read, _ := io.ReadAll(input)
			mutex.Lock()
			written = read
			mutex.Unlock()
			return 0
		}
	}
	allowed := host.NewAllowedImages()
	allowed.Replace([]string{standinImage})
	rules := host.ContainerRules{Arrangement: host.Contained, InstallationName: "journal", Allowed: allowed, AgentImage: standinImage}
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

func containedOrder(t *testing.T, change func(plan *OpenPlan)) Order {
	t.Helper()
	plan := OpenPlan{
		Type:        "terminal",
		Restart:     "never",
		Argv:        []string{"program", "--settings", "{folder:files}/settings.json"},
		Environment: []string{"SKILLS={folder:files}/skills"},
		Files: []PlanFile{
			{Name: "settings.json", Content: `{"replies":"{folder:files}/hook-replies.json"}`, Template: true},
			{Name: "skills/a/SKILL.md", Content: "# a"},
		},
		Container: &host.ContainerManifest{
			Image:          standinImage,
			User:           "10001:10001",
			Workdir:        "/workspace",
			IsReadOnlyRoot: true,
			Network:        "journal-net-s1",
			IsAttachable:   true,
			Budgets:        host.ContainerBudgets{CPUCores: 1, MemoryBytes: 1 << 30, Processes: 64, OpenFiles: 256},
			Mounts: []host.ContainerMount{
				{Type: host.MountPlanFile, Target: host.PlanFileFolder},
				{Type: host.MountPlanFile, Source: "settings.json", Target: "/etc/program/settings.json"},
			},
		},
		Labels: host.StartLabels{Installation: "journal", Session: "s1"},
		Size:   TerminalSize{Columns: 80, Rows: 24},
	}
	change(&plan)
	payload, err := json.Marshal(plan)
	if err != nil {
		t.Fatal(err)
	}
	return Order{ID: "open-p1", Type: "open_container", ProcessID: "p1", Payload: string(payload)}
}

func TestAContainedPlanOpensWithEachFileMountedWhereItNames(t *testing.T) {
	table, daemon, written := containedTable(t)

	if _, err := table.openContainer(context.Background(), containedOrder(t, func(*OpenPlan) {})); err != nil {
		t.Fatal(err)
	}

	session, found := daemon.Container("journal-process-p1")
	if !found {
		t.Fatal("the session container was not created")
	}
	mounts := map[string]string{}
	for _, mount := range session.HostConfig.Mounts {
		if mount.ReadOnly {
			mounts[mount.Target] = mount.Source
		}
	}
	files := host.SessionFilesFolder("s1", "p1")
	if mounts[host.PlanFileFolder] != files || mounts["/etc/program/settings.json"] != files+"/settings.json" {
		t.Fatalf("the plan files are not mounted read-only where they name: %v", mounts)
	}
	if !slices.Contains(session.Config.Cmd, host.PlanFileFolder+"/settings.json") ||
		!strings.Contains(strings.Join(session.Config.Env, " "), "SKILLS="+host.PlanFileFolder+"/skills") {
		t.Fatalf("{folder:files} is not the folder the container sees: %v %v", session.Config.Cmd, session.Config.Env)
	}
	archived := archivedFiles(t, written())
	if len(archived) != 2 || archived["skills/a/SKILL.md"] != "# a" ||
		archived["settings.json"] != `{"replies":"`+host.PlanFileFolder+`/hook-replies.json"}` {
		t.Fatalf("the host wrote %v into the session folder", archived)
	}
}

func TestAContainedPlanNamingThisHostIsRefused(t *testing.T) {
	changes := map[string]func(plan *OpenPlan){
		"a host name":           func(plan *OpenPlan) { plan.Argv = []string{"{host:INSTALLATION}/bin/program"} },
		"a folder of this host": func(plan *OpenPlan) { plan.Folders = []string{"run"} },
		"an inherited variable": func(plan *OpenPlan) { plan.Inherit = []string{"HOME"} },
		"a file it has not": func(plan *OpenPlan) {
			plan.Container.Mounts[1].Source = "other.json"
		},
	}

	for name, change := range changes {
		table, _, _ := containedTable(t)
		_, err := table.openContainer(context.Background(), containedOrder(t, change))
		var refusal RefusalError
		if !errors.As(err, &refusal) || refusal.Refusal != Unsafe {
			t.Errorf("%s: the plan was not refused as unsafe: %v", name, err)
		}
	}
}

// archivedFiles are the files of the archive by their names.
func archivedFiles(t *testing.T, archive []byte) map[string]string {
	t.Helper()
	reader := tar.NewReader(bytes.NewReader(archive))
	files := map[string]string{}
	for {
		header, err := reader.Next()
		if errors.Is(err, io.EOF) {
			return files
		}
		if err != nil {
			t.Fatal(err)
		}
		content, err := io.ReadAll(reader)
		if err != nil {
			t.Fatal(err)
		}
		files[header.Name] = string(content)
	}
}
