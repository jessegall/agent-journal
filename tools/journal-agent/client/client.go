// Package client speaks the journal's host protocol: signed calls to claim requests, take start grants and report.
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

// ClaimedRequest mirrors App\Agents\Support\ClaimedRequest.
type ClaimedRequest struct {
	RuntimeID string  `json:"runtimeId"`
	RequestID string  `json:"requestId"`
	Sequence  int     `json:"sequence"`
	Attempt   int     `json:"attempt"`
	Operation string  `json:"operation"`
	Message   *string `json:"message"`
	Model     *string `json:"model"`
	Effort    *string `json:"effort"`
	// Script is the key script a key_script request runs, with its version, its parameters and the step it stopped
	// at, which a resumed run goes on from; all empty for any other request.
	Script           *string           `json:"script"`
	ScriptVersion    *int              `json:"scriptVersion"`
	ScriptParameters []ScriptParameter `json:"scriptParameters"`
	ScriptStep       *int              `json:"scriptStep"`
}

// ScriptParameter mirrors App\Agents\Values\ScriptParameter: one named value a key script request gives its script.
type ScriptParameter struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// RequestReport mirrors App\Http\Data\Agents\RequestProgressReportData.
type RequestReport struct {
	RequestID     string        `json:"request_id"`
	Attempt       int           `json:"attempt"`
	Progress      string        `json:"progress"`
	ActualBinding *string       `json:"actual_binding"`
	Outcome       *string       `json:"outcome"`
	Script        *ScriptReport `json:"script,omitempty"`
	// OperationKey names one raise or report call, so the journal takes a repeated call once; empty for the others.
	OperationKey string `json:"operation_key,omitempty"`
}

// ScriptReport mirrors App\Http\Data\Agents\ScriptProgressData: the step a key script confirmed, the screen
// generation it matched and what it saw.
type ScriptReport struct {
	Step       int    `json:"step"`
	Generation int    `json:"generation"`
	Evidence   string `json:"evidence"`
}

// NavigationRaise mirrors App\Http\Data\Agents\NavigationRaiseData: a key script run stopped at a point it could not
// be certain of, the stalled request, attempt and step, why, and the stable screen, its rows redacted on the host.
// The operation key names the raise, so a repeated send is the same raise.
type NavigationRaise struct {
	OperationKey string   `json:"operation_key"`
	RequestID    string   `json:"request_id"`
	Attempt      int      `json:"attempt"`
	Step         int      `json:"step"`
	Reason       string   `json:"reason"`
	Fingerprint  string   `json:"fingerprint"`
	Rows         []string `json:"rows"`
	Highlight    int      `json:"highlight"`
	Generation   uint64   `json:"generation"`
}

// The answers to a raise, as App\Agents\Enums\NavigationRaiseOutcome names them.
const (
	NavigationOpened = "opened"
	NavigationHeld   = "held"
	NavigationWait   = "wait"
)

// NavigationAnswer mirrors App\Agents\Support\NavigationRaiseAnswer: a navigation request is open, the person holds
// the runtime, or the host waits and asks again.
type NavigationAnswer struct {
	Answer            string  `json:"answer"`
	RequestID         *string `json:"requestId"`
	RetryAfterSeconds *int    `json:"retryAfterSeconds"`
}

// ActivityReport mirrors App\Http\Data\Agents\RuntimeActivityReportData.
type ActivityReport struct {
	RuntimeID         string `json:"runtime_id"`
	Activity          string `json:"activity"`
	Hold              string `json:"hold"`
	ProcessGeneration int    `json:"process_generation"`
}

// TurnReport mirrors App\Http\Data\Agents\DriverTurnReportData.
type TurnReport struct {
	RuntimeID         string  `json:"runtime_id"`
	ProcessGeneration int     `json:"process_generation"`
	NativePromptID    string  `json:"native_prompt_id"`
	Finished          bool    `json:"finished"`
	Model             *string `json:"model"`
	Effort            *string `json:"effort"`
	Outcome           *string `json:"outcome"`
}

// LivenessReport mirrors App\Http\Data\Agents\RuntimeLivenessReportData.
type LivenessReport struct {
	RuntimeID         string `json:"runtime_id"`
	ProcessGeneration int    `json:"process_generation"`
	Evidence          string `json:"evidence"`
}

// ErrRefused is returned when the journal refuses a call outright (4xx): a retry would be refused again.
var ErrRefused = errors.New("the journal refused the call")

// ErrAlreadyGranted is returned when a runtime's start token was handed out before.
var ErrAlreadyGranted = errors.New("this start was already granted")

// Client makes signed calls for one enrolled host. It never logs its secret.
type Client struct {
	enrollment Enrollment
	http       *http.Client
	now        func() time.Time
}

// New returns a client for the enrollment.
func New(enrollment Enrollment) *Client {
	return &Client{enrollment: enrollment, http: &http.Client{Timeout: 30 * time.Second}, now: time.Now}
}

// Claim long-polls for up to waitSeconds and returns at most limit requests of this host's runtimes.
func (client *Client) Claim(ctx context.Context, limit, waitSeconds int) ([]ClaimedRequest, error) {
	var answer struct {
		Requests []ClaimedRequest `json:"requests"`
	}
	target := "/host/claim?limit=" + strconv.Itoa(limit) + "&wait=" + strconv.Itoa(waitSeconds)
	return answer.Requests, client.call(ctx, target, nil, &answer)
}

// StartFile is one file the host writes in a start folder.
type StartFile struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

// StartFolder is a folder the host writes inside the start's settings folder before it spawns the program, with the
// arguments that come right before the folder's absolute path.
type StartFolder struct {
	Name      string       `json:"name"`
	Files     []StartFile `json:"files"`
	Arguments []string     `json:"arguments"`
}

// Grant is a runtime's start token and the folders its start needs, which the journal hands out once.
type Grant struct {
	Token           string         `json:"token"`
	Folders         []StartFolder `json:"folders"`
	ProfileKey      string         `json:"profile_key"`
	ProfileRevision int            `json:"profile_revision"`
	OfflineReply    string         `json:"offline_reply"`
	OfflineSeal     string         `json:"offline_reply_seal"`
	Runtime         RuntimeStart  `json:"runtime"`
}

// RuntimeStart mirrors App\Agents\Support\RuntimeStart: what the host needs to start the runtime's program.
type RuntimeStart struct {
	DriverType        string  `json:"driver_type"`
	Program           string  `json:"program"`
	ProgramBuild      string  `json:"program_build"`
	Folder            string  `json:"folder"`
	ProcessGeneration int     `json:"process_generation"`
	Model             *string `json:"model"`
	Effort            *string `json:"effort"`
}

// ProfileEnvironment is the start's pinned authorization profile as environment entries; none when it has no pin.
func (grant Grant) ProfileEnvironment() []string {
	if grant.ProfileKey == "" {
		return nil
	}
	return []string{
		"JOURNAL_PROFILE=" + grant.ProfileKey,
		"JOURNAL_PROFILE_REVISION=" + strconv.Itoa(grant.ProfileRevision),
		"JOURNAL_OFFLINE_REPLY=" + grant.OfflineReply,
		"JOURNAL_OFFLINE_REPLY_SEAL=" + grant.OfflineSeal,
	}
}

// StartGrant takes a runtime's grant; the journal refuses it while what the start needs, such as its skills, is not
// ready.
func (client *Client) StartGrant(ctx context.Context, runtimeID string) (Grant, error) {
	var answer Grant
	return answer, client.call(ctx, "/host/runtimes/"+runtimeID+"/start", nil, &answer)
}

// RaiseNavigation asks the journal what to do at a point a key script run could not be certain of.
func (client *Client) RaiseNavigation(
	ctx context.Context,
	runtimeID string,
	raise NavigationRaise,
) (NavigationAnswer, error) {
	var answer NavigationAnswer
	return answer, client.call(ctx, "/host/runtimes/"+runtimeID+"/navigation", raise, &answer)
}

// ReportRequest, ReportActivity, ReportTurn, ReportHeartbeat and ReportExit send one typed report each.
func (client *Client) ReportRequest(ctx context.Context, report RequestReport) error {
	return client.call(ctx, "/host/reports/request", report, nil)
}

func (client *Client) ReportActivity(ctx context.Context, report ActivityReport) error {
	return client.call(ctx, "/host/reports/activity", report, nil)
}

func (client *Client) ReportTurn(ctx context.Context, report TurnReport) error {
	return client.call(ctx, "/host/reports/turn", report, nil)
}

func (client *Client) ReportHeartbeat(ctx context.Context, report LivenessReport) error {
	return client.call(ctx, "/host/reports/heartbeat", report, nil)
}

func (client *Client) ReportExit(ctx context.Context, report LivenessReport) error {
	return client.call(ctx, "/host/reports/exit", report, nil)
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
	callID, err := newCallID()
	if err != nil {
		return err
	}
	issuedAt := client.now().Unix()
	signed, err := signature(client.enrollment.Secret, http.MethodPost, target, callID, issuedAt, content)
	if err != nil {
		return err
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, client.enrollment.JournalURL+target, bytes.NewReader(content))
	if err != nil {
		return err
	}
	request.Header.Set("Authorization", "Bearer "+client.enrollment.Secret)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")
	request.Header.Set(callIDHeader, callID)
	request.Header.Set(issuedAtHeader, strconv.FormatInt(issuedAt, 10))
	request.Header.Set(signatureHeader, signed)
	request.Header.Set(protocolHeader, protocolVersion)

	response, err := client.http.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode == http.StatusGone {
		return ErrAlreadyGranted
	}
	if response.StatusCode >= 300 {
		message, _ := io.ReadAll(io.LimitReader(response.Body, 512))
		failure := fmt.Errorf("the journal answered %d to %s: %s", response.StatusCode, target, message)
		if response.StatusCode >= 400 && response.StatusCode < 500 {
			return errors.Join(ErrRefused, failure)
		}
		return failure
	}
	if answer == nil {
		return nil
	}
	return json.NewDecoder(response.Body).Decode(answer)
}

func newCallID() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}
	return hex.EncodeToString(random), nil
}

// MainRuntimeRequest mirrors App\Http\Data\Agents\MainRuntimeRequestData.
type MainRuntimeRequest struct {
	AgentID      string `json:"agent_id"`
	Folder       string `json:"folder"`
	Program      string `json:"program"`
	ProgramBuild string `json:"program_build"`
	Profile      string `json:"profile"`
}

// OpenedRuntime is the session and runtime the journal opened.
type OpenedRuntime struct {
	SessionID string `json:"session_id"`
	RuntimeID string `json:"runtime_id"`
}

// OpenMainRuntime asks the journal to open an agent's main runtime as a terminal on this host.
func (client *Client) OpenMainRuntime(ctx context.Context, request MainRuntimeRequest) (OpenedRuntime, error) {
	var opened OpenedRuntime
	return opened, client.call(ctx, "/host/runtimes", request, &opened)
}

// JournalURL is where the journal answers, for the programs this host starts.
func (client *Client) JournalURL() string { return client.enrollment.JournalURL }
