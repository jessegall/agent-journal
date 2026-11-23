// Package mcprelay is the MCP server a started driver runs on stdio where the journal's own console is not installed,
// such as a session container: each frame the driver writes goes to the journal as one signed call whose body is the
// frame's exact bytes, and each answer comes back as one line. It reads no journal data itself. It mirrors the
// console's relay (App\Mcp\Console\RelayCommand, App\Mcp\Support\RelayFrames and Frame).
package mcprelay

import (
	"bufio"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

const (
	// Path is the journal's MCP address for a started driver (App\Mcp\Servers\JournalServer::PATH).
	Path = "/agent/mcp/v1"
	// byteLimit and depthLimit are the largest and the deepest message the journal takes
	// (App\Http\Middleware\Mcp\LimitMcpMessage).
	byteLimit  = 262144
	depthLimit = 32
	// mostQueued is how many frames wait at most.
	mostQueued = 8
	// budget is how long after it arrived a frame's call may last, and smallestStart how much of that must be left
	// for a queued frame to be started at all.
	budget        = 20 * time.Second
	smallestStart = 2 * time.Second

	parseError     = -32700
	invalidRequest = -32600
	serverError    = -32000

	protocolVersionHeader = "MCP-Protocol-Version"
	methodHeader          = "Mcp-Method"
	nameHeader            = "Mcp-Name"
	protocolVersionMeta   = "io.modelcontextprotocol/protocolVersion"
)

// refusal is one of the journal's refusal codes, with whether the same call may be sent again
// (App\Enums\RefusalCode).
type refusal struct {
	code      string
	retryable bool
}

var (
	invalidInput    = refusal{"invalid_input", false}
	unauthenticated = refusal{"unauthenticated", false}
	busy            = refusal{"busy", true}
	unavailable     = refusal{"unavailable", true}
	deadlineExpired = refusal{"deadline_expired", true}
)

// Answer is what the journal said to one frame's call.
type Answer struct {
	Status int
	Body   []byte
}

// Sender sends one frame's bytes to the journal before the deadline, with the frame's MCP headers and the time the
// frame arrived as the call's issue time. An error means the journal was not reached.
type Sender func(ctx context.Context, body []byte, issuedAt time.Time, headers map[string]string) (Answer, error)

// frame is one JSON-RPC message the driver wrote, as the exact bytes it wrote, with the moment it arrived.
type frame struct {
	bytes      []byte
	id         json.RawMessage
	method     string
	params     map[string]json.RawMessage
	admittedAt time.Time
}

func (frame frame) hasID() bool { return len(frame.id) > 0 && string(frame.id) != "null" }

// isRequest is whether the driver waits for an answer: a message with an id and a method.
func (frame frame) isRequest() bool { return frame.hasID() && frame.method != "" }

func (frame frame) deadline() time.Time { return frame.admittedAt.Add(budget) }

// cancelledID is the id of the request a notifications/cancelled frame cancels, when this is one.
func (frame frame) cancelledID() (string, bool) {
	if frame.method != "notifications/cancelled" {
		return "", false
	}
	id, named := frame.params["requestId"]
	if !named || (!isJSONString(id) && !isJSONInteger(id)) {
		return "", false
	}

	return string(id), true
}

// protocolVersion is the version a modern frame names in its _meta; empty for a legacy frame.
func (frame frame) protocolVersion() string {
	var meta map[string]json.RawMessage
	if json.Unmarshal(frame.params["_meta"], &meta) != nil {
		return ""
	}
	var version string
	if json.Unmarshal(meta[protocolVersionMeta], &version) != nil {
		return ""
	}

	return version
}

// headers are the MCP headers of the frame's call: a modern frame mirrors its method, name and protocol version; a
// legacy frame carries the version its initialize negotiated, once there is one.
func (frame frame) headers(negotiated string) map[string]string {
	version := frame.protocolVersion()
	if version == "" || frame.method == "" {
		if negotiated == "" {
			return map[string]string{}
		}

		return map[string]string{protocolVersionHeader: negotiated}
	}
	headers := map[string]string{methodHeader: frame.method, protocolVersionHeader: version}
	if name, named := frame.name(); named && frame.hasID() {
		headers[nameHeader] = headerValue(name)
	}

	return headers
}

// name is what a call names: the tool or prompt, or the resource's address.
func (frame frame) name() (string, bool) {
	key := map[string]string{"tools/call": "name", "prompts/get": "name", "resources/read": "uri"}[frame.method]
	var name string
	if key == "" || json.Unmarshal(frame.params[key], &name) != nil {
		return "", false
	}

	return name, true
}

var plainHeaderValue = regexp.MustCompile(`^[\x21-\x7E]([\x20-\x7E\x09]*[\x21-\x7E])?$`)

// headerValue is a value as a header carries it: itself when it is plain visible text, else base64 between the
// markers the journal reads (Laravel\Mcp\Transport\HeaderValue).
func headerValue(value string) string {
	isMarked := strings.HasPrefix(value, "=?base64?") && strings.HasSuffix(value, "?=")
	if !isMarked && plainHeaderValue.MatchString(value) {
		return value
	}

	return "=?base64?" + base64.StdEncoding.EncodeToString([]byte(value)) + "?="
}

// Relay passes a driver's frames to the journal and writes the answers back, one line each. Diagnostics go to the
// errors writer, never to the output the driver reads.
type Relay struct {
	Send   Sender
	Output io.Writer
	Errors io.Writer
	Now    func() time.Time

	mutex      sync.Mutex
	arrived    *sync.Cond
	queue      []frame
	ended      bool
	negotiated string
}

// Run reads the input to its end and answers every frame; it returns once the input ended and the queue is empty.
func (relay *Relay) Run(ctx context.Context, input io.Reader) {
	if relay.Now == nil {
		relay.Now = time.Now
	}
	relay.arrived = sync.NewCond(&relay.mutex)
	go relay.read(input)

	for {
		next, found := relay.next()
		if !found {
			return
		}
		call, cancel := context.WithDeadline(ctx, next.deadline())
		answer, err := relay.Send(call, next.bytes, next.admittedAt, next.headers(relay.negotiated))
		expired := call.Err() != nil
		cancel()
		switch {
		case err != nil && expired:
			relay.refuse(next, deadlineExpired, "The call passed its deadline before the journal answered.", nil)
		case err != nil:
			relay.refuse(next, unavailable, "The journal could not be reached: "+err.Error(), nil)
		default:
			relay.answer(next, answer)
		}
	}
}

// read admits each line of the input as it arrives, so a cancellation can drop its queued request while a call runs.
func (relay *Relay) read(input io.Reader) {
	reader := bufio.NewReaderSize(input, 65536)
	for {
		line, err := reader.ReadBytes('\n')
		if text := strings.TrimRight(string(line), "\r\n"); strings.TrimSpace(text) != "" {
			relay.admit([]byte(text))
		}
		if err != nil {
			break
		}
	}
	relay.mutex.Lock()
	relay.ended = true
	relay.mutex.Unlock()
	relay.arrived.Broadcast()
}

func (relay *Relay) admit(line []byte) {
	if len(line) > byteLimit {
		relay.writeError(idIn(line), invalidRequest, invalidInput,
			"The message is larger than "+strconv.Itoa(byteLimit)+" bytes and was not sent.", nil)

		return
	}
	if !utf8.Valid(line) {
		relay.writeError(nil, parseError, invalidInput, "The message is not UTF-8 and was not sent.", nil)

		return
	}
	if !json.Valid(line) {
		relay.writeError(nil, parseError, invalidInput, "The message is not one JSON-RPC object and was not sent.", nil)

		return
	}
	if depthOf(line) > depthLimit {
		relay.writeError(idIn(line), invalidRequest, invalidInput,
			"The message is nested deeper than "+strconv.Itoa(depthLimit)+" levels and was not sent.", nil)

		return
	}
	var message struct {
		ID     json.RawMessage            `json:"id"`
		Method string                     `json:"method"`
		Params map[string]json.RawMessage `json:"params"`
	}
	if err := json.Unmarshal(line, &message); err != nil {
		relay.writeError(nil, parseError, invalidInput, "The message is not one JSON-RPC object and was not sent.", nil)

		return
	}
	relay.enqueue(frame{bytes: line, id: message.ID, method: message.Method, params: message.Params, admittedAt: relay.Now()})
}

func (relay *Relay) enqueue(admitted frame) {
	relay.mutex.Lock()
	if cancelled, cancels := admitted.cancelledID(); cancels {
		kept := relay.queue[:0]
		for _, queued := range relay.queue {
			if string(queued.id) != cancelled {
				kept = append(kept, queued)
			}
		}
		relay.queue = kept
		relay.mutex.Unlock()

		return
	}
	if len(relay.queue) >= mostQueued {
		relay.mutex.Unlock()
		relay.refuse(admitted, busy,
			"The relay already holds "+strconv.Itoa(mostQueued)+" waiting calls; send it again when one is answered.", nil)

		return
	}
	relay.queue = append(relay.queue, admitted)
	relay.mutex.Unlock()
	relay.arrived.Broadcast()
}

// next is the next queued frame that may still start, waiting for input when none is queued; found is false once
// the input ended.
func (relay *Relay) next() (frame, bool) {
	for {
		relay.mutex.Lock()
		for len(relay.queue) == 0 && !relay.ended {
			relay.arrived.Wait()
		}
		if len(relay.queue) == 0 {
			relay.mutex.Unlock()

			return frame{}, false
		}
		next := relay.queue[0]
		relay.queue = relay.queue[1:]
		relay.mutex.Unlock()
		if next.deadline().Sub(relay.Now()) >= smallestStart {
			return next, true
		}
		relay.refuse(next, deadlineExpired, "The call waited past its deadline and was not sent; send it again.", nil)
	}
}

// answer writes the journal's answer to the frame: its body as one line, nothing for 202, and a JSON-RPC error for a
// refusal that carries none of its own.
func (relay *Relay) answer(answered frame, answer Answer) {
	if answer.Status == 202 {
		return
	}
	var reply map[string]json.RawMessage
	if err := json.Unmarshal(answer.Body, &reply); err == nil && string(reply["jsonrpc"]) == `"2.0"` {
		relay.rememberNegotiatedVersion(answered, reply)
		compact, _ := json.Marshal(reply)
		relay.write(compact)

		return
	} else if err != nil {
		fmt.Fprintf(relay.Errors, "The journal's answer is not a JSON-RPC reply (%v).\n", err)
	}
	switch answer.Status {
	case 401:
		relay.refuse(answered, unauthenticated, "The journal did not accept this start token.", nil)
	case 429:
		relay.refuse(answered, busy, "Too many calls; send it again after the wait.", retryAfterIn(answer.Body))
	case 413, 400:
		relay.refuse(answered, invalidInput, "The journal refused the message as too large or malformed.", nil)
	default:
		relay.refuse(answered, unavailable,
			"The journal answered "+strconv.Itoa(answer.Status)+" and no MCP reply: "+saidIn(answer.Body), nil)
	}
}

// saidIn is what a refusal's body says in its own words: its message when it names one, else its first bytes.
func saidIn(body []byte) string {
	var refusal struct {
		Message string `json:"message"`
	}
	if json.Unmarshal(body, &refusal) == nil && refusal.Message != "" {
		return refusal.Message
	}

	return string(body[:min(len(body), 200)])
}

// rememberNegotiatedVersion keeps the protocol version a legacy initialize negotiated, for the frames after it.
func (relay *Relay) rememberNegotiatedVersion(answered frame, reply map[string]json.RawMessage) {
	if answered.method != "initialize" || answered.protocolVersion() != "" {
		return
	}
	var result struct {
		ProtocolVersion string `json:"protocolVersion"`
	}
	if json.Unmarshal(reply["result"], &result) == nil && result.ProtocolVersion != "" {
		relay.negotiated = result.ProtocolVersion
	}
}

// retryAfterIn is the wait a busy refusal asks for, when its body names one.
func retryAfterIn(body []byte) map[string]any {
	var busyReply struct {
		RetryAfterSeconds *int `json:"retry_after_seconds"`
	}
	if json.Unmarshal(body, &busyReply) != nil || busyReply.RetryAfterSeconds == nil {
		return nil
	}

	return map[string]any{"retry_after_seconds": *busyReply.RetryAfterSeconds}
}

func (relay *Relay) refuse(refused frame, code refusal, message string, details map[string]any) {
	if !refused.isRequest() {
		fmt.Fprintf(relay.Errors, "A %s message was not delivered: %s\n", refused.method, message)

		return
	}
	relay.writeError(refused.id, serverError, code, message, details)
}

func (relay *Relay) writeError(id json.RawMessage, jsonRPCCode int, code refusal, message string, details map[string]any) {
	data := map[string]any{"code": code.code, "retryable": code.retryable}
	for name, detail := range details {
		data[name] = detail
	}
	if len(id) == 0 {
		id = json.RawMessage("null")
	}
	line, _ := json.Marshal(map[string]any{
		"jsonrpc": "2.0",
		"id":      id,
		"error":   map[string]any{"code": jsonRPCCode, "message": message, "data": data},
	})
	relay.write(line)
}

func (relay *Relay) write(line []byte) {
	relay.mutex.Lock()
	defer relay.mutex.Unlock()
	_, _ = relay.Output.Write(append(line, '\n'))
}

// idIn is the id of a message that is too large or too deep to be read whole, when its start names one.
func idIn(line []byte) json.RawMessage {
	found := idPattern.FindSubmatch(line)
	if found == nil {
		return nil
	}

	return json.RawMessage(found[1])
}

var idPattern = regexp.MustCompile(`"id"\s*:\s*("(?:[^"\\]|\\.)*"|-?\d+)`)

// depthOf is how deeply a valid JSON text nests its objects and arrays.
func depthOf(line []byte) int {
	deepest, depth, inString, escaped := 0, 0, false, false
	for _, character := range line {
		switch {
		case escaped:
			escaped = false
		case inString:
			escaped = character == '\\'
			inString = character != '"'
		case character == '"':
			inString = true
		case character == '{' || character == '[':
			depth++
			deepest = max(deepest, depth)
		case character == '}' || character == ']':
			depth--
		}
	}

	return deepest
}

func isJSONString(value json.RawMessage) bool { return len(value) > 0 && value[0] == '"' }

func isJSONInteger(value json.RawMessage) bool {
	_, err := strconv.ParseInt(string(value), 10, 64)

	return err == nil
}
