package host

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"sync"
)

// CodexNotification is one notification the app-server sent: its method and its params as sent.
type CodexNotification struct {
	Method string          `json:"method"`
	Params json.RawMessage `json:"params"`
}

// ErrOwnerGone is returned for a request on an app-server whose connection ended.
var ErrOwnerGone = errors.New("the Codex app-server is gone")

// CodexConnection speaks the app-server's JSON-RPC over its standard input and output: requests carry ids of their
// own and wait for their answer, and every notification goes to the one handler the owner set.
type CodexConnection struct {
	writer  io.Writer
	mutex   sync.Mutex
	nextID  int
	waiting map[int]chan codexAnswer
	notify  func(CodexNotification)
	closed  bool
}

type codexAnswer struct {
	result json.RawMessage
	err    error
}

type codexMessage struct {
	ID     *int            `json:"id,omitempty"`
	Method string          `json:"method,omitempty"`
	Params json.RawMessage `json:"params,omitempty"`
	Result json.RawMessage `json:"result,omitempty"`
	Error  *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

// NewCodexConnection reads the app-server's output until it ends, answering requests and passing notifications on.
func NewCodexConnection(output io.Reader, input io.Writer, notify func(CodexNotification)) *CodexConnection {
	connection := &CodexConnection{writer: input, waiting: map[int]chan codexAnswer{}, notify: notify}
	go connection.read(output)
	return connection
}

// Request sends one request and decodes its result into answer; nil answer drops it.
func (connection *CodexConnection) Request(ctx context.Context, method string, params, answer any) error {
	connection.mutex.Lock()
	if connection.closed {
		connection.mutex.Unlock()
		return ErrOwnerGone
	}
	connection.nextID++
	id := connection.nextID
	reply := make(chan codexAnswer, 1)
	connection.waiting[id] = reply
	err := connection.write(codexRequest{ID: &id, Method: method, Params: params})
	connection.mutex.Unlock()
	if err != nil {
		return err
	}
	select {
	case <-ctx.Done():
		connection.forget(id)
		return ctx.Err()
	case answered := <-reply:
		if answered.err != nil || answer == nil {
			return answered.err
		}
		return json.Unmarshal(answered.result, answer)
	}
}

// Notify sends one notification, which has no answer.
func (connection *CodexConnection) Notify(method string) error {
	connection.mutex.Lock()
	defer connection.mutex.Unlock()
	return connection.write(codexRequest{Method: method})
}

type codexRequest struct {
	ID     *int   `json:"id,omitempty"`
	Method string `json:"method"`
	Params any    `json:"params,omitempty"`
}

func (connection *CodexConnection) write(request codexRequest) error {
	line, err := json.Marshal(request)
	if err != nil {
		return err
	}
	_, err = connection.writer.Write(append(line, '\n'))
	return err
}

func (connection *CodexConnection) read(output io.Reader) {
	scanner := bufio.NewScanner(output)
	scanner.Buffer(make([]byte, 64*1024), 16*1024*1024)
	for scanner.Scan() {
		var message codexMessage
		if json.Unmarshal(scanner.Bytes(), &message) != nil {
			continue
		}
		switch {
		case message.ID != nil && message.Method == "":
			connection.answer(*message.ID, message)
		case message.Method != "" && message.ID == nil:
			connection.notify(CodexNotification{Method: message.Method, Params: message.Params})
		}
	}
	connection.close()
}

func (connection *CodexConnection) answer(id int, message codexMessage) {
	connection.mutex.Lock()
	reply, found := connection.waiting[id]
	delete(connection.waiting, id)
	connection.mutex.Unlock()
	if !found {
		return
	}
	if message.Error != nil {
		reply <- codexAnswer{err: fmt.Errorf("the Codex app-server refused: %s", message.Error.Message)}
		return
	}
	reply <- codexAnswer{result: message.Result}
}

func (connection *CodexConnection) forget(id int) {
	connection.mutex.Lock()
	delete(connection.waiting, id)
	connection.mutex.Unlock()
}

// close fails every request still waiting: the app-server ended, so none of them gets an answer.
func (connection *CodexConnection) close() {
	connection.mutex.Lock()
	defer connection.mutex.Unlock()
	connection.closed = true
	for id, reply := range connection.waiting {
		reply <- codexAnswer{err: ErrOwnerGone}
		delete(connection.waiting, id)
	}
}
