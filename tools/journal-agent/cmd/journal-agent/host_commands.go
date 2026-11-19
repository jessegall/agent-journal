package main

import (
	"bufio"
	"context"
	"crypto/rand"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/creack/pty"
	"golang.org/x/term"

	"journal-agent/client"
	"journal-agent/drivers"
	drivercontracts "journal-agent/drivers/contracts"
	"journal-agent/host"
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

// enroll stores the host id and the secret agents:host-enroll printed. The secret is read from standard input, so it
// never appears in the process list or the shell history.
func enroll(arguments []string) error {
	flags := flag.NewFlagSet("enroll", flag.ContinueOnError)
	journalURL := flags.String("journal", "", "the journal's URL")
	hostID := flags.String("host", "", "the host id agents:host-enroll printed")
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if *journalURL == "" || *hostID == "" {
		return errors.New("enroll needs --journal and --host, and the secret on standard input")
	}
	secret, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil && secret == "" {
		return errors.New("enroll reads the secret from standard input")
	}
	enrollment := host.Enrollment{JournalURL: strings.TrimRight(*journalURL, "/"), HostID: *hostID, Secret: strings.TrimSpace(secret)}
	if err := (host.State{Folder: *stateFolder}).Save(enrollment); err != nil {
		return err
	}
	log.Printf("host %s is enrolled; its state is in %s", enrollment.HostID, *stateFolder)
	return nil
}

// serve claims this host's requests until it is stopped. Carrying them out is the scheduler's job; until then each
// claimed request is only logged by its identity, never by its content.
func serve(arguments []string) error {
	flags := flag.NewFlagSet("serve", flag.ContinueOnError)
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
	hookCommand := flags.String("hook-command", "", "the hook relay command the programs call")
	if err := flags.Parse(arguments); err != nil {
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
	journal := client.New(enrollment)
	loop := serving.NewLoop(journal, processRuntimes(*stateFolder, journal.JournalURL(), *hookCommand))
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

// processRuntimes opens a runtime run one child per turn from its start grant, with a conversation of its own, the
// pinned profile of its program and the model the journal asked for.
func processRuntimes(stateFolder, journalURL, hookCommand string) serving.Opener {
	return func(runtimeID string, grant client.Grant) (serving.Runtime, error) {
		if grant.Runtime.DriverType != drivers.ProcessDriverType {
			return nil, fmt.Errorf("runtime %s runs under the %s driver, which serve opens only through attach", runtimeID, grant.Runtime.DriverType)
		}
		profile, known := profileFor[grant.Runtime.Program]
		if !known {
			return nil, fmt.Errorf("runtime %s runs %q, which has no pinned profile", runtimeID, grant.Runtime.Program)
		}
		if err := pinnedBuild(profile, grant.Runtime.ProgramBuild); err != nil {
			return nil, fmt.Errorf("runtime %s: %w", runtimeID, err)
		}
		conversationID, err := newConversationID()
		if err != nil {
			return nil, err
		}
		driver := drivers.NewProcessDriver(drivers.ProcessRuntime{
			JournalURL:     journalURL,
			Credential:     grant.Token,
			ProfilePin:     grant.ProfileEnvironment(),
			ConversationID: conversationID,
			SettingsFolder: filepath.Join(stateFolder, "runtimes", runtimeID),
			WorkingFolder:  grant.Runtime.Folder,
			HookCommand:    hookCommand,
			Profile:        profile,
		}, grant.Runtime.ProcessGeneration)
		identity := drivercontracts.RequestIdentity{RuntimeID: runtimeID}
		if grant.Runtime.Model != nil {
			_, _ = driver.ChangeModel(context.Background(), drivercontracts.ModelChange{Request: identity, Model: *grant.Runtime.Model})
		}
		if grant.Runtime.Effort != nil {
			_, _ = driver.ChangeEffort(context.Background(), drivercontracts.EffortChange{Request: identity, Effort: *grant.Runtime.Effort})
		}
		return driver, nil
	}
}

// startTerminal starts a runtime's program on a PTY the host owns, for the attach socket.
func startTerminal(request host.AttachRequest) (*os.File, error) {
	if len(request.Command) == 0 {
		return nil, fmt.Errorf("the host does not run runtime %s; attach with --agent to open it", request.RuntimeID)
	}
	command := exec.Command(request.Command[0], request.Command[1:]...)
	command.Dir = request.Folder
	command.Env = request.Env
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
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	rows, columns := terminalSize()
	request := host.AttachRequest{RuntimeID: *runtimeID, Rows: rows, Columns: columns}
	if *runtimeID == "" {
		opened, err := openMainRuntime(*stateFolder, *agentID, *folder, *program, *hookCommand)
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

// openMainRuntime asks the journal for the main runtime, takes its start token and builds the program's
// terminal start from the pinned profile, with the credential and generation for the hook relay.
func openMainRuntime(stateFolder, agentID, folder, program, hookCommand string) (host.AttachRequest, error) {
	profile, known := profileFor[program]
	if !known || agentID == "" || folder == "" {
		return host.AttachRequest{}, errors.New("attach needs --agent, --folder and --program claude or codex")
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
	opened, err := journal.OpenMainRuntime(ctx, client.MainRuntimeRequest{AgentID: agentID, Folder: absolute, Program: profile.Program(), ProgramBuild: profile.Build(), Profile: program})
	if err != nil {
		return host.AttachRequest{}, err
	}
	grant, err := journal.StartGrant(ctx, opened.RuntimeID)
	if err != nil {
		return host.AttachRequest{}, err
	}
	conversationID, err := newConversationID()
	if err != nil {
		return host.AttachRequest{}, err
	}
	start := contracts.Start{
		Mode:           contracts.TerminalMode,
		SettingsFolder: filepath.Join(stateFolder, "runtimes", opened.RuntimeID),
		SessionID:      conversationID,
		HookCommand:    hookCommand,
		WorkFolder:     absolute,
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
	environment := append(profile.Environment(drivers.WithoutJournalVariables(os.Environ()), start),
		"JOURNAL_URL="+journal.JournalURL(), "JOURNAL_START_TOKEN="+grant.Token, "JOURNAL_PROCESS_GENERATION=1",
		"JOURNAL_BYPASS_LOG="+filepath.Join(start.SettingsFolder, drivers.BypassLogName))
	environment = append(environment, grant.ProfileEnvironment()...)
	return host.AttachRequest{RuntimeID: opened.RuntimeID, Command: append([]string{profile.Program()}, startArguments...), Folder: absolute, Env: environment}, nil
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
		if file.LinkTo != "" {
			_ = os.Remove(target)
			if err := os.Symlink(file.LinkTo, target); err != nil {
				return err
			}
			continue
		}
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
