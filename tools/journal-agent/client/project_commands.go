package client

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	projectCommandsTarget = "/api/project-commands"
	profileHeader         = "X-Journal-Profile"
	profileRevisionHeader = "X-Journal-Profile-Revision"
	agentCallProtocol     = "2"
	exitStream            = "exit"
	standardErrorStream   = "stderr"
)

// ErrNoExitFrame is returned when the journal's answer ended before the verb's exit frame.
var ErrNoExitFrame = errors.New("the journal's answer ended before the verb's exit code")

// StartGrant is a provider session's own credential, as its start environment carries it: the journal, the start
// token and the profile the start was pinned to. Every call it makes is signed as that agent.
type StartGrant struct {
	JournalURL      string
	Token           string
	ProfileKey      string
	ProfileRevision int
}

// ProjectCommand mirrors App\Connections\Calls\RunProjectCommandCall: one journal verb as typed, run once per key.
type ProjectCommand struct {
	RequestKey string   `json:"request_key"`
	Binding    string   `json:"binding"`
	Argv       []string `json:"argv"`
	Stdin      string   `json:"stdin"`
}

// CommandFrame mirrors App\Connections\Values\CommandFrame: output in sequence, or the exit frame with its code.
type CommandFrame struct {
	Sequence int    `json:"sequence"`
	Stream   string `json:"stream"`
	Text     string `json:"text"`
	IsBase64 bool   `json:"isBase64"`
	ExitCode int    `json:"exitCode"`
}

// Bytes are the frame's output as it was written.
func (frame CommandFrame) Bytes() ([]byte, error) {
	if frame.IsBase64 {
		return base64.StdEncoding.DecodeString(frame.Text)
	}

	return []byte(frame.Text), nil
}

// IsStandardError is whether the frame was written to standard error.
func (frame CommandFrame) IsStandardError() bool { return frame.Stream == standardErrorStream }

// RunProjectCommand runs the verb on the journal, signed with the grant, and hands each frame to write in sequence;
// it answers the verb's exit code. A connection lost before the exit frame is ErrUncertain.
func RunProjectCommand(
	ctx context.Context,
	transport *http.Client,
	grant StartGrant,
	command ProjectCommand,
	write func(CommandFrame) error,
) (int, error) {
	request, err := grant.signedPost(ctx, projectCommandsTarget, command)
	if err != nil {
		return 0, err
	}

	return readFrames(transport, request, write)
}

// CommandStatus mirrors App\Connections\Calls\ProjectCommandStatus: where a request id's run stands and, once it
// settled with an outcome, the frames it recorded, ending with its exit frame.
type CommandStatus struct {
	State  string         `json:"state"`
	Frames []CommandFrame `json:"frames"`
}

// The states a run's status reads in, as App\Connections\Enums\CommandRunState names them.
const (
	CommandRunning               = "running"
	CommandCancellationRequested = "cancellation_requested"
	CommandInterrupted           = "interrupted"
	CommandUnknown               = "unknown"
)

// IsSettled is whether the run ended with an outcome whose frames the status carries.
func (status CommandStatus) IsSettled() bool {
	return status.State != CommandRunning && status.State != CommandCancellationRequested &&
		status.State != CommandInterrupted && status.State != CommandUnknown
}

// ReadProjectCommandStatus reads, signed with the grant, what became of this agent's verb of the request id on the
// binding; it starts nothing.
func ReadProjectCommandStatus(
	ctx context.Context,
	transport *http.Client,
	grant StartGrant,
	bindingID string,
	requestKey string,
) (CommandStatus, error) {
	request, err := grant.signedPost(ctx, projectCommandsTarget+"/status",
		map[string]string{"binding": bindingID, "request_key": requestKey})
	if err != nil {
		return CommandStatus{}, err
	}
	response, err := transport.Do(request)
	if err != nil {
		return CommandStatus{}, errors.Join(ErrUncertain, err)
	}
	defer response.Body.Close()
	if err := refusalOf(response, request.URL.Path); err != nil {
		return CommandStatus{}, err
	}
	var status CommandStatus

	return status, json.NewDecoder(response.Body).Decode(&status)
}

// readFrames sends the request and hands each frame of its answer to write in sequence, until the exit frame.
func readFrames(transport *http.Client, request *http.Request, write func(CommandFrame) error) (int, error) {
	response, err := transport.Do(request)
	if err != nil {
		return 0, errors.Join(ErrUncertain, err)
	}
	defer response.Body.Close()

	if err := refusalOf(response, request.URL.Path); err != nil {
		return 0, err
	}

	var answer struct {
		Frames []CommandFrame `json:"frames"`
	}
	if err := json.NewDecoder(response.Body).Decode(&answer); err != nil {
		return 0, errors.Join(ErrUncertain, err)
	}
	for _, frame := range answer.Frames {
		if frame.Stream == exitStream {
			return frame.ExitCode, nil
		}
		if err := write(frame); err != nil {
			return 0, err
		}
	}

	return 0, errors.Join(ErrUncertain, ErrNoExitFrame)
}

// signedPost is a POST of the body as JSON, signed as the grant's agent: the version-2 envelope with the start's
// profile key and revision after it (App\AgentRequests\Support\SignedCall::agentSignatureFor).
func (grant StartGrant) signedPost(ctx context.Context, target string, body any) (*http.Request, error) {
	content, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}
	callID, err := newCallID()
	if err != nil {
		return nil, err
	}
	issuedAt := strconv.FormatInt(time.Now().Unix(), 10)
	digest := sha256.Sum256(content)
	fields := []string{
		agentCallProtocol, http.MethodPost, target, callID, issuedAt, hex.EncodeToString(digest[:]),
		grant.ProfileKey, strconv.Itoa(grant.ProfileRevision),
	}
	for _, field := range fields {
		if strings.ContainsAny(field, "\r\n") {
			return nil, errLineBreak
		}
	}
	mac := hmac.New(sha256.New, []byte(grant.Token))
	mac.Write([]byte(strings.Join(fields, "\n")))

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, grant.JournalURL+target, bytes.NewReader(content))
	if err != nil {
		return nil, err
	}
	request.Header.Set("Authorization", "Bearer "+grant.Token)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")
	request.Header.Set(callIDHeader, callID)
	request.Header.Set(issuedAtHeader, issuedAt)
	request.Header.Set(signatureHeader, hex.EncodeToString(mac.Sum(nil)))
	request.Header.Set(protocolHeader, agentCallProtocol)
	request.Header.Set(profileHeader, grant.ProfileKey)
	request.Header.Set(profileRevisionHeader, strconv.Itoa(grant.ProfileRevision))

	return request, nil
}

// StartGrantFrom reads a provider session's grant from its start environment; ok is false outside one.
func StartGrantFrom(lookup func(string) (string, bool)) (StartGrant, bool) {
	grant := StartGrant{}
	values := map[string]*string{
		"JOURNAL_URL": &grant.JournalURL, "JOURNAL_START_TOKEN": &grant.Token, "JOURNAL_PROFILE": &grant.ProfileKey,
	}
	for name, target := range values {
		value, found := lookup(name)
		if !found || value == "" {
			return StartGrant{}, false
		}
		*target = value
	}
	revision, found := lookup("JOURNAL_PROFILE_REVISION")
	number, err := strconv.Atoi(revision)
	if !found || err != nil {
		return StartGrant{}, false
	}
	grant.ProfileRevision = number

	return grant, true
}
