package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
	"github.com/jessegall/agent-journal/tools/journal/launch"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// LaunchProgram is `journal launch <program> [--worktree [name]]`: the boot menu, then the program in the chosen
// environment's folder, with the launcher's socket open for the workers its session dispatches.
func LaunchProgram(home string, argv []string, stdout, stderr io.Writer) int {
	request, err := launchRequest(argv)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return UsageCode
	}
	request.Answers = launch.LoadAnswers(home)
	journal := launch.CommandJournal{Run: func(line ...string) (string, error) {
		var output, errorOutput bytes.Buffer
		if code := Run(timing.Started(), line, &output, &errorOutput); code != SuccessCode {
			return output.String(), fmt.Errorf("journal %s: %s", strings.Join(line, " "), strings.TrimSpace(output.String()+errorOutput.String()))
		}
		return output.String(), nil
	}}
	terminal := launch.NewConsoleTerminal()
	restore := terminal.Raw()
	choice, err := launch.Boot(journal, terminal, request)
	restore()
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	_ = launch.SaveAnswers(home, choice.Answers)
	if listener, err := launch.Listen(socket.NamedPath(home, "launcher"), launch.ProcessStarter{}); err == nil {
		defer listener.Close()
	}
	command := exec.Command(request.Program, launch.ProgramArguments(request.Program, choice)...)
	command.Dir, command.Stdin, command.Stdout, command.Stderr = choice.Folder, os.Stdin, stdout, stderr
	command.Env = os.Environ()
	for name, value := range choice.Variables {
		command.Env = append(command.Env, name+"="+value)
	}
	if err := command.Run(); err != nil {
		var exit *exec.ExitError
		if errors.As(err, &exit) {
			return exit.ExitCode()
		}
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	return SuccessCode
}

func launchRequest(argv []string) (launch.Request, error) {
	if len(argv) == 0 {
		return launch.Request{}, fmt.Errorf("usage: journal launch <claude or codex> [--worktree [name]]")
	}
	folder := WorkingFolder()
	root, err := launch.ProjectRoot(folder)
	if err != nil {
		root = folder
	}
	request := launch.Request{Program: argv[0], Root: root}
	for index := 1; index < len(argv); index++ {
		if argv[index] != "--worktree" && argv[index] != "-w" {
			continue
		}
		request.WorktreeGiven = true
		if index+1 < len(argv) && !strings.HasPrefix(argv[index+1], "-") {
			request.Worktree = argv[index+1]
		}
	}
	return request, nil
}
