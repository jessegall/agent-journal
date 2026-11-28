// Command journal-terminal runs the main session of a connected project in its owner's terminal.
package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"golang.org/x/term"

	"journal-runner/client"
	"journal-runner/device"
	"journal-runner/hookadapter"
	"journal-runner/hostapi"
	"journal-runner/localsession"
	"journal-runner/project"
	"journal-runner/terminal"
	"journal-runner/upgrade"
)

var developmentCommand func([]string) error

var errStartUsage = errors.New("usage: journal-terminal <driver> [<arguments of the program>]")

func main() {
	os.Exit(run(os.Args[1:], os.Stdin, os.Stdout, os.Stderr))
}

func run(arguments []string, input *os.File, stdout, stderr io.Writer) int {
	if len(arguments) == 0 {
		fmt.Fprintln(stderr, errStartUsage)
		fmt.Fprintln(stderr, "       journal-terminal <annotate|screen|render> <folder>")
		return 2
	}
	if developmentCommand != nil && arguments[0] == "mock" {
		if err := developmentCommand(arguments[1:]); err != nil {
			fmt.Fprintln(stderr, "journal-terminal:", err)
			return 1
		}
		return 0
	}
	if tool, found := recordingTools[arguments[0]]; found {
		if len(arguments) != 2 {
			fmt.Fprintf(stderr, "usage: journal-terminal %s <folder>\n", arguments[0])
			return 2
		}
		if err := tool(arguments[1], stdout); err != nil {
			fmt.Fprintln(stderr, "journal-terminal:", err)
			return 1
		}
		return 0
	}
	flags := flag.NewFlagSet("journal-terminal", flag.ContinueOnError)
	flags.SetOutput(stderr)
	stateFolder := flags.String("state", device.DefaultStateFolder(), "the connected machine's private state")
	model := flags.String("model", "default", "the session model")
	effort := flags.String("effort", "", "the session effort")
	if err := flags.Parse(arguments); err != nil {
		return 2
	}
	if flags.NArg() == 0 {
		fmt.Fprintln(stderr, errStartUsage)
		return 2
	}
	folder, err := os.Getwd()
	if err != nil {
		fmt.Fprintln(stderr, "journal-terminal:", err)
		return 1
	}
	found, binding, state, err := project.ResolveConnected(folder, *stateFolder, upgrade.WakeRelay)
	if err != nil {
		fmt.Fprintln(stderr, "journal-terminal:", err)
		return 1
	}
	code, err := start(flags.Args(), input, stdout, stderr, found, binding, state, client.BindingRuntimeRequest{
		Model: *model, Effort: *effort,
	})
	if err != nil {
		fmt.Fprintln(stderr, "journal-terminal:", err)
		return 1
	}
	return code
}

func start(
	arguments []string,
	input *os.File,
	stdout, stderr io.Writer,
	folder project.Folder,
	binding device.Binding,
	state device.ConnectionState,
	request client.BindingRuntimeRequest,
) (int, error) {
	size, err := windowSize(input)
	if err != nil {
		return 1, err
	}
	installation, err := device.OwnInstallation()
	if err != nil {
		return 1, err
	}
	sealed, err := hostapi.LoadAllowedPrograms(state.Folder, filepath.Base(installation))
	if err != nil {
		return 1, err
	}
	driver := arguments[0]
	if driver == "claude" {
		driver = "claude-code"
	}
	journal := client.ForRemoteProject(binding.Enrollment, &http.Client{Timeout: 30 * time.Second})
	request.RootID = binding.RootID
	request.Folder = folder.Root
	request.AgentID = binding.MainAgentID
	request.Driver = driver
	request.Profile = "main-agent"
	opened, err := openMainRuntime(journal, state, request, binding.BindingID)
	if err != nil {
		return 1, err
	}
	defer confirmStop(journal, state, binding.BindingID, opened.RuntimeID, stderr)
	plan, err := hostapi.ReadWirePayload[hostapi.OpenPlan](opened.Plan)
	if err != nil {
		return 1, fmt.Errorf("the journal sent an invalid terminal plan: %w", err)
	}
	if plan.Type != "terminal" || plan.Container != nil {
		return 1, errors.New("the journal did not send a local terminal plan")
	}
	plan.Size = size
	session := localsession.Session{
		Root: folder.Root, RuntimeID: opened.RuntimeID, SessionID: opened.SessionID, Installation: installation,
		JournalURL: binding.JournalURL, Programs: sealed.Programs, Plan: plan,
	}
	prepared, err := session.Prepare(arguments[1:])
	if err != nil {
		return 1, err
	}
	grant, granted := client.StartGrantFrom(environmentOf(prepared.Command.Env))
	if !granted {
		return 1, hookadapter.ErrNoGrant
	}
	gate, err := hookadapter.Listen(session.RunFolder())
	if err != nil {
		return 1, err
	}
	defer gate.Close()
	go hookadapter.Serve(gate, forwardHooks(grant))

	kept := localsession.KeptFiles{StateFolder: state.Folder, BindingID: binding.BindingID}
	if len(prepared.KeptFiles) > 0 && !kept.HoldsAny() {
		fmt.Fprintln(stderr, "journal-terminal: sign in inside this session to keep the sign-in with this project.")
	}
	if err := kept.Provide(prepared.KeptFiles); err != nil {
		return 1, err
	}
	defer func() {
		if err := kept.Keep(prepared.KeptFiles); err != nil {
			fmt.Fprintln(stderr, "journal-terminal: the sign-in was not kept:", err)
		}
	}()
	relay, err := listenTerminal(device.RelayFolder(state.Folder, binding.BindingID), opened.ProcessID)
	if err != nil {
		return 1, err
	}
	defer relay.Close()

	raw, err := term.MakeRaw(int(input.Fd()))
	if err != nil {
		return 1, err
	}
	defer term.Restore(int(input.Fd()), raw)
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGHUP, syscall.SIGINT)
	defer stop()

	running, err := terminal.Start(prepared.Command, plan, stdout, relay.post)
	if err != nil {
		return 1, err
	}
	go relay.Serve(running, opened.ProcessID, size)
	go superviseSession(ctx, journal, binding.BindingID, opened, gate, running, stderr)
	go watchWindow(running, input)
	go func() { _, _ = io.Copy(running, input) }()

	select {
	case <-running.Done():
	case <-ctx.Done():
		_ = gate.Close()
		if _, err := running.Stop(stopPlan()); err != nil {
			return 1, err
		}
	}
	exit := running.Wait()
	relay.waitForExit()
	return exit.Code, nil
}

func environmentOf(environment []string) func(string) (string, bool) {
	values := make(map[string]string, len(environment))
	for _, entry := range environment {
		if name, value, named := strings.Cut(entry, "="); named {
			values[name] = value
		}
	}
	return func(name string) (string, bool) {
		value, found := values[name]
		return value, found
	}
}

func forwardHooks(grant client.StartGrant) func(context.Context, string, []byte) (hookadapter.Reply, error) {
	return func(ctx context.Context, driver string, native []byte) (hookadapter.Reply, error) {
		return hookadapter.AskJournal(grant, driver, firstProcessGeneration)(ctx, native)
	}
}

func windowSize(input *os.File) (hostapi.TerminalSize, error) {
	columns, rows, err := term.GetSize(int(input.Fd()))
	if err != nil {
		return hostapi.TerminalSize{}, fmt.Errorf("the session needs a terminal window: %w", err)
	}
	if rows < 1 || columns < 1 {
		return hostapi.TerminalSize{}, errors.New("the terminal window has no size")
	}
	return hostapi.TerminalSize{Rows: uint16(rows), Columns: uint16(columns)}, nil
}

func watchWindow(session *terminal.Session, input *os.File) {
	changes := make(chan os.Signal, 1)
	signal.Notify(changes, syscall.SIGWINCH)
	defer signal.Stop(changes)
	for {
		select {
		case <-session.Done():
			return
		case <-changes:
			if size, err := windowSize(input); err == nil {
				_, _ = session.Resize(size)
			}
		}
	}
}
