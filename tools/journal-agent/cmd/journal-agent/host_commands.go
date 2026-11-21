package main

import (
	"bufio"
	"context"
	"crypto/rand"
	"errors"
	"flag"
	"fmt"
	"io"
	"journal-agent/recording"
	"log"
	"net"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"

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

// defaultStateFolder is the host's private folder unless --state names another.
func defaultStateFolder() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return ".journal-agent"
	}
	return filepath.Join(home, ".journal-agent")
}

// enroll stores the host id and the secret agents:host-enroll printed. The secret is read from standard input or
// from the file --secret-file names, so it never appears in the environment, the process list or the shell history:
// an operator passes the file's path, never the secret. An enrollment already held for the same journal and host is
// kept as it is, so a one-shot service may run enroll on every start.
func enroll(arguments []string) error {
	flags := flag.NewFlagSet("enroll", flag.ContinueOnError)
	journalURL := flags.String("journal", "", "the journal's URL")
	hostID := flags.String("host", "", "the host id agents:host-enroll printed")
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
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

	return pinned.AssertLoaded(context.Background(), host.Containers{Docker: "docker", Host: dockerSocket})
}

// serve claims this host's requests until it is stopped. Carrying them out is the scheduler's job; until then each
// claimed request is only logged by its identity, never by its content.
func serve(arguments []string) error {
	flags := flag.NewFlagSet("serve", flag.ContinueOnError)
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
	hookCommand := flags.String("hook-command", "", "the hook relay command the programs call")
	installationFolder := flags.String("installation", "", "the protected installation saved-account starts run from")
	arrangementFlag := flags.String("arrangement", string(host.Local), "where agents run: local or contained")
	dockerSocket := flags.String("docker", "", "the agent daemon's socket a contained host starts containers through")
	installationName := flags.String("installation-name", "", "the prefix of a contained host's containers")
	startSocketFolder := flags.String("start-socket-dir", "", "an owner-only folder for the start socket, the state folder by default")
	agentImage := flags.String("agent-image", "", "the agent image a contained host runs, by digest")
	runnerImage := flags.String("runner-image", "", "the sign-in runner image of a contained host, by digest")
	seccomp := flags.String("seccomp-profile", "", "the seccomp profile a contained host's agent containers run under")
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
	journal := client.New(enrollment).WithArrangement(string(arrangement))
	opener := runtimeOpener{stateFolder: *stateFolder, installationFolder: *installationFolder,
		codexOwners: &host.CodexOwners{}, journalURL: journal.JournalURL(), hookCommand: *hookCommand, socket: socket,
		declared: combinationsOf(arrangement)}
	if arrangement.IsContained() {
		rules := host.ContainerRules{Arrangement: arrangement, InstallationName: installation, AgentImage: *agentImage}
		opener.containers = host.Containers{Docker: "docker", Host: *dockerSocket, Rules: rules}
		opener.installation = installation
		opener.reportExit = journal.ReportExit
	}
	preparation := startPreparation(journal, *stateFolder, *installationFolder)
	reports := &host.StartReports{Folder: *stateFolder}
	sessions := host.ContainerSessions{}
	var bindsAccount func(ctx context.Context, folder string) (bool, error)
	if arrangement.IsContained() {
		sessions, err = host.ContainerSessionsOf(ctx, host.Containers{Docker: "docker", Host: *dockerSocket}, string(installation))
		if err != nil {
			return err
		}
		rules := host.ContainerRules{Arrangement: arrangement, InstallationName: installation, AgentImage: *agentImage}
		containers := host.Containers{Docker: "docker", Host: *dockerSocket, Rules: rules}
		bindsAccount = containers.BindsAccount
		evidence := host.NativeEvidence{Folder: *stateFolder}
		// Without a report the journal refuses every contained start, so a failed report stops no other work.
		if err := host.ReportContainedProtection(ctx, containers, *seccomp, evidence, journal); err != nil {
			log.Printf("the protection of the agent image was not reported: %v", err)
		}
	}
	// The journal refuses every call of a host of another protocol, so this report fails first when the versions differ.
	if err := journal.ReportCombinations(ctx, combinationsOf(arrangement)); err != nil {
		return fmt.Errorf("the journal did not take this host's combinations: %w", err)
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
	startSocket := host.StartSocket{Folder: *startSocketFolder, Executor: &protectedExecutor{
		preparation: preparation, open: opener.open, reports: reports, reporter: journal,
		codexOwners: opener.codexOwners, arrangement: arrangement, bindsAccount: bindsAccount,
	}}
	startListener, err := startSocket.Listen()
	if err != nil {
		return err
	}
	defer startListener.Close()
	go startSocket.Serve(ctx, startListener)
	loop := serving.NewLoop(journal, preparation, opener.open)
	watcher, err := host.NewScreenWatcher(ctx, journal, socket)
	if err != nil {
		return err
	}
	journal.Poll(ctx, func(claimed client.Claim) {
		watcher.Set(claimed.Watched)
		if len(claimed.Requests) == 0 {
			return
		}
		for _, request := range claimed.Requests {
			log.Printf("claimed %s request %s (sequence %d, attempt %d) of runtime %s", request.Operation, request.RequestID, request.Sequence, request.Attempt, request.RuntimeID)
		}
		loop.Take(ctx, claimed.Requests)
	})
	return nil
}

// runtimeOpener opens the driver of a runtime the journal hands this host, by the variant its start grant names:
// a headless runtime runs one child per turn, a terminal runtime keeps one program open on a PTY the attach socket
// owns.
type runtimeOpener struct {
	stateFolder        string
	installationFolder string
	// codexOwners keeps the one app-server of each Codex account generation, shared by its runtimes' threads.
	codexOwners *host.CodexOwners
	journalURL  string
	hookCommand string
	socket      *host.AttachSocket
	// containers, installation and reportExit run a contained session's program in its own container and report its
	// end; a local host has none of them.
	containers   host.Containers
	installation host.InstallationName
	reportExit   func(ctx context.Context, report client.LivenessReport) error
	// declared is every combination this host told the journal it can run; a grant for any other is refused.
	declared []client.HostCombination
}

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
	if !declares(opener.declared, grant.Runtime.Driver, grant.Runtime.DriverBuild, grant.Runtime.Variant) {
		return nil, fmt.Errorf("runtime %s: %w", runtimeID, ErrCombinationNotDeclared)
	}
	if err := pinnedBuild(profile, grant.Runtime.DriverBuild); err != nil {
		return nil, fmt.Errorf("runtime %s: %w", runtimeID, err)
	}
	environment, err := cleanEnvironmentOf(opener.stateFolder, opener.installationFolder, runtimeID, prepared)
	if err != nil {
		return nil, err
	}
	manifest, contained, err := prepared.ContainerManifest()
	if err != nil {
		return nil, err
	}
	if contained {
		return opener.containedRuntime(runtimeID, prepared, profile, manifest)
	}
	if profile.Program() == "codex" {
		return opener.codexRuntime(runtimeID, prepared, environment)
	}
	switch grant.Runtime.Variant {
	case drivers.HeadlessVariant:
		return opener.headlessRuntime(runtimeID, prepared, profile, environment)
	case drivers.TerminalVariant:
		return opener.terminalRuntime(runtimeID, prepared, profile, environment)
	}

	return nil, fmt.Errorf("runtime %s runs as %s, a variant this host has no runtime for", runtimeID,
		grant.Runtime.Variant)
}

// containedRuntime opens a contained runtime in its session's own container by its variant: a terminal runtime's
// program is the container's terminal process, a headless runtime's runs one container per turn.
func (opener runtimeOpener) containedRuntime(
	runtimeID string,
	prepared host.PreparedStart,
	profile contracts.ProgramProfile,
	manifest host.ContainerManifest,
) (serving.Runtime, error) {
	variant := prepared.Grant.Runtime.Variant
	if opener.installation == "" {
		return nil, fmt.Errorf("runtime %s runs contained as %s, which this host runs in no container", runtimeID, variant)
	}

	switch variant {
	case drivers.TerminalVariant:
		return opener.containedTerminalRuntime(runtimeID, prepared, profile, manifest)
	case drivers.HeadlessVariant:
		return opener.containedHeadlessRuntime(runtimeID, prepared, profile, manifest)
	}

	return nil, fmt.Errorf("runtime %s runs contained as %s, which this host runs in no container", runtimeID, variant)
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
			return host.StartCodexOwner(ctx, executable, environment, ownerRoot)
		})
	if err != nil {
		return nil, err
	}
	runtime := prepared.Runtime()
	settings := host.CodexThreadSettings{
		Root: root, WritableRoots: []string{runtime.Folder}, Transport: transport,
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
	profile contracts.ProgramProfile,
	environment []string,
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
	driver := drivers.NewHeadlessDriver(drivers.HeadlessRuntime{
		JournalURL:          opener.journalURL,
		Credential:          grant.Token,
		ProfilePin:          grant.ProfileEnvironment(),
		ConversationID:      conversationID,
		ResumesConversation: resumes,
		SettingsFolder:      settingsFolder,
		WorkingFolder:       grant.Runtime.Folder,
		HookCommand:         opener.hookCommand,
		Profile:             profile,
		Environment:         environment,
		ReadFiles:           prepared.Claim.Recipe.ReadFiles,
		Account:             accountOf(prepared, opener.installationFolder, runtimeID),
		RelayVariables:      prepared.RelayVariables(settingsFolder),
		Executable:          installedProgram(opener.installationFolder, profile),
	}, grant.Runtime.ProcessGeneration)
	identity := drivercontracts.RequestIdentity{RuntimeID: runtimeID}
	if grant.Runtime.Model != nil {
		change := drivercontracts.ModelChange{Request: identity, Model: *grant.Runtime.Model}
		_, _ = driver.ChangeModel(context.Background(), change)
	}
	if grant.Runtime.Effort != nil {
		change := drivercontracts.EffortChange{Request: identity, Effort: *grant.Runtime.Effort}
		_, _ = driver.ChangeEffort(context.Background(), change)
	}
	return driver, nil
}

// terminalRuntime starts the runtime's program on a PTY the attach socket owns, or takes the one a user attached
// first, and drives it through that terminal's screen and gate: the classifier and the key script runner read the
// same screen the user sees, and every key, the user's too, passes the one gate.
func (opener runtimeOpener) terminalRuntime(
	runtimeID string,
	prepared host.PreparedStart,
	profile contracts.ProgramProfile,
	environment []string,
) (serving.Runtime, error) {
	grant := prepared.Grant
	request, err := startOf(profile, opener.stateFolder, opener.journalURL, opener.hookCommand, runtimeID, grant,
		environment, accountOf(prepared, opener.installationFolder, runtimeID),
		prepared.RelayVariables(filepath.Join(opener.stateFolder, "runtimes", runtimeID)),
		installedProgram(opener.installationFolder, profile))
	if err != nil {
		return nil, err
	}
	request.Rows, request.Columns = defaultRows, defaultColumns
	request.ReadFiles = prepared.Claim.Recipe.ReadFiles
	opened, err := opener.socket.Open(request)
	if err != nil {
		return nil, err
	}

	return terminalDriverOf(profile, opened, grant.Runtime.ProcessGeneration), nil
}

// terminalDriverOf builds the terminal driver of a program the host runs, with its key script runner reading the
// menus through the profile's layout and reporting each step through the driver's progress relay.
func terminalDriverOf(profile contracts.ProgramProfile, opened host.Terminal, generation int) *drivers.TerminalDriver {
	layout := profile.Screens()
	classifier := screen.NewClassifier(layout, opened.Reader)
	relay := &drivers.ProgressRelay{}
	clock := keyscripts.WallClock{}
	view := screen.NewView(layout, opened.Reader)
	program := keyscripts.Program{Name: profile.Program(), Layout: layout}

	return drivers.NewTerminalDriver(drivers.TerminalRuntime{
		Profile:           profile.Program() + "@" + profile.Build(),
		Classifier:        classifier,
		Gate:              opened.Gate,
		Composer:          layout.Composer.Name(),
		Generation:        opened.Reader.Generation,
		Scripts:           scripts.Registered(),
		Runner:            keyscripts.NewRunner(opened.Gate, classifier, clock, view, program, relay.Report),
		Clock:             clock,
		ProcessGeneration: generation,
		Progress:          relay,
	})
}

// startTerminal starts a runtime's program on a PTY the host owns, for the attach socket.
func startTerminal(request host.AttachRequest) (*os.File, error) {
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
	return pty.StartWithSize(command, &pty.Winsize{Rows: request.Rows, Cols: request.Columns})
}

// detachKey (Ctrl-]) leaves the program running and gives the terminal back.
const detachKey = 0x1d

// attach opens the agent's main runtime on this host, or shows one the host already runs, in this terminal. Keys and
// resizes go to the program, its output comes back; Ctrl-] detaches and leaves it running.
func attach(arguments []string) error {
	flags := flag.NewFlagSet("attach", flag.ContinueOnError)
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
	agentID := flags.String("agent", "", "the agent whose main runtime to open")
	runtimeID := flags.String("runtime", "", "a runtime the host already runs, to attach to again")
	folder := flags.String("folder", "", "the folder the agent works in")
	program := flags.String("program", "claude", "claude or codex")
	hookCommand := flags.String("hook-command", "", "the hook relay command the program calls")
	installationFolder := flags.String("installation", "", "the protected installation saved-account starts run from")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	rows, columns := terminalSize()
	request := host.AttachRequest{RuntimeID: *runtimeID, Rows: rows, Columns: columns}
	if *runtimeID == "" {
		opened, err := openMainRuntime(*stateFolder, *installationFolder, *agentID, *folder, *program, *hookCommand)
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

// errCodexHasNoTerminal refuses to attach to Codex: its runtimes are threads on the account's shared app-server, and
// a second interactive Codex for the user to type into would be a second sign-in owner.
var errCodexHasNoTerminal = errors.New("a Codex runtime runs as a thread on its account's shared app-server and has " +
	"no terminal to attach to")

// installedProgram is the absolute path of the program in the protected installation, which a prepared start runs.
func installedProgram(installationFolder string, profile contracts.ProgramProfile) string {
	return host.Installation{Folder: installationFolder}.Path(filepath.Join("bin", profile.Program()))
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
// and the start refused unless it runs from the verified installation under a protected arrangement the host proved.
func startPreparation(journal *client.Client, stateFolder, installationFolder string) host.StartPreparation {
	return host.StartPreparation{
		Journal:        journal,
		States:         host.StartStates{Folder: filepath.Join(stateFolder, "starts")},
		RuntimesFolder: filepath.Join(stateFolder, "runtimes"),
		Prerequisites: func(grant client.Grant, claim client.ClaimedStart) error {
			return protectedStartAllowed(stateFolder, installationFolder, grant, claim)
		},
	}
}

// errNoInstallation refuses an account start on a host that serves without a protected installation.
var errNoInstallation = errors.New("this host has no protected installation, so it starts no saved account")

func protectedStartAllowed(stateFolder, installationFolder string, grant client.Grant, claim client.ClaimedStart) error {
	profile, known := profileFor[grant.Runtime.Driver]
	if !known {
		return fmt.Errorf("%q has no pinned profile", grant.Runtime.Driver)
	}
	if claim.Recipe.DriverVersion != grant.Runtime.DriverBuild {
		return fmt.Errorf("the account recipe is for %s %s, the runtime for %s", profile.Program(),
			claim.Recipe.DriverVersion, grant.Runtime.DriverBuild)
	}
	if installationFolder == "" {
		return errNoInstallation
	}
	if _, err := (host.Installation{Folder: installationFolder}).Verify(); err != nil {
		return err
	}
	capability, err := host.InspectProtection(host.LocalPlatform(), profile.Program(), claim.Recipe.DriverVersion,
		host.NativeEvidence{Folder: stateFolder})
	if err != nil {
		return err
	}
	if !capability.Available {
		return fmt.Errorf("the protected arrangement of %s %s is not available on this host: journal-agent protection "+
			"names what is missing", profile.Program(), claim.Recipe.DriverVersion)
	}
	return nil
}

// openMainRuntime asks the journal for the main runtime, prepares its start like any other runtime's and builds the
// program's terminal start from the pinned profile, with the credential and generation for the hook relay.
func openMainRuntime(
	stateFolder, installationFolder, agentID, folder, program, hookCommand string,
) (host.AttachRequest, error) {
	profile, known := profileFor[program]
	if !known || agentID == "" || folder == "" {
		return host.AttachRequest{}, errors.New("attach needs --agent, --folder and --program claude or codex")
	}
	if profile.Program() == "codex" {
		return host.AttachRequest{}, errCodexHasNoTerminal
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
	opened, err := journal.OpenMainRuntime(ctx, client.MainRuntimeRequest{AgentID: agentID, Folder: absolute, Driver: profile.Program(), DriverBuild: profile.Build(), Profile: program})
	if err != nil {
		return host.AttachRequest{}, err
	}
	prepared, err := startPreparation(journal, stateFolder, installationFolder).Prepare(ctx, opened.RuntimeID)
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
	profile contracts.ProgramProfile,
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
	start := contracts.Start{
		Mode:           recording.TerminalMode,
		SettingsFolder: filepath.Join(stateFolder, "runtimes", runtimeID),
		SessionID:      conversationID,
		HookCommand:    hookCommand,
		WorkFolder:     grant.Runtime.Folder,
		Account:        account,
	}
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
		RuntimeID: runtimeID,
		Command:   append([]string{executable}, startArguments...),
		Folder:    grant.Runtime.Folder,
		Env:       startEnvironment,
	}, nil
}

func writeSettings(profile contracts.ProgramProfile, start contracts.Start) error {
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

// layoutOf is the screen layout of the program an attach request starts, from the profile of its program name.
func layoutOf(request host.AttachRequest) (screen.Layout, error) {
	if len(request.Command) == 0 {
		return screen.Layout{}, errors.New("an attach request names no program")
	}
	profile, known := profileFor[filepath.Base(request.Command[0])]
	if !known {
		return screen.Layout{}, fmt.Errorf("no profile for the program %q", request.Command[0])
	}

	return profile.Screens(), nil
}

// pinnedBuild refuses a runtime opened for another build than the profile pins, and a program on this host whose
// installed version is not that build, before any work starts.
func pinnedBuild(profile contracts.ProgramProfile, requested string) error {
	if requested != profile.Build() {
		return fmt.Errorf("build %s of %s is not the pinned build %s", requested, profile.Program(), profile.Build())
	}
	output, err := exec.Command(profile.Program(), "--version").Output()
	if err != nil {
		return fmt.Errorf("the version of %s could not be read: %w", profile.Program(), err)
	}

	return profile.CheckBuild(strings.TrimSpace(string(output)))
}
