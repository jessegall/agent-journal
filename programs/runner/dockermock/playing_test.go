package dockermock

import (
	"bufio"
	"bytes"
	"context"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// TestARecordedTerminalPlaysWhatItPrintedAsItIsTyped sends the recorded Docker calls of a terminal turn as
// the host sent them, in the order they were asked and each without waiting for the one before, up to the session
// terminal's attach; it types there what was typed when it was recorded and reads back what the session printed.
func TestARecordedTerminalPlaysWhatItPrintedAsItIsTyped(t *testing.T) {
	scenario := recorded.MustLoad(t, "terminal-turn")
	playing := Play(t, scenario)
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
	playing := Play(refused, recorded.MustLoad(t, "terminal-turn"))
	response, err := http.Get(strings.Replace(playing.Host(), "tcp://", "http://", 1) + "/v1.51/plugins")
	if err == nil {
		_ = response.Body.Close()
	}
	if !strings.Contains(refused.failure, "GET /v1.51/plugins") {
		t.Fatalf("an unrecorded call failed with %q, not naming it", refused.failure)
	}
}

func TestARecordedStopReleasesWaitBeforeAllTerminalInputArrives(t *testing.T) {
	scenario := recorded.MustLoad(t, "terminal-turn")
	playing := Play(t, scenario)
	terminal := terminalExchange(t, scenario)
	calls, err := scenario.Calls(recording.WireDocker)
	if err != nil {
		t.Fatal(err)
	}
	stopIndex := slices.IndexFunc(calls, func(call recorded.Call) bool {
		return strings.HasSuffix(call.Asked.Path, "/stop") &&
			playing.programs[containerOf(call.Asked.Path)].exchange.Name == terminal.Name
	})
	if stopIndex < 0 {
		t.Fatal("the recording never stops its terminal container")
	}
	stop := calls[stopIndex].Asked
	name := containerOf(stop.Path)
	waitIndex := slices.IndexFunc(calls, func(call recorded.Call) bool {
		return strings.HasSuffix(call.Asked.Path, "/wait") && containerOf(call.Asked.Path) == name
	})
	if waitIndex < 0 {
		t.Fatal("the recording never waits for the terminal container to exit")
	}
	local, peer := net.Pipe()
	defer local.Close()
	defer peer.Close()
	if !playing.programs[name].output.attach(local) {
		t.Fatal("the terminal container was stopped before it was attached")
	}
	if err := send(strings.TrimPrefix(playing.Host(), "tcp://"), stop); err != nil {
		t.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(t.Context(), 2*time.Second)
	defer cancel()
	wait := calls[waitIndex]
	path := wait.Asked.Path + queryOf(wait.Asked.Query)
	request, err := http.NewRequestWithContext(ctx, wait.Asked.Method, playing.server.URL+path, nil)
	if err != nil {
		t.Fatal(err)
	}
	response, err := playing.server.Client().Do(request)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil || response.StatusCode != *wait.Answered.Status || !bytes.Equal(body, decoded(wait.Answered.Body)) {
		t.Fatalf("the stopped container's wait returned %d and %q (%v)", response.StatusCode, body, err)
	}
	deadline, _ := ctx.Deadline()
	_ = peer.SetReadDeadline(deadline)
	if _, err := peer.Read(make([]byte, 1)); !errors.Is(err, io.EOF) {
		t.Fatalf("a stopped container left its terminal attached: %v", err)
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
	read := 0
	err = filepath.WalkDir(filepath.Join(root, "resources", "recordings"), func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() || entry.Name() != "exchange.json" {
			return nil
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		var exchange recorded.Exchange
		if err := json.Unmarshal(content, &exchange); err != nil {
			return fmt.Errorf("reading %s: %w", path, err)
		}
		if exchange.Opening.Wire != recording.WireDocker {
			return nil
		}
		for _, event := range exchange.Events {
			if event.Type != "answered" {
				continue
			}
			var answer recording.Call
			if err := json.Unmarshal(event.Call, &answer); err != nil {
				return fmt.Errorf("reading an answer in %s: %w", path, err)
			}
			if answer.Headers["Content-Type"] != "application/vnd.docker.multiplexed-stream" || answer.IsCut || answer.Body == "" {
				continue
			}
			stream, err := base64.StdEncoding.DecodeString(answer.Body)
			if err != nil {
				return fmt.Errorf("reading the answer to %s in %s: %w", answer.Path, path, err)
			}
			read++
			if at := wholeFramesEnd(stream); at >= 0 {
				t.Errorf("the %s answer to %s in %s breaks its frames at byte %d", answer.Method, answer.Path, path, at)
			}
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
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
