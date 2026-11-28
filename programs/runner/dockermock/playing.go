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
	"testing"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// playedPause is how long a played container waits between two groups of its recorded output.
const playedPause = 5 * time.Millisecond

// Playing is a Docker daemon played from a recorded scenario: every call gets its recorded answer, and a container's
// attach plays what the driver exchange of its program printed, gated on what is typed into it as it was recorded.
type Playing struct {
	server *httptest.Server
	replay *recorded.CallReplay
	// programs are the driver exchanges by the id and the name of the container that ran them, as recorded.
	programs map[string]program
	mutex    sync.Mutex
}

// program is the driver exchange a container ran, and whether the container had a terminal.
type program struct {
	exchange recorded.Exchange
	hasTTY   bool
}

// createdProgram is what a recorded container create names of the program it runs.
type createdProgram struct {
	Entrypoint []string `json:"Entrypoint"`
	Cmd        []string `json:"Cmd"`
	Tty        bool     `json:"Tty"`
}

// Play starts a Docker daemon that plays the recorded scenario of the driver, closed when the test ends; a call the
// recording does not hold fails the test naming it.
func Play(t testing.TB, driver, name string) *Playing {
	t.Helper()
	scenario := recorded.MustLoad(t, driver, name)
	playing := &Playing{replay: recorded.NewCallReplay(t, scenario, recording.WireDocker), programs: programsOf(t, scenario)}
	playing.replay.Upgraded = playing.attached
	// A container's wait or followed log answers only once what was asked of it while it waited was asked here too.
	playing.replay.IsLongPoll = isLongPoll
	playing.replay.OrderGroup = containerCalledBy
	headers := daemonHeadersOf(t, scenario)
	playing.server = httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.URL.Path == pingPath {
			answerPing(writer, headers)
			return
		}
		playing.replay.ServeHTTP(writer, request)
	}))
	// Closing the replay first ends a call still held in its order, which the server's close would wait for.
	t.Cleanup(func() {
		playing.replay.Close()
		playing.server.Close()
	})
	return playing
}

// pingPath is where Docker's client asks the daemon's API version before its first call.
const pingPath = "/_ping"

// daemonHeaders are the headers the recorded daemon names itself by on every answer.
var daemonHeaders = []string{"Api-Version", "Docker-Experimental", "Ostype", "Server"}

// daemonHeadersOf are the recorded daemon's own headers, as its first answer carries them: a recording opens on a
// host whose client asked the version before, so it holds no ping, and a played daemon answers one by these.
func daemonHeadersOf(t testing.TB, scenario recorded.Scenario) map[string]string {
	t.Helper()
	calls, err := scenario.Calls(recording.WireDocker)
	if err != nil {
		t.Fatal(err)
	}
	for _, call := range calls {
		if call.Answered.Headers["Api-Version"] != "" {
			return call.Answered.Headers
		}
	}
	t.Fatal("the recorded daemon named no API version")
	return nil
}

func answerPing(writer http.ResponseWriter, headers map[string]string) {
	for _, name := range daemonHeaders {
		writer.Header().Set(name, headers[name])
	}
	_, _ = io.WriteString(writer, "OK")
}

// Host is the daemon's address as Docker's client takes it.
func (playing *Playing) Host() string {
	return "tcp://" + strings.TrimPrefix(playing.server.URL, "http://")
}

// programsOf pairs each recorded container, by its id and its name, with the driver exchange its create ran.
func programsOf(t testing.TB, scenario recorded.Scenario) map[string]program {
	t.Helper()
	calls, err := scenario.Calls(recording.WireDocker)
	if err != nil {
		t.Fatal(err)
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
				ran := program{exchange: exchange, hasTTY: asked.Tty}
				programs[answered.ID] = ran
				if name := call.Asked.Query["name"]; name != "" {
					programs[name] = ran
				}
			}
		}
	}
	return programs
}

// attached plays the program of the attached container on its connection, or nothing for a container the recording
// ran no driver program in, and closes the connection when the program's output is played.
func (playing *Playing) attached(call recorded.Call, connection net.Conn, buffered *bufio.ReadWriter) {
	defer connection.Close()
	playing.mutex.Lock()
	ran, isDriver := playing.programs[containerOf(call.Answered.Path)]
	playing.mutex.Unlock()
	if !isDriver {
		return
	}
	fixture, err := recording.Load(ran.exchange.Folder)
	if err != nil {
		return
	}
	var output io.Writer = connection
	if !ran.hasTTY {
		output = stdoutFrames{connection}
	}
	_ = recording.GatedReplay(fixture, buffered, output, playedPause, func(recording.Typed) error { return nil })
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
	header := make([]byte, 8)
	header[0] = 1
	binary.BigEndian.PutUint32(header[4:], uint32(len(piece)))
	if _, err := frames.writer.Write(append(header, piece...)); err != nil {
		return 0, err
	}
	return len(piece), nil
}
