package main

import (
	"errors"
	"net"
	"os"
	"path/filepath"
	"sync"
	"time"

	"journal-runner/hostapi"
	"journal-runner/localsocket"
	"journal-runner/terminal"
)

const exitSendWait = 2 * time.Second
const pendingOutputs = 64

type terminalRelay struct {
	listener net.Listener
	posts    chan hostapi.Output
	done     chan struct{}

	mutex  sync.Mutex
	active net.Conn
	closed bool
}

func listenTerminal(relayFolder, processID string) (*terminalRelay, error) {
	if filepath.Base(processID) != processID || processID == "." || processID == ".." || processID == "" {
		return nil, errors.New("the terminal process id is not a socket name")
	}
	folder := hostapi.TerminalSocketFolder(relayFolder)
	if err := os.MkdirAll(folder, 0o700); err != nil {
		return nil, err
	}
	info, err := os.Stat(folder)
	if err != nil {
		return nil, err
	}
	if info.Mode().Perm()&0o077 != 0 {
		return nil, errors.New("the terminal socket folder is open to other users")
	}
	path := hostapi.TerminalSocket(relayFolder, processID)
	listener, err := localsocket.Listen(path)
	if err != nil {
		return nil, err
	}
	if err := os.Chmod(path, 0o600); err != nil {
		_ = listener.Close()
		return nil, err
	}
	return &terminalRelay{listener: listener, posts: make(chan hostapi.Output, pendingOutputs), done: make(chan struct{})}, nil
}

func (relay *terminalRelay) post(output hostapi.Output) error {
	select {
	case relay.posts <- output:
	default:
		// The next snapshot gives the relay the current screen when it can take output again.
	}
	return nil
}

func (relay *terminalRelay) Serve(session *terminal.Session, processID string, size hostapi.TerminalSize) {
	defer close(relay.done)
	for {
		connection, err := relay.listener.Accept()
		if err != nil {
			return
		}
		relay.mutex.Lock()
		if relay.closed {
			relay.mutex.Unlock()
			_ = connection.Close()
			return
		}
		relay.active = connection
		relay.mutex.Unlock()
		ended := relay.serveConnection(hostapi.NewTerminalLink(connection), session, processID, size)
		relay.mutex.Lock()
		relay.active = nil
		relay.mutex.Unlock()
		if ended {
			return
		}
	}
}

func (relay *terminalRelay) serveConnection(
	link *hostapi.TerminalLink,
	session *terminal.Session,
	processID string,
	size hostapi.TerminalSize,
) bool {
	defer link.Close()
	if now, err := session.Size(); err == nil {
		size = now
	}
	adopt := hostapi.LocalLinkAdopt{
		ProcessID: processID, Generation: firstProcessGeneration, Size: size, SpoolOffset: session.SpoolOffset(),
	}
	if err := link.Send(hostapi.LinkAdopt, adopt); err != nil {
		return false
	}
	read := make(chan struct{})
	var answering sync.Mutex
	go readInstructions(link, session, processID, &answering, read)
	_, _ = session.Snapshot()
	for {
		select {
		case <-read:
			return false
		case output := <-relay.posts:
			if err := link.Send(hostapi.LinkOutput, output); err != nil {
				return false
			}
		case <-session.Done():
			answering.Lock()
			err := relay.sendExit(link, session.Wait())
			answering.Unlock()
			return err == nil
		}
	}
}

func (relay *terminalRelay) sendExit(link *hostapi.TerminalLink, exit hostapi.LocalLinkExit) error {
	for {
		select {
		case output := <-relay.posts:
			if err := link.Send(hostapi.LinkOutput, output); err != nil {
				return err
			}
		default:
			return link.Send(hostapi.LinkExit, exit)
		}
	}
}

func (relay *terminalRelay) waitForExit() {
	select {
	case <-relay.done:
	case <-time.After(exitSendWait):
	}
}

func (relay *terminalRelay) Close() {
	relay.mutex.Lock()
	defer relay.mutex.Unlock()
	if relay.closed {
		return
	}
	relay.closed = true
	_ = relay.listener.Close()
	if relay.active != nil {
		_ = relay.active.Close()
	}
}
