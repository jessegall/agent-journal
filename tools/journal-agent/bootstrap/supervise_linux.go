//go:build linux

package bootstrap

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"syscall"
	"time"
)

// childFlag marks the init's own re-execution as one of its children, which drops to its user and execs its program.
const childFlag = "--journal-init-child"

// The roles a child of the init plays.
const (
	executorRole = "executor"
	programRole  = "program"
)

// Layout is where the init finds the executor, the executor's socket, the workspace and the tools user's home.
type Layout struct {
	Executor   string
	Socket     string
	Workspace  string
	ToolsHome  string
	SocketWait time.Duration
}

// ContainerLayout is the layout inside a protected-account container.
var ContainerLayout = Layout{
	Executor: "/opt/journal/bin/journal-exec", Socket: "/run/journal-exec/exec.sock", Workspace: "/workspace",
	ToolsHome: "/home/journal-tools", SocketWait: 10 * time.Second,
}

// Main runs the init, `journal-init -- <program argv>`, or one of its children, and answers the exit code. A failed
// step prints one reason line, never the environment or the program's arguments.
func Main(layout Layout, arguments []string) int {
	if len(arguments) >= 2 && arguments[0] == childFlag {
		return refuse(arguments[1], runChild(layout, arguments[1], arguments[2:]))
	}

	if len(arguments) < 2 || arguments[0] != "--" {
		return refuse("init", errors.New("the program to run is missing: journal-init -- <program>"))
	}

	code, err := supervise(layout, arguments[1:])

	return refuse("init", err, code)
}

// supervise starts the executor, waits for its socket, starts the program, drops itself and reaps; it ends with the
// program's code when the program exits, and with 1 when the executor does first.
func supervise(layout Layout, program []string) (int, error) {
	executor, err := startChild(executorRole, nil)
	if err != nil {
		return 1, err
	}

	if err := waitForSocket(layout); err != nil {
		return 1, err
	}

	client, err := startChild(programRole, program)
	if err != nil {
		return 1, err
	}

	if err := SupervisorUser.Drop(); err != nil {
		return 1, fmt.Errorf("the init could not drop its own privileges: %w", err)
	}

	fmt.Println("journal-init: ready")

	return reap(executor.Pid, client.Pid), nil
}

// startChild re-executes the init as a child of the role, with the standard streams and the environment it was given.
func startChild(role string, program []string) (*os.Process, error) {
	child := exec.Command("/proc/self/exe", append([]string{childFlag, role}, program...)...)
	child.Stdin, child.Stdout, child.Stderr = os.Stdin, os.Stdout, os.Stderr
	if role == executorRole {
		child.Stdin = nil
	}

	if err := child.Start(); err != nil {
		return nil, fmt.Errorf("starting the %s failed: %w", role, err)
	}

	return child.Process, nil
}

func waitForSocket(layout Layout) error {
	deadline := time.Now().Add(layout.SocketWait)
	for time.Now().Before(deadline) {
		if _, err := os.Stat(layout.Socket); err == nil {
			return nil
		}
		time.Sleep(50 * time.Millisecond)
	}

	return errors.New("the executor's socket did not appear in time")
}

// reap waits on every child, the orphans the container's processes leave included, until the program or the
// executor ends, and answers the init's exit code.
func reap(executor, program int) int {
	for {
		var status syscall.WaitStatus
		pid, err := syscall.Wait4(-1, &status, 0, nil)
		if errors.Is(err, syscall.EINTR) {
			continue
		}
		if err != nil {
			return 1
		}

		switch pid {
		case program:
			return exitCodeOf(status)
		case executor:
			return 1
		}
	}
}

// exitCodeOf is the code a shell reports for the status: the exit code, or 128 and the signal.
func exitCodeOf(status syscall.WaitStatus) int {
	if status.Signaled() {
		return 128 + int(status.Signal())
	}

	return status.ExitStatus()
}

// runChild drops to the role's user, closes every inherited descriptor and execs the role's program; it returns only
// when a step failed.
func runChild(layout Layout, role string, program []string) error {
	identity, path, arguments, environment, folder, err := childPlan(layout, role, program)
	if err != nil {
		return err
	}

	if err := identity.Drop(); err != nil {
		return err
	}

	if err := closeInherited(); err != nil {
		return fmt.Errorf("closing inherited descriptors failed: %w", err)
	}

	if err := os.Chdir(folder); err != nil {
		return errors.New("entering the working folder failed")
	}

	return syscall.Exec(path, arguments, environment)
}

// childPlan is who the role runs as, what it execs, with which arguments and environment, and where.
func childPlan(layout Layout, role string, program []string) (Identity, string, []string, []string, string, error) {
	switch role {
	case executorRole:
		environment := []string{"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
			"HOME=" + layout.ToolsHome, "LANG=C.UTF-8"}

		return ExecutorUser, layout.Executor, []string{layout.Executor}, environment, "/", nil
	case programRole:
		if len(program) == 0 {
			return Identity{}, "", nil, nil, "", errors.New("the program to run is missing")
		}

		path, err := exec.LookPath(program[0])
		if err != nil {
			return Identity{}, "", nil, nil, "", errors.New("the program could not be found")
		}

		return ProgramUser, path, program, os.Environ(), layout.Workspace, nil
	}

	return Identity{}, "", nil, nil, "", errors.New("the child role is unknown")
}

// refuse prints the one reason line of a failed step and answers the exit code: the given one, or 1 on a failure.
func refuse(role string, err error, code ...int) int {
	if err != nil {
		fmt.Fprintf(os.Stderr, "journal-init: %s: %v\n", role, err)
		return 1
	}

	if len(code) > 0 {
		return code[0]
	}

	return 0
}
