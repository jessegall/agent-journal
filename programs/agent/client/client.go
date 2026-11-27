// Package client makes the signed calls of an enrolled host or a connected relay to the journal.
package client

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
)

// Enrollment is what agents:host-enroll handed a host: where the journal is, which host it is and its secret.
type Enrollment struct {
	JournalURL string `json:"journal_url"`
	HostID     string `json:"host_id"`
	Secret     string `json:"secret"`
}

// The answers to a raise, as App\Agents\Enums\NavigationRaiseOutcome names them.
const (
	NavigationOpened = "opened"
	NavigationHeld   = "held"
	NavigationWait   = "wait"
	NavigationEntry  = "entry"
)

// The types of a usage measurement and the windows of a limit, as the journal names them.
const (
	UsageWindow       = "window"
	UsageResultCost   = "result_cost"
	UsageThreadTokens = "thread_tokens"

	WindowFiveHour  = "five_hour"
	WindowSevenDay  = "seven_day"
	WindowPrimary   = "primary"
	WindowSecondary = "secondary"
)

// ErrRefused is returned when the journal refuses a call outright (4xx): a retry would be refused again.
var ErrRefused = errors.New("the journal refused the call")

// ErrAlreadyGranted is returned when a runtime's start token was handed out before, or a start was claimed,
// cancelled or ended already (410): it is gone, and asking again gets nothing.
var ErrAlreadyGranted = errors.New("this start was already granted")

// ErrConflict is returned when the journal refuses a call because of the state it is in (409), such as a program
// arrangement the host has not proven.
var ErrConflict = errors.New("the journal's state refuses the call")

// ErrUnauthenticated is returned when the journal does not accept the host's credential or signature (401).
var ErrUnauthenticated = errors.New("the journal did not accept the host's credential")

// ErrHostRoleRefused is returned when the journal refuses this host the route for its role (403): an enrolled host on
// a relay's route, a relay on an enrolled host's route, or a relay whose binding is no longer live.
var ErrHostRoleRefused = errors.New("the journal refuses this host for its role")

// ErrUncertain is returned when the call may or may not have reached the journal: the connection failed or the
// journal failed (5xx). A claim or report that ends this way is retried, never taken as refused.
var ErrUncertain = errors.New("the call's outcome is unknown")

// Client makes signed calls for one enrolled host. It never logs its secret.
type Client struct {
	enrollment Enrollment
	http       *http.Client
	now        func() time.Time
	// arrangement is where this host runs agents, local or contained, reported on every claim; empty reports local.
	arrangement string
	// browserInput is whether every claim says this host carries out browser control of its terminals.
	browserInput bool
	// failed keeps the calls that failed on the host's side until a call the journal answers carries them.
	failed *failedCalls
}

// callTimeout is the longest one call waits for its answer: well past the longest wait of an instruction claim, so a
// journal slow to answer a claim never answers one the host gave up on, whose instructions would then reach no host.
const callTimeout = 60 * time.Second

// New returns a client for the enrollment.
func New(enrollment Enrollment) *Client {
	return &Client{
		enrollment: enrollment,
		http:       &http.Client{Timeout: callTimeout},
		now:        time.Now,
		failed:     &failedCalls{},
	}
}

// ForRemoteProject is a client for the relay of a project connected to a server journal, over the HTTP client given.
func ForRemoteProject(enrollment Enrollment, transport *http.Client) *Client {
	return &Client{enrollment: enrollment, http: transport, now: time.Now, failed: &failedCalls{}}
}

// WithArrangement makes every claim report where this host runs agents, local or contained.
func (client *Client) WithArrangement(arrangement string) *Client {
	client.arrangement = arrangement
	return client
}

// The two types of project read.
const (
	ProjectReadDirectory = "directory"
	ProjectReadFile      = "file"
)

// answerOf posts the body to the target and decodes the journal's answer as an A.
func answerOf[A any](ctx context.Context, client *Client, target string, body any) (A, error) {
	var answer A
	return answer, client.call(ctx, target, body, &answer)
}

func (client *Client) call(ctx context.Context, target string, body any, answer any) error {
	content := []byte("{}")
	if body != nil {
		encoded, err := json.Marshal(body)
		if err != nil {
			return err
		}
		content = encoded
	}
	return client.send(ctx, http.MethodPost, target, content, answer)
}

// read makes a signed GET: its signature covers the method, the exact target and an empty body.
func (client *Client) read(ctx context.Context, target string, answer any) error {
	return client.send(ctx, http.MethodGet, target, nil, answer)
}

func (client *Client) send(ctx context.Context, method, target string, content []byte, answer any) error {
	request, err := client.signedRequest(ctx, method, target, content)
	if err != nil {
		return err
	}
	response, err := client.deliver(request, target)
	if err != nil {
		return errors.Join(ErrUncertain, err)
	}
	defer response.Body.Close()
	if err := refusalOf(response, target); err != nil {
		return err
	}
	if answer == nil {
		return nil
	}
	return json.NewDecoder(response.Body).Decode(answer)
}

// sendAnswering makes a signed call whose every answer of the journal carries an outcome to read, a refusal too: only
// a server error or no answer at all is an error.
func (client *Client) sendAnswering(ctx context.Context, method, target string, content []byte, answer any) error {
	request, err := client.signedRequest(ctx, method, target, content)
	if err != nil {
		return err
	}
	response, err := client.deliver(request, target)
	if err != nil {
		return errors.Join(ErrUncertain, err)
	}
	defer response.Body.Close()
	if response.StatusCode >= 500 {
		return refusalOf(response, target)
	}

	return json.NewDecoder(response.Body).Decode(answer)
}

// deliver sends a signed call with the calls that failed since the journal last answered, keeps this one when it
// fails too, and forgets those it carried once the journal answers it.
func (client *Client) deliver(request *http.Request, target string) (*http.Response, error) {
	carried, count := client.failed.pending()
	if carried != "" {
		request.Header.Set(failedCallsHeader, carried)
	}
	response, err := client.http.Do(request)
	if err != nil {
		client.failed.note(target, 0, err.Error(), client.now())
		return nil, err
	}
	if response.StatusCode >= 500 {
		client.failed.note(target, response.StatusCode, http.StatusText(response.StatusCode), client.now())
		return response, nil
	}
	client.failed.forget(count)

	return response, nil
}

// signedRequest is a call signed with the host's credential: its signature covers the method, the exact target, the
// call id, its time and the body.
func (client *Client) signedRequest(ctx context.Context, method, target string, content []byte) (*http.Request, error) {
	callID, err := newCallID()
	if err != nil {
		return nil, err
	}
	issuedAt := client.now().Unix()
	signed, err := signature(client.enrollment.Secret, method, target, callID, issuedAt, content)
	if err != nil {
		return nil, err
	}
	request, err := http.NewRequestWithContext(ctx, method, client.enrollment.JournalURL+target, bytes.NewReader(content))
	if err != nil {
		return nil, err
	}
	request.Header.Set("Authorization", "Bearer "+client.enrollment.Secret)
	if content != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	request.Header.Set("Accept", "application/json")
	request.Header.Set(callIDHeader, callID)
	request.Header.Set(issuedAtHeader, strconv.FormatInt(issuedAt, 10))
	request.Header.Set(signatureHeader, signed)

	return request, nil
}

// refusalOf names what a status other than success means for the host; nil for a success.
func refusalOf(response *http.Response, target string) error {
	if response.StatusCode < 300 {
		return nil
	}
	if response.StatusCode == http.StatusGone {
		return ErrAlreadyGranted
	}
	message, _ := io.ReadAll(io.LimitReader(response.Body, 512))
	failure := fmt.Errorf("the journal answered %d to %s: %s", response.StatusCode, target, message)
	switch {
	case response.StatusCode == http.StatusConflict:
		return errors.Join(ErrConflict, ErrRefused, failure)
	case response.StatusCode == http.StatusUpgradeRequired:
		return errors.Join(ErrProtocolRefused, ErrRefused, failure)
	case response.StatusCode == http.StatusPreconditionRequired:
		return errors.Join(ErrAwaitingApproval, ErrRefused, failure)
	case response.StatusCode == http.StatusUnauthorized:
		return errors.Join(ErrUnauthenticated, ErrRefused, failure)
	case response.StatusCode == http.StatusForbidden && refusalCodeOf(message) == hostRoleRefusalCode:
		return errors.Join(ErrHostRoleRefused, ErrRefused, failure)
	case response.StatusCode >= 400 && response.StatusCode < 500:
		return errors.Join(ErrRefused, failure)
	default:
		return errors.Join(ErrUncertain, failure)
	}
}

// hostRoleRefusalCode is the code App\Hosts\Exceptions\HostRoleRefused answers with (App\Engine\Enums\RefusalCode::Forbidden):
// the route is for the other role of host. Any other 403, such as a start the journal refuses, is a plain refusal.
const hostRoleRefusalCode = "forbidden"

// refusalCodeOf is the code a refusal's JSON body names; empty when the body names none.
func refusalCodeOf(body []byte) string {
	var refusal struct {
		Code string `json:"code"`
	}
	_ = json.Unmarshal(body, &refusal)

	return refusal.Code
}

func newCallID() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}
	return hex.EncodeToString(random), nil
}

// JournalURL is where the journal answers, for the programs this host starts.
func (client *Client) JournalURL() string { return client.enrollment.JournalURL }
