package hostapi

import (
	"bufio"
	"encoding/json"
	"errors"
	"io"
	"net"
	"sync"
)

type LinkMessage string

const (
	LinkAdopt       LinkMessage = "adopt"
	LinkInstruction LinkMessage = "instruction"
	LinkAnswer      LinkMessage = "answer"
	LinkOutput      LinkMessage = "output"
	LinkExit        LinkMessage = "exit"
	LinkPrivate     LinkMessage = "private_value"
)

const linkMessageByteLimit = 4 << 20

// TerminalLink reads and writes newline-delimited envelopes on one local socket.
type TerminalLink struct {
	connection net.Conn
	reader     *bufio.Scanner
	writer     *json.Encoder
	writes     sync.Mutex
}

func NewTerminalLink(connection net.Conn) *TerminalLink {
	reader := bufio.NewScanner(connection)
	reader.Buffer(nil, linkMessageByteLimit)
	return &TerminalLink{connection: connection, reader: reader, writer: json.NewEncoder(connection)}
}

func (link *TerminalLink) Send(message LinkMessage, body any) error {
	link.writes.Lock()
	defer link.writes.Unlock()
	return link.writer.Encode(map[LinkMessage]any{message: body})
}

func (link *TerminalLink) Receive() (LinkMessage, []byte, error) {
	if !link.reader.Scan() {
		if err := link.reader.Err(); err != nil {
			return "", nil, err
		}
		return "", nil, io.EOF
	}
	var envelope map[LinkMessage]json.RawMessage
	if err := json.Unmarshal(link.reader.Bytes(), &envelope); err != nil {
		return "", nil, err
	}
	if len(envelope) != 1 {
		return "", nil, errors.New("a local terminal envelope holds exactly one message")
	}
	for message, body := range envelope {
		return message, body, nil
	}
	return "", nil, io.EOF
}

func (link *TerminalLink) Close() error {
	return link.connection.Close()
}
