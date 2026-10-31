package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

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
	journal := launchJournal()
	terminal := launch.NewConsoleTerminal()
	restore := terminal.Raw()
	choice, err := launch.Boot(journal, terminal, request)
	restore()
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	_ = launch.SaveAnswers(home, choice.Answers)
	if request.Program == "codex" {
		if trust, err := journal.Run("codex", "hook-trust", choice.Folder); err == nil {
			if line := launch.HookTrustLine(strings.TrimSpace(trust)); line != "" {
				fmt.Fprintln(stderr, line)
			}
		}
	}
	if listener, err := launch.Listen(socket.NamedPath(home, "launcher"), launch.ProcessStarter{Home: home}); err == nil {
		defer listener.Close()
	}
	launchName := "launch-" + strconv.FormatInt(time.Now().UnixNano(), 36)
	agentID, err := journal.StartAgent(choice.Environment, request.Program, launchName)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	log, err := launch.OpenTerminalLog(launch.TerminalFile(home, agentID))
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	defer log.Close()
	command := exec.Command(request.Program, launch.ProgramArguments(request.Program, choice)...)
	command.Dir = choice.Folder
	command.Env = append(os.Environ(), "JOURNAL_LAUNCH="+launchName)
	for name, value := range choice.Variables {
		command.Env = append(command.Env, name+"="+value)
	}
	restoreProgram := terminal.Raw()
	err = launch.RunInTerminal(command, os.Stdin, stdout, log)
	restoreProgram()
	if err != nil {
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

// launchJournal reads the journal for the launcher through this client's own command lines.
func launchJournal() launch.CommandJournal {
	return launch.CommandJournal{Run: func(line ...string) (string, error) {
		var output, errorOutput bytes.Buffer
		if code := Run(timing.Started(), line, &output, &errorOutput); code != SuccessCode {
			return output.String(), fmt.Errorf("journal %s: %s", strings.Join(line, " "), strings.TrimSpace(output.String()+errorOutput.String()))
		}
		return output.String(), nil
	}}
}
