package dockermock

import (
	"bufio"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"slices"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// playedPause is how long a played container waits between two groups of its recorded output.
const playedPause = 5 * time.Millisecond

// Playing is a Docker daemon played from a recorded scenario: every call gets its recorded answer, a container's
// attach plays what the driver exchange of its program printed, gated on what is typed into it as it was recorded, and
// the calls its program made to the journal are made again as its output reaches their moments.
type Playing struct {
	server   *httptest.Server
	replay   *recorded.CallReplay
	scenario recorded.Scenario
	// programs are the driver exchanges by the id and the name of the container that ran them, as recorded.
	programs map[string]program
	// environments are the live environments of the containers created, by the name and the id they were created as.
	environments map[string][]string
	// runKeys are the image and command each recorded container ran, by its id and its name, as recorded.
	runKeys map[string]string
	// outputs are what each recorded run printed, as the host answered its run_containers order.
	outputs runOutputs
	mutex   sync.Mutex
}

// program is the driver exchange a container ran, whether the container had a terminal, and when its output was
// played, shared by the container's id and its name.
type program struct {
	exchange recorded.Exchange
	hasTTY   bool
	output   *playedOutput
}

// playedOutput closes once a container's recorded output was played whole on its attach; a container read by its
// logs is never attached, and its wait holds for nothing.
type playedOutput struct {
	done       chan struct{}
	once       sync.Once
	isAttached atomic.Bool
}

func (output *playedOutput) finish() {
	output.once.Do(func() { close(output.done) })
}

// countedOutput passes the replay's output and its moments on and tells once the recorded output was written whole,
// as the replay itself goes on reading the program's input until it ends.
type countedOutput struct {
	next   *journalCaller
	left   int
	played func()
}

func (output *countedOutput) Reached(offset time.Duration) error {
	return output.next.Reached(offset)
}

func (output *countedOutput) Write(piece []byte) (int, error) {
	written, err := output.next.Write(piece)
	output.left -= written
	if output.left <= 0 {
		output.played()
	}
	return written, err
}

// recordedLength is how many bytes the fixture's program printed.
func recordedLength(fixture recording.Fixture) int {
	length := 0
	for _, chunk := range fixture.Output {
		length += len(chunk.Bytes)
	}
	return length
}

// createdProgram is what a recorded container create names of the program it runs.
type createdProgram struct {
	Image      string   `json:"Image"`
	Entrypoint []string `json:"Entrypoint"`
	Cmd        []string `json:"Cmd"`
	Tty        bool     `json:"Tty"`
}

// Play starts a Docker daemon that plays the recorded scenario of the driver, closed when the test ends; a call the
// recording does not hold fails the test naming it.
func Play(t testing.TB, driver, name string) *Playing {
	t.Helper()
	playing, err := PlayScenario(t, recorded.MustLoad(t, driver, name))
	if err != nil {
		t.Fatal(err)
	}
	playing.server = httptest.NewServer(playing)
	t.Cleanup(func() {
		playing.Close()
		playing.server.Close()
	})
	return playing
}

// PlayScenario is a Docker daemon that plays the recorded scenario, reporting each call the recording does not hold
// to the failures; serve it, and close it before its server.
func PlayScenario(failures recorded.Failures, scenario recorded.Scenario) (*Playing, error) {
	replay, err := recorded.NewCallReplay(failures, scenario, recording.WireDocker)
	if err != nil {
		return nil, err
	}
	programs, err := programsOf(scenario)
	if err != nil {
		return nil, err
	}
	outputs, err := runOutputsOf(scenario)
	if err != nil {
		return nil, err
	}
	playing := &Playing{replay: replay, scenario: scenario, programs: programs,
		environments: map[string][]string{}, runKeys: map[string]string{}, outputs: outputs}
	replay.Upgraded = playing.attached
	replay.Heard = playing.heard
	replay.Answering = playing.answering
	// A container's wait or followed log answers only once what was asked of it while it waited was asked here too.
	replay.IsLongPoll = isLongPoll
	replay.OrderGroup = containerCalledBy
	return playing, nil
}

// ServeHTTP answers every call by its recording.
func (playing *Playing) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	playing.replay.ServeHTTP(writer, request)
}

// Close ends every call still held in its order, so the server serving the daemon can close.
func (playing *Playing) Close() {
	playing.replay.Close()
}

// AssertPlayedWhole reports each recorded call that was never asked to the failures.
func (playing *Playing) AssertPlayedWhole(failures recorded.Failures) {
	playing.replay.AssertPlayedWhole(failures)
}

// IsPlayedWhole answers whether every recorded call was asked.
func (playing *Playing) IsPlayedWhole() bool {
	return playing.replay.IsPlayedWhole()
}

// heard keeps the live environment of each container created, by the name and the id the recording gave it.
func (playing *Playing) heard(call recorded.Call, body []byte) {
	if !strings.HasSuffix(call.Answered.Path, "/containers/create") {
		return
	}
	var answered struct {
		ID string `json:"Id"`
	}
	_ = json.Unmarshal(decoded(call.Answered.Body), &answered)
	playing.mutex.Lock()
	defer playing.mutex.Unlock()
	playing.environments[answered.ID] = createdEnvironment(body)
	var created createdProgram
	_ = json.Unmarshal(decoded(call.Asked.Body), &created)
	key := runKey(created.Image, append(slices.Clone(created.Entrypoint), created.Cmd...))
	playing.runKeys[answered.ID] = key
	if name := call.Asked.Query["name"]; name != "" {
		playing.environments[name] = createdEnvironment(body)
		playing.runKeys[name] = key
	}
}

// Host is the daemon's address as Docker's client takes it.
func (playing *Playing) Host() string {
	return "tcp://" + strings.TrimPrefix(playing.server.URL, "http://")
}

// programsOf pairs each recorded container, by its id and its name, with the driver exchange its create ran.
func programsOf(scenario recorded.Scenario) (map[string]program, error) {
	calls, err := scenario.Calls(recording.WireDocker)
	if err != nil {
		return nil, err
	}
	drivers := scenario.ExchangesOn(recording.WireDriver)
	programs := map[string]program{}
	for _, call := range calls {
		if !strings.HasSuffix(call.Answered.Path, "/containers/create") {
			continue
		}
		var asked createdProgram
		var answered struct {
			ID string `json:"Id"`
		}
		if json.Unmarshal(decoded(call.Asked.Body), &asked) != nil || json.Unmarshal(decoded(call.Answered.Body), &answered) != nil {
			continue
		}
		command := append(slices.Clone(asked.Entrypoint), asked.Cmd...)
		for _, exchange := range drivers {
			argv := exchange.Opening.Argv
			if len(argv) > 0 && len(argv) <= len(command) && slices.Equal(command[len(command)-len(argv):], argv) {
				ran := program{exchange: exchange, hasTTY: asked.Tty, output: &playedOutput{done: make(chan struct{})}}
				programs[answered.ID] = ran
				if name := call.Asked.Query["name"]; name != "" {
					programs[name] = ran
				}
			}
		}
	}
	return programs, nil
}

// attached plays the program of the attached container on its connection, or nothing for a container the recording
// ran no driver program in, and closes the connection when the program's output is played.
func (playing *Playing) attached(call recorded.Call, connection net.Conn, buffered *bufio.ReadWriter) {
	defer connection.Close()
	playing.mutex.Lock()
	ran, isDriver := playing.programs[containerOf(call.Answered.Path)]
	key := playing.runKeys[containerOf(call.Answered.Path)]
	playing.mutex.Unlock()
	if !isDriver {
		playing.printRun(key, connection)
		return
	}
	ran.output.isAttached.Store(true)
	defer ran.output.finish()
	fixture, err := recording.Load(ran.exchange.Folder)
	if err != nil {
		return
	}
	var output io.Writer = connection
	if !ran.hasTTY {
		output = stdoutFrames{connection}
	}
	calls, err := journalCallsOf(playing.scenario, ran.exchange)
	if err != nil {
		return
	}
	playing.mutex.Lock()
	environment := playing.environments[containerOf(call.Answered.Path)]
	playing.mutex.Unlock()
	caller := newJournalCaller(calls, playing.scenario.Manifest.Driver, environment, output, playing.replay.Values())
	defer caller.finish()
	written := &countedOutput{next: caller, left: recordedLength(fixture), played: ran.output.finish}
	_ = recording.GatedReplay(fixture, buffered, written, playedPause, func(recording.Typed) error { return nil })
}

// answering holds a container's wait until its recorded output was played whole, as Docker answers a wait only once
// the container's output reached its attach; every other answer goes as it is.
func (playing *Playing) answering(call recorded.Call, body []byte) []byte {
	if !strings.HasSuffix(call.Answered.Path, "/wait") {
		return body
	}
	playing.mutex.Lock()
	ran, isDriver := playing.programs[containerOf(call.Answered.Path)]
	playing.mutex.Unlock()
	if !isDriver || !ran.output.isAttached.Load() {
		return body
	}
	select {
	case <-ran.output.done:
	case <-playing.replay.Closed():
	}
	return body
}

// printRun writes what the recorded run of the image and command printed, as Docker streams a container that ran no
// driver program: its standard output and its standard error each as frames of their own.
func (playing *Playing) printRun(key string, connection net.Conn) {
	playing.mutex.Lock()
	output, isRecorded := playing.outputs.take(key)
	playing.mutex.Unlock()
	if !isRecorded {
		return
	}
	if output.Stdout != "" {
		_, _ = stdoutFrames{connection}.Write([]byte(output.Stdout))
	}
	if output.Stderr != "" {
		_, _ = stderrFrames{connection}.Write([]byte(output.Stderr))
	}
}

// isLongPoll answers whether the call waits on its container: a wait, or a log followed until the container ends.
func isLongPoll(call recorded.Call) bool {
	return strings.HasSuffix(call.Answered.Path, "/wait") ||
		(strings.HasSuffix(call.Answered.Path, "/logs") && call.Answered.Query["follow"] == "1")
}

// containerCalledBy is the container a call is about: the one its path names, or the one a create names.
func containerCalledBy(call recorded.Call) string {
	if strings.HasSuffix(call.Answered.Path, "/containers/create") {
		return call.Answered.Query["name"]
	}
	return containerOf(call.Answered.Path)
}

// containerOf is the container a path of Docker's API names: /v1.x/containers/<id>/...
func containerOf(path string) string {
	parts := strings.Split(path, "/")
	for index, part := range parts {
		if part == "containers" && index+1 < len(parts) {
			return parts[index+1]
		}
	}
	return ""
}

func decoded(body string) []byte {
	bytes, _ := base64.StdEncoding.DecodeString(body)
	return bytes
}

// stdoutFrames writes each piece as one frame of Docker's multiplexed stream on standard output, as a container with
// no terminal is attached.
type stdoutFrames struct{ writer io.Writer }

func (frames stdoutFrames) Write(piece []byte) (int, error) {
	return writeFrame(frames.writer, 1, piece)
}

// stderrFrames writes each piece as one frame of Docker's multiplexed stream on standard error.
type stderrFrames struct{ writer io.Writer }

func (frames stderrFrames) Write(piece []byte) (int, error) {
	return writeFrame(frames.writer, 2, piece)
}

// writeFrame writes one frame of Docker's multiplexed stream: its stream's number, its length, then the piece.
func writeFrame(writer io.Writer, stream byte, piece []byte) (int, error) {
	header := make([]byte, 8)
	header[0] = stream
	binary.BigEndian.PutUint32(header[4:], uint32(len(piece)))
	if _, err := writer.Write(append(header, piece...)); err != nil {
		return 0, err
	}
	return len(piece), nil
}
