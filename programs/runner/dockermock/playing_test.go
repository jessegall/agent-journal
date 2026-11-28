package dockermock

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"path/filepath"
	"slices"
	"strings"
	"testing"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// TestARecordedTerminalPlaysWhatItPrintedAsItIsTyped sends the recorded Docker calls of a Claude Code terminal turn as
// the host sent them, in the order they were asked and each without waiting for the one before, up to the session
// terminal's attach; it types there what was typed when it was recorded and reads back what the session printed.
func TestARecordedTerminalPlaysWhatItPrintedAsItIsTyped(t *testing.T) {
	playing := Play(t, "claude-code", "terminal-turn")
	scenario := recorded.MustLoad(t, "claude-code", "terminal-turn")
	calls, err := scenario.Calls(recording.WireDocker)
	if err != nil {
		t.Fatal(err)
	}
	slices.SortStableFunc(calls, func(left, right recorded.Call) int { return int(left.AskedAt - right.AskedAt) })
	terminal := terminalExchange(t, scenario)
	fixture, err := recording.Load(terminal.Folder)
	if err != nil {
		t.Fatal(err)
	}
	address := strings.TrimPrefix(playing.Host(), "tcp://")

	for _, call := range calls {
		played, isDriver := playing.programs[containerOf(call.Answered.Path)]
		if call.Answered.IsUpgraded && isDriver && played.exchange.Name == terminal.Name {
			printed, err := attach(address, call.Asked, typedOf(fixture))
			if err != nil {
				t.Fatal(err)
			}
			if !bytes.Equal(printed, printedOf(fixture)) {
				t.Fatalf("the terminal played %d bytes, not the %d it printed when recorded", len(printed), len(printedOf(fixture)))
			}
			return
		}
		go ask(address, call)
		time.Sleep(askingGap)
	}
	t.Fatal("the recording attached to no session terminal")
}

// askingGap is how long the test leaves between two calls it sends side by side, so each is taken in its order.
const askingGap = 2 * time.Millisecond

// ask sends a recorded call again as the runner asked it, an attach on a connection of its own; a call the recording
// does not hold fails the test through the replay, so what the call is answered is not this one's to check.
func ask(address string, call recorded.Call) {
	if call.Answered.IsUpgraded {
		_, _ = attach(address, call.Asked, nil)
		return
	}
	_ = send(address, call.Asked)
}

func TestACallTheRecordingDoesNotHoldFailsNamingIt(t *testing.T) {
	refused := &refusingTB{TB: t}
	playing := Play(refused, "claude-code", "terminal-turn")
	response, err := http.Get(strings.Replace(playing.Host(), "tcp://", "http://", 1) + "/v1.51/plugins")
	if err == nil {
		_ = response.Body.Close()
	}
	if !strings.Contains(refused.failure, "GET /v1.51/plugins") {
		t.Fatalf("an unrecorded call failed with %q, not naming it", refused.failure)
	}
}

// refusingTB keeps the first failure a replay reports instead of failing the test that checks it.
type refusingTB struct {
	testing.TB
	failure string
}

func (refusing *refusingTB) Errorf(format string, values ...any) {
	if refusing.failure == "" {
		refusing.failure = fmt.Sprintf(format, values...)
	}
}

func (refusing *refusingTB) Error(values ...any) {
	refusing.Errorf("%s", fmt.Sprint(values...))
}

// terminalExchange is the recorded driver exchange of the session's terminal.
func terminalExchange(t *testing.T, scenario recorded.Scenario) recorded.Exchange {
	t.Helper()
	for _, exchange := range scenario.ExchangesOn(recording.WireDriver) {
		if exchange.Opening.Mode == "terminal" {
			return exchange
		}
	}
	t.Fatal("the recording holds no session terminal")
	return recorded.Exchange{}
}

// typedOf is all that was typed into the recorded program, in order.
func typedOf(fixture recording.Fixture) []byte {
	var typed bytes.Buffer
	for _, input := range fixture.Inputs {
		typed.Write(input.Bytes)
	}
	return typed.Bytes()
}

// printedOf is all the recorded program printed, in order.
func printedOf(fixture recording.Fixture) []byte {
	var printed bytes.Buffer
	for _, chunk := range fixture.Output {
		printed.Write(chunk.Bytes)
	}
	return printed.Bytes()
}

// send asks the recorded request again, as the runner asked it.
func send(address string, asked recording.Call) error {
	request, err := http.NewRequest(asked.Method, "http://"+address+asked.Path+queryOf(asked.Query),
		bytes.NewReader(decoded(asked.Body)))
	if err != nil {
		return err
	}
	request.Header.Set("Content-Type", "application/json")
	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return err
	}
	_, _ = io.Copy(io.Discard, response.Body)
	return response.Body.Close()
}

// attach asks the recorded attach of a container again on a raw connection, types the input into it, and reads what
// the container plays until it closes.
func attach(address string, asked recording.Call, typed []byte) ([]byte, error) {
	connection, err := net.Dial("tcp", address)
	if err != nil {
		return nil, err
	}
	defer connection.Close()
	_, _ = fmt.Fprintf(connection, "%s %s%s HTTP/1.1\r\nHost: docker\r\nConnection: Upgrade\r\nUpgrade: tcp\r\n"+
		"Content-Length: 0\r\n\r\n", asked.Method, asked.Path, queryOf(asked.Query))
	reader := bufio.NewReader(connection)
	response, err := http.ReadResponse(reader, nil)
	if err != nil {
		return nil, err
	}
	if response.StatusCode != http.StatusSwitchingProtocols {
		return nil, fmt.Errorf("the attach was answered %s", response.Status)
	}
	if _, err := connection.Write(typed); err != nil {
		return nil, err
	}
	// Typing ends here, as the recorded session's did, so the played program plays its last output and closes.
	_ = connection.(*net.TCPConn).CloseWrite()
	return io.ReadAll(reader)
}

func queryOf(query map[string]string) string {
	if len(query) == 0 {
		return ""
	}
	values := url.Values{}
	for name, value := range query {
		values.Set(name, value)
	}
	return "?" + values.Encode()
}

// TestEveryRecordedMultiplexedAnswerIsWholeFrames reads every recorded Docker answer in Docker's multiplexed stream
// frame by frame: a fake of another length than the real value it replaced leaves a head naming the wrong length.
func TestEveryRecordedMultiplexedAnswerIsWholeFrames(t *testing.T) {
	root, err := recorded.Root()
	if err != nil {
		t.Fatal(err)
	}
	definitions, _ := filepath.Glob(filepath.Join(root, "resources/recordings/scenarios/*/*.json"))
	read := 0
	for _, definition := range definitions {
		scenario, err := recorded.Load(root, filepath.Base(filepath.Dir(definition)), strings.TrimSuffix(filepath.Base(definition), ".json"))
		if err != nil {
			continue
		}
		calls, _ := scenario.Calls(recording.WireDocker)
		for _, call := range calls {
			if call.Answered.Headers["Content-Type"] != "application/vnd.docker.multiplexed-stream" || call.Answered.IsCut {
				continue
			}
			read++
			if at := wholeFramesEnd(decoded(call.Answered.Body)); at >= 0 {
				t.Errorf("the %s answer to %s of %s breaks its frames at byte %d", call.Answered.Method, call.Answered.Path, scenario.Name, at)
			}
		}
	}
	if read == 0 {
		t.Fatal("no recording holds a multiplexed answer")
	}
}

// wholeFramesEnd is where a multiplexed stream stops being whole frames, or -1 when it is whole.
func wholeFramesEnd(stream []byte) int {
	at := 0
	for at < len(stream) {
		if at+8 > len(stream) || stream[at] > 2 || !bytes.Equal(stream[at+1:at+4], []byte{0, 0, 0}) {
			return at
		}
		at += 8 + int(binary.BigEndian.Uint32(stream[at+4:at+8]))
	}
	if at != len(stream) {
		return at
	}
	return -1
}
