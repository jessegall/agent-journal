// Command journal-agent is the journal's host for agent programs. For now it records evidence sessions.
package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"sort"
	"strings"
	"syscall"
	"time"

	"github.com/creack/pty"
	"golang.org/x/term"

	"journal-agent/profiles"
	"journal-agent/profiles/contracts"
	"journal-agent/recording"
)

// profileFor is the pinned launch profile of each program.
var profileFor = map[string]contracts.ProgramProfile{"claude": profiles.ClaudeCode{}}

// secretToggle is the key (Ctrl-]) that turns secret marking of typed input on and off; it is never forwarded.
const secretToggle = 0x1d

func main() {
	if len(os.Args) < 2 || os.Args[1] != "record" {
		fmt.Fprintln(os.Stderr, "usage: journal-agent record --program <claude|codex> --mode <process|terminal> --out <dir> -- <args>")
		os.Exit(2)
	}

	exitCode, err := record(os.Args[2:])
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-agent:", err)
		os.Exit(1)
	}

	os.Exit(exitCode)
}

// record runs the program once, forwards the person's keys and resizes, and writes the session as a fixture.
func record(arguments []string) (int, error) {
	flags := flag.NewFlagSet("record", flag.ContinueOnError)
	program := flags.String("program", "", "the agent program: claude or codex")
	mode := flags.String("mode", "", "process or terminal")
	out := flags.String("out", "", "the recording folder")
	useProfile := flags.Bool("use-profile", false, "launch the program through its pinned profile; the words after -- are the prompt")
	sessionID := flags.String("session", "", "with --use-profile: the exact session ID to start, or to resume with --resume")
	resume := flags.Bool("resume", false, "with --use-profile: resume the session given by --session")
	stopAfter := flags.Duration("stop-after", 0, "end the program this long after its start, for unattended terminal recordings")

	if err := flags.Parse(arguments); err != nil {
		return 2, err
	}

	command := flags.Args()
	if *program != "claude" && *program != "codex" {
		return 2, errors.New("--program must be claude or codex")
	}
	if *out == "" || len(command) == 0 {
		return 2, errors.New("--out and a command after -- are required")
	}

	profileName := ""
	environment := os.Environ()
	if *useProfile {
		profile, known := profileFor[*program]
		if !known {
			return 2, fmt.Errorf("no pinned profile for %s yet", *program)
		}
		launched, err := profiledCommand(profile, contracts.Mode(*mode), *out, *sessionID, *resume, strings.Join(command, " "))
		if err != nil {
			return 2, err
		}
		command = launched
		environment = profile.Environment(environment)
		profileName = profile.Program() + "@" + profile.Build()
	}

	recorder := recording.NewRecorder(recording.Fixture{
		Program:        *program,
		ProgramVersion: programVersion(command[0]),
		Profile:        profileName,
		Mode:           recording.Mode(*mode),
		InitialState:   initialState(command),
	}, time.Now)

	var exitCode int
	var err error

	switch recording.Mode(*mode) {
	case recording.ProcessMode:
		exitCode, err = runProcess(command, environment, recorder)
	case recording.TerminalMode:
		exitCode, err = runTerminal(command, environment, *stopAfter, recorder)
	default:
		return 2, errors.New("--mode must be process or terminal")
	}

	if err != nil {
		return 1, err
	}

	return exitCode, recorder.Finish(exitCode).Save(*out)
}

// runProcess runs the program as a plain child with pipes, in its own process group.
func runProcess(command []string, environment []string, recorder *recording.Recorder) (int, error) {
	child := exec.Command(command[0], command[1:]...)
	child.Env = environment
	child.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	child.Stdin = &inputTee{source: os.Stdin, recorder: recorder}
	child.Stdout = &outputTee{stream: "stdout", sink: os.Stdout, recorder: recorder}
	child.Stderr = &outputTee{stream: "stderr", sink: os.Stderr, recorder: recorder}

	return exitCodeOf(child.Run())
}

// runTerminal runs the program in a pseudo-terminal of the person's size, in its own session, and passes the
// person's keys and resizes through.
func runTerminal(command []string, environment []string, stopAfter time.Duration, recorder *recording.Recorder) (int, error) {
	child := exec.Command(command[0], command[1:]...)
	child.Env = environment

	terminal, err := pty.StartWithSize(child, &pty.Winsize{Cols: 120, Rows: 40})
	if err != nil {
		return 1, fmt.Errorf("starting %s in a terminal: %w", command[0], err)
	}
	defer terminal.Close()

	if stopAfter > 0 {
		timer := time.AfterFunc(stopAfter, func() { child.Process.Signal(syscall.SIGTERM) })
		defer timer.Stop()
	}

	resizes := make(chan os.Signal, 1)
	signal.Notify(resizes, syscall.SIGWINCH)
	defer signal.Stop(resizes)
	go followResizes(resizes, terminal, recorder)
	resizes <- syscall.SIGWINCH

	if term.IsTerminal(int(os.Stdin.Fd())) {
		previous, err := term.MakeRaw(int(os.Stdin.Fd()))
		if err == nil {
			defer term.Restore(int(os.Stdin.Fd()), previous)
		}
	}

	go io.Copy(terminal, &inputTee{source: os.Stdin, recorder: recorder})
	io.Copy(&outputTee{stream: "terminal", sink: os.Stdout, recorder: recorder}, terminal)

	return exitCodeOf(child.Wait())
}

// followResizes copies the person's terminal size onto the program's terminal and records each change.
func followResizes(resizes <-chan os.Signal, terminal *os.File, recorder *recording.Recorder) {
	for range resizes {
		columns, rows, err := term.GetSize(int(os.Stdin.Fd()))
		if err != nil {
			continue
		}

		pty.Setsize(terminal, &pty.Winsize{Cols: uint16(columns), Rows: uint16(rows)})
		recorder.Resize(recording.Geometry{Columns: uint16(columns), Rows: uint16(rows)})
	}
}

// inputTee passes typed input on and records it; Ctrl-] switches secret marking, so a password is never written.
type inputTee struct {
	source   io.Reader
	recorder *recording.Recorder
	secret   bool
}

func (tee *inputTee) Read(buffer []byte) (int, error) {
	count, err := tee.source.Read(buffer)
	kept := buffer[:0]

	for _, key := range buffer[:count] {
		if key == secretToggle {
			tee.secret = !tee.secret
			continue
		}
		kept = append(kept, key)
	}

	if len(kept) > 0 {
		tee.recorder.Input(kept, tee.secret)
	}

	return len(kept), err
}

// outputTee shows the program's output to the person and records it.
type outputTee struct {
	stream   string
	sink     io.Writer
	recorder *recording.Recorder
}

func (tee *outputTee) Write(bytes []byte) (int, error) {
	tee.recorder.Output(tee.stream, bytes)

	return tee.sink.Write(bytes)
}

// initialState is the redacted start: the working folder, the arguments and only the names of the environment.
func initialState(command []string) recording.InitialState {
	folder, _ := os.Getwd()
	names := make([]string, 0, len(os.Environ()))

	for _, entry := range os.Environ() {
		names = append(names, strings.SplitN(entry, "=", 2)[0])
	}
	sort.Strings(names)

	return recording.InitialState{WorkingFolder: folder, Arguments: command, EnvironmentNames: names}
}

// programVersion asks the program for its version, the first line of --version.
func programVersion(program string) string {
	printed, err := exec.Command(program, "--version").Output()
	if err != nil {
		return "unknown"
	}

	return strings.TrimSpace(strings.SplitN(string(printed), "\n", 2)[0])
}

func exitCodeOf(err error) (int, error) {
	var exit *exec.ExitError
	if errors.As(err, &exit) {
		return exit.ExitCode(), nil
	}
	if err != nil {
		return 1, err
	}

	return 0, nil
}

// profiledCommand builds the launch of a program through its pinned profile: it refuses another build, writes the
// isolated settings file into the recording folder and gives the full command line.
func profiledCommand(profile contracts.ProgramProfile, mode contracts.Mode, out, sessionID string, resume bool, prompt string) ([]string, error) {
	if err := profile.CheckBuild(programVersion(profile.Program())); err != nil {
		return nil, err
	}

	settings, err := profile.SettingsFile()
	if err != nil {
		return nil, err
	}

	settingsFolder, err := filepath.Abs(filepath.Join(out, "settings"))
	if err != nil {
		return nil, err
	}
	if err := os.MkdirAll(settingsFolder, 0o755); err != nil {
		return nil, err
	}
	if err := os.WriteFile(filepath.Join(settingsFolder, "settings.json"), settings, 0o644); err != nil {
		return nil, err
	}

	arguments, err := profile.Arguments(contracts.Launch{Mode: mode, SettingsFolder: settingsFolder, SessionID: sessionID, Resume: resume, Prompt: prompt})
	if err != nil {
		return nil, err
	}

	return append([]string{profile.Program()}, arguments...), nil
}
