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
	"journal-agent/host"
	"journal-agent/profiles/contracts"
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
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	enrollment, err := (host.State{Folder: *stateFolder}).Load()
	if err != nil {
		return err
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	socket := &host.AttachSocket{Folder: *stateFolder, Start: startTerminal}
	listener, err := socket.Listen()
	if err != nil {
		return err
	}
	defer listener.Close()
	client.New(enrollment).Poll(ctx, func(claimed []client.ClaimedRequest) {
		for _, request := range claimed {
			log.Printf("claimed %s request %s (sequence %d, attempt %d) of runtime %s", request.Operation, request.RequestID, request.Sequence, request.Attempt, request.RuntimeID)
		}
	})
	return nil
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

// openMainRuntime asks the journal for the main runtime, takes its launch credential and builds the program's
// terminal launch from the pinned profile, with the credential and generation for the hook relay.
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
	credential, err := journal.LaunchGrant(ctx, opened.RuntimeID)
	if err != nil {
		return host.AttachRequest{}, err
	}
	conversationID, err := newConversationID()
	if err != nil {
		return host.AttachRequest{}, err
	}
	launch := contracts.Launch{Mode: contracts.TerminalMode, SettingsFolder: filepath.Join(stateFolder, "runtimes", opened.RuntimeID), SessionID: conversationID, HookCommand: hookCommand}
	if err := writeSettings(profile, launch); err != nil {
		return host.AttachRequest{}, err
	}
	launchArguments, err := profile.Arguments(launch)
	if err != nil {
		return host.AttachRequest{}, err
	}
	environment := append(profile.Environment(drivers.WithoutJournalVariables(os.Environ()), launch),
		"JOURNAL_URL="+journal.JournalURL(), "JOURNAL_LAUNCH_TOKEN="+credential, "JOURNAL_PROCESS_GENERATION=1")
	return host.AttachRequest{RuntimeID: opened.RuntimeID, Command: append([]string{profile.Program()}, launchArguments...), Folder: absolute, Env: environment}, nil
}

func writeSettings(profile contracts.ProgramProfile, launch contracts.Launch) error {
	files, err := profile.SettingsFiles(launch)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(launch.SettingsFolder, 0o700); err != nil {
		return err
	}
	for _, file := range files {
		target := filepath.Join(launch.SettingsFolder, file.Name)
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
