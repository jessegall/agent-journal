// Command journal is the journal command of a machine connected to a server journal. It finds the connected folder
// it runs in, keeps that folder's relay running, answers status itself and runs every other verb on the server.
package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"
	"syscall"
	"time"

	"journal-agent/client"
	"journal-agent/diagnostics"
	"journal-agent/hookadapter"
	"journal-agent/host"
	"journal-agent/lease"
	"journal-agent/localsession"
	"journal-agent/profiles"
	"journal-agent/project"
	"journal-agent/userservice"
)

// localVerbs are the verbs this machine answers itself; every other verb runs on the server.
var localVerbs = []string{
	"status", "claude", "codex", "logout", "service", "disconnect", "attach", "upgrade", "diagnostics", "terminal",
}

// errVerbLater refuses a local verb this connected machine does not run yet.
var errVerbLater = errors.New("this verb arrives with the next release")

func main() {
	folder, err := os.Getwd()
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal:", err)
		os.Exit(1)
	}
	commands := dispatcher{
		stateFolder: host.DefaultStateFolder(),
		wake:        wakeRelay,
		grant:       func(host.Binding) (client.StartGrant, bool) { return client.StartGrantFrom(os.LookupEnv) },
		transport:   &http.Client{},
		approval:    deviceApproval,
		terminal:    os.Getenv(host.TerminalSelectorVariable),
		disableService: func(binding host.Binding) error {
			home, _ := os.UserHomeDir()
			return userservice.Service{Home: home, BindingID: binding.BindingID, StateFolder: host.DefaultStateFolder()}.Disable()
		},
	}
	os.Exit(commands.run(os.Args[1:], folder, standardInput(), os.Stdout, os.Stderr))
}

// dispatcher resolves the connected folder of each invocation and its binding; one dispatcher serves every
// connected folder of the machine.
type dispatcher struct {
	stateFolder string
	wake        func(stateFolder string, bindingID string) error
	grant       func(binding host.Binding) (client.StartGrant, bool)
	transport   *http.Client
	approval    func(binding host.Binding, state host.ConnectionState, selector string, stderr io.Writer) (host.TerminalSignIn, error)
	// terminal is the selector of this shell's sign-in, from journal terminal open; none outside such a shell.
	terminal string
	// disableService stops the user service that keeps the binding's relay running.
	disableService func(binding host.Binding) error
}

// run resolves the folder's binding, wakes its relay when none runs and answers the verb with its exit code.
func (commands dispatcher) run(arguments []string, folder string, stdin []byte, stdout, stderr io.Writer) int {
	found, binding, state, err := commands.resolve(folder)
	if errors.Is(err, project.ErrNotConnected) {
		fmt.Fprintln(stdout, "Not connected: no connected project folder holds "+folder+".")
		return 0
	}
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	if len(arguments) > 0 && slices.Contains(localVerbs, arguments[0]) {
		return commands.local(arguments, binding, state, found, stdout, stderr)
	}

	return commands.forward(arguments, binding, state, stdin, stdout, stderr)
}

// resolve finds the connected folder at or above the folder, its binding on this machine and its private state, and
// wakes the binding's relay when none runs.
func (commands dispatcher) resolve(folder string) (project.Folder, host.Binding, host.ConnectionState, error) {
	found, connection, err := project.Find(folder)
	if err != nil {
		return project.Folder{}, host.Binding{}, host.ConnectionState{}, err
	}

	state, binding, err := host.ConnectionOfBinding(commands.stateFolder, connection.BindingID)
	if errors.Is(err, host.ErrNotConnected) || binding.RootID != connection.RootID {
		return project.Folder{}, host.Binding{}, host.ConnectionState{}, project.ErrNotConnected
	}
	if err != nil {
		return project.Folder{}, host.Binding{}, host.ConnectionState{}, err
	}
	if binding.CanonicalRoot != found.Root {
		return project.Folder{}, host.Binding{}, host.ConnectionState{}, fmt.Errorf(
			"%w: it was connected at %s and is now at %s; connect this folder with a new install line",
			project.ErrRootMoved, binding.CanonicalRoot, found.Root)
	}

	if !state.RelayIsRunning() {
		if err := commands.wake(commands.stateFolder, binding.BindingID); err != nil {
			return project.Folder{}, host.Binding{}, host.ConnectionState{}, err
		}
	}

	return found, binding, state, nil
}

// local answers a verb this machine handles itself.
func (commands dispatcher) local(
	arguments []string,
	binding host.Binding,
	state host.ConnectionState,
	folder project.Folder,
	stdout, stderr io.Writer,
) int {
	verb := arguments[0]
	if verb == "claude" {
		return commands.claude(binding, folder, stderr)
	}
	if verb == "disconnect" {
		return commands.disconnect(arguments[1:], binding, state, folder, stdout, stderr)
	}
	if verb == "service" {
		return commands.service(binding, stdout, stderr)
	}
	if verb == "logout" {
		return commands.logout(binding, stdout, stderr)
	}
	if verb == "diagnostics" {
		return diagnose(binding, state, folder, stdout, stderr)
	}
	if verb == "terminal" {
		return openTerminal(arguments[1:], state, stdout, stderr)
	}
	if verb == "codex" {
		// Local Codex sessions wait for a per-thread callback channel the pinned build does not give.
		fmt.Fprintln(stderr, "journal:", localsession.ErrCodexWithheld)
		return 1
	}
	if verb != "status" {
		fmt.Fprintln(stderr, "journal:", verb+":", errVerbLater)
		return 1
	}

	fmt.Fprintln(stdout, status(binding, state, folder))

	return 0
}

// claude opens the binding's main runtime on the journal and starts its isolated Claude Code session on this
// terminal, from the sealed installation beside this command.
func (commands dispatcher) claude(binding host.Binding, folder project.Folder, stderr io.Writer) int {
	installation, err := ownInstallation()
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	journal := client.ForRemoteProject(binding.Enrollment, &http.Client{Timeout: 30 * time.Second})
	opened, err := journal.OpenBindingRuntime(context.Background(), binding.BindingID, client.BindingRuntimeRequest{
		RootID: binding.RootID, Folder: folder.Root, AgentID: binding.MainAgentID,
		Driver: "claude-code", DriverBuild: profiles.ClaudeCode{}.Build(), Profile: "main-agent",
	})
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	session := localsession.Session{
		Root: folder.Root, RuntimeID: opened.RuntimeID, SessionID: opened.SessionID, Installation: installation,
	}
	command, err := session.Command(os.Args[2:])
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	listener, err := hookadapter.Listen(session.RunFolder())
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	defer listener.Close()
	go hookadapter.Serve(listener, refuseWithoutStartGrant)

	account := localsession.ClaudeAccount{StateFolder: commands.stateFolder, BindingID: binding.BindingID}
	if !account.IsSignedIn() {
		fmt.Fprintln(stderr, "journal: sign in to Claude Code in this session; the sign-in stays with this project only.")
	}
	if err := account.Provide(session.ConfigFolder()); err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	defer func() {
		if err := account.Keep(session.ConfigFolder()); err != nil {
			fmt.Fprintln(stderr, "journal: the sign-in was not kept:", err)
		}
	}()

	command.Stdin, command.Stdout, command.Stderr = os.Stdin, os.Stdout, os.Stderr
	if err := command.Start(); err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	supervision, endSupervision := context.WithCancel(context.Background())
	defer endSupervision()
	go superviseSession(supervision, journal, binding.BindingID, opened, listener, command, stderr)
	if err := command.Wait(); err != nil {
		var exited *exec.ExitError
		if errors.As(err, &exited) {
			return exited.ExitCode()
		}
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	return 0
}

// firstProcessGeneration is the process generation of a runtime the journal just opened.
const firstProcessGeneration = 1

// leaseStopGrace is how long a session whose lease ended has to end its own tools before it is killed.
const leaseStopGrace = 5 * time.Second

// superviseSession keeps the session's execution lease; once it ends, the hook gate closes, so no tool call of the
// session is answered again, and Claude Code is asked to stop, then killed after a grace.
func superviseSession(
	ctx context.Context,
	journal *client.Client,
	bindingID string,
	opened client.OpenedBindingRuntime,
	gate io.Closer,
	command *exec.Cmd,
	stderr io.Writer,
) {
	supervisor := lease.Supervisor{Stop: func() {
		fmt.Fprintln(stderr, "journal: the journal no longer lets this session work, so it stops. Your files stay as they are.")
		gate.Close()
		_ = command.Process.Signal(syscall.SIGTERM)
		time.AfterFunc(leaseStopGrace, func() { _ = command.Process.Kill() })
	}}
	renewal := client.LeaseRenewal{AuthorityGeneration: opened.AuthorityGeneration, RuntimeGeneration: firstProcessGeneration}
	supervisor.Keep(ctx, func(ctx context.Context) (time.Time, time.Time, error) {
		answer, err := journal.RenewLease(ctx, bindingID, opened.RuntimeID, renewal)

		return answer.ServerTime, answer.ExpiresAt, err
	}, lease.RenewEvery)
}

// disconnect removes this folder's connection from this machine once confirmed: its relay and service stop, its
// private credentials and session state go, dirty worktrees stay with their paths printed, and other connected
// folders are untouched. The binding reads offline on the journal; its history stays there.
func (commands dispatcher) disconnect(
	flags []string,
	binding host.Binding,
	state host.ConnectionState,
	folder project.Folder,
	stdout, stderr io.Writer,
) int {
	if !slices.Contains(flags, "--yes") {
		fmt.Fprintln(stdout, "This disconnects "+folder.Root+" from "+binding.JournalURL+
			": its relay stops and this machine forgets its sign-in. Work in progress is kept. Run journal disconnect --yes to go on.")
		return 1
	}

	if err := commands.disableService(binding); err != nil && !errors.Is(err, userservice.ErrNoServiceManager) {
		fmt.Fprintln(stderr, "journal:", err)
	}
	kept, err := folder.Disconnect()
	for _, path := range kept {
		fmt.Fprintln(stdout, "Kept work in progress at "+path)
	}
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	if err := state.Remove(); err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	fmt.Fprintln(stdout, "Disconnected "+folder.Root+".")
	if host.RemainingBindings(commands.stateFolder) > 0 {
		return 0
	}

	kept, err = host.MachineChanges{StateFolder: commands.stateFolder}.Undo()
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	fmt.Fprintln(stdout, "No connected project is left on this machine; the journal's releases and the changes it made to "+
		"your shell are removed.")
	for _, path := range kept {
		fmt.Fprintln(stdout, "Kept "+path+": it changed since the journal set it up, so the journal line in it is yours to remove.")
	}

	return 0
}

// service enables or disables the user service that keeps the binding's relay running.
func (commands dispatcher) service(binding host.Binding, stdout, stderr io.Writer) int {
	installation, err := ownInstallation()
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	home, err := os.UserHomeDir()
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	service := userservice.Service{
		Home: home, BindingID: binding.BindingID, StateFolder: commands.stateFolder,
		Program: filepath.Join(installation, "bin", "journal-agent"),
	}
	action := ""
	if len(os.Args) > 2 {
		action = os.Args[2]
	}
	switch action {
	case "enable":
		err = service.Enable()
	case "disable":
		err = service.Disable()
	default:
		fmt.Fprintln(stderr, "usage: journal service enable|disable")
		return 2
	}
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	fmt.Fprintln(stdout, "The relay of this project is "+action+"d as a user service.")

	return 0
}

// logout ends the binding's Claude Code sign-in generation; the next session starts signed out.
func (commands dispatcher) logout(binding host.Binding, stdout, stderr io.Writer) int {
	account := localsession.ClaudeAccount{StateFolder: commands.stateFolder, BindingID: binding.BindingID}
	if err := account.Logout(); err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	fmt.Fprintln(stdout, "Signed out of Claude Code for this project.")

	return 0
}

// errNoStartGrant is the answer to a hook call while the session holds no start grant to ask the journal with.
var errNoStartGrant = errors.New("this session holds no start grant to ask the journal with")

// refuseWithoutStartGrant answers every hook call with a failure, so the adapter gives the provider its own
// blocking reply until the session's start grant reaches it.
func refuseWithoutStartGrant(context.Context, string, []byte) (hookadapter.Reply, error) {
	return hookadapter.Reply{}, errNoStartGrant
}

// ownInstallation is the sealed installation this command runs from: the folder above its bin folder.
func ownInstallation() (string, error) {
	program, err := os.Executable()
	if err != nil {
		return "", err
	}
	program, err = filepath.EvalSymlinks(program)
	if err != nil {
		return "", err
	}

	return filepath.Dir(filepath.Dir(program)), nil
}

// forward runs the verb on the server, writes its frames in sequence and answers its exit code. A lost connection
// fails with the request id, so the run can be reconciled; nothing is queued.
func (commands dispatcher) forward(
	arguments []string,
	binding host.Binding,
	state host.ConnectionState,
	stdin []byte,
	stdout, stderr io.Writer,
) int {
	requestKey, err := newRequestKey()
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	command := client.ProjectCommand{RequestKey: requestKey, Binding: binding.BindingID, Argv: arguments, Stdin: string(stdin)}
	write := writeFrameTo(stdout, stderr)
	var code int
	if grant, found := commands.grant(binding); found {
		code, err = client.RunProjectCommand(context.Background(), commands.transport, grant, command, write)
	} else {
		code, err = commands.asShellUser(binding, state, command, write, stderr)
	}
	if err != nil {
		fmt.Fprintf(stderr, "journal: %v (request %s)\n", err, requestKey)
		return 1
	}

	return code
}

// errNoTerminalSignIn is returned in a shell journal terminal open did not start: its sign-in has no place to be kept.
var errNoTerminalSignIn = errors.New("this shell is no terminal sign-in: run journal terminal open, then the command in the shell it opens")

// asShellUser runs the verb under this terminal's own sign-in, approved in the owner's browser when none is kept. A
// grant the journal refuses is forgotten for its generation alone and approved again; a journal that could not be
// reached keeps the sign-in and says so.
func (commands dispatcher) asShellUser(
	binding host.Binding,
	state host.ConnectionState,
	command client.ProjectCommand,
	write func(client.CommandFrame) error,
	stderr io.Writer,
) (int, error) {
	if commands.terminal == "" {
		return 0, errNoTerminalSignIn
	}
	signIn, err := commands.signedIn(binding, state, stderr)
	if err != nil {
		return 0, err
	}

	run := func(grant string) (int, error) {
		if isOverview(command) {
			return showOverview(context.Background(), commands.transport, binding.JournalURL, grant, command, write)
		}

		return client.RunDeviceCommand(context.Background(), commands.transport, binding.JournalURL, grant, command, write)
	}
	code, err := run(signIn.Grant)
	if errors.Is(err, client.ErrUnauthenticated) {
		if err := state.ClearSignIn(commands.terminal, signIn.Generation); err != nil {
			return 0, err
		}
		fmt.Fprintf(stderr, "journal: terminal sign-in %s no longer works; approve this terminal again.\n", signIn.Reference)
		if signIn, err = commands.signedIn(binding, state, stderr); err != nil {
			return 0, err
		}

		return run(signIn.Grant)
	}
	if errors.Is(err, client.ErrUncertain) {
		fmt.Fprintf(stderr, "journal: the journal could not be reached, so this terminal's access could not be checked; its sign-in %s is kept.\n", signIn.Reference)
	}

	return code, err
}

// isOverview is whether the command is the one-word journal overview, with nothing piped in.
func isOverview(command client.ProjectCommand) bool {
	return len(command.Argv) == 1 && command.Argv[0] == "overview" && command.Stdin == ""
}

// showOverview prints this terminal's overview: its project and environment, how many tasks of it the approving
// user holds, and each by number and title.
func showOverview(
	ctx context.Context,
	transport *http.Client,
	journalURL string,
	grant string,
	command client.ProjectCommand,
	write func(client.CommandFrame) error,
) (int, error) {
	overview, err := client.RunDeviceOverview(ctx, transport, journalURL, grant, command)
	if err != nil {
		return 0, err
	}
	noun := "tasks"
	if overview.Count == 1 {
		noun = "task"
	}
	lines := []string{overview.Project + " / " + overview.Environment, fmt.Sprintf("%d %s assigned to you", overview.Count, noun)}
	for _, task := range overview.Tasks {
		lines = append(lines, fmt.Sprintf("#%d %s", task.Number, task.Title))
	}

	return 0, write(client.CommandFrame{Sequence: 1, Stream: "stdout", Text: strings.Join(lines, "\n") + "\n"})
}

// signedIn is this terminal's kept sign-in with its bearer, approved now when it has none yet.
func (commands dispatcher) signedIn(binding host.Binding, state host.ConnectionState, stderr io.Writer) (host.TerminalSignIn, error) {
	signIn, err := state.SignIn(commands.terminal)
	if err == nil && signIn.Grant != "" {
		return signIn, nil
	}
	if err != nil && !errors.Is(err, host.ErrNoSignIn) {
		return host.TerminalSignIn{}, err
	}

	return commands.approval(binding, state, commands.terminal, stderr)
}

// openTerminal starts a shell whose journal commands run under a terminal sign-in of their own: a fresh one, or with
// --resume the kept sign-in of that reference. The selector in the shell is only a lookup key, never a bearer.
func openTerminal(arguments []string, state host.ConnectionState, stdout, stderr io.Writer) int {
	if len(arguments) == 0 || arguments[0] != "open" {
		fmt.Fprintln(stderr, "usage: journal terminal open [--resume <reference>]")
		return 2
	}
	selector, err := host.NewTerminalSelector()
	if len(arguments) == 3 && arguments[1] == "--resume" {
		var signIn host.TerminalSignIn
		signIn, err = state.SignInOf(arguments[2])
		selector = signIn.Selector
	}
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	shell := os.Getenv("SHELL")
	if shell == "" {
		shell = "/bin/zsh"
	}
	fmt.Fprintln(stdout, "journal: this shell keeps its own terminal sign-in; exit it to leave.")
	command := exec.Command(shell)
	command.Env = append(os.Environ(), host.TerminalSelectorVariable+"="+selector)
	command.Stdin, command.Stdout, command.Stderr = os.Stdin, os.Stdout, os.Stderr
	if err := command.Run(); err != nil {
		var exited *exec.ExitError
		if errors.As(err, &exited) {
			return exited.ExitCode()
		}
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	return 0
}

// deviceApproval asks the journal for a device code, shows its approval URL and code, polls until the owner
// approved it or it expired, and keeps the grant.
func deviceApproval(binding host.Binding, state host.ConnectionState, selector string, stderr io.Writer) (host.TerminalSignIn, error) {
	transport := &http.Client{Timeout: 30 * time.Second}
	journal := client.ForRemoteProject(binding.Enrollment, transport)
	ctx := context.Background()
	startKey, err := newRequestKey()
	if err != nil {
		return host.TerminalSignIn{}, err
	}
	start, err := journal.StartDeviceGrant(ctx, binding.BindingID, startKey)
	if errors.Is(err, client.ErrUncertain) {
		// The start's reply was lost: the same key finds the grant it made.
		start, err = journal.StartDeviceGrant(ctx, binding.BindingID, startKey)
	}
	if err != nil {
		return host.TerminalSignIn{}, err
	}
	// The reference and the selector are kept before the first poll, so a lost reply still names the sign-in.
	signIn := host.TerminalSignIn{Selector: selector, Reference: start.Reference, Generation: start.Generation}
	if err := state.SaveSignIn(signIn); err != nil {
		return host.TerminalSignIn{}, err
	}
	fmt.Fprintf(stderr, "journal: to sign in this terminal on %s, open %s and approve the code %s.\n",
		binding.JournalURL, start.ApprovalURL, start.UserCode)
	fmt.Fprintf(stderr, "journal: this is terminal sign-in %s; the code works until %s.\n", start.Reference,
		localDeadline(start.ExpiresAt))

	interval := max(start.Interval, 1)
	for {
		time.Sleep(time.Duration(interval) * time.Second)
		poll, err := journal.PollDeviceGrant(ctx, start.DeviceCode)
		if err != nil {
			return host.TerminalSignIn{}, err
		}
		switch poll.Outcome {
		case client.PollPending:
			continue
		case client.PollSlowDown:
			interval = max(poll.Interval, interval+1)
			continue
		case client.PollIssued:
			signIn.Grant = poll.Grant
			return signIn, state.SaveSignIn(signIn)
		case client.PollAlreadyIssued:
			return host.TerminalSignIn{}, endedApproval(state, signIn, fmt.Errorf(
				"sign-in %s was handed out once and its answer was lost: withdraw it in Settings, then run the command again for a fresh one", poll.Reference))
		case client.PollExpired:
			return host.TerminalSignIn{}, endedApproval(state, signIn, errors.New(
				"the code expired before it was approved: run the command again for a new one"))
		case client.PollRevoked:
			return host.TerminalSignIn{}, endedApproval(state, signIn, fmt.Errorf(
				"sign-in %s was revoked: run the command again to approve a new one", poll.Reference))
		}

		return host.TerminalSignIn{}, fmt.Errorf("the journal answered the poll with %q, which this journal command does not know", poll.Outcome)
	}
}

// endedApproval forgets the sign-in an approval kept before it polled, once its request ended without a bearer.
func endedApproval(state host.ConnectionState, signIn host.TerminalSignIn, ended error) error {
	if err := state.ClearSignIn(signIn.Selector, signIn.Generation); err != nil {
		return errors.Join(ended, err)
	}

	return ended
}

// localDeadline is an ISO 8601 moment in this computer's own time zone, in full.
func localDeadline(moment string) string {
	at, err := time.Parse(time.RFC3339, moment)
	if err != nil {
		return moment
	}

	return at.Local().Format("15:04 MST on Mon 2 Jan 2006")
}

// writeFrameTo writes each frame's output to standard output or error, as the verb wrote it.
func writeFrameTo(stdout, stderr io.Writer) func(client.CommandFrame) error {
	return func(frame client.CommandFrame) error {
		output, err := frame.Bytes()
		if err != nil {
			return err
		}
		target := stdout
		if frame.IsStandardError() {
			target = stderr
		}
		_, err = target.Write(output)
		return err
	}
}

// status is the one line journal status answers.
func status(binding host.Binding, state host.ConnectionState, folder project.Folder) string {
	contact := "no contact yet"
	if report, err := state.RelayReport(); err == nil {
		contact = "last contact " + report.ReportedAt.Local().Format(time.DateTime)
	}

	return fmt.Sprintf("Connected to %s · %s · %s · %s",
		binding.JournalURL, filepath.Base(folder.Root), host.MachineLabel(), contact)
}

// diagnose writes the binding's diagnostics bundle into the project folder and names it.
func diagnose(binding host.Binding, state host.ConnectionState, folder project.Folder, stdout, stderr io.Writer) int {
	release := "unknown"
	if installation, err := ownInstallation(); err == nil {
		release = filepath.Base(installation)
	}
	install := diagnostics.Install{Release: release, Protocol: client.RemoteProjectProtocolVersion}
	path, err := diagnostics.Write(binding, state, install, folder.Root)
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	fmt.Fprintln(stdout, "Wrote "+path+": it names this install and its last failures, and holds no secret.")

	return 0
}

// standardInput is what was piped into the command; a terminal passes nothing on.
func standardInput() []byte {
	info, err := os.Stdin.Stat()
	if err != nil || info.Mode()&os.ModeCharDevice != 0 {
		return nil
	}
	piped, err := io.ReadAll(os.Stdin)
	if err != nil {
		return nil
	}

	return piped
}

// wakeRelay starts the binding's relay with the journal-agent installed beside this command.
func wakeRelay(stateFolder string, bindingID string) error {
	program, err := os.Executable()
	if err != nil {
		return err
	}
	program, err = filepath.EvalSymlinks(program)
	if err != nil {
		return err
	}

	return host.StartRelay(filepath.Join(filepath.Dir(program), "journal-agent"), stateFolder, bindingID)
}

func newRequestKey() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return hex.EncodeToString(random), nil
}
