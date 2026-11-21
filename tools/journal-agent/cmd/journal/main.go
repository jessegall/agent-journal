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
	"time"

	"journal-agent/client"
	"journal-agent/diagnostics"
	"journal-agent/hookadapter"
	"journal-agent/host"
	"journal-agent/localsession"
	"journal-agent/profiles"
	"journal-agent/project"
	"journal-agent/userservice"
)

// localVerbs are the verbs this machine answers itself; every other verb runs on the server.
var localVerbs = []string{"status", "claude", "codex", "logout", "service", "disconnect", "attach", "upgrade", "diagnostics"}

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
	approval    func(binding host.Binding, state host.ConnectionState, stderr io.Writer) (string, error)
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
	if host.RemainingBindings(commands.stateFolder) == 0 {
		fmt.Fprintln(stdout, "No connected project is left on this machine. You may remove "+
			filepath.Join(commands.stateFolder, "releases")+", the journal lines in your shell startup file and the "+
			"/.journal/ line in .gitignore when you have not changed them.")
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
	requestID, err := newRequestID()
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	command := client.ProjectCommand{RequestID: requestID, Binding: binding.BindingID, Argv: arguments, Stdin: string(stdin)}
	write := writeFrameTo(stdout, stderr)
	var code int
	if grant, found := commands.grant(binding); found {
		code, err = client.RunProjectCommand(context.Background(), commands.transport, grant, command, write)
	} else {
		code, err = commands.asShellUser(binding, state, command, write, stderr)
	}
	if err != nil {
		fmt.Fprintf(stderr, "journal: %v (request %s)\n", err, requestID)
		return 1
	}

	return code
}

// asShellUser runs the verb under the shell user's device grant, approved in the owner's browser when none is kept.
func (commands dispatcher) asShellUser(
	binding host.Binding,
	state host.ConnectionState,
	command client.ProjectCommand,
	write func(client.CommandFrame) error,
	stderr io.Writer,
) (int, error) {
	grant, err := state.DeviceGrant()
	if errors.Is(err, host.ErrNotConnected) {
		grant, err = commands.approval(binding, state, stderr)
	}
	if err != nil {
		return 0, err
	}

	return client.RunDeviceCommand(context.Background(), commands.transport, binding.JournalURL, grant, command, write)
}

// deviceApproval asks the journal for a device code, shows its approval URL and code, polls until the owner
// approved it or it expired, and keeps the grant.
func deviceApproval(binding host.Binding, state host.ConnectionState, stderr io.Writer) (string, error) {
	transport := &http.Client{Timeout: 30 * time.Second}
	journal := client.ForRemoteProject(binding.Enrollment, transport)
	ctx := context.Background()
	start, err := journal.StartDeviceGrant(ctx, binding.BindingID)
	if err != nil {
		return "", err
	}
	fmt.Fprintf(stderr, "journal: open %s and approve the code %s\n", start.ApprovalURL, start.UserCode)

	for {
		time.Sleep(time.Duration(max(start.Interval, 1)) * time.Second)
		grant, err := journal.PollDeviceGrant(ctx, start.DeviceCode)
		if errors.Is(err, client.ErrAwaitingApproval) {
			continue
		}
		if err != nil {
			return "", err
		}

		return grant, state.SaveDeviceGrant(grant)
	}
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

func newRequestID() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return hex.EncodeToString(random), nil
}
