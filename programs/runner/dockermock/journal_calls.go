package dockermock

import (
	"context"
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"sync"
	"time"

	"journal-runner/client"
	"journal-runner/hookadapter"
	"journal-runner/mcprelay"
	"journal-runner/recorded"
	"journal-runner/recording"
)

// The sealed hook reply file a start's plan files hold, and its key beside it (App\Agents\Drivers\Hooks\HookReplies).
const (
	hookRepliesFile = "hook-replies.json"
	hookRepliesKey  = "hook-replies.key"
)

// journalCall is a call a played container's program made to the journal while it was recorded: a hook its driver ran
// or a frame its MCP server sent, at its moment after the program started.
type journalCall struct {
	offset time.Duration
	wire   recording.Wire
	body   []byte
}

// journalCallsOf are the hook and agent calls of the scenario made while the driver exchange ran, in the order they
// were asked.
func journalCallsOf(scenario recorded.Scenario, exchange recorded.Exchange) ([]journalCall, error) {
	opened := exchange.Opening.OpenedAt
	calls := []journalCall{}
	for _, wire := range []recording.Wire{recording.WireHooks, recording.WireAgent} {
		recordedCalls, err := scenario.Calls(wire)
		if err != nil {
			return nil, err
		}
		for _, call := range recordedCalls {
			if call.AskedAt < opened {
				continue
			}
			calls = append(calls, journalCall{offset: time.Duration(call.AskedAt-opened) * time.Microsecond, wire: wire,
				body: decoded(call.Asked.Body)})
		}
	}
	slices.SortStableFunc(calls, func(left, right journalCall) int { return int(left.offset - right.offset) })
	return calls, nil
}

// journalCaller makes a played container's calls to the journal as its programs made them, through the programs'
// own code: each hook through the hook adapter a session container runs, each agent frame through the MCP relay,
// both with the grant of the container's live environment. A call is made once the played output reaches its moment.
type journalCaller struct {
	calls  []journalCall
	driver string
	output io.Writer
	values *recording.Values
	frames io.WriteCloser
	grant  client.StartGrant
	// repliesFolder holds the sealed hook reply files the start's plan files gave the container.
	repliesFolder string
	made          int
	mutex         sync.Mutex
}

// newJournalCaller starts the MCP relay of a container whose live environment holds the start's grant; a container
// without one makes no calls.
func newJournalCaller(calls []journalCall, driver string, environment []string, replies map[string][]byte,
	output io.Writer, values *recording.Values) *journalCaller {
	grant, isGranted := client.StartGrantFrom(lookupIn(environment))
	if !isGranted {
		return &journalCaller{output: output}
	}
	repliesFolder, err := os.MkdirTemp("", "journal-played-replies-")
	if err != nil {
		return &journalCaller{output: output}
	}
	for name, content := range replies {
		_ = os.WriteFile(filepath.Join(repliesFolder, name), content, 0o600)
	}
	frames, relayInput := io.Pipe()
	caller := &journalCaller{calls: calls, driver: driver, output: output, values: values, frames: relayInput, grant: grant,
		repliesFolder: repliesFolder}
	relay := mcprelay.Relay{Send: sendAsAgent(grant), Output: io.Discard, Errors: io.Discard}
	go relay.Run(context.Background(), frames)
	return caller
}

func (caller *journalCaller) Write(piece []byte) (int, error) {
	return caller.output.Write(piece)
}

// Reached makes every call recorded up to the moment, in order.
func (caller *journalCaller) Reached(offset time.Duration) error {
	caller.mutex.Lock()
	defer caller.mutex.Unlock()
	for caller.made < len(caller.calls) && caller.calls[caller.made].offset <= offset {
		caller.make(caller.calls[caller.made])
		caller.made++
	}
	return nil
}

// finish makes the calls the recording holds past the played output's end and closes the relay.
func (caller *journalCaller) finish() {
	_ = caller.Reached(time.Duration(1 << 62))
	if caller.frames != nil {
		_ = caller.frames.Close()
	}
	if caller.repliesFolder != "" {
		_ = os.RemoveAll(caller.repliesFolder)
	}
}

func (caller *journalCaller) make(call journalCall) {
	body := []byte(caller.values.Live(string(call.body)))
	if call.wire == recording.WireAgent {
		_, _ = caller.frames.Write(append(body, '\n'))
		return
	}
	repliesFile := filepath.Join(caller.repliesFolder, hookRepliesFile)
	hookadapter.InContainer(caller.grant, caller.driver, repliesFile).Answer(body)
}

// sendAsAgent sends a frame to the journal's MCP address signed with the grant, as journal-mcp's own sender does; it
// stays a copy, as a change to the programs of the agent image makes every recording stale.
func sendAsAgent(grant client.StartGrant) mcprelay.Sender {
	return func(ctx context.Context, body []byte, issuedAt time.Time, headers map[string]string) (mcprelay.Answer, error) {
		answer, err := grant.PostAsAgent(ctx, mcprelay.Path, body, issuedAt.Unix(), headers)
		return mcprelay.Answer{Status: answer.Status, Body: answer.Body}, err
	}
}

// lookupIn looks a variable up in an environment of NAME=value entries.
func lookupIn(environment []string) func(string) (string, bool) {
	return func(name string) (string, bool) {
		for _, entry := range environment {
			if value, isNamed := strings.CutPrefix(entry, name+"="); isNamed {
				return value, true
			}
		}
		return "", false
	}
}

// createdEnvironment is the environment a container create asks for.
func createdEnvironment(body []byte) []string {
	var asked struct {
		Env []string `json:"Env"`
	}
	_ = json.Unmarshal(body, &asked)
	return asked.Env
}
