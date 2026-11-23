package main

import (
	"bufio"
	"context"
	"crypto/rand"
	"errors"
	"flag"
	"fmt"
	"io"
	"journal-agent/shellwords"
	"log"
	"net"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/creack/pty"
	"golang.org/x/term"

	"journal-agent/client"
	"journal-agent/drivers"
	drivercontracts "journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/keyscripts"
	"journal-agent/keyscripts/scripts"
	"journal-agent/profiles"
	"journal-agent/profiles/contracts"
	"journal-agent/screen"
	"journal-agent/serving"
)

// enroll stores the host id and the secret agents:host-enroll printed. The secret is read from standard input or
// from the file --secret-file names, so it never appears in the environment, the process list or the shell history:
// an operator passes the file's path, never the secret. An enrollment already held for the same journal and host is
// kept as it is, so a one-shot service may run enroll on every start.
func enroll(arguments []string) error {
	flags := flag.NewFlagSet("enroll", flag.ContinueOnError)
	journalURL := flags.String("journal", "", "the journal's URL")
	hostID := flags.String("host", "", "the host id agents:host-enroll printed")
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	secretFile := flags.String("secret-file", "", "a file holding the secret, instead of standard input")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if *journalURL == "" || *hostID == "" {
		return errors.New("enroll needs --journal and --host, and the secret on standard input or in --secret-file")
	}
	state := host.State{Folder: *stateFolder}
	trimmedURL := strings.TrimRight(*journalURL, "/")
	if state.HoldsEnrollment(trimmedURL, *hostID) {
		log.Printf("host %s is already enrolled with %s; nothing changed", *hostID, trimmedURL)
		return nil
	}
	secret, err := readSecret(*secretFile)
	if err != nil {
		return err
	}
	enrollment := host.Enrollment{JournalURL: trimmedURL, HostID: *hostID, Secret: secret}
	if err := state.Save(enrollment); err != nil {
		return err
	}
	log.Printf("host %s is enrolled; its state is in %s", enrollment.HostID, *stateFolder)
	return nil
}

// readSecret reads the secret from the file, or from standard input when no file is named; a trailing newline is no
// part of it.
func readSecret(secretFile string) (string, error) {
	if secretFile != "" {
		content, err := os.ReadFile(secretFile)
		if err != nil {
			return "", fmt.Errorf("enroll reads the secret from %s: %w", secretFile, err)
		}
		return strings.TrimSpace(string(content)), nil
	}
	secret, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil && secret == "" {
		return "", errors.New("enroll reads the secret from standard input or --secret-file")
	}
	return strings.TrimSpace(secret), nil
}

// verifyArrangement checks what the host runs from before it enrolls, listens or claims anything: a contained host's
// pinned images on the agent daemon, a local host's sealed installation folder.
func verifyArrangement(arrangement host.Arrangement, pinned host.PinnedImages, dockerSocket, installationFolder string) error {
	if !arrangement.IsContained() {
		return verifyInstallation(installationFolder)
	}

	containers, err := host.ContainersOn(dockerSocket, host.ContainerRules{})
	if err != nil {
		return err
	}

	return pinned.AssertLoaded(context.Background(), containers)
}

// serve claims this host's requests until it is stopped. Carrying them out is the scheduler's job; until then each
// claimed request is only logged by its identity, never by its content.
func serve(arguments []string) error {
	flags := flag.NewFlagSet("serve", flag.ContinueOnError)
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	hookCommand := flags.String("hook-command", "", "the hook relay command the programs call")
	installationFolder := flags.String("installation", "", "the protected installation saved-account starts run from")
	arrangementFlag := flags.String("arrangement", string(host.Local), "where agents run: local or contained")
	dockerSocket := flags.String("docker", "", "the agent daemon's socket a contained host starts containers through")
	installationName := flags.String("installation-name", "", "the prefix of a contained host's containers")
	startSocketFolder := flags.String("start-socket-dir", "", "an owner-only folder for the start socket, the state folder by default")
	agentImage := flags.String("agent-image", "", "the agent image a contained host runs, by digest")
	runnerImage := flags.String("runner-image", "", "the sign-in runner image of a contained host, by digest")
	seccomp := flags.String("seccomp-profile", "", "the seccomp profile a contained host's agent containers run under")
	protectedTrial := flags.String("protected-trial", "", "drivers on the protected-account trial, by key, split by commas")
	sessionJournal := flags.String("session-journal", "",
		"the journal's URL as a session container reaches it, when that differs from the host's own")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	arrangement, err := host.ParseArrangement(*arrangementFlag)
	if err != nil {
		return err
	}
	installation, err := host.ParseInstallationName(*installationName)
	if err != nil {
		return err
	}
	if err := arrangement.AssertServable(*dockerSocket, installation); err != nil {
		return err
	}
	pinned := host.PinnedImages{Agent: *agentImage, Runner: *runnerImage}
	if err := verifyArrangement(arrangement, pinned, *dockerSocket, *installationFolder); err != nil {
		return err
	}
	enrollment, err := (host.State{Folder: *stateFolder}).Load()
	if err != nil {
		return err
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	socket := &host.AttachSocket{Folder: *stateFolder, Start: startTerminal, Layout: layoutOf}
	listener, err := socket.Listen()
	if err != nil {
		return err
	}
	defer listener.Close()
	// Every host carries out browser writers' text, keys, pastes and resizes on its terminal drivers: a contained
	// one through the daemon's attach to its container, whose attachment the grant is scoped to; Ctrl+C goes as its
	// byte, never a signal, the gate writes in order with the terminal's own backpressure, and a resize sizes the
	// container's terminal. No host offers private entry.
	journal := client.New(enrollment).WithArrangement(string(arrangement)).WithBrowserInput()
	opener := runtimeOpener{stateFolder: *stateFolder, installationFolder: *installationFolder,
		codexOwners: &host.CodexOwners{}, journalURL: journal.JournalURL(), hookCommand: *hookCommand, socket: socket,
		declared: descriptorsOf(arrangement), sessionJournalURL: journal.JournalURL()}
	if trimmed := strings.TrimRight(*sessionJournal, "/"); trimmed != "" {
		opener.sessionJournalURL = trimmed
	}
	prerequisites := localPrerequisites(*stateFolder, *installationFolder)
	if arrangement.IsContained() {
		rules := host.ContainerRules{Arrangement: arrangement, InstallationName: installation, AgentImage: *agentImage}
		opener.containers, err = host.ContainersOn(*dockerSocket, rules)
		if err != nil {
			return err
		}
		socket.Start = startTerminalOn(opener.containers)
		socket.InstanceRuns = instanceRunsOn(opener.containers)
		opener.installation = installation
		prerequisites = containedPrerequisites(*stateFolder, *seccomp, trialDrivers(*protectedTrial), opener.containers)
	}
	preparation := startPreparation(journal, *stateFolder, prerequisites)
	reports := &host.StartReports{Folder: *stateFolder}
	// Usage reports keep their own file and worker, so a usage retry never waits in front of a start report.
	opener.usage = host.NewUsageReports(*stateFolder)
	opener.statusLines = &host.StatusLineRelays{}
	go opener.usage.Run(ctx, journal)
	sessions := host.ContainerSessions{}
	var bindsAccount func(ctx context.Context, folder string) (bool, error)
	var folders accountFolders
	if arrangement.IsContained() {
		containers := opener.containers
		sessions, err = host.ContainerSessionsOf(ctx, containers, string(installation))
		if err != nil {
			return err
		}
		bindsAccount = containers.BindsAccount
		folders = containers
		cleanup := host.LaunchCleanup{Containers: containers, Installation: installation,
			RuntimeFolders: filepath.Join(*stateFolder, "runtimes"), StopSeconds: host.StopSeconds}
		go runCleanups(ctx, cleanup, journal)
		evidence := host.NativeEvidence{Folder: *stateFolder}
		// Without a report the journal refuses every contained start, so a failed report stops no other work.
		if err := host.ReportContainedProtection(ctx, containers, *seccomp, evidence, journal); err != nil {
			log.Printf("the protection of the agent image was not reported: %v", err)
		}
	}
	// The journal refuses every call of a host of another protocol, so this report fails first when the versions differ.
	if err := journal.ReportDescriptors(ctx, descriptorsOf(arrangement)); err != nil {
		return fmt.Errorf("the journal did not take this host's drivers: %w", err)
	}
	outcomes, err := host.ReconcileOnBoot(ctx, journal, preparation.States, reports, sessions)
	if err != nil {
		return err
	}
	for _, outcome := range outcomes {
		log.Printf("after the restart, start %s is %s", outcome.StartKey, outcome.Outcome)
	}
	if *startSocketFolder == "" {
		*startSocketFolder = *stateFolder
	}
	executor := &protectedExecutor{
		preparation: preparation, open: opener.open, reports: reports, reporter: journal,
		codexOwners: opener.codexOwners, arrangement: arrangement, bindsAccount: bindsAccount, accountFolders: folders,
	}
	claims := claimServing{journal: journal, preparation: preparation, open: opener.open, executor: executor,
		startSocketFolder: *startSocketFolder, socket: socket}
	if err := claims.run(ctx, func() {}); err != nil {
		return err
	}
	return nil
}

// runtimeOpener opens the driver of a runtime the journal hands this host, by the variant its start grant names:
// a headless runtime runs one child per turn, a terminal runtime keeps one program open on a PTY the attach socket
// owns.
type runtimeOpener struct {
	// worktrees prepares a connected project's children their own linked worktrees; nil on an enrolled host.
	worktrees *host.NativeWorktrees
	// relayState is the relay's whole state folder, which a connected child's confined program neither reads nor
	// writes.
	relayState         string
	stateFolder        string
	installationFolder string
	// codexOwners keeps the one app-server of each Codex account generation, shared by its runtimes' threads.
	codexOwners *host.CodexOwners
	journalURL  string
	// sessionJournalURL is the journal's address from inside a session container, whose network shares nothing with
	// the host's: the relays there ask the journal at this address.
	sessionJournalURL string
	hookCommand       string
	socket            *host.AttachSocket
	// containers and installation run a contained session's program in its own container; a local host has neither.
	containers   host.Containers
	installation host.InstallationName
	// declared is every driver this host advertised to the journal; a grant for any other is refused.
	declared []client.HostDescriptor
	// usage queues what the usage readers of each start observed, for its own worker to send.
	usage *host.UsageReports
	// statusLines are the sockets where terminal starts' status-line readers hand their windows.
	statusLines *host.StatusLineRelays
}

// ErrCodexChildUnconfined refuses a connected child on Codex: its runtimes are threads of one app-server per account,
// which no confinement of one child's checkout can hold.
var ErrCodexChildUnconfined = errors.New("a connected child cannot run on Codex, whose shared app-server is never confined to one checkout")

// defaultRows and defaultColumns size a terminal the host opens before any user attaches to it.
const (
	defaultRows    uint16 = 40
	defaultColumns uint16 = 120
)

func (opener runtimeOpener) open(runtimeID string, prepared host.PreparedStart) (serving.Runtime, error) {
	grant := prepared.Grant
	profile, known := profileFor[grant.Runtime.Driver]
	if !known {
		return nil, fmt.Errorf("runtime %s runs %q, which has no pinned profile", runtimeID, grant.Runtime.Driver)
	}
	if !advertises(opener.declared, grant.Runtime.DriverKey, grant.Runtime.DriverBuild) {
		return nil, drivercontracts.RefuseStart(drivercontracts.RefusalPinnedBuildMissing, fmt.Errorf(
			"runtime %s runs %s at %s: %w", runtimeID, grant.Runtime.DriverKey, grant.Runtime.DriverBuild,
			ErrDriverNotAdvertised))
	}
	if err := pinnedBuild(profile, grant.Runtime.DriverBuild); err != nil {
		return nil, drivercontracts.RefuseStart(drivercontracts.RefusalPinnedBuildMissing, fmt.Errorf("runtime %s: %w", runtimeID, err))
	}
	var confined *host.ChildConfinement
	if prepared.Claim.ChildCheckout != nil && opener.worktrees != nil {
		child, confinement, err := opener.inChildWorktree(runtimeID, prepared)
		if err != nil {
			return nil, err
		}
		prepared, confined = child, &confinement
	}
	environment, err := cleanEnvironmentOf(opener.stateFolder, opener.installationFolder, runtimeID, prepared)
	if err != nil {
		return nil, err
	}
	manifest, contained, err := prepared.ContainerManifest()
	if err != nil {
		return nil, err
	}
	registration, registered := driverRegistrations[grant.Runtime.DriverKey]
	if !registered {
		return nil, fmt.Errorf("runtime %s runs the driver %q, which this host has no registration for", runtimeID,
			grant.Runtime.DriverKey)
	}
	if contained {
		return registration.openContained(opener, runtimeID, prepared, profile, manifest)
	}
	if confined != nil && registration.confinementRefusal != nil {
		return nil, fmt.Errorf("runtime %s: %w", runtimeID, registration.confinementRefusal)
	}

	return registration.open(opener, runtimeID, prepared, profile, environment, confined)
}

// driverRegistration is how this host opens one registered driver, found by its key alone: in a session's own
// container or on the host, and the reason it refuses a confined child, when it cannot hold one.
type driverRegistration struct {
	open func(opener runtimeOpener, runtimeID string, prepared host.PreparedStart, profile contracts.DriverProfile,
		environment []string, confined *host.ChildConfinement) (serving.Runtime, error)
	openContained func(opener runtimeOpener, runtimeID string, prepared host.PreparedStart,
		profile contracts.DriverProfile, manifest host.ContainerManifest) (serving.Runtime, error)
	confinementRefusal error
}

// driverRegistrations are the drivers this host opens, by the registration key the journal names in the grant.
var driverRegistrations = map[string]driverRegistration{
	"claude-code": {
		open:          runtimeOpener.terminalRuntime,
		openContained: inContainer(runtimeOpener.containedTerminalRuntime),
	},
	"claude-code-headless": {
		open:          runtimeOpener.headlessRuntime,
		openContained: inContainer(runtimeOpener.containedHeadlessRuntime),
	},
	"codex-headless": {
		open: func(opener runtimeOpener, runtimeID string, prepared host.PreparedStart, _ contracts.DriverProfile,
			environment []string, _ *host.ChildConfinement) (serving.Runtime, error) {
			return opener.codexRuntime(runtimeID, prepared, environment)
		},
		openContained:      inContainer(runtimeOpener.containedHeadlessRuntime),
		confinementRefusal: ErrCodexChildUnconfined,
	},
	"codex": {
		open:               runtimeOpener.terminalRuntime,
		openContained:      inContainer(runtimeOpener.containedTerminalRuntime),
		confinementRefusal: ErrCodexChildUnconfined,
	},
}

// inContainer opens a registration's runtime in its session's own container, on a host that runs containers.
func inContainer(
	open func(opener runtimeOpener, runtimeID string, prepared host.PreparedStart, profile contracts.DriverProfile,
		manifest host.ContainerManifest) (serving.Runtime, error),
) func(runtimeOpener, string, host.PreparedStart, contracts.DriverProfile, host.ContainerManifest) (serving.Runtime, error) {
	return func(opener runtimeOpener, runtimeID string, prepared host.PreparedStart, profile contracts.DriverProfile,
		manifest host.ContainerManifest) (serving.Runtime, error) {
		if opener.installation == "" {
			return nil, fmt.Errorf("runtime %s runs contained, which this host runs in no container", runtimeID)
		}

		return open(opener, runtimeID, prepared, profile, manifest)
	}
}

// inChildWorktree prepares the linked worktree of a connected project's child before its process exists, keeps the
// runtime and its start on the claim's receipt, serves the Git broker for it at a short private socket, confines the
// child to the worktree and that socket, and answers the start with the worktree as the runtime's folder and the
// socket as its broker's. A machine that cannot confine the child refuses its start.
func (opener runtimeOpener) inChildWorktree(
	runtimeID string,
	prepared host.PreparedStart,
) (host.PreparedStart, host.ChildConfinement, error) {
	ctx := context.Background()
	checkout := prepared.Claim.ChildCheckout
	claim := host.WorktreeClaim{ClaimID: checkout.ClaimID, Generation: checkout.Generation,
		ChildID: prepared.Claim.SessionID, Writes: checkout.Writes, BaseOID: checkout.BaseOID}
	receipt, err := opener.worktrees.Prepare(ctx, claim)
	if err != nil {
		return host.PreparedStart{}, host.ChildConfinement{}, fmt.Errorf("runtime %s: its worktree was not prepared: %w",
			runtimeID, err)
	}
	if err := opener.worktrees.RecordRuntime(receipt, runtimeID, prepared.Claim.StartKey); err != nil {
		return host.PreparedStart{}, host.ChildConfinement{}, err
	}
	common, err := opener.worktrees.CommonDirectory(ctx)
	if err != nil {
		return host.PreparedStart{}, host.ChildConfinement{}, err
	}
	// The child changes Git only through the broker of fixed operations; its socket listens before the confinement
	// names it, as the confinement matches the socket's real path.
	socket := host.BrokerSocketPath(runtimeID)
	listener, err := host.ListenBroker(socket)
	if err != nil {
		return host.PreparedStart{}, host.ChildConfinement{}, fmt.Errorf("runtime %s: its Git broker was not served: %w",
			runtimeID, err)
	}
	folders := host.LocalProjectFolders{Checkout: receipt.Path, Project: opener.worktrees.Root, Common: common,
		State: opener.relayState, Runtime: filepath.Join(opener.stateFolder, "runtimes", runtimeID), Broker: socket}
	if account := accountOf(prepared, opener.installationFolder, runtimeID); account != nil {
		folders.Account = account.Folder
	}
	confinement, err := host.ConfineChild(folders)
	if err != nil {
		listener.Close()
		return host.PreparedStart{}, host.ChildConfinement{}, fmt.Errorf(
			"runtime %s: a connected child starts only confined: %w", runtimeID, err)
	}
	go host.ServeBroker(listener, host.GitBroker{Checkout: receipt.Path, Writes: checkout.Writes, Git: "git"})
	prepared.Grant.Runtime.Folder = receipt.Path
	prepared.BrokerSocket = socket

	return prepared, confinement, nil
}

// codexRuntime opens a Codex runtime as one thread on its account generation's shared app-server, in an empty root
// the account trusts, with the work folder as its writable root. It never opens a second interactive Codex: a
// terminal-only operation answers that it needs a terminal.
func (opener runtimeOpener) codexRuntime(
	runtimeID string,
	prepared host.PreparedStart,
	environment []string,
) (serving.Runtime, error) {
	ctx := context.Background()
	account := prepared.Claim.Directory
	installation := host.Installation{Folder: opener.installationFolder}
	workingRoots := filepath.Join(opener.stateFolder, "codex-roots")
	ownerRoot := filepath.Join(workingRoots, "owner-"+strconv.Itoa(prepared.Claim.Generation))
	if err := os.MkdirAll(ownerRoot, 0o700); err != nil {
		return nil, err
	}
	hooks, tables, err := profiles.CodexAccountHooks(account, opener.hookCommand)
	if err != nil {
		return nil, err
	}
	transport := prepared.Transport()
	root, err := host.CodexPreparationOf(installation).PrepareRoot(ctx, host.CodexRootRequest{
		Account: account, WorkingRoots: workingRoots, Root: runtimeID, Hooks: hooks, HookTables: tables,
		Transport: transport,
	})
	if err != nil {
		return nil, err
	}
	executable := installedProgram(opener.installationFolder, profiles.Codex{})
	owner, err := opener.codexOwners.Of(ctx, account, prepared.Claim.Generation,
		func(ctx context.Context) (*host.CodexOwner, error) {
			return host.StartCodexOwner(ctx, executable, environment, ownerRoot, prepared.Claim.SignInMethod)
		})
	if err != nil {
		return nil, err
	}
	runtime := prepared.Runtime()
	settings := host.CodexThreadSettings{
		Root: root, WritableRoots: []string{runtime.Folder}, Transport: transport,
	}
	if opener.usage != nil {
		usage := host.NewUsageSink(prepared, opener.usage)
		owner.ReportWindowsTo(usage)
		settings.Usage = usage
	}
	if runtime.Model != nil {
		settings.Model = *runtime.Model
	}
	return drivers.NewCodexDriver(owner, settings, runtime.ProcessGeneration), nil
}

// headlessRuntime opens a headless runtime, one child per turn, from its launch grant, with a conversation of its own, the
// pinned profile of its program and the model the journal asked for.
func (opener runtimeOpener) headlessRuntime(
	runtimeID string,
	prepared host.PreparedStart,
	profile contracts.DriverProfile,
	environment []string,
	confined *host.ChildConfinement,
) (serving.Runtime, error) {
	grant := prepared.Grant
	settingsFolder := filepath.Join(opener.stateFolder, "runtimes", runtimeID)
	if err := host.RequireNoLinks(opener.stateFolder, settingsFolder); err != nil {
		return nil, err
	}
	conversationID, resumes, err := conversationOf(prepared, grant.Runtime.Folder)
	if err != nil {
		return nil, err
	}
	headless := drivers.HeadlessRuntime{
		JournalURL: opener.journalURL,
		Credential: grant.Token,
		ProfilePin: grant.ProfileEnvironment(),
		Start: startOnThisMachine(grant, conversationID, settingsFolder, opener.hookCommand,
			accountOf(prepared, opener.installationFolder, runtimeID)),
		ResumesConversation: resumes,
		Profile:             profile,
		Environment:         environment,
		ReadFiles:           prepared.Claim.Recipe.ReadFiles,
		RelayVariables:      prepared.RelayVariables(settingsFolder),
		Executable:          installedProgram(opener.installationFolder, profile),
		Usage:               opener.usageOf(prepared),
	}
	// A nil pointer must not reach the interface, where it would read as a confinement.
	if confined != nil {
		headless.Confinement = confined
	}
	return drivers.NewHeadlessDriver(headless, grant.Runtime.ProcessGeneration), nil
}

// terminalRuntime starts the runtime's program on a PTY the attach socket owns, or takes the one a user attached
// first, and drives it through that terminal's screen and gate: the classifier and the key script runner read the
// same screen the user sees, and every key, the user's too, passes the one gate.
func (opener runtimeOpener) terminalRuntime(
	runtimeID string,
	prepared host.PreparedStart,
	profile contracts.DriverProfile,
	environment []string,
	confined *host.ChildConfinement,
) (serving.Runtime, error) {
	grant := prepared.Grant
	account := accountOf(prepared, opener.installationFolder, runtimeID)
	account.StatusLine = opener.statusLineOf(runtimeID, prepared, profile)
	request, err := startOf(profile, opener.stateFolder, opener.journalURL, opener.hookCommand, runtimeID, grant,
		environment, account,
		prepared.RelayVariables(filepath.Join(opener.stateFolder, "runtimes", runtimeID)),
		installedProgram(opener.installationFolder, profile))
	if err != nil {
		return nil, err
	}
	request.Rows, request.Columns = defaultRows, defaultColumns
	request.ReadFiles = prepared.Claim.Recipe.ReadFiles
	if confined != nil {
		request.Command = confined.Command(request.Command)
	}
	opened, err := opener.socket.Open(request)
	if err != nil {
		return nil, err
	}

	return terminalDriverOf(profile, opened, grant.Runtime.ProcessGeneration, request.ConversationID), nil
}

// instanceRunsOn answers whether a container instance still runs, for telling a lost attachment from an ended
// session; a failed inspect counts as not running. It only looks.
func instanceRunsOn(containers host.Containers) func(instance string) bool {
	return func(instance string) bool {
		running, err := containers.IsRunning(context.Background(), instance)

		return err == nil && running
	}
}

// terminalDriverOf builds the terminal driver of a program the host runs, with its key script runner reading the
// menus through the profile's layout and reporting each step through the driver's progress relay.
func terminalDriverOf(
	profile contracts.DriverProfile,
	opened host.Terminal,
	generation int,
	conversationID string,
) *drivers.TerminalDriver {
	layout := profile.Screens()
	classifier := screen.NewClassifier(layout, opened.Reader)
	relay := &drivers.ProgressRelay{}
	clock := keyscripts.WallClock{}
	view := screen.NewView(layout, opened.Reader)
	driver := keyscripts.Driver{Name: profile.Driver(), Layout: layout}

	return drivers.NewTerminalDriver(drivers.TerminalRuntime{
		Profile:           profile.Driver() + "@" + profile.Build(),
		Classifier:        classifier,
		Gate:              opened.Gate,
		Composer:          layout.Composer.Name(),
		Layout:            layout,
		Hangup:            opened.Hangup,
		EnterPrivate:      opened.EnterPrivate,
		ConfirmPrivateEnd: opened.ConfirmPrivateEnd,
		Attachment:        opened.Attachment,
		Generation:        opened.Reader.Generation,
		Scripts:           scripts.Registered(),
		Runner:            keyscripts.NewRunner(opened.Gate, classifier, clock, view, driver, relay.Report),
		Clock:             clock,
		ProcessGeneration: generation,
		ConversationID:    conversationID,
		Progress:          relay,
	})
}

// startTerminalOn starts a runtime's terminal for the attach socket of a contained host: the terminal of the session
// container that runs its program, and a PTY for a program the host runs itself.
func startTerminalOn(containers host.Containers) host.TerminalStarter {
	return func(request host.AttachRequest) (host.TerminalStream, error) {
		if request.ContainerInstance == "" {
			return startTerminal(request)
		}

		return containers.AttachTerminal(context.Background(), request.ContainerInstance, request.Rows, request.Columns)
	}
}

// startTerminal starts a runtime's program on a PTY the host owns, for the attach socket.
func startTerminal(request host.AttachRequest) (host.TerminalStream, error) {
	if len(request.Command) == 0 {
		return nil, fmt.Errorf("the host does not run runtime %s; attach with --agent to open it", request.RuntimeID)
	}
	command := exec.Command(request.Command[0], request.Command[1:]...)
	command.Dir = request.Folder
	command.Env = request.Env
	files, err := host.OpenReadFiles(request.ReadFiles)
	if err != nil {
		return nil, err
	}
	defer host.CloseFiles(files)
	command.ExtraFiles = files
	file, err := pty.StartWithSize(command, &pty.Winsize{Rows: request.Rows, Cols: request.Columns})
	if err != nil {
		return nil, err
	}

	return host.PtyTerminal(file), nil
}

// detachKey (Ctrl-]) leaves the program running and gives the terminal back.
const detachKey = 0x1d

// attach opens the agent's main runtime on this host, or shows one the host already runs, in this terminal. Keys and
// resizes go to the program, its output comes back; Ctrl-] detaches and leaves it running.
func attach(arguments []string) error {
	flags := flag.NewFlagSet("attach", flag.ContinueOnError)
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	agentID := flags.String("agent", "", "the agent whose main runtime to open")
	runtimeID := flags.String("runtime", "", "a runtime the host already runs, to attach to again")
	folder := flags.String("folder", "", "the folder the agent works in")
	driver := flags.String("driver", "claude", "claude or codex")
	hookCommand := flags.String("hook-command", "", "the hook relay command the program calls")
	installationFolder := flags.String("installation", "", "the protected installation saved-account starts run from")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	rows, columns := terminalSize()
	request := host.AttachRequest{RuntimeID: *runtimeID, Rows: rows, Columns: columns}
	if *runtimeID == "" {
		opened, err := openMainRuntime(*stateFolder, *installationFolder, *agentID, *folder, *driver, *hookCommand)
		if err != nil {
			return err
		}
		request = opened
		request.Rows, request.Columns = rows, columns
	}

	connection, err := net.Dial("unix", (&host.AttachSocket{Folder: *stateFolder}).Path())
	if err != nil {
		return fmt.Errorf("journal-agent serve is not running: %w", err)
	}
	defer connection.Close()
	if err := host.WriteAttachRequest(connection, request); err != nil {
		return err
	}
	if term.IsTerminal(int(os.Stdin.Fd())) {
		previous, err := term.MakeRaw(int(os.Stdin.Fd()))
		if err == nil {
			defer term.Restore(int(os.Stdin.Fd()), previous)
		}
	}
	resizes := make(chan os.Signal, 1)
	signal.Notify(resizes, syscall.SIGWINCH)
	defer signal.Stop(resizes)
	go func() {
		for range resizes {
			rows, columns := terminalSize()
			_ = host.WriteResize(connection, rows, columns)
		}
	}()
	go forwardKeys(os.Stdin, connection)
	log.Printf("runtime %s attached; Ctrl-] detaches and leaves it running", request.RuntimeID)
	return host.ReadOutput(connection, os.Stdout)
}

func forwardKeys(in io.Reader, connection net.Conn) {
	buffer := make([]byte, 1024)
	for {
		count, err := in.Read(buffer)
		if count > 0 {
			if at := strings.IndexByte(string(buffer[:count]), detachKey); at >= 0 {
				_ = host.WriteKeys(connection, buffer[:at])
				connection.Close()
				return
			}
			if host.WriteKeys(connection, buffer[:count]) != nil {
				return
			}
		}
		if err != nil {
			connection.Close()
			return
		}
	}
}

// installedProgram is the absolute path of the program in the protected installation, which a prepared start runs.
func installedProgram(installationFolder string, profile contracts.DriverProfile) string {
	return host.Installation{Folder: installationFolder}.Path(filepath.Join("bin", profile.Driver()))
}

// accountOf is the saved account a prepared start signs in with, the journal's MCP server from the protected
// installation and the runtime as the launch's reference.
func accountOf(prepared host.PreparedStart, installationFolder, runtimeID string) *contracts.AccountStart {
	installation := host.Installation{Folder: installationFolder}
	return prepared.AccountStart(&contracts.JournalServer{
		Command: installation.Path(installedPHP),
		Relay:   installation.Path(installedMcpRelay),
	}, runtimeID)
}

// The protected installation's PHP binary and the journal's MCP relay it runs.
const (
	installedPHP      = "bin/php"
	installedMcpRelay = "journal/bin/journal-mcp"
)

// cleanEnvironmentOf is the prepared start's environment: the host's platform variables, an empty home and empty
// folders of the runtime's own, the protected installation's PATH and the account recipe's settings.
func cleanEnvironmentOf(
	stateFolder, installationFolder, runtimeID string,
	prepared host.PreparedStart,
) ([]string, error) {
	runtimeFolder := filepath.Join(stateFolder, "runtimes", runtimeID)
	return host.CleanEnvironment(os.Environ(), prepared.Claim.Recipe, host.StartFolders{
		Home:         filepath.Join(runtimeFolder, "home"),
		EmptyFolders: filepath.Join(runtimeFolder, "empty"),
		Installation: installationFolder,
	})
}

// startPreparation prepares every runtime start of this host: the grant and account claim saved in its private state,
// and the start refused unless its prerequisites hold.
func startPreparation(journal *client.Client, stateFolder string, prerequisites host.StartPrerequisites) host.StartPreparation {
	return host.StartPreparation{
		Journal:        journal,
		States:         host.StartStates{Folder: filepath.Join(stateFolder, "starts")},
		RuntimesFolder: filepath.Join(stateFolder, "runtimes"),
		Prerequisites:  prerequisites,
	}
}

// errNoInstallation refuses an account start on a host that serves without a protected installation.
var errNoInstallation = errors.New("this host has no protected installation, so it starts no saved account")

// errNoContainer refuses an account start a contained host was granted without a container to run it in.
var errNoContainer = errors.New("this host runs agents in containers, and the start's grant names no container")

// localPrerequisites allows a local host's account start only from its verified installation, on this machine's
// platform where the host proved the program's protection.
func localPrerequisites(stateFolder, installationFolder string) host.StartPrerequisites {
	return func(grant client.Grant, claim client.ClaimedStart) error {
		if installationFolder == "" {
			return errNoInstallation
		}
		if _, err := (host.Installation{Folder: installationFolder}).Verify(); err != nil {
			return err
		}
		return protectionProved(host.LocalPlatform(), stateFolder, false, grant, claim)
	}
}

// containedPrerequisites allows a contained host's account start on the platform its container launches: the
// protected profile's own platform for a protected-account container, the agent image's sandbox otherwise. A driver
// on the protected-account trial starts its protected container before its evidence is recorded.
func containedPrerequisites(stateFolder, seccomp string, trial []string, containers host.Containers) host.StartPrerequisites {
	return func(grant client.Grant, claim client.ClaimedStart) error {
		manifest, named, err := (host.PreparedStart{Grant: grant, Claim: claim}).ContainerManifest()
		if err != nil {
			return err
		}
		if !named {
			return errNoContainer
		}
		if manifest.IsProtected() {
			onTrial := isOnTrial(trial, grant.Runtime.DriverKey)
			return protectionProved(host.ProtectedPlatform(containers), stateFolder, onTrial, grant, claim)
		}
		platform := host.ContainedPlatform(context.Background(), containers, seccomp)
		return protectionProved(platform, stateFolder, false, grant, claim)
	}
}

// isOnTrial reports whether the trial names the driver or the family it is a mode of: claude-code covers
// claude-code-headless.
func isOnTrial(trial []string, driverKey string) bool {
	return slices.ContainsFunc(trial, func(named string) bool {
		return driverKey == named || strings.HasPrefix(driverKey, named+"-")
	})
}

// trialDrivers reads the drivers named on the protected-account trial, split by commas.
func trialDrivers(named string) []string {
	var drivers []string
	for _, driver := range strings.Split(named, ",") {
		if trimmed := strings.TrimSpace(driver); trimmed != "" {
			drivers = append(drivers, trimmed)
		}
	}
	return drivers
}

// protectionProved refuses the start unless the program's pinned build has every item of its protection enforced on
// the platform it runs on. A driver on trial starts once every item has its mechanism, since the trial is where the
// runs that show each hold are made.
func protectionProved(
	platform host.ProtectionPlatform,
	stateFolder string,
	onTrial bool,
	grant client.Grant,
	claim client.ClaimedStart,
) error {
	profile, known := profileFor[grant.Runtime.Driver]
	if !known {
		return fmt.Errorf("%q has no pinned profile", grant.Runtime.Driver)
	}
	if claim.Recipe.DriverVersion != grant.Runtime.DriverBuild {
		return fmt.Errorf("the account recipe is for %s %s, the runtime for %s", profile.Driver(),
			claim.Recipe.DriverVersion, grant.Runtime.DriverBuild)
	}
	capability, err := host.InspectProtection(platform, profile.Driver(), claim.Recipe.DriverVersion,
		host.NativeEvidence{Folder: stateFolder})
	if err != nil {
		return err
	}
	if capability.Available || (onTrial && capability.AwaitsEvidenceOnly()) {
		return nil
	}
	return fmt.Errorf("the protected arrangement of %s %s is not available on %s (driver %s, on trial: %t): %s",
		profile.Driver(), claim.Recipe.DriverVersion, platform.Name, grant.Runtime.DriverKey, onTrial,
		strings.Join(capability.Shortfalls(), "; "))
}

// openMainRuntime asks the journal for the main runtime, prepares its start like any other runtime's and builds the
// program's terminal start from the pinned profile, with the credential and generation for the hook relay.
func openMainRuntime(
	stateFolder, installationFolder, agentID, folder, program, hookCommand string,
) (host.AttachRequest, error) {
	profile, known := profileFor[program]
	if !known || agentID == "" || folder == "" {
		return host.AttachRequest{}, errors.New("attach needs --agent, --folder and --driver claude or codex")
	}
	enrollment, err := (host.State{Folder: stateFolder}).Load()
	if err != nil {
		return host.AttachRequest{}, err
	}
	journal := client.New(enrollment)
	ctx := context.Background()
	absolute, err := filepath.Abs(folder)
	if err != nil {
		return host.AttachRequest{}, err
	}
	opened, err := journal.OpenMainRuntime(ctx, client.MainRuntimeRequest{AgentID: agentID, Folder: absolute, Driver: profile.Driver(), DriverBuild: profile.Build(), Profile: program})
	if err != nil {
		return host.AttachRequest{}, err
	}
	prepared, err := startPreparation(journal, stateFolder, localPrerequisites(stateFolder, installationFolder)).
		Prepare(ctx, opened.RuntimeID)
	if err != nil {
		return host.AttachRequest{}, err
	}
	environment, err := cleanEnvironmentOf(stateFolder, installationFolder, opened.RuntimeID, prepared)
	if err != nil {
		return host.AttachRequest{}, err
	}
	request, err := startOf(profile, stateFolder, journal.JournalURL(), hookCommand, opened.RuntimeID, prepared.Grant,
		environment, accountOf(prepared, installationFolder, opened.RuntimeID),
		prepared.RelayVariables(filepath.Join(stateFolder, "runtimes", opened.RuntimeID)),
		installedProgram(installationFolder, profile))
	request.ReadFiles = prepared.Claim.Recipe.ReadFiles
	return request, err
}

// startOf builds the program's terminal start for a runtime from its pinned profile and its start grant: the
// settings files and start folders written, the arguments, and the environment with the credential, the process
// generation and the bypass log for the hook relay. Attaching a user and serving a terminal runtime both start
// the program through it.
func startOf(
	profile contracts.DriverProfile,
	stateFolder, journalURL, hookCommand, runtimeID string,
	grant client.Grant,
	environment []string,
	account *contracts.AccountStart,
	relayVariables []string,
	executable string,
) (host.AttachRequest, error) {
	conversationID, err := newConversationID()
	if err != nil {
		return host.AttachRequest{}, err
	}
	settingsFolder := filepath.Join(stateFolder, "runtimes", runtimeID)
	start := startOnThisMachine(grant, conversationID, settingsFolder, hookCommand, account).Terminal(false)
	if err := host.RequireNoLinks(stateFolder, start.SettingsFolder); err != nil {
		return host.AttachRequest{}, err
	}
	if err := writeSettings(profile, start); err != nil {
		return host.AttachRequest{}, err
	}
	startArguments, err := profile.Arguments(start)
	if err != nil {
		return host.AttachRequest{}, err
	}
	folderArguments, err := host.WriteStartFolders(start.SettingsFolder, grant.Folders)
	if err != nil {
		return host.AttachRequest{}, err
	}
	startArguments = append(startArguments, folderArguments...)
	startEnvironment := append(profile.Environment(drivers.WithoutJournalVariables(environment), start),
		"JOURNAL_URL="+journalURL, "JOURNAL_START_TOKEN="+grant.Token,
		"JOURNAL_PROCESS_GENERATION="+strconv.Itoa(grant.Runtime.ProcessGeneration),
		"JOURNAL_BYPASS_LOG="+filepath.Join(start.SettingsFolder, drivers.BypassLogName))
	startEnvironment = append(startEnvironment, grant.ProfileEnvironment()...)
	startEnvironment = append(startEnvironment, relayVariables...)
	return host.AttachRequest{
		RuntimeID:      runtimeID,
		ConversationID: conversationID,
		Driver:         profile.Driver(),
		Command:        append([]string{executable}, startArguments...),
		Folder:         grant.Runtime.Folder,
		Env:            startEnvironment,
	}, nil
}

func writeSettings(profile contracts.DriverProfile, start contracts.Start) error {
	files, err := profile.SettingsFiles(start)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(start.SettingsFolder, 0o700); err != nil {
		return err
	}
	for _, file := range files {
		target := filepath.Join(start.SettingsFolder, file.Name)
		if err := os.WriteFile(target, file.Content, 0o600); err != nil {
			return err
		}
	}
	return nil
}

func terminalSize() (uint16, uint16) {
	columns, rows, err := term.GetSize(int(os.Stdin.Fd()))
	if err != nil {
		return 40, 120
	}
	return uint16(rows), uint16(columns)
}

// ErrResumeFailed refuses a start whose explicitly chosen conversation has no transcript left to resume.
var ErrResumeFailed = errors.New("the chosen conversation's transcript is gone, so it cannot be resumed; start fresh instead")

// conversationOf is the conversation a start runs in: the one the journal chose to resume when its transcript is in
// the start's own account folder for its own workspace, else a new one, unless the owner chose it explicitly.
func conversationOf(prepared host.PreparedStart, workFolder string) (string, bool, error) {
	if resumed, ok := prepared.ResumableConversation(workFolder); ok {
		return resumed, true, nil
	}
	if prepared.Claim.ConversationRequired {
		return "", false, ErrResumeFailed
	}
	conversationID, err := newConversationID()
	return conversationID, false, err
}

// newConversationID is a random UUID: Claude Code takes the exact session id it is given and never picks the latest.
func newConversationID() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}
	random[6] = random[6]&0x0f | 0x40
	random[8] = random[8]&0x3f | 0x80
	return fmt.Sprintf("%x-%x-%x-%x-%x", random[0:4], random[4:6], random[6:8], random[8:10], random[10:16]), nil
}

// layoutOf is the screen layout of the program an attach request starts, from the profile of the program it names.
func layoutOf(request host.AttachRequest) (screen.Layout, error) {
	profile, known := profileFor[request.Driver]
	if !known {
		return screen.Layout{}, fmt.Errorf("no profile for the program %q", request.Driver)
	}

	return profile.Screens(), nil
}

// pinnedBuild refuses a runtime opened for another build than the profile pins, and a program on this host whose
// installed version is not that build, before any work starts.
func pinnedBuild(profile contracts.DriverProfile, requested string) error {
	if requested != profile.Build() {
		return fmt.Errorf("build %s of %s is not the pinned build %s", requested, profile.Driver(), profile.Build())
	}
	output, err := exec.Command(profile.Driver(), "--version").Output()
	if err != nil {
		return fmt.Errorf("the version of %s could not be read: %w", profile.Driver(), err)
	}

	return profile.CheckBuild(strings.TrimSpace(string(output)))
}

// usageOf is the usage sink of the start; none when this host queues no usage.
func (opener runtimeOpener) usageOf(prepared host.PreparedStart) drivers.UsageObserver {
	if opener.usage == nil {
		return nil
	}
	return host.NewUsageSink(prepared, opener.usage)
}

// statusLineOf is the status-line reader command of a terminal Claude start signed in with Claude, whose status line
// reports its limit windows: the installed host program, given the socket of this start's own relay. Any other start,
// or one whose relay cannot open, reads no window there.
func (opener runtimeOpener) statusLineOf(
	runtimeID string,
	prepared host.PreparedStart,
	profile contracts.DriverProfile,
) string {
	if !profile.ReportsLimitWindows() || prepared.Claim.SignInMethod != oauthSignIn || opener.statusLines == nil {
		return ""
	}
	program, err := os.Executable()
	if err != nil {
		log.Printf("runtime %s reads no limit windows: %v", runtimeID, err)
		return ""
	}
	relay := filepath.Join(opener.stateFolder, "runtimes", runtimeID, statusLineSocket)
	if err := os.MkdirAll(filepath.Dir(relay), 0o700); err != nil {
		log.Printf("runtime %s reads no limit windows: %v", runtimeID, err)
		return ""
	}
	if err := opener.statusLines.Open(runtimeID, relay, host.NewUsageSink(prepared, opener.usage)); err != nil {
		log.Printf("runtime %s reads no limit windows: %v", runtimeID, err)
		return ""
	}
	return shellwords.Quoted(program, "status-line", "--relay", relay)
}

const (
	// oauthSignIn is the sign-in method of an account signed in with Claude or ChatGPT.
	oauthSignIn      = "oauth"
	statusLineSocket = "status-line.sock"
)

// cleanupInterval is how often a contained host takes the launch cleanups the journal says it owes; a closed
// session's capacity is given back only once its cleanup is reported.
const cleanupInterval = 10 * time.Second

// runCleanups takes the journal's pending launch cleanups now and then every interval until the host stops; a failed
// round is logged and tried again on the next.
func runCleanups(ctx context.Context, cleanup host.LaunchCleanup, journal host.CleanupJournal) {
	ticker := time.NewTicker(cleanupInterval)
	defer ticker.Stop()
	for {
		if err := cleanup.RunPending(ctx, journal); err != nil && ctx.Err() == nil {
			log.Printf("the launch cleanups were not all done: %v", err)
		}
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		}
	}
}
