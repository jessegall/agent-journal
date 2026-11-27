package recorded

import (
	"bufio"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"sync"
	"testing"
	"time"

	"journal-runner/recording"
)

// LongestGap is the longest a replay waits before an answer, however long the recorded one took, so a long poll
// recorded waiting answers at once in a test.
const LongestGap = 50 * time.Millisecond

// CallReplay is the other side of a wire of calls, played from a recording: each request gets the recorded answer of
// the first call not yet played with its method and path shape, its fakes bound to the live values heard in their
// places, as calls made side by side may come in another order; a request no such call is left for fails the test
// naming it and the call the recording holds next.
type CallReplay struct {
	// Heard is told each call played with the body it was asked with, before it is answered.
	Heard func(call Call, body []byte)
	// Upgraded is handed the connection of a call the recording answered by upgrading it, after its answer's head.
	Upgraded func(call Call, connection net.Conn, buffered *bufio.ReadWriter)

	t      testing.TB
	calls  []Call
	played []bool
	values *recording.Values
	mutex  sync.Mutex
}

// NewCallReplay plays the scenario's calls on the wire, in the order they were answered.
func NewCallReplay(t testing.TB, scenario Scenario, wire recording.Wire) *CallReplay {
	t.Helper()
	calls, err := scenario.Calls(wire)
	if err != nil {
		t.Fatal(err)
	}
	return &CallReplay{t: t, calls: calls, played: make([]bool, len(calls)), values: recording.NewValues()}
}

// Values are the live values the replay bound to the recording's fakes so far.
func (replay *CallReplay) Values() *recording.Values {
	return replay.values
}

// ServeHTTP answers the request with its recorded answer.
func (replay *CallReplay) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	body, _ := io.ReadAll(request.Body)
	replay.mutex.Lock()
	call, err := replay.take(request, body)
	replay.mutex.Unlock()
	if err != nil {
		replay.t.Error(err)
		http.Error(writer, err.Error(), http.StatusTeapot)
		return
	}
	if replay.Heard != nil {
		replay.Heard(call, body)
	}
	time.Sleep(min(call.Gap, LongestGap))
	if call.Answered.IsUpgraded {
		replay.upgrade(writer, call)
		return
	}
	for name, value := range call.Answered.Headers {
		writer.Header().Set(name, replay.values.Live(value))
	}
	answer, _ := base64.StdEncoding.DecodeString(call.Answered.Body)
	writer.WriteHeader(*call.Answered.Status)
	_, _ = io.WriteString(writer, replay.values.Live(string(answer)))
}

// AssertPlayedWhole fails the test when a recorded call was never asked.
func (replay *CallReplay) AssertPlayedWhole(t testing.TB) {
	t.Helper()
	replay.mutex.Lock()
	defer replay.mutex.Unlock()
	for index, call := range replay.calls {
		if !replay.played[index] {
			t.Errorf("the recorded call %s %s of exchange %s was never asked", call.Answered.Method, call.Answered.Path, call.Exchange)
		}
	}
}

// take is the first call not yet played that the request is, with the request's live values bound.
func (replay *CallReplay) take(request *http.Request, body []byte) (Call, error) {
	asked := request.Method + " " + request.URL.Path
	next := -1
	for index, call := range replay.calls {
		if replay.played[index] {
			continue
		}
		if next < 0 {
			next = index
		}
		if tried, err := replay.tried(index, request, body); err == nil {
			replay.values = tried
			replay.played[index] = true
			return call, nil
		}
	}
	if next < 0 {
		return Call{}, fmt.Errorf("%s was asked after every recorded call was played", asked)
	}
	following := replay.calls[next]
	return Call{}, fmt.Errorf("%s was asked where the recording holds %s %s next", asked, following.Answered.Method, following.Answered.Path)
}

// tried binds the request's live values to the call's fakes on a copy of the bindings, which a request of another
// method or path shape refuses.
func (replay *CallReplay) tried(index int, request *http.Request, body []byte) (*recording.Values, error) {
	call := replay.calls[index]
	tried := replay.values.Copy()
	place := recording.Place{Exchange: call.Exchange, Event: index}
	if call.Answered.Method != request.Method {
		return nil, fmt.Errorf("%s is not %s", request.Method, call.Answered.Method)
	}
	recordedPath, _ := json.Marshal(call.Answered.Path)
	heardPath, _ := json.Marshal(request.URL.Path)
	if err := tried.Hear(place.Within("path"), recordedPath, heardPath); err != nil {
		return nil, err
	}
	sent, _ := base64.StdEncoding.DecodeString(call.Asked.Body)
	if json.Valid(sent) && json.Valid(body) {
		if err := tried.Hear(place.Within("body"), sent, body); err != nil {
			return nil, err
		}
	}
	return tried, nil
}

// upgrade answers with the recorded head of an upgraded call and hands the connection on.
func (replay *CallReplay) upgrade(writer http.ResponseWriter, call Call) {
	hijacker, able := writer.(http.Hijacker)
	if !able {
		replay.t.Errorf("the call %s %s cannot be upgraded on this server", call.Answered.Method, call.Answered.Path)
		return
	}
	connection, buffered, err := hijacker.Hijack()
	if err != nil {
		replay.t.Error(err)
		return
	}
	_, _ = fmt.Fprintf(buffered, "HTTP/1.1 %d %s\r\n", *call.Answered.Status, http.StatusText(*call.Answered.Status))
	for name, value := range call.Answered.Headers {
		_, _ = fmt.Fprintf(buffered, "%s: %s\r\n", name, replay.values.Live(value))
	}
	_, _ = buffered.WriteString("\r\n")
	_ = buffered.Flush()
	if replay.Upgraded == nil {
		_ = connection.Close()
		return
	}
	replay.Upgraded(call, connection, buffered)
}
