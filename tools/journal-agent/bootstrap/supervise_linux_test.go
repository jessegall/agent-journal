//go:build linux

package bootstrap

import (
	"bufio"
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
	"time"
)

// layoutVariable carries the test layout to the test binary when it runs as the init and as its children.
const layoutVariable = "JOURNAL_INIT_TEST_LAYOUT"

// statusLines are the status lines an identity is checked by.
const statusLines = `grep -E '^(Uid|Gid|Groups|NoNewPrivs|Cap(Inh|Prm|Eff|Bnd|Amb)):'`

func TestMain(m *testing.M) {
	if encoded := os.Getenv(layoutVariable); encoded != "" {
		var layout Layout
		if err := json.Unmarshal([]byte(encoded), &layout); err != nil {
			os.Exit(2)
		}

		os.Exit(Main(layout, os.Args[1:]))
	}

	os.Exit(m.Run())
}

// initFolder is a folder every user of the container may enter, holding a fake executor that records its status and
// process id, makes the socket and waits.
func initFolder(t *testing.T) (string, Layout) {
	if os.Geteuid() != 0 {
		t.Skip("the init drops users, which needs root with SETUID, SETGID and SETPCAP: run it in the golang image")
	}

	folder, err := os.MkdirTemp("/tmp", "journal-init-")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		if text, err := os.ReadFile(filepath.Join(folder, "executor-pid")); err == nil {
			if executor, err := strconv.Atoi(strings.TrimSpace(string(text))); err == nil {
				_ = syscall.Kill(executor, syscall.SIGKILL)
			}
		}
		_ = os.RemoveAll(folder)
	})

	executor := filepath.Join(folder, "executor")
	script := "#!/bin/sh\n" + statusLines + " /proc/self/status > " + folder + "/executor-status\n" +
		"echo $$ > " + folder + "/executor-pid\ntouch " + folder + "/exec.sock\nexec sleep 60 >/dev/null 2>&1\n"
	for _, step := range []error{
		os.Chmod(folder, 0o777),
		os.WriteFile(executor, []byte(script), 0o755),
	} {
		if step != nil {
			t.Fatal(step)
		}
	}

	return folder, Layout{Executor: executor, Socket: filepath.Join(folder, "exec.sock"), Workspace: folder,
		ToolsHome: folder, SocketWait: 10 * time.Second}
}

// runInit runs the test binary as the init of the program and answers its command, started.
func runInit(t *testing.T, layout Layout, program ...string) (*exec.Cmd, *bufio.Scanner) {
	encoded, err := json.Marshal(layout)
	if err != nil {
		t.Fatal(err)
	}

	init := exec.Command(os.Args[0], append([]string{"--"}, program...)...)
	init.Env = append(os.Environ(), layoutVariable+"="+string(encoded))
	init.Stderr = os.Stderr
	output, err := init.StdoutPipe()
	if err != nil {
		t.Fatal(err)
	}

	if err := init.Start(); err != nil {
		t.Fatal(err)
	}

	return init, bufio.NewScanner(output)
}

func TestTheProgramAndTheExecutorRunAsTheirOwnUsersWithNoCapabilitiesAndTheInitAsAThird(t *testing.T) {
	folder, layout := initFolder(t)

	init, output := runInit(t, layout, "sh", "-c",
		statusLines+" /proc/self/status; sleep 1; echo parent; "+statusLines+" /proc/$PPID/status; exit 7")
	var lines []string
	for output.Scan() {
		lines = append(lines, output.Text())
	}

	err := init.Wait()
	if exit, ended := err.(*exec.ExitError); !ended || exit.ExitCode() != 7 {
		t.Fatalf("the init ended with %v, not the program's 7", err)
	}

	text := strings.Join(lines, "\n")
	if strings.Count(text, "journal-init: ready") != 1 {
		t.Fatalf("the ready line is not there once: %q", text)
	}

	program, supervisor, _ := strings.Cut(strings.Replace(text, "journal-init: ready\n", "", 1), "parent\n")
	executor, err := os.ReadFile(filepath.Join(folder, "executor-status"))
	if err != nil {
		t.Fatal(err)
	}

	for name, check := range map[string]error{
		"program":    ProgramUser.Verify(program),
		"executor":   ExecutorUser.Verify(string(executor)),
		"supervisor": SupervisorUser.Verify(supervisor),
	} {
		if check != nil {
			t.Fatalf("the %s: %v", name, check)
		}
	}
}

func TestKillingTheExecutorStopsTheInit(t *testing.T) {
	folder, layout := initFolder(t)

	init, output := runInit(t, layout, "sleep", "60")
	if !output.Scan() || output.Text() != "journal-init: ready" {
		t.Fatalf("the init did not get ready: %q", output.Text())
	}

	text, err := os.ReadFile(filepath.Join(folder, "executor-pid"))
	if err != nil {
		t.Fatal(err)
	}

	executor, err := strconv.Atoi(strings.TrimSpace(string(text)))
	if err != nil {
		t.Fatal(err)
	}

	if err := syscall.Kill(executor, syscall.SIGKILL); err != nil {
		t.Fatal(err)
	}

	ended := make(chan error, 1)
	go func() { ended <- init.Wait() }()
	select {
	case err := <-ended:
		if exit, isExit := err.(*exec.ExitError); !isExit || exit.ExitCode() != 1 {
			t.Fatalf("the init ended with %v, not 1", err)
		}
	case <-time.After(10 * time.Second):
		_ = init.Process.Kill()
		t.Fatal("the init outlived its executor")
	}
}
