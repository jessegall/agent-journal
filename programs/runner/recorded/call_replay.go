package recorded

import (
	"bufio"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"sync"
	"testing"
	"time"

	"journal-runner/recording"
)

// orderPoll is how often a call played in order looks again whether the calls before it were asked.
const orderPoll = 5 * time.Millisecond

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
	// Answering is handed each answer's body with its fakes bound and gives the body sent, as a replay that signs a
	// recorded answer again with its own secret.
	Answering func(call Call, body []byte) []byte
	// IsStreamed answers whether a call is one of a stream the live side cuts by its own timing, such as a process's
	// output: such a call matches by its path alone and binds nothing, answers as often as it is asked and need not be
	// asked at all.
	IsStreamed func(call Call) bool
	// IsLongPoll answers whether a call is a long poll, one the other side answered only once what ends it was heard:
	// it is answered only once every call of its order group, not streamed, that was asked while it waited for its
	// recorded answer was asked here too. Any other call is answered at once.
	IsLongPoll func(call Call) bool
	// OrderGroup names the calls a long poll is ordered with, such as those of one container; a call of no group
	// orders nothing.
	OrderGroup func(call Call) string

	t      Failures
	calls  []Call
	played []bool
	values *recording.Values
	mutex  sync.Mutex
	// closed ends every call still held in its order, once the replay is closed.
	closed    chan struct{}
	closeOnce sync.Once
}

// NewCallReplay plays the scenario's calls on the wire, in the order they were answered.
func NewCallReplay(failures Failures, scenario Scenario, wire recording.Wire) (*CallReplay, error) {
	calls, err := scenario.Calls(wire)
	if err != nil {
		return nil, err
	}
	return &CallReplay{t: failures, calls: calls, played: make([]bool, len(calls)), values: recording.NewValues(),
		closed: make(chan struct{})}, nil
}

// MustCallReplay is the replay of the scenario's calls on the wire for a test, failing it when they cannot be read.
func MustCallReplay(t testing.TB, scenario Scenario, wire recording.Wire) *CallReplay {
	t.Helper()
	replay, err := NewCallReplay(t, scenario, wire)
	if err != nil {
		t.Fatal(err)
	}
	return replay
}

// Failures is where a replay reports a call it cannot answer: a test, or a played daemon's own record of them.
type Failures interface {
	Error(args ...any)
	Errorf(format string, args ...any)
}

// Close ends every call still held in its order, so the server serving the replay can close.
func (replay *CallReplay) Close() {
	replay.closeOnce.Do(func() { close(replay.closed) })
}

// Closed is closed once the replay is.
func (replay *CallReplay) Closed() <-chan struct{} {
	return replay.closed
}

// Values are the live values the replay bound to the recording's fakes so far.
func (replay *CallReplay) Values() *recording.Values {
	return replay.values
}

// ServeHTTP answers the request with its recorded answer.
func (replay *CallReplay) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	body, _ := io.ReadAll(request.Body)
	replay.mutex.Lock()
	index, err := replay.take(request, body)
	replay.mutex.Unlock()
	if err != nil {
		replay.t.Error(err)
		http.Error(writer, err.Error(), http.StatusTeapot)
		return
	}
	call := replay.calls[index]
	if replay.Heard != nil {
		replay.Heard(call, body)
	}
	if call.Answered.IsUpgraded {
		if replay.isOrdered(index) && !replay.awaitEarlier(request, index) {
			return
		}
		time.Sleep(min(call.Gap, LongestGap))
		replay.upgrade(writer, call)
		return
	}
	for name, value := range call.Answered.Headers {
		writer.Header().Set(name, replay.values.Live(value))
	}
	writer.Header().Del("Content-Length")
	writer.WriteHeader(*call.Answered.Status)
	// The head goes at once and the body in its order, as a stream's head came long before the end it was recorded at.
	if flusher, isFlushing := writer.(http.Flusher); isFlushing {
		flusher.Flush()
	}
	if replay.isOrdered(index) && !replay.awaitEarlier(request, index) {
		return
	}
	time.Sleep(min(call.Gap, LongestGap))
	answer, _ := base64.StdEncoding.DecodeString(call.Answered.Body)
	live := []byte(replay.values.Live(string(answer)))
	if replay.Answering != nil {
		live = replay.Answering(call, live)
	}
	_, _ = writer.Write(live)
}

// AssertPlayedWhole fails the test when a recorded call was never asked.
func (replay *CallReplay) AssertPlayedWhole(t Failures) {
	replay.mutex.Lock()
	defer replay.mutex.Unlock()
	for index, call := range replay.calls {
		if !replay.played[index] && !replay.isStreamed(index) {
			t.Errorf("the recorded call %s %s of exchange %s was never asked", call.Answered.Method, call.Answered.Path, call.Exchange)
		}
	}
}

// IsPlayedWhole answers whether every recorded call that is not streamed was asked.
func (replay *CallReplay) IsPlayedWhole() bool {
	replay.mutex.Lock()
	defer replay.mutex.Unlock()
	for index, played := range replay.played {
		if !played && !replay.isStreamed(index) {
			return false
		}
	}
	return true
}

// HasUnplayed answers whether a call of the method and path, as recorded, is still to be asked.
func (replay *CallReplay) HasUnplayed(method, path string) bool {
	replay.mutex.Lock()
	defer replay.mutex.Unlock()
	for index, call := range replay.calls {
		if !replay.played[index] && call.Answered.Method == method && call.Answered.Path == path {
			return true
		}
	}
	return false
}

func (replay *CallReplay) isOrdered(index int) bool {
	call := replay.calls[index]
	return replay.IsLongPoll != nil && replay.IsLongPoll(call) && replay.OrderGroup != nil && replay.OrderGroup(call) != "" &&
		!replay.isStreamed(index)
}

func (replay *CallReplay) isStreamed(index int) bool {
	return replay.IsStreamed != nil && replay.IsStreamed(replay.calls[index])
}

// awaitEarlier waits until every call that was asked while the call waited for its answer, when recorded, was asked
// here, and answers whether the request is still there to be answered.
func (replay *CallReplay) awaitEarlier(request *http.Request, index int) bool {
	for !replay.isEarlierPlayed(index) {
		select {
		case <-request.Context().Done():
			return false
		case <-replay.closed:
			return false
		case <-time.After(orderPoll):
		}
	}
	return true
}

// isEarlierPlayed answers whether every call of the call's group, not streamed, that was asked on the exchange while
// the call waited for its answer, when recorded, was asked here too.
func (replay *CallReplay) isEarlierPlayed(index int) bool {
	replay.mutex.Lock()
	defer replay.mutex.Unlock()
	answered := replay.calls[index].AskedAt + replay.calls[index].Gap.Microseconds()
	group := replay.OrderGroup(replay.calls[index])
	for other, call := range replay.calls {
		if other == index || replay.played[other] || replay.isStreamed(other) || call.Exchange != replay.calls[index].Exchange ||
			replay.OrderGroup(call) != group {
			continue
		}
		if call.AskedAt > replay.calls[index].AskedAt && call.AskedAt < answered {
			return false
		}
	}
	return true
}

// take is the first call not yet played that the request is, or a streamed call it is, with the request's live
// values bound.
// candidatesAfterFit is how many further calls a request is weighed against once one fits, as the call naming its
// very values is recorded near the first that fits.
const candidatesAfterFit = 32

func (replay *CallReplay) take(request *http.Request, body []byte) (int, error) {
	asked := request.Method + " " + request.URL.Path
	next := -1
	var nearest error
	chosen, chosenValues, fewest, looked := -1, (*recording.Values)(nil), 0, 0
	for index := range replay.calls {
		if chosen >= 0 && looked >= candidatesAfterFit {
			break
		}
		streamed := replay.isStreamed(index)
		if replay.played[index] && !streamed {
			continue
		}
		if next < 0 && !streamed {
			next = index
		}
		tried, err := replay.pathBound(index, request)
		if err == nil && !streamed {
			err = replay.bodyBound(tried, index, body)
		}
		if err == nil && streamed {
			// A stream's calls match by their path and bind nothing: the live side cuts them by its own timing.
			replay.played[index] = true
			return index, nil
		}
		if err == nil {
			// Of the calls the request fits, the one naming the very values heard wins: concurrent calls that
			// differ only in a value, such as two images' checks, are never bound crosswise.
			renames := tried.RenamesSince(replay.values)
			if chosen < 0 || renames < fewest {
				chosen, chosenValues, fewest = index, tried, renames
			}
			if renames == 0 {
				break
			}
			looked++
			continue
		}
		var refusal bodyRefusal
		if nearest == nil && errors.As(err, &refusal) {
			nearest = err
		}
	}
	if chosen >= 0 {
		replay.values = chosenValues
		replay.played[chosen] = true
		return chosen, nil
	}
	if next < 0 {
		return 0, fmt.Errorf("%s was asked after every recorded call was played", asked)
	}
	following := replay.calls[next]
	if nearest != nil {
		return 0, fmt.Errorf("%s was asked where the recording holds %s %s next, and %w", asked,
			following.Answered.Method, following.Answered.Path, nearest)
	}
	return 0, fmt.Errorf("%s was asked where the recording holds %s %s next", asked, following.Answered.Method, following.Answered.Path)
}

// pathBound binds the request's live values in its path to the call's fakes on a copy of the bindings, which a
// request of another method or path shape refuses.
func (replay *CallReplay) pathBound(index int, request *http.Request) (*recording.Values, error) {
	call := replay.calls[index]
	tried := replay.values.Copy()
	if call.Answered.Method != request.Method {
		return nil, fmt.Errorf("%s is not %s", request.Method, call.Answered.Method)
	}
	recordedPath, _ := json.Marshal(call.Answered.Path)
	heardPath, _ := json.Marshal(request.URL.Path)
	if err := tried.Hear(replay.placeOf(index).Within("path"), recordedPath, heardPath); err != nil {
		return nil, err
	}
	return tried, nil
}

// bodyBound binds the live values of the request's body to the call's fakes on the bindings, which a body of another
// shape refuses.
func (replay *CallReplay) bodyBound(tried *recording.Values, index int, body []byte) error {
	call := replay.calls[index]
	sent, _ := base64.StdEncoding.DecodeString(call.Asked.Body)
	if !json.Valid(sent) || !json.Valid(body) {
		return nil
	}
	if err := tried.Hear(replay.placeOf(index).Within("body"), sent, body); err != nil {
		return bodyRefusal{call: call, reason: err}
	}
	return nil
}

func (replay *CallReplay) placeOf(index int) recording.Place {
	return recording.Place{Exchange: replay.calls[index].Exchange, Event: index}
}

// bodyRefusal is why a recorded call of the asked method and path did not take the request's body.
type bodyRefusal struct {
	call   Call
	reason error
}

func (refusal bodyRefusal) Error() string {
	return fmt.Sprintf("the recorded %s %s of exchange %s differs in its body: %v", refusal.call.Answered.Method,
		refusal.call.Answered.Path, refusal.call.Exchange, refusal.reason)
}

func (refusal bodyRefusal) Unwrap() error {
	return refusal.reason
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
