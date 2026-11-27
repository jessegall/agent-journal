package recording

import (
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

// KeptHeaders are the headers a recorded call keeps: those a client reads, never a signature, a credential or a
// cookie; the same list as the PHP RecordedCall.
var KeptHeaders = []string{"Content-Type", "Accept", "Content-Encoding", "Api-Version", "Docker-Experimental",
	"Ostype", "Server"}

// BodyByteLimit is the most bytes of a body a recorded call keeps, so a followed log stays small.
const BodyByteLimit = 64 * 1024

// Call is one call across a wire as a recording keeps it, in the PHP RecordedCall's line format.
type Call struct {
	Method     string            `json:"method"`
	Path       string            `json:"path"`
	Query      map[string]string `json:"query"`
	Status     *int              `json:"status"`
	Headers    map[string]string `json:"headers"`
	Body       string            `json:"body"`
	IsUpgraded bool              `json:"upgraded"`
	IsCut      bool              `json:"cut"`
	IsWithheld bool              `json:"withheld"`
}

// CallRecorder is the recorder of one wire of calls: each exchange's first call opens its draft.
type CallRecorder struct {
	wire   Wire
	drafts Drafts
}

// NewCallRecorder records the wire's calls into the drafts.
func NewCallRecorder(wire Wire, drafts Drafts) CallRecorder {
	return CallRecorder{wire: wire, drafts: drafts}
}

func (recorder CallRecorder) Wire() Wire {
	return recorder.wire
}

func (recorder CallRecorder) Begin(exchange string, opening Opening) error {
	return recorder.drafts.Begin(recorder.wire, exchange, opening)
}

// Add adds the event to the exchange, opening its draft with its first event.
func (recorder CallRecorder) Add(exchange string, event Event) error {
	opening := Opening{Wire: recorder.wire, Exchange: exchange, Mode: "calls", Argv: []string{},
		Environment: map[string]string{}, Inherited: []string{}, OpenedAt: event.At}
	if err := recorder.drafts.Begin(recorder.wire, exchange, opening); err != nil {
		return err
	}
	return recorder.drafts.Add(recorder.wire, exchange, event)
}

// End has nothing to write: a wire of calls ends with its run.
func (recorder CallRecorder) End(string, int) error {
	return nil
}

// Asked is the event of a request as the client sent it; its body is read and put back for the request to go on.
func Asked(request *http.Request, at time.Time) Event {
	var sent []byte
	if request.Body != nil {
		sent, _ = io.ReadAll(request.Body)
		request.Body = io.NopCloser(bytes.NewReader(sent))
	}
	call := Call{Method: request.Method, Path: request.URL.Path, Query: queryOf(request), Headers: keptOf(request.Header)}
	call.Body, call.IsCut = keptBody(sent)
	return callEvent("asked", at, call)
}

// Answered is the event of the server's answer to the request, its body as the server meant it (a gzip answer
// unpacked), an upgraded answer keeping only that it was upgraded.
func Answered(request *http.Request, status int, header http.Header, body []byte, at time.Time) Event {
	call := Call{Method: request.Method, Path: request.URL.Path, Query: queryOf(request), Status: &status,
		Headers: keptOf(header), IsUpgraded: status == http.StatusSwitchingProtocols}
	if !call.IsUpgraded {
		call.Body, call.IsCut = keptBody(decodedBody(header.Get("Content-Encoding"), body))
	}
	return callEvent("answered", at, call)
}

func callEvent(kind string, at time.Time, call Call) Event {
	encoded, _ := json.Marshal(call)
	return Event{Type: kind, At: at.UnixMicro(), Call: encoded}
}

func queryOf(request *http.Request) map[string]string {
	query := map[string]string{}
	for name, values := range request.URL.Query() {
		query[name] = values[0]
	}
	return query
}

func keptOf(header http.Header) map[string]string {
	kept := map[string]string{}
	for _, name := range KeptHeaders {
		if value := header.Get(name); value != "" {
			kept[name] = value
		}
	}
	return kept
}

// keptBody is the body, cut past BodyByteLimit, as base64, and whether it was cut.
func keptBody(body []byte) (string, bool) {
	isCut := len(body) > BodyByteLimit
	if isCut {
		body = body[:BodyByteLimit]
	}
	return base64.StdEncoding.EncodeToString(body), isCut
}

// decodedBody is the body as the server meant it: a gzip body unpacked, any other as it came.
func decodedBody(encoding string, body []byte) []byte {
	if encoding != "gzip" || len(body) == 0 {
		return body
	}
	reader, err := gzip.NewReader(bytes.NewReader(body))
	if err != nil {
		return body
	}
	unpacked, err := io.ReadAll(reader)
	if err != nil {
		return body
	}
	return unpacked
}
