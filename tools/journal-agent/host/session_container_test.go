package host

import (
	"bufio"
	"context"
	"errors"
	"io"
	"net/http"
	"slices"
	"strings"
	"testing"
	"time"

	"journal-agent/dockerstandin"
)

// sessionOn gives the session container of session-7 on a stand-in daemon that holds its image.
func sessionOn(t *testing.T) (SessionContainer, *dockerstandin.Daemon) {
	t.Helper()
	containers, daemon := standIn(t, containedRules)

	return SessionContainer{Containers: containers, Name: "journal-session-7", Labels: accountLabels("7")}, daemon
}

func attachableManifest() ContainerManifest {
	attachable := containedManifest()
	attachable.Network = "journal-session-7"
	attachable.Attachable = true

	return attachable
}

// echoing is a program that prints back what is typed into it until it is stopped.
func echoing(_ context.Context, _ *dockerstandin.Container, input io.Reader, output io.Writer) int {
	_, _ = io.Copy(output, input)

	return 0
}

func TestASessionContainerRunsItsProgramAsItsOwnTerminalProcess(t *testing.T) {
	container, daemon := sessionOn(t)
	process := ContainerProcess{Command: []string{"claude", "--settings", "{}"}, Environment: []string{"HOME=/home/journal"}}

	if err := container.Open(context.Background(), attachableManifest(), process); err != nil {
		t.Fatal(err)
	}

	created, found := daemon.Container("journal-session-7")
	if !found || !created.IsRunning() || !created.Config.Tty || !created.Config.OpenStdin {
		t.Fatalf("the session container does not run with a terminal: %v", daemon.Requests())
	}
	if !slices.Equal(created.Config.Cmd, process.Command) || !slices.Contains(created.Config.Env, "HOME=/home/journal") ||
		created.HostConfig.NetworkMode != "journal-session-7" {
		t.Fatalf("the program is %v with %v on %s", created.Config.Cmd, created.Config.Env, created.HostConfig.NetworkMode)
	}
	network, made := daemon.Network("journal-session-7")
	if !made || network.Labels[sessionLabel] != labels().Session {
		t.Fatalf("the session has no network of its own: %+v", network)
	}
}

func TestASessionContainerThatAlreadyRunsIsFoundAndNotCreatedAgain(t *testing.T) {
	container, daemon := sessionOn(t)
	daemon.AddContainer("journal-session-7", accountLabels("7").asMap(), true)

	if err := container.Open(context.Background(), attachableManifest(), ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}

	if daemon.Asked(http.MethodPost, "/containers/create") || len(daemon.Created()) != 1 {
		t.Fatalf("a running session container was created again: %v", daemon.Requests())
	}
}

func TestAContainerWithoutATerminalIsNoSessionContainer(t *testing.T) {
	container, daemon := sessionOn(t)

	err := container.Open(context.Background(), containedManifest(), ContainerProcess{Command: []string{"claude"}})
	if !errors.Is(err, ErrSessionContainerUnattachable) {
		t.Fatalf("an unattachable manifest gave %v", err)
	}
	if len(daemon.Requests()) != 0 {
		t.Fatalf("the daemon was asked: %v", daemon.Requests())
	}
}

// The host types into a session's terminal and reads its screen through the daemon's attach, sizes the
// container's terminal, and a hangup leaves the program running.
func TestTheHostTypesIntoASessionsTerminalReadsItAndSizesItThroughTheDaemon(t *testing.T) {
	container, daemon := sessionOn(t)
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program { return echoing }
	if err := container.Open(context.Background(), attachableManifest(), ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}
	instance, err := container.Containers.InstanceID(context.Background(), container.Name)
	if err != nil {
		t.Fatal(err)
	}

	terminal, err := container.Containers.AttachTerminal(context.Background(), instance, 40, 120)
	if err != nil {
		t.Fatal(err)
	}
	typed := []byte("hello")
	if _, err := terminal.Write(typed); err != nil {
		t.Fatal(err)
	}
	shown := make([]byte, len(typed))
	if _, err := io.ReadFull(terminal, shown); err != nil || string(shown) != string(typed) {
		t.Fatalf("the terminal showed %q, %v", shown, err)
	}

	created, _ := daemon.Container(instance)
	if rows, columns := created.Size(); rows != 40 || columns != 120 {
		t.Fatalf("the container's terminal is %d by %d", rows, columns)
	}
	if err := terminal.Resize(50, 160); err != nil {
		t.Fatal(err)
	}
	rows, columns, _ := terminal.Size()
	if daemonRows, daemonColumns := created.Size(); rows != 50 || columns != 160 || daemonRows != 50 || daemonColumns != 160 {
		t.Fatalf("after a resize the terminal is %d by %d and the container's %d by %d", rows, columns, daemonRows, daemonColumns)
	}

	if err := terminal.Close(); err != nil || !created.IsRunning() || created.Typed() != string(typed) {
		t.Fatalf("a hangup ended the program or lost what was typed: %v, typed %q", err, created.Typed())
	}
}

func TestAStopIsProvenAndRemovesTheContainerAndItsNetworkButKeepsTheVolumes(t *testing.T) {
	container, daemon := sessionOn(t)
	if err := container.Open(context.Background(), attachableManifest(), ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}

	if err := container.Stop(context.Background(), "journal-session-7"); err != nil {
		t.Fatal(err)
	}

	_, hasContainer := daemon.Container("journal-session-7")
	_, hasNetwork := daemon.Network("journal-session-7")
	if hasContainer || hasNetwork || !daemon.Asked(http.MethodPost, "/containers/journal-session-7/stop?t=10") {
		t.Fatalf("the stop left the container or its network: %v", daemon.Requests())
	}
	if _, kept := daemon.Volume("journal-account-7-projects"); !kept || daemon.Asked(http.MethodDelete, "/volumes/") {
		t.Fatalf("a session volume was removed: %v", daemon.Requests())
	}
}

func TestAnOutOfMemoryKillIsTheRuntimesExit(t *testing.T) {
	container, daemon := sessionOn(t)
	if err := container.Open(context.Background(), attachableManifest(), ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}
	created, _ := daemon.Container("journal-session-7")
	created.KillForMemory()

	exit, err := container.Wait(context.Background(), "journal-session-7")
	if err != nil {
		t.Fatal(err)
	}

	if exit.Code != 137 || !exit.OutOfMemory || !strings.Contains(exit.Evidence(), "memory") {
		t.Fatalf("the exit is %+v: %s", exit, exit.Evidence())
	}
	if _, hasNetwork := daemon.Network("journal-session-7"); hasNetwork {
		t.Fatalf("the ended container's network stayed: %v", daemon.Requests())
	}
}

// programsOwnWords stands for what a program prints before it gives up, with the colours a terminal program adds.
const (
	programsOwnWords       = "bypassPermissions-not-supported-here"
	programsColouredOutput = "starting\r\n\x1b[31m" + programsOwnWords + "\x1b[0m\r\n"
)

// A program that ends at once is reported with its own last lines, as plain text, as the reason.
func TestAProgramThatEndsAtOnceIsReportedWithItsOwnLastLines(t *testing.T) {
	container, daemon := sessionOn(t)
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program {
		return dockerstandin.Printing(programsColouredOutput, 1)
	}
	if err := container.Open(context.Background(), attachableManifest(), ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}

	exit, err := container.Wait(context.Background(), "journal-session-7")
	if err != nil {
		t.Fatal(err)
	}

	if exit.Code != 1 || exit.OutOfMemory || !strings.HasSuffix(exit.Evidence(), programsOwnWords) ||
		strings.Contains(exit.Evidence(), "\x1b") {
		t.Fatalf("the exit is %+v: %q", exit, exit.Evidence())
	}
	if _, held := daemon.Container("journal-session-7"); held {
		t.Fatal("the ended container stayed")
	}
}

func headlessManifest() ContainerManifest {
	headless := containedManifest()
	headless.Network = "journal-session-7"

	return headless
}

func TestAHeadlessTurnRunsItsProgramInAFreshSessionContainerWithoutATerminal(t *testing.T) {
	container, daemon := sessionOn(t)
	before := daemon.AddContainer("journal-session-7", accountLabels("7").asMap(), false)
	process := ContainerProcess{Command: []string{"claude", "--print", "Check your pending journal work."}}
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program {
		return dockerstandin.Printing("{\"type\":\"result\"}\n", 0)
	}

	turn, err := container.Turn(context.Background(), headlessManifest(), process)
	if err != nil {
		t.Fatal(err)
	}

	created, found := daemon.Container("journal-session-7")
	if !found || created.ID == before.ID || created.Config.Tty || created.WasStarted() ||
		!slices.Equal(created.Config.Cmd, process.Command) {
		t.Fatalf("the turn is not its own program in a fresh container without a terminal: %v", daemon.Requests())
	}

	output, err := turn.Output()
	if err != nil {
		t.Fatal(err)
	}
	if err := turn.Start(); err != nil {
		t.Fatal(err)
	}
	line, _ := bufio.NewReader(output).ReadString('\n')
	_, _ = io.Copy(io.Discard, output)
	if err := turn.Wait(); err != nil || line != "{\"type\":\"result\"}\n" {
		t.Fatalf("the turn printed %q and ended with %v", line, err)
	}
}

func TestAHeadlessTurnThatFailsEndsWithItsExitCodeAndItsOwnLastLines(t *testing.T) {
	container, daemon := sessionOn(t)
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program {
		return dockerstandin.Printing(programsOwnWords+"\n", 2)
	}
	turn, err := container.Turn(context.Background(), headlessManifest(), ContainerProcess{Command: []string{"claude"}})
	if err != nil {
		t.Fatal(err)
	}

	if err := turn.Start(); err != nil {
		t.Fatal(err)
	}
	err = turn.Wait()

	var exited ExitedWith
	if !errors.As(err, &exited) || exited != 2 || !strings.HasSuffix(err.Error(), programsOwnWords) {
		t.Fatalf("a failed turn ended with %v", err)
	}
}

func TestAHeadlessTurnIsInterruptedAndStoppedThroughTheDaemon(t *testing.T) {
	container, daemon := sessionOn(t)
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program {
		return func(ctx context.Context, _ *dockerstandin.Container, _ io.Reader, _ io.Writer) int {
			<-ctx.Done()

			return 0
		}
	}
	turn, err := container.Turn(context.Background(), headlessManifest(), ContainerProcess{Command: []string{"claude"}})
	if err != nil {
		t.Fatal(err)
	}
	if err := turn.Start(); err != nil {
		t.Fatal(err)
	}

	if err := turn.Interrupt(); err != nil {
		t.Fatal(err)
	}
	created, _ := daemon.Container("journal-session-7")
	var exited ExitedWith
	if err := turn.Wait(); !errors.As(err, &exited) || !slices.Equal(created.Signals(), []string{"SIGINT"}) {
		t.Fatalf("an interrupted turn ended with %v after %v", err, created.Signals())
	}
	if outcome := turn.Stop(StopStages{Grace: time.Second}); outcome != StopProven {
		t.Fatalf("a stop of an ended turn gave %v", outcome)
	}
}

func TestATerminalManifestRunsNoHeadlessTurn(t *testing.T) {
	container, _ := sessionOn(t)

	if _, err := container.Turn(context.Background(), attachableManifest(), ContainerProcess{}); !errors.Is(err, ErrSessionContainerAttachable) {
		t.Fatalf("a terminal manifest gave %v", err)
	}
}

func TestAWritersCheckoutIsMountedReadWriteInsteadOfTheMainsWorkspace(t *testing.T) {
	container, daemon := sessionOn(t)
	daemon.AddVolume("journal-checkout-session-7", nil)
	writer := headlessManifest()
	writer.Mounts[0] = ContainerMount{Type: MountVolume, Source: "journal-workspace-main", Target: "/workspace", Writable: true, Checkout: true}

	if _, err := container.Turn(context.Background(), writer, ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}

	created, _ := daemon.Container("journal-session-7")
	workspace := mountIn(t, created.HostConfig.Mounts, "/workspace")
	if workspace.Source != "journal-checkout-session-7" || workspace.ReadOnly {
		t.Fatalf("the writer does not work in its own checkout: %+v", workspace)
	}
	if !daemon.Asked(http.MethodGet, "/volumes/journal-checkout-session-7") {
		t.Fatalf("the checkout was not looked for before it was used: %v", daemon.Requests())
	}
}

func TestACheckoutOfAnotherInstallationIsRefusedBeforeAnyClone(t *testing.T) {
	container, daemon := sessionOn(t)
	writer := headlessManifest()
	writer.Mounts[0] = ContainerMount{Type: MountVolume, Source: "other-workspace-main", Target: "/workspace", Writable: true, Checkout: true}

	if _, err := container.Turn(context.Background(), writer, ContainerProcess{Command: []string{"claude"}}); !errors.Is(err, ErrManifestUnsafe) {
		t.Fatalf("a checkout of another installation's workspace gave %v", err)
	}
	if slices.ContainsFunc(daemon.Requests(), func(request string) bool { return strings.Contains(request, "checkout") }) {
		t.Fatalf("a checkout was made: %v", daemon.Requests())
	}
}

func protectedAttachableManifest() ContainerManifest {
	protected := attachableManifest()
	protected.LaunchProfile = LaunchProtectedAccount
	protected.User = "0:0"
	protected.Capabilities = []string{"SETUID", "SETGID", "SETPCAP"}

	return protected
}

func TestAProtectedSessionChecksItsAccountFolderThenHandsItsProgramToTheInit(t *testing.T) {
	container, daemon := sessionOn(t)
	process := ContainerProcess{Command: []string{"claude", "--settings", "{}"}}

	if err := container.Open(context.Background(), protectedAttachableManifest(), process); err != nil {
		t.Fatal(err)
	}

	all := daemon.Created()
	session := all[len(all)-1]
	checks := all[:len(all)-1]
	if len(checks) == 0 || session.Name != "journal-session-7" || !strings.Contains(scriptOf(checks[len(checks)-1]), "refuse()") {
		t.Fatalf("the account folder was not checked before the create: %v", daemon.Requests())
	}
	if !slices.Equal(session.Config.Entrypoint, []string{protectedInit}) ||
		!slices.Equal(session.Config.Cmd, []string{"--", "claude", "--settings", "{}"}) {
		t.Fatalf("the init is not handed the program: %v %v", session.Config.Entrypoint, session.Config.Cmd)
	}
}

func TestAProtectedSessionOnAnUnsafeAccountFolderIsRefusedBeforeAnythingIsCreated(t *testing.T) {
	container, daemon := sessionOn(t)
	open := "/srv/journal/accounts/7/.credentials.json"
	daemon.Programs = func(created *dockerstandin.Container) dockerstandin.Program {
		if !strings.Contains(scriptOf(created), "refuse()") {
			return nil
		}

		return dockerstandin.Printing("is-open\t"+open+"\n", 1)
	}

	err := container.Open(context.Background(), protectedAttachableManifest(), ContainerProcess{Command: []string{"claude"}})
	if !errors.Is(err, ErrAccountFolderUnsafe) || !strings.Contains(err.Error(), open) {
		t.Fatalf("got %v", err)
	}
	if _, created := daemon.Container("journal-session-7"); created {
		t.Fatal("a container was created on an unsafe account folder")
	}
}

func TestAStandardSessionPassesItsProgramWithoutTheInitsSeparator(t *testing.T) {
	container, daemon := sessionOn(t)

	if err := container.Open(context.Background(), attachableManifest(), ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}

	created := daemon.Created()
	if len(created) != 1 || !slices.Equal(created[0].Config.Cmd, []string{"claude"}) || len(created[0].Config.Entrypoint) != 0 {
		t.Fatalf("a standard session took the protected path: %v", daemon.Requests())
	}
}
