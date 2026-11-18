// Command journal-agent is the journal's host for agent programs. For now it records evidence sessions.
package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/creack/pty"
	"golang.org/x/term"

	"journal-agent/profiles"
	"journal-agent/profiles/contracts"
	"journal-agent/recording"
	"journal-agent/screen"
)

// profileFor is the pinned launch profile of each program.
var profileFor = map[string]contracts.ProgramProfile{"claude": profiles.ClaudeCode{}, "codex": profiles.Codex{}}

// secretToggle is the key (Ctrl-]) that turns secret marking of typed input on and off; it is never forwarded.
const secretToggle = 0x1d

func main() {
	if len(os.Args) == 3 && os.Args[1] == "capture-hook" {
		if err := captureHook(os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

	if len(os.Args) == 3 && os.Args[1] == "annotate" {
		if err := annotate(os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

	if len(os.Args) == 3 && os.Args[1] == "screen" {
		if err := printScreen(os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

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
	folder := flags.String("folder", "", "the working folder the program starts in; an empty folder keeps project instructions out of evidence")
	captureHooks := flags.Bool("capture-hooks", false, "with --use-profile: install a hook on every native event that appends its payload to hooks.jsonl in the recording folder")
	var keys keyScript
	flags.Var(&keys, "keys", "in terminal mode, keys to type after a delay, as <delay>=<keys> (Go escapes such as \\x1b or \\r work); repeat it")
	stopAfter := flags.Duration("stop-after", 0, "end the program this long after its start, for unattended terminal recordings")

	if err := flags.Parse(arguments); err != nil {
		return 2, err
	}

	command := flags.Args()
	if *program != "claude" && *program != "codex" {
		return 2, errors.New("--program must be claude or codex")
	}
	if *folder != "" {
		if err := os.Chdir(*folder); err != nil {
			return 2, fmt.Errorf("entering the working folder %s: %w", *folder, err)
		}
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
		hookCommand := ""
		if *captureHooks {
			self, err := os.Executable()
			if err != nil {
				return 2, err
			}
			capture, err := filepath.Abs(filepath.Join(*out, "hooks.jsonl"))
			if err != nil {
				return 2, err
			}
			hookCommand = self + " capture-hook " + capture
		}
		launched, launch, err := profiledCommand(profile, contracts.Mode(*mode), *out, *sessionID, *resume, strings.Join(command, " "), hookCommand)
		if err != nil {
			return 2, err
		}
		command = launched
		environment = profile.Environment(environment, launch)
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
		exitCode, err = runTerminal(command, environment, *stopAfter, keys, recorder)
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
func runTerminal(command []string, environment []string, stopAfter time.Duration, keys keyScript, recorder *recording.Recorder) (int, error) {
	child := exec.Command(command[0], command[1:]...)
	child.Env = environment

	terminal, err := pty.StartWithSize(child, &pty.Winsize{Cols: 120, Rows: 40})
	if err != nil {
		return 1, fmt.Errorf("starting %s in a terminal: %w", command[0], err)
	}
	defer terminal.Close()

	if stopAfter > 0 {
		timer := time.AfterFunc(stopAfter, func() {
			recorder.Input([]byte("<SIGTERM>"), false)
			child.Process.Signal(syscall.SIGTERM)
		})
		defer timer.Stop()
	}

	for _, step := range keys {
		timer := time.AfterFunc(step.after, func() {
			recorder.Input(step.keys, false)
			terminal.Write(step.keys)
		})
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
// isolated settings files into the recording folder and gives the full command line with the launch it made.
func profiledCommand(profile contracts.ProgramProfile, mode contracts.Mode, out, sessionID string, resume bool, prompt, hookCommand string) ([]string, contracts.Launch, error) {
	launch := contracts.Launch{Mode: mode, SessionID: sessionID, Resume: resume, Prompt: prompt, HookCommand: hookCommand}

	if err := profile.CheckBuild(programVersion(profile.Program())); err != nil {
		return nil, launch, err
	}

	settingsFolder, err := filepath.Abs(filepath.Join(out, "settings"))
	if err != nil {
		return nil, launch, err
	}
	launch.SettingsFolder = settingsFolder

	files, err := profile.SettingsFiles(launch)
	if err != nil {
		return nil, launch, err
	}
	if err := os.MkdirAll(launch.SettingsFolder, 0o755); err != nil {
		return nil, launch, err
	}
	for _, file := range files {
		if err := writeSettingsFile(launch.SettingsFolder, file); err != nil {
			return nil, launch, err
		}
	}

	arguments, err := profile.Arguments(launch)
	if err != nil {
		return nil, launch, err
	}

	return append([]string{profile.Program()}, arguments...), launch, nil
}

// writeSettingsFile writes one isolated settings file, or links it when it is a login the person already holds.
func writeSettingsFile(folder string, file contracts.SettingsFile) error {
	path := filepath.Join(folder, file.Name)

	if file.LinkTo == "" {
		return os.WriteFile(path, file.Content, 0o644)
	}

	os.Remove(path)

	return os.Symlink(file.LinkTo, path)
}

// captureHook appends one hook payload, with the time it arrived, to the capture file and answers the program with
// an empty object, so the hook neither allows nor denies anything.
func captureHook(capture string) error {
	payload, err := io.ReadAll(os.Stdin)
	if err != nil {
		return err
	}

	file, err := os.OpenFile(capture, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	defer file.Close()

	line, err := json.Marshal(map[string]any{"at": time.Now().UTC().Format(time.RFC3339Nano), "payload": json.RawMessage(strings.TrimSpace(string(payload)))})
	if err != nil {
		return err
	}
	if _, err := file.Write(append(line, '\n')); err != nil {
		return err
	}

	fmt.Print("{}")

	return nil
}

// keyStep is keys typed into the terminal after a delay from the start.
type keyStep struct {
	after time.Duration
	keys  []byte
}

// keyScript is the --keys flag: the keys an unattended terminal recording types, in order of their delays.
type keyScript []keyStep

func (script *keyScript) String() string {
	return fmt.Sprint(len(*script), " key steps")
}

func (script *keyScript) Set(value string) error {
	delay, keys, found := strings.Cut(value, "=")
	if !found {
		return errors.New("a key step is <delay>=<keys>")
	}

	after, err := time.ParseDuration(delay)
	if err != nil {
		return err
	}

	unquoted, err := strconv.Unquote(`"` + keys + `"`)
	if err != nil {
		return fmt.Errorf("the keys %q: %w", keys, err)
	}

	*script = append(*script, keyStep{after: after, keys: []byte(unquoted)})

	return nil
}

// printScreen replays a terminal recording through the screen reader and prints the screen it ends on.
func printScreen(folder string) error {
	fixture, err := recording.Load(folder)
	if err != nil {
		return err
	}

	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, nil)
	if err != nil {
		return err
	}
	for _, chunk := range fixture.Output {
		if err := reader.Feed(chunk.Bytes); err != nil {
			return err
		}
	}

	snapshot := reader.Snapshot()
	for _, row := range snapshot.Rows {
		fmt.Println(row)
	}
	fmt.Printf("-- cursor %d,%d visible %v, %s buffer, exit %d\n", snapshot.Cursor.Row, snapshot.Cursor.Column, snapshot.Cursor.Visible, snapshot.Buffer, fixture.ExitCode)

	return nil
}

// settleTime is how long after a key a screen checkpoint is read, so the program has drawn its answer.
const settleTime = 1500 * time.Millisecond

// annotate replays a terminal recording through the screen reader and stores, after each typed input, the screen
// it settled on as a checkpoint of the fixture: the evidence of what each key did.
func annotate(folder string) error {
	fixture, err := recording.Load(folder)
	if err != nil {
		return err
	}

	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, nil)
	if err != nil {
		return err
	}

	fixture.Checkpoints = nil
	next := 0
	for _, input := range fixture.Inputs {
		until := input.Offset + settleTime
		for ; next < len(fixture.Output) && fixture.Output[next].Offset <= until; next++ {
			if err := reader.Feed(fixture.Output[next].Bytes); err != nil {
				return err
			}
		}

		snapshot := reader.Snapshot()
		fixture.Checkpoints = append(fixture.Checkpoints, recording.ScreenCheckpoint{
			Offset:       until,
			Rows:         snapshot.Rows,
			CursorRow:    snapshot.Cursor.Row,
			CursorColumn: snapshot.Cursor.Column,
		})
	}

	return fixture.Save(folder)
}
