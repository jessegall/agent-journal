package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
	"github.com/jessegall/agent-journal/tools/journal/launch"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// LaunchProgram is `journal launch <program> [--worktree [name]] [program arguments]`: the boot menu, then the program
// in the chosen environment's folder, with the launcher's socket open for the workers its session dispatches. Arguments
// other than the worktree's go to the program, over the journal's own defaults.
func LaunchProgram(home string, argv []string, stdout, stderr io.Writer) int {
	binary := filepath.Join(home, "bin", "journal")
	version, versionErr := launch.ReadBinaryVersion(binary)
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
	if errors.Is(err, launch.ErrLeftRunning) || errors.Is(err, launch.ErrLeft) {
		fmt.Fprintln(stdout, err)
		return 0
	}
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	_ = launch.SaveAnswers(home, choice.Answers)
	prepareProgramHooks(journal, request.Program, choice.Folder, stderr)
	inputs := launch.NewTerminalInputs()
	inputs.OnLogin(journal.TellInterrupt)
	if listener, err := launch.ListenVersioned(socket.NamedPath(home, "launcher"), launch.ProcessStarter{Home: home, Inputs: inputs, OnAnswer: journal.TellMenuAnswer, OnExit: programExitReporter(journal, inputs), OnInterrupt: journal.TellInterrupt}, inputs, version.Digest); err == nil {
		defer listener.Close()
		defer inputs.StopAll()
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
	labels := launch.BandLabels{Project: filepath.Base(request.Root), Environment: choice.Environment, Address: "viewer link unavailable"}
	if link, err := journal.Run("viewer"); err == nil {
		link = strings.TrimSpace(link)
		labels.Address = launch.DisplayAddress(link)
		if line := launch.OpenViewer(link, launch.StartDetached); line != "" {
			fmt.Fprintln(stderr, line)
		}
	} else {
		fmt.Fprintln(stderr, "the viewer link could not be asked: "+err.Error())
	}
	programCommand, err := journal.ProgramCommand(request, choice, launchName)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	command := programExec(programCommand, choice, launchName, os.Environ())
	watcher := launch.NewMenuWatcher(inputs, agentID, func(question, explanation string) { journal.TellMenuAnswer(agentID, question, explanation) })
	stopWatching := make(chan struct{})
	defer close(stopWatching)
	go watcher.Watch(stopWatching)
	restoreProgram := terminal.Raw()
	programLog := io.MultiWriter(log, watcher, &launch.InterruptWatcher{OnInterrupt: func() { journal.TellInterrupt(agentID) }})
	stopReplacement := make(chan struct{})
	defer close(stopReplacement)
	err = runMainProgram(inputs, agentID, command, os.Stdin, func(input io.Reader, started func()) error {
		track := func() {
			started()
			if versionErr == nil {
				go watchLauncher(home, binary, version, stopReplacement, stderr)
			}
		}
		if launch.ShowsBand() {
			return launch.RunBelowBand(launch.NewBand(stdout, labels), command, input, programLog, track)
		}
		fmt.Fprintln(stdout, launch.HeaderBar(choice.Environment, agentID, labels.Address))
		return launch.RunInTerminal(command, input, stdout, programLog, track)
	})
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

// runMainProgram runs the launch's own program under its agent row, kept in the inputs once it has started so a stop on
// the launcher's socket reaches it, and takes it out when it ends.
func runMainProgram(inputs *launch.TerminalInputs, agentID int, command *exec.Cmd, keyboard io.Reader, run func(input io.Reader, started func()) error) error {
	defer inputs.Close(agentID)
	return run(inputs.Open(agentID, keyboard), func() { inputs.Track(agentID, command) })
}

func prepareProgramHooks(journal launch.CommandJournal, program, folder string, stderr io.Writer) {
	_, _ = journal.Run("program", "manage", program, folder)
	if trust, err := journal.Run("program", "trust", program, folder); err == nil {
		if line := launch.HookTrustLine(strings.TrimSpace(trust)); line != "" {
			fmt.Fprintln(stderr, line)
		}
	}
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
			request.ProgramArguments = append(request.ProgramArguments, argv[index])
			continue
		}
		request.WorktreeGiven = true
		if index+1 < len(argv) && !strings.HasPrefix(argv[index+1], "-") {
			request.Worktree = argv[index+1]
			index++
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

// programExitReporter says how a program ended, and whether the launch ending is why.
func programExitReporter(journal launch.CommandJournal, inputs *launch.TerminalInputs) func(agentID, exitCode, pid int) {
	return func(agentID, exitCode, pid int) {
		if inputs.IsClosing() {
			journal.TellLaunchEnded(agentID, exitCode, pid)
			return
		}
		journal.TellProgramExit(agentID, exitCode, pid)
	}
}

// ProgramNames are the programs a person starts with journal <program>, as version 4 did, beside journal launch <program>.
var ProgramNames = []string{launch.ClaudeProgram, "codex"}

// IsProgramName says whether the first word names a program to start.
func IsProgramName(word string) bool {
	for _, name := range ProgramNames {
		if word == name {
			return true
		}
	}
	return false
}

// programExec builds the program's process: the launcher's environment, then the launch name, the choice's variables
// and last the journal's own, so the journal's CODEX_HOME wins over one the person exported.
func programExec(programCommand launch.ProgramCommand, choice launch.Choice, launchName string, environment []string) *exec.Cmd {
	command := exec.Command(programCommand.Arguments[0], programCommand.Arguments[1:]...)
	command.Dir = choice.Folder
	command.Env = append(environment, "JOURNAL_LAUNCH="+launchName)
	for name, value := range choice.Variables {
		command.Env = append(command.Env, name+"="+value)
	}
	for name, value := range programCommand.Variables {
		command.Env = append(command.Env, name+"="+value)
	}
	return command
}
