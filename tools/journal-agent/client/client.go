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

	"journal-agent/screen"
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
	// NavigationRequestID and NavigationRound are the main agent's round a navigate request carries.
	NavigationRequestID *string          `json:"navigationRequestId"`
	NavigationRound     *NavigationRound `json:"navigationRound"`
}

// NavigationRound mirrors App\Agents\Values\NavigationRound: the row version and screen generation a round of the
// main agent answers, and exactly one of keys, a label to choose, a seen label to confirm, a goal parameter to type,
// or a proof with what it completes.
type NavigationRound struct {
	NavigationRequestID string   `json:"navigationRequestId"`
	RowVersion          int      `json:"rowVersion"`
	Generation          uint64   `json:"generation"`
	Keys                []string `json:"keys"`
	Choose              *string  `json:"choose"`
	Confirm             *string  `json:"confirm"`
	Proof               *string  `json:"proof"`
	Completes           *string  `json:"completes"`
	NextStep            *int     `json:"nextStep"`
	TypeParameter       *string  `json:"typeParameter"`
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
	// Navigation is what the host saw after a round of the main agent; nil for any other request.
	Navigation *NavigationReport `json:"navigation,omitempty"`
}

// NavigationReport mirrors App\Http\Data\Agents\NavigationRoundReportData: the screen after a round, its rows
// redacted, whether the round's proof showed, the actions carried out and the refusal that stopped it.
type NavigationReport struct {
	Rows       []string       `json:"rows"`
	Highlight  int            `json:"highlight"`
	Generation uint64         `json:"generation"`
	ProofSeen  bool           `json:"proof_seen"`
	Actions    []ActionReport `json:"actions,omitempty"`
	Refusal    *string        `json:"refusal"`
	// Steps are the proven path as a library entry keeps it, sent when the round's proof showed.
	Steps []PathStep `json:"steps,omitempty"`
}

// PathStep is one step of a proven path: the fingerprint of the screen it expects, and a label to choose or a named
// key, with the proof the last step carries.
type PathStep struct {
	Fingerprint string  `json:"fingerprint"`
	Choose      *string `json:"choose"`
	Key         *string `json:"key"`
	Proof       *string `json:"proof"`
}

// ActionReport is one action a round carried out: a choose or a key, the label seen before confirming, the
// fingerprint of the screen before it and the key's name.
type ActionReport struct {
	Kind        string `json:"kind"`
	Label       string `json:"label,omitempty"`
	Fingerprint string `json:"fingerprint"`
	Key         string `json:"key,omitempty"`
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
	// DeclinedEntries are library entries whose replay failed here, which the journal must not answer again.
	DeclinedEntries []string `json:"declined_entries,omitempty"`
	// StaleEntry is the library entry this raise replaces, whose replay failed after its first step.
	StaleEntry string `json:"stale_entry,omitempty"`
	// SentSteps are the steps the stale entry's replay already sent, by name, never with screen text.
	SentSteps []string `json:"sent_steps,omitempty"`
}

// EntryStaleReport mirrors App\Http\Data\Agents\MenuEntryStaleData: a library entry's replay failed a check on
// the runtime's build, at a step after its first, with the redacted screen it failed on when that may leave the host.
type EntryStaleReport struct {
	RuntimeID    string   `json:"runtime_id"`
	OperationKey string   `json:"operation_key"`
	Reason       string   `json:"reason"`
	Step         int      `json:"step"`
	Build        string   `json:"build"`
	Rows         []string `json:"rows"`
}

// The answers to a raise, as App\Agents\Enums\NavigationRaiseOutcome names them.
const (
	NavigationOpened = "opened"
	NavigationHeld   = "held"
	NavigationWait   = "wait"
	NavigationEntry  = "entry"
)

// NavigationAnswer mirrors App\Agents\Support\NavigationRaiseAnswer: a navigation request is open, the person holds
// the runtime, or the host waits and asks again.
type NavigationAnswer struct {
	Answer            string  `json:"answer"`
	RequestID         *string `json:"requestId"`
	RetryAfterSeconds *int    `json:"retryAfterSeconds"`
	// Entry is the library entry to replay, as keyscripts.Entry reads it; Guarded is set when it was proven on
	// another build only.
	Entry   json.RawMessage `json:"entry"`
	Guarded bool            `json:"guarded"`
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

// ErrAlreadyGranted is returned when a runtime's start token was handed out before, or a start was claimed,
// cancelled or ended already (410): it is gone, and asking again gets nothing.
var ErrAlreadyGranted = errors.New("this start was already granted")

// ErrConflict is returned when the journal refuses a call because of the state it is in (409), such as a program
// arrangement the host has not proven.
var ErrConflict = errors.New("the journal's state refuses the call")

// ErrUnauthenticated is returned when the journal does not accept the host's credential or signature (401).
var ErrUnauthenticated = errors.New("the journal did not accept the host's credential")

// ErrUncertain is returned when the call may or may not have reached the journal: the connection failed or the
// journal failed (5xx). A claim or report that ends this way is retried, never taken as refused.
var ErrUncertain = errors.New("the call's outcome is unknown")

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

// Watch is one runtime somebody watches in the journal, and how often its screen is captured.
type Watch struct {
	RuntimeID  string `json:"runtime_id"`
	IntervalMs int    `json:"interval_ms"`
}

// Claim is one answer to a claim: the requests handed to this host, the runtimes watched on it and the version of
// that watched list.
type Claim struct {
	Requests       []ClaimedRequest `json:"requests"`
	Watched        []Watch          `json:"watched"`
	WatchedVersion int              `json:"watched_version"`
}

// Claim long-polls for up to waitSeconds and returns at most limit requests of this host's runtimes; the poll answers
// at once when the watched list's version differs from watchedVersion, the last one the host saw.
func (client *Client) Claim(ctx context.Context, limit, waitSeconds, watchedVersion int) (Claim, error) {
	var answer Claim
	target := "/host/claim?limit=" + strconv.Itoa(limit) + "&wait=" + strconv.Itoa(waitSeconds) +
		"&watched_version=" + strconv.Itoa(watchedVersion)
	return answer, client.call(ctx, target, nil, &answer)
}

// ScreenReport is one frame of a watched runtime's screen.
type ScreenReport struct {
	RuntimeID string       `json:"runtime_id"`
	Frame     screen.Frame `json:"frame"`
}

// ScreenRefused is the journal's refusal of a screen report, such as for a runtime nobody watches any more.
type ScreenRefused struct {
	Reason string
}

func (refused ScreenRefused) Error() string {
	return "the journal refused the screen report: " + refused.Reason
}

// ReportScreen sends one frame of the runtime's screen; a refusal comes back as ScreenRefused.
func (client *Client) ReportScreen(ctx context.Context, runtimeID string, frame screen.Frame) error {
	var answer struct {
		Status string `json:"status"`
		Reason string `json:"reason"`
	}
	report := ScreenReport{RuntimeID: runtimeID, Frame: frame}
	if err := client.call(ctx, "/host/reports/screen", report, &answer); err != nil {
		return err
	}
	if answer.Status == "refused" {
		return ScreenRefused{Reason: answer.Reason}
	}
	return nil
}

// StartFile is one file the host writes in a start folder.
type StartFile struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

// StartFolder is a folder the host writes inside the start's settings folder before it spawns the program, with the
// arguments that come right before the folder's absolute path.
type StartFolder struct {
	Name      string      `json:"name"`
	Files     []StartFile `json:"files"`
	Arguments []string    `json:"arguments"`
}

// Grant is a runtime's start token and the folders its start needs, which the journal hands out once.
type Grant struct {
	Token           string        `json:"token"`
	Folders         []StartFolder `json:"folders"`
	ProfileKey      string        `json:"profile_key"`
	ProfileRevision int           `json:"profile_revision"`
	OfflineReply    string        `json:"offline_reply"`
	OfflineSeal     string        `json:"offline_reply_seal"`
	Runtime         RuntimeStart  `json:"runtime"`
}

// RuntimeStart mirrors App\Agents\Support\RuntimeStart: what the host needs to start the runtime's program.
type RuntimeStart struct {
	DriverType        string  `json:"driver_type"`
	SessionID         string  `json:"session_id"`
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

// ReportReplayed reports that the replay of a library entry worked on the runtime, under the replay's key.
func (client *Client) ReportReplayed(ctx context.Context, entryID, runtimeID, operationKey string) error {
	body := map[string]string{"runtime_id": runtimeID, "operation_key": operationKey}
	return client.call(ctx, "/host/menu-entries/"+entryID+"/replayed", body, nil)
}

// ReportStale reports that the replay of a library entry failed a check on the runtime's build, under the replay's key.
func (client *Client) ReportStale(ctx context.Context, entryID string, report EntryStaleReport) error {
	return client.call(ctx, "/host/menu-entries/"+entryID+"/stale", report, nil)
}

// InterruptNavigation reports that the person took over a runtime whose navigation request was open.
func (client *Client) InterruptNavigation(ctx context.Context, navigationID string) error {
	return client.call(ctx, "/host/navigation/"+navigationID+"/interrupt", nil, nil)
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
	return client.send(ctx, http.MethodPost, target, content, answer)
}

// read makes a signed GET: its signature covers the method, the exact target and an empty body.
func (client *Client) read(ctx context.Context, target string, answer any) error {
	return client.send(ctx, http.MethodGet, target, nil, answer)
}

func (client *Client) send(ctx context.Context, method, target string, content []byte, answer any) error {
	callID, err := newCallID()
	if err != nil {
		return err
	}
	issuedAt := client.now().Unix()
	signed, err := signature(client.enrollment.Secret, method, target, callID, issuedAt, content)
	if err != nil {
		return err
	}
	request, err := http.NewRequestWithContext(ctx, method, client.enrollment.JournalURL+target, bytes.NewReader(content))
	if err != nil {
		return err
	}
	request.Header.Set("Authorization", "Bearer "+client.enrollment.Secret)
	if content != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	request.Header.Set("Accept", "application/json")
	request.Header.Set(callIDHeader, callID)
	request.Header.Set(issuedAtHeader, strconv.FormatInt(issuedAt, 10))
	request.Header.Set(signatureHeader, signed)
	request.Header.Set(protocolHeader, protocolVersion)

	response, err := client.http.Do(request)
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
	case response.StatusCode == http.StatusUnauthorized:
		return errors.Join(ErrUnauthenticated, ErrRefused, failure)
	case response.StatusCode >= 400 && response.StatusCode < 500:
		return errors.Join(ErrRefused, failure)
	default:
		return errors.Join(ErrUncertain, failure)
	}
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
