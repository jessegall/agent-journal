package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"
)

type shellSandbox struct {
	Level   string
	Program string
	Prefix  []string
}

func (sandbox shellSandbox) command(program string, arguments ...string) *exec.Cmd {
	return exec.Command(sandbox.Program, append(append(append([]string{}, sandbox.Prefix...), program), arguments...)...)
}

func checkedSandbox(program string, writable []string, limit readLimit) (shellSandbox, error) {
	resolved := make([]string, 0, len(writable))
	for _, folder := range writable {
		path, err := filepath.EvalSymlinks(folder)
		if err != nil {
			return shellSandbox{}, err
		}
		resolved = append(resolved, path)
	}
	sandbox, err := systemSandbox(program, resolved, limit)
	if err != nil {
		return sandbox, err
	}
	probe, err := os.CreateTemp("", "journal-write-probe-")
	if err != nil {
		return sandbox, err
	}
	name := probe.Name()
	_ = probe.Close()
	defer os.Remove(name)
	command := sandbox.command(program, "--sandbox-probe", name)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	command = exec.CommandContext(ctx, command.Path, command.Args[1:]...)
	if output, err := command.CombinedOutput(); err != nil {
		return sandbox, fmt.Errorf("read-only shell sandbox self-test failed: %w: %s", err, output)
	}
	return sandbox, nil
}

func sandboxProbe(name string) int {
	file, err := os.OpenFile(name, os.O_WRONLY|os.O_TRUNC, 0)
	if errors.Is(err, os.ErrPermission) || errors.Is(err, syscall.EROFS) {
		return 0
	}
	if file != nil {
		_ = file.Close()
	}
	fmt.Fprintln(os.Stderr, "sandbox did not refuse the protected write:", err)
	return 125
}

func sandboxCheck() int {
	folder, err := os.MkdirTemp("", "journal-shell-check-")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 125
	}
	defer os.RemoveAll(folder)
	program, err := os.Executable()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 125
	}
	sandbox, err := checkedSandbox(program, []string{folder}, readLimit{})
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 125
	}
	fmt.Println(sandbox.Level)
	return 0
}

func runSandbox(options Options, folder Folder) (shellSandbox, error) {
	temporary := filepath.Join(folder.Path, "tmp")
	if err := os.MkdirAll(temporary, 0o700); err != nil {
		return shellSandbox{}, err
	}
	program, err := os.Executable()
	if err != nil {
		return shellSandbox{}, err
	}
	writable := []string{folder.Path, temporary}
	if options.WriteFolder == "" {
		return checkedSandbox(program, writable, readLimit{})
	}
	worker, err := workerFolders(options.WriteFolder, options.Home)
	if err != nil {
		return shellSandbox{}, err
	}
	limit, err := workerReadLimit(options.WriteFolder, options.Home, options.ReadFolders)
	if err != nil {
		return shellSandbox{}, err
	}
	return checkedSandbox(program, append(writable, worker...), limit)
}
