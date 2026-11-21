package host

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os/exec"
	"strings"
	"sync"
	"syscall"
	"time"

	"journal-agent/profiles/contracts"
)

// ErrNotChatgptAccount refuses an owner whose account is not signed in with a ChatGPT subscription: no API key or
// other provider is ever used in its place.
var ErrNotChatgptAccount = errors.New("the Codex account is not signed in with ChatGPT")

// ErrNotApiKeyAccount refuses an owner of an API-key account whose app-server reports any other sign-in.
var ErrNotApiKeyAccount = errors.New("the Codex account is not signed in with an API key")

// codexAccountTypes is the account/read type each sign-in method of the claim must report: ChatGPT for OAuth, and
// for an older claim that names no method, and apiKey for an API key (docs/accounts/codex-integration.md).
var codexAccountTypes = map[string]codexAccountType{
	"":        {name: "chatgpt", refusal: ErrNotChatgptAccount},
	"oauth":   {name: "chatgpt", refusal: ErrNotChatgptAccount},
	"api_key": {name: "apiKey", refusal: ErrNotApiKeyAccount},
}

type codexAccountType struct {
	name    string
	refusal error
}

// rateLimitsWait bounds the one metadata request of an owner's limits; a timeout leaves the owner running.
var rateLimitsWait = 10 * time.Second

const (
	// mostUsageHandOffs bounds the readings waiting for the owner's usage worker; one past it is lost coverage.
	mostUsageHandOffs = 64
)

// CodexTurnEnd is how one turn of a thread ended: completed, interrupted or failed, or ownerExited when the
// app-server itself ended under it.
type CodexTurnEnd struct {
	TurnID string
	Status string
}

// CodexThreadSettings are what one thread starts with: its empty trusted root as working folder, the model, and the
// work folder as its one writable extra root.
type CodexThreadSettings struct {
	Root          string
	Model         string
	WritableRoots []string
	Transport     contracts.TransportProfile
	// Usage takes the thread's token counts, as the start it runs for; nil reads none.
	Usage CodexUsage
}

// CodexOwner is the one app-server of a saved account's sign-in generation: it owns the sign-in and its refresh, and
// every journal session on that account is one of its threads, each with its own turn ends.
type CodexOwner struct {
	connection *CodexConnection
	process    *exec.Cmd
	mutex      sync.Mutex
	turnEnds   map[string]chan CodexTurnEnd
	ended      chan struct{}
	// accountType is what account/read must report for the claim's sign-in method; only a ChatGPT account has limits.
	accountType codexAccountType
	// windows takes the account's limit windows: the usage of the latest start that runs on the owner.
	windows CodexUsage
	// threadUsage takes each known thread's token counts, as its own start.
	threadUsage map[string]CodexUsage
	limitsAsked bool
	limitsRetry bool
	// limitUpdates counts the limit notifications, so a read's answer older than one of them is dropped.
	limitUpdates int
	handOffs     chan func()
}

// StartCodexOwner starts the protected app-server in the account's environment, initializes it and checks that the
// account is signed in by the claim's method before anything runs on it.
func StartCodexOwner(
	ctx context.Context,
	executable string,
	environment []string,
	root, method string,
) (*CodexOwner, error) {
	accountType, known := codexAccountTypes[method]
	if !known {
		return nil, fmt.Errorf("a Codex account signed in by %q has no app-server owner", method)
	}
	process := exec.Command(executable, "app-server")
	process.Env, process.Dir = environment, root
	process.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	input, err := process.StdinPipe()
	if err != nil {
		return nil, err
	}
	output, err := process.StdoutPipe()
	if err != nil {
		return nil, err
	}
	if err := process.Start(); err != nil {
		return nil, err
	}
	owner := &CodexOwner{process: process, turnEnds: map[string]chan CodexTurnEnd{}, ended: make(chan struct{}),
		accountType: accountType, threadUsage: map[string]CodexUsage{}, handOffs: make(chan func(), mostUsageHandOffs)}
	owner.connection = NewCodexConnection(output, input, owner.route)
	go owner.wait()
	go owner.handUsageOn()
	if err := owner.initialize(ctx); err != nil {
		owner.Stop()
		return nil, err
	}
	return owner, nil
}

func (owner *CodexOwner) initialize(ctx context.Context) error {
	clientInfo := map[string]any{"clientInfo": map[string]string{"name": "journal", "version": "6"}}
	if err := owner.connection.Request(ctx, "initialize", clientInfo, nil); err != nil {
		return err
	}
	if err := owner.connection.Notify("initialized"); err != nil {
		return err
	}
	var account struct {
		Account *struct {
			Type string `json:"type"`
		} `json:"account"`
	}
	if err := owner.connection.Request(ctx, "account/read", map[string]any{}, &account); err != nil {
		return err
	}
	if account.Account == nil || account.Account.Type != owner.accountType.name {
		return owner.accountType.refusal
	}
	return nil
}

// ReportWindowsTo makes the usage of the latest start on the owner take the account's limit windows; the first
// start on a ChatGPT owner also asks for them once.
func (owner *CodexOwner) ReportWindowsTo(usage CodexUsage) {
	owner.mutex.Lock()
	owner.windows = usage
	asks := owner.hasLimits() && !owner.limitsAsked
	owner.limitsAsked = true
	owner.mutex.Unlock()
	if asks {
		go owner.readRateLimits()
	}
}

// hasLimits is whether the account has rate limits to read: only a ChatGPT subscription has them.
func (owner *CodexOwner) hasLimits() bool {
	return owner.accountType.name == "chatgpt"
}

// readRateLimits asks the app-server for the account's limits once, outside its read loop; a failure asks again on
// the owner's next thread or turn, and an answer older than a limit notification is dropped.
func (owner *CodexOwner) readRateLimits() {
	owner.mutex.Lock()
	seen := owner.limitUpdates
	owner.mutex.Unlock()
	ctx, cancel := context.WithTimeout(context.Background(), rateLimitsWait)
	defer cancel()
	var answer json.RawMessage
	err := owner.connection.Request(ctx, "account/rateLimits/read", map[string]any{}, &answer)
	owner.mutex.Lock()
	if err != nil {
		owner.limitsRetry = true
		owner.mutex.Unlock()
		return
	}
	stale := owner.limitUpdates != seen
	owner.mutex.Unlock()
	if stale {
		return
	}
	owner.reportWindows(readCodexWindows(answer))
}

// retryRateLimits asks for the limits again once after a failed read, on the owner's normal activity.
func (owner *CodexOwner) retryRateLimits() {
	owner.mutex.Lock()
	retries := owner.limitsRetry
	owner.limitsRetry = false
	owner.mutex.Unlock()
	if retries {
		go owner.readRateLimits()
	}
}

// StartThread starts one thread and answers the id the app-server acknowledged, the thread's only identity.
func (owner *CodexOwner) StartThread(ctx context.Context, settings CodexThreadSettings) (string, error) {
	params := map[string]any{"cwd": settings.Root, "sandbox": "workspace-write", "approvalPolicy": "never"}
	params["config"] = map[string]any{"mcp_servers.journal.enabled": settings.Transport != contracts.CliTransport}
	if settings.Model != "" {
		params["model"] = settings.Model
	}
	var started struct {
		Thread struct {
			ID string `json:"id"`
		} `json:"thread"`
	}
	owner.retryRateLimits()
	if err := owner.connection.Request(ctx, "thread/start", params, &started); err != nil {
		return "", err
	}
	if started.Thread.ID == "" {
		return "", errors.New("the Codex app-server acknowledged no thread id")
	}
	owner.mutex.Lock()
	owner.turnEnds[started.Thread.ID] = make(chan CodexTurnEnd, 4)
	if settings.Usage != nil {
		owner.threadUsage[started.Thread.ID] = settings.Usage
	}
	owner.mutex.Unlock()
	return started.Thread.ID, nil
}

// StartTurn runs one turn of a thread with the work folder as its writable root, and answers the turn's id.
func (owner *CodexOwner) StartTurn(
	ctx context.Context,
	threadID, text, effort string,
	writableRoots []string,
) (string, error) {
	params := map[string]any{
		"threadId":      threadID,
		"input":         []map[string]string{{"type": "text", "text": text}},
		"sandboxPolicy": map[string]any{"type": "workspaceWrite", "writableRoots": writableRoots},
	}
	if effort != "" {
		params["effort"] = effort
	}
	var started struct {
		Turn struct {
			ID string `json:"id"`
		} `json:"turn"`
	}
	owner.retryRateLimits()
	if err := owner.connection.Request(ctx, "turn/start", params, &started); err != nil {
		return "", err
	}
	return started.Turn.ID, nil
}

// Interrupt stops one turn of one thread; the owner's other threads go on.
func (owner *CodexOwner) Interrupt(ctx context.Context, threadID, turnID string) error {
	return owner.connection.Request(ctx, "turn/interrupt", map[string]string{"threadId": threadID, "turnId": turnID},
		nil)
}

// TurnEnds answers each turn end of the thread, in order.
func (owner *CodexOwner) TurnEnds(threadID string) <-chan CodexTurnEnd {
	owner.mutex.Lock()
	defer owner.mutex.Unlock()
	return owner.turnEnds[threadID]
}

// Ended is closed once the app-server process ended.
func (owner *CodexOwner) Ended() <-chan struct{} { return owner.ended }

// Stop ends the app-server and every thread on it; each thread hears ownerExited.
func (owner *CodexOwner) Stop() {
	if owner.process.Process != nil {
		_ = syscall.Kill(-owner.process.Process.Pid, syscall.SIGTERM)
	}
}

// route passes each notification on to what reads it: a turn's end to its thread, the account's limits and a known
// thread's token count to the usage worker. Nothing here reads or writes a disk or the network.
func (owner *CodexOwner) route(notification CodexNotification) {
	switch notification.Method {
	case "turn/completed":
		owner.routeTurnEnd(notification)
	case "account/rateLimits/updated":
		owner.mutex.Lock()
		owner.limitUpdates++
		owner.mutex.Unlock()
		owner.reportWindows(readCodexWindows(notification.Params))
	case "thread/tokenUsage/updated":
		owner.reportThreadCount(notification.Params)
	}
}

func (owner *CodexOwner) reportWindows(readings []WindowReading) {
	owner.mutex.Lock()
	usage := owner.windows
	owner.mutex.Unlock()
	if usage == nil || len(readings) == 0 {
		return
	}
	owner.handOff(func() {
		for _, reading := range readings {
			usage.Window(reading)
		}
	})
}

// reportThreadCount hands on the token count of a thread the owner knows; any other thread's is dropped.
func (owner *CodexOwner) reportThreadCount(params json.RawMessage) {
	count, ok := readCodexThreadCount(params)
	if !ok {
		return
	}
	owner.mutex.Lock()
	usage := owner.threadUsage[count.ThreadID]
	owner.mutex.Unlock()
	if usage == nil {
		return
	}
	owner.handOff(func() { usage.ThreadTokens(count) })
}

// handOff gives a reading to the usage worker without waiting; a full hand-off loses it with a log line.
func (owner *CodexOwner) handOff(report func()) {
	select {
	case owner.handOffs <- report:
	default:
		log.Printf("a Codex usage reading was lost: the hand-off is full")
	}
}

// handUsageOn hands each reading to its usage, in the order the app-server sent them, until the owner ended.
func (owner *CodexOwner) handUsageOn() {
	for {
		select {
		case report := <-owner.handOffs:
			report()
		case <-owner.ended:
			return
		}
	}
}

func (owner *CodexOwner) routeTurnEnd(notification CodexNotification) {
	var completed struct {
		ThreadID string `json:"threadId"`
		Turn     struct {
			ID     string `json:"id"`
			Status string `json:"status"`
		} `json:"turn"`
	}
	if json.Unmarshal(notification.Params, &completed) != nil {
		return
	}
	owner.mutex.Lock()
	ends := owner.turnEnds[completed.ThreadID]
	owner.mutex.Unlock()
	if ends != nil {
		ends <- CodexTurnEnd{TurnID: completed.Turn.ID, Status: completed.Turn.Status}
	}
}

func (owner *CodexOwner) wait() {
	_ = owner.process.Wait()
	owner.mutex.Lock()
	for _, ends := range owner.turnEnds {
		select {
		case ends <- CodexTurnEnd{Status: "ownerExited"}:
		default:
		}
	}
	owner.mutex.Unlock()
	close(owner.ended)
}

// CodexOwners keeps one owner a saved account's sign-in generation, made once and shared by every thread on it.
type CodexOwners struct {
	mutex  sync.Mutex
	owners map[string]*CodexOwner
}

// OwnerStarter starts the owner of an account generation the first time one of its threads needs it.
type OwnerStarter func(ctx context.Context) (*CodexOwner, error)

// Of answers the running owner of the account generation, starting it once; an owner that ended is started anew.
func (owners *CodexOwners) Of(ctx context.Context, account string, generation int, start OwnerStarter) (*CodexOwner,
	error) {
	key := fmt.Sprintf("%s@%d", account, generation)
	owners.mutex.Lock()
	defer owners.mutex.Unlock()
	if owners.owners == nil {
		owners.owners = map[string]*CodexOwner{}
	}
	if owner, found := owners.owners[key]; found && !hasEnded(owner) {
		return owner, nil
	}
	owner, err := start(ctx)
	if err != nil {
		return nil, err
	}
	owners.owners[key] = owner
	return owner, nil
}

// Drain stops every owner of the account, each generation, and answers true once each is proven ended within the
// bound; an owner still running keeps the account from being changed.
func (owners *CodexOwners) Drain(account string, bound time.Duration) bool {
	owners.mutex.Lock()
	defer owners.mutex.Unlock()
	drained := true
	for key, owner := range owners.owners {
		if !strings.HasPrefix(key, account+"@") {
			continue
		}
		owner.Stop()
		select {
		case <-owner.ended:
			delete(owners.owners, key)
		case <-time.After(bound):
			drained = false
		}
	}
	return drained
}

func hasEnded(owner *CodexOwner) bool {
	select {
	case <-owner.ended:
		return true
	default:
		return false
	}
}
