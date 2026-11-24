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
	"journal-agent/drivers/contracts"
	"net/http"
	"net/url"
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
	// Parts are a delivery's ordered text and attachment references; empty for any other request.
	Parts  []contracts.MessagePart `json:"parts"`
	Model  *string                 `json:"model"`
	Effort *string                 `json:"effort"`
	// Script is the key script a key_script request runs, with its version, its parameters and the step it stopped
	// at, which a resumed run goes on from; all empty for any other request.
	Script           *string           `json:"script"`
	ScriptVersion    *int              `json:"scriptVersion"`
	ScriptParameters []ScriptParameter `json:"scriptParameters"`
	ScriptStep       *int              `json:"scriptStep"`
	// NavigationRequestID and NavigationRound are the main agent's round a navigate request carries.
	NavigationRequestID *string          `json:"navigationRequestId"`
	NavigationRound     *NavigationRound `json:"navigationRound"`
	// SessionID, ProcessStartID and ProcessGeneration bind the host's report of this request to the session, its
	// supervised start (nil when the journal supervises none) and the process generation the claim was made for.
	SessionID         string  `json:"sessionId"`
	ProcessStartID    *string `json:"processStartId"`
	ProcessGeneration int     `json:"processGeneration"`
	// Bootstrap marks the start's bootstrap: the initial wake of a start still proving its conversation, which carries
	// no chat text; the driver proves its conversation without a turn.
	Bootstrap bool `json:"bootstrap"`
}

// browserControlOperations are the operations a browser writer's grant sends, App\Agents\Enums\DriverOperation's
// terminalControl().
var browserControlOperations = []string{
	"take_control",
	"cancel_take",
	"release_control",
	"terminal_input",
	"draft_choice",
	"check_screen",
	"open_private_entry",
	"private_input",
	"cancel_private_entry",
}

// IsBrowserControl is whether the operation is one a browser writer's grant sends.
func IsBrowserControl(operation string) bool {
	for _, control := range browserControlOperations {
		if control == operation {
			return true
		}
	}

	return false
}

// BrowserControlFields are the fields a browser writer's operation carries in its message, as
// App\Agents\Support\TerminalControls writes them.
type BrowserControlFields struct {
	TakeID         string `json:"take_id"`
	GrantID        string `json:"grant_id"`
	Renew          bool   `json:"renew"`
	Sequence       uint64 `json:"sequence"`
	ScreenRevision uint64 `json:"screen_revision"`
	Text           string `json:"text"`
	Enter          bool   `json:"enter"`
	Choice         string `json:"choice"`
	Type           string `json:"type"`
	Key            string `json:"key"`
	Rows           int    `json:"rows"`
	Columns        int    `json:"columns"`
	SubmissionID   string `json:"submission_id"`
	// Value is a private submission's value, which only the claim carries; it is never logged or kept.
	Value string `json:"value"`
}

// BrowserControl reads the fields of a browser writer's operation from the request's message.
func (request ClaimedRequest) BrowserControl() (BrowserControlFields, error) {
	var fields BrowserControlFields
	if request.Message == nil {
		return fields, errors.New("the browser operation carries no fields")
	}
	err := json.Unmarshal([]byte(*request.Message), &fields)

	return fields, err
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
	RequestID string `json:"request_id"`
	Attempt   int    `json:"attempt"`
	// Progress is empty for a turn's end, which the journal judges from TurnEnd.
	Progress      string             `json:"progress,omitempty"`
	TurnEnd       *contracts.TurnEnd `json:"turn_end,omitempty"`
	ActualBinding *string            `json:"actual_binding"`
	Outcome       *string            `json:"outcome"`
	Script        *ScriptReport      `json:"script,omitempty"`
	// OperationKey names one raise or report call, so the journal takes a repeated call once; empty for the others.
	OperationKey string `json:"operation_key,omitempty"`
	// Navigation is what the host saw after a round of the main agent; nil for any other request.
	Navigation *NavigationReport `json:"navigation,omitempty"`
	// RefusalReason is the allowlisted reason the host refused the request for, and NoProcessCreated whether it knows
	// no process of the program was made; both empty for every other failure.
	RefusalReason    *string `json:"refusal_reason,omitempty"`
	NoProcessCreated bool    `json:"no_process_created,omitempty"`
	// Sequence numbers the reports of one runtime in the order the host sends them, as ActivityReport's does.
	Sequence uint64 `json:"sequence"`
	// SessionID, ProcessStartID and ProcessGeneration are the claim's binding the report answers.
	SessionID         string  `json:"session_id,omitempty"`
	ProcessStartID    *string `json:"process_start_id,omitempty"`
	ProcessGeneration int     `json:"process_generation,omitempty"`
}

// NavigationReport mirrors App\Http\Data\Agents\NavigationRoundReportData: the screen after a round, its rows
// redacted, whether the round's proof showed, the actions carried out and the refusal that stopped it.
type NavigationReport struct {
	Rows             []string       `json:"rows"`
	Highlight        int            `json:"highlight"`
	Generation       uint64         `json:"generation"`
	HasObservedProof bool           `json:"has_observed_proof"`
	Actions          []ActionReport `json:"actions,omitempty"`
	Refusal          *string        `json:"refusal"`
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

// NavigationAnswer mirrors App\Agents\Support\NavigationRaiseAnswer: a navigation request is open, the user holds
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
	// Sequence numbers the reports of one runtime in the order the host sends them, so the journal takes a report
	// sent again once and knows when one before it is missing.
	Sequence uint64 `json:"sequence"`
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

// UsageReport mirrors App\Http\Data\Agents\UsageReportData: one usage measurement of a claimed start, under the
// sign-in generation the start ran in, the source that made it with its order and the UTC second it was observed.
type UsageReport struct {
	StartKey    string           `json:"start_key"`
	Generation  int              `json:"generation"`
	SourceID    string           `json:"source_id"`
	SourceOrder int64            `json:"source_order"`
	ObservedAt  string           `json:"observed_at"`
	Measurement UsageMeasurement `json:"measurement"`
}

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

// UsageMeasurement mirrors the measurement data of a usage report, read by its type: a window carries its limit,
// slot and what was reported of it, a result cost its US dollars as an exact decimal, a thread token count its
// thread and totals. A field the program did not report is left out.
type UsageMeasurement struct {
	Type            string   `json:"type"`
	LimitID         string   `json:"limit_id,omitempty"`
	Slot            string   `json:"slot,omitempty"`
	UsedPercent     *float64 `json:"used_percent,omitempty"`
	WindowMinutes   *int     `json:"window_minutes,omitempty"`
	ResetsAt        string   `json:"resets_at,omitempty"`
	USD             string   `json:"usd,omitempty"`
	ThreadID        string   `json:"thread_id,omitempty"`
	Total           *int64   `json:"total,omitempty"`
	Input           *int64   `json:"input,omitempty"`
	CachedInput     *int64   `json:"cached_input,omitempty"`
	Output          *int64   `json:"output,omitempty"`
	ReasoningOutput *int64   `json:"reasoning_output,omitempty"`
	LastTurnTotal   *int64   `json:"last_turn_total,omitempty"`
}

// LivenessReport mirrors App\Http\Data\Agents\RuntimeLivenessReportData.
type LivenessReport struct {
	RuntimeID         string `json:"runtime_id"`
	ProcessGeneration int    `json:"process_generation"`
	Evidence          string `json:"evidence"`
}

// ProtectionReport mirrors App\Agents\Data\ProtectionReportData: what a contained host found of one program's
// protected arrangement in the agent image, item by item.
type ProtectionReport struct {
	Driver   string           `json:"driver"`
	Build    string           `json:"build"`
	Platform string           `json:"platform"`
	Items    []ProtectionItem `json:"items"`
}

// ProtectionItem mirrors App\Agents\Data\ProtectedItemData.
type ProtectionItem struct {
	Item     string `json:"item"`
	Enforced bool   `json:"enforced"`
	Evidence string `json:"evidence"`
	Reason   string `json:"reason"`
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
}

// New returns a client for the enrollment.
func New(enrollment Enrollment) *Client {
	return &Client{
		enrollment: enrollment,
		http:       &http.Client{Timeout: 30 * time.Second},
		now:        time.Now,
	}
}

// ForRemoteProject is a client for the relay of a project connected to a server journal, over the HTTP client given.
func ForRemoteProject(enrollment Enrollment, transport *http.Client) *Client {
	return &Client{enrollment: enrollment, http: transport, now: time.Now}
}

// WithArrangement makes every claim report where this host runs agents, local or contained.
func (client *Client) WithArrangement(arrangement string) *Client {
	client.arrangement = arrangement
	return client
}

// WithBrowserInput makes every claim say this host carries out browser writers' operations on its terminals.
func (client *Client) WithBrowserInput() *Client {
	client.browserInput = true
	return client
}

// Watch is one runtime somebody watches in the journal, and how often its screen is captured.
type Watch struct {
	RuntimeID  string `json:"runtime_id"`
	IntervalMs int    `json:"interval_ms"`
}

// Claim is one answer to a claim: the requests handed to this host, the reads of its projects it is asked to
// answer, the runtimes watched on it and the version of that watched list.
type Claim struct {
	Requests       []ClaimedRequest `json:"requests"`
	ProjectReads   []ProjectRead    `json:"project_reads"`
	Watched        []Watch          `json:"watched"`
	WatchedVersion int              `json:"watched_version"`
}

// ProjectRead is a read of a connected project's folder or file the journal asks this host for, with how much of it
// the answer may hold.
type ProjectRead struct {
	ID           string `json:"id"`
	BindingID    string `json:"binding_id"`
	Type         string `json:"type"`
	Path         string `json:"path"`
	EntriesLimit int    `json:"entries_limit"`
	TextLimit    int    `json:"text_limit"`
}

// The two types of project read.
const (
	ProjectReadDirectory = "directory"
	ProjectReadFile      = "file"
)

// ProjectEntry is one entry of a project folder: its name, whether it is a folder, and its size in bytes.
type ProjectEntry struct {
	Name     string `json:"name"`
	IsFolder bool   `json:"is_folder"`
	Size     int64  `json:"size"`
}

// ProjectReadReport is a host's one answer to a project read: a folder's entries, a file's text with the digest and
// size of the bytes read, or the reason it could not read it.
type ProjectReadReport struct {
	Entries   []ProjectEntry `json:"entries,omitempty"`
	Text      *string        `json:"text,omitempty"`
	Digest    string         `json:"digest,omitempty"`
	Size      *int64         `json:"size,omitempty"`
	Truncated bool           `json:"truncated"`
	Failure   string         `json:"failure,omitempty"`
}

// ReportProjectRead answers one project read the journal handed this host.
func (client *Client) ReportProjectRead(ctx context.Context, readID string, report ProjectReadReport) error {
	return client.call(ctx, "/host/reports/project-reads/"+url.PathEscape(readID), report, nil)
}

// Claim long-polls for up to waitSeconds and returns at most limit requests of this host's runtimes; the poll answers
// at once when the watched list's version differs from watchedVersion, the last one the host saw.
func (client *Client) Claim(ctx context.Context, limit, waitSeconds, watchedVersion int) (Claim, error) {
	target := "/host/claim?limit=" + strconv.Itoa(limit) + "&wait=" + strconv.Itoa(waitSeconds) +
		"&watched_version=" + strconv.Itoa(watchedVersion)
	if client.arrangement != "" {
		target += "&arrangement=" + url.QueryEscape(client.arrangement)
	}
	if client.browserInput {
		target += "&browser_input=1&browser_keys=1&browser_paste=1&browser_resize=1"
	}
	return answerOf[Claim](ctx, client, target, nil)
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

// Paths are the folder's name and the path of each of its files, every path the host writes for it.
func (folder StartFolder) Paths() []string {
	paths := []string{folder.Name}
	for _, file := range folder.Files {
		paths = append(paths, file.Path)
	}
	return paths
}

// ArgumentsAt are the arguments that point the program at the folder written at the absolute path; none when the
// folder takes no arguments.
func (folder StartFolder) ArgumentsAt(absolute string) []string {
	if len(folder.Arguments) == 0 {
		return nil
	}
	return append(append([]string{}, folder.Arguments...), absolute)
}

// Grant is a runtime's start token and the folders its start needs, which the journal hands out once; a contained
// session's grant also holds the manifest of its container, which the host package reads.
type Grant struct {
	Token           string        `json:"token"`
	Folders         []StartFolder `json:"folders"`
	ProfileKey      string        `json:"profile_key"`
	ProfileRevision int           `json:"profile_revision"`
	OfflineReply    string        `json:"offline_reply"`
	OfflineSeal     string        `json:"offline_reply_seal"`
	Runtime         RuntimeStart  `json:"runtime"`
	// Container is the manifest of the container the session runs in, null for a start on the protected host.
	Container json.RawMessage `json:"container,omitempty"`
}

// HasContainer is whether the grant holds a container manifest: the session runs in a container of the agent daemon.
func (grant Grant) HasContainer() bool {
	return len(grant.Container) > 0 && string(grant.Container) != "null"
}

// RuntimeStart mirrors App\Support\RuntimeStart: what the host needs to start the runtime's program.
type RuntimeStart struct {
	SessionID         string  `json:"session_id"`
	Driver            string  `json:"driver"`
	DriverKey         string  `json:"driver_key"`
	DriverBuild       string  `json:"driver_build"`
	Folder            string  `json:"folder"`
	ProcessGeneration int     `json:"process_generation"`
	Model             *string `json:"model"`
	Effort            *string `json:"effort"`
	// Limits are the waits the journal decided for this runtime's driver.
	Limits contracts.Limits `json:"limits"`
	// SignInMethods are the Claude sign-in methods the journal accepts for an account start.
	SignInMethods []string `json:"sign_in_methods"`
}

// RequestedModel is the model the journal asked this start to run on; empty when it leaves the choice to the program.
func (runtime RuntimeStart) RequestedModel() string {
	if runtime.Model == nil {
		return ""
	}

	return *runtime.Model
}

// RequestedEffort is the effort the journal asked this start to run with; empty when it named none.
func (runtime RuntimeStart) RequestedEffort() string {
	if runtime.Effort == nil {
		return ""
	}

	return *runtime.Effort
}

// DriverBuild is the build of the program the grant starts.
func (grant Grant) DriverBuild() string {
	return grant.Runtime.DriverBuild
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
	return answerOf[Grant](ctx, client, "/host/runtimes/"+runtimeID+"/start", nil)
}

// RaiseNavigation asks the journal what to do at a point a key script run could not be certain of.
func (client *Client) RaiseNavigation(
	ctx context.Context,
	runtimeID string,
	raise NavigationRaise,
) (NavigationAnswer, error) {
	return answerOf[NavigationAnswer](ctx, client, "/host/runtimes/"+runtimeID+"/navigation", raise)
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

// InterruptNavigation reports that the user took over a runtime whose navigation request was open.
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

// ReportUsage sends one usage measurement of a start this host claimed; the journal acknowledges a repeated report
// like the first, so a report whose acknowledgement was lost is sent again unchanged.
func (client *Client) ReportUsage(ctx context.Context, report UsageReport) error {
	return client.call(ctx, "/host/reports/usage", report, nil)
}

func (client *Client) ReportHeartbeat(ctx context.Context, report LivenessReport) error {
	return client.call(ctx, "/host/reports/heartbeat", report, nil)
}

// HostDescriptor mirrors App\Data\Hosts\HostDescriptorData: one driver registration this host runs, by its key, with the
// build it pins and where it runs it.
type HostDescriptor struct {
	Key         string `json:"key"`
	Build       string `json:"build"`
	Arrangement string `json:"arrangement"`
	Placement   string `json:"placement"`
}

// HostDescriptors mirrors App\Data\Hosts\HostDescriptorsData: every driver this host runs.
type HostDescriptors struct {
	Descriptors []HostDescriptor `json:"descriptors"`
}

// ReportDescriptors tells the journal which drivers this host runs.
func (client *Client) ReportDescriptors(ctx context.Context, descriptors []HostDescriptor) error {
	return client.call(ctx, "/host/reports/descriptors", HostDescriptors{descriptors}, nil)
}

func (client *Client) ReportProtection(ctx context.Context, report ProtectionReport) error {
	return client.call(ctx, "/host/reports/protection", report, nil)
}

func (client *Client) ReportExit(ctx context.Context, report LivenessReport) error {
	return client.call(ctx, "/host/reports/exit", report, nil)
}

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

// sendAnswering makes a signed call whose every answer of the journal carries an outcome to read, a refusal too: only
// a server error or no answer at all is an error.
func (client *Client) sendAnswering(ctx context.Context, method, target string, content []byte, answer any) error {
	request, err := client.signedRequest(ctx, method, target, content)
	if err != nil {
		return err
	}
	response, err := client.http.Do(request)
	if err != nil {
		return errors.Join(ErrUncertain, err)
	}
	defer response.Body.Close()
	if response.StatusCode >= 500 {
		return refusalOf(response, target)
	}

	return json.NewDecoder(response.Body).Decode(answer)
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

// hostRoleRefusalCode is the code App\Exceptions\HostRoleRefused answers with (App\Enums\RefusalCode::Forbidden):
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

// MainRuntimeRequest mirrors App\Http\Data\Agents\MainRuntimeRequestData.
type MainRuntimeRequest struct {
	AgentID     string `json:"agent_id"`
	Folder      string `json:"folder"`
	Driver      string `json:"driver"`
	DriverBuild string `json:"driver_build"`
	Profile     string `json:"profile"`
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
