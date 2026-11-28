package hostapi

import (
	"errors"
	"net"
	"os"
	"path/filepath"
)

// sideSocketsFolderName is the placeholder name of the folder that holds a process's side sockets.
const sideSocketsFolderName = "sockets"

// mostSideBytes bounds one read of a side socket, as a status line's record is small.
const mostSideBytes = 64 * 1024

// listenSideSockets listens on each side socket the plan names, in the process's sockets folder, before the process
// starts, and sends what is written to one as output chunks of a stream named after it. Each socket closes once the
// process has ended, or at once through the answered close for a process that never started.
func (table *ProcessTable) listenSideSockets(held *heldProcess) (func(), error) {
	folder := filepath.Join(table.stateFolder, "processes", held.id, sideSocketsFolderName)
	listeners := []net.Listener{}
	closeAll := func() {
		for _, listener := range listeners {
			_ = listener.Close()
		}
	}
	for _, name := range held.plan.SideSockets {
		listener, err := listenSide(folder, name)
		if err != nil {
			closeAll()
			return func() {}, err
		}
		listeners = append(listeners, listener)
		go table.acceptSide(held, name, listener)
	}
	go func() {
		<-held.exited
		closeAll()
	}()
	return closeAll, nil
}

// listenSide listens on one side socket, which only the host's user may reach.
func listenSide(folder, name string) (net.Listener, error) {
	if !isPlainName(name) {
		return nil, RefusalError{Refusal: Unsafe, Reason: "the side socket name " + name + " is not a plain name"}
	}
	path := filepath.Join(folder, name)
	_ = os.Remove(path)
	listener, err := net.Listen("unix", path)
	if err != nil {
		return nil, err
	}
	if err := os.Chmod(path, 0o600); err != nil {
		_ = listener.Close()
		return nil, err
	}
	return listener, nil
}

func (table *ProcessTable) acceptSide(held *heldProcess, name string, listener net.Listener) {
	offset := int64(0)
	for {
		connection, err := listener.Accept()
		if errors.Is(err, net.ErrClosed) {
			return
		}
		if err != nil {
			continue
		}
		offset = table.readSide(held.id, name, connection, offset)
	}
}

// readSide sends what one connection writes as chunks of the socket's stream and answers the stream's offset after it.
func (table *ProcessTable) readSide(processID, name string, connection net.Conn, offset int64) int64 {
	defer connection.Close()
	buffer := make([]byte, mostSideBytes)
	for {
		count, err := connection.Read(buffer)
		if count > 0 {
			table.outputs.send(processID, Output{Chunks: ChunksOf(name, offset, buffer[:count])})
			offset += int64(count)
		}
		if err != nil {
			return offset
		}
	}
}
