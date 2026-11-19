package host

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os/exec"
	"strings"
	"sync"
	"syscall"
	"time"
)

// ErrNotChatgptAccount refuses an owner whose account is not signed in with a ChatGPT subscription: no API key or
// other provider is ever used in its place.
var ErrNotChatgptAccount = errors.New("the Codex account is not signed in with ChatGPT")

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
}

// CodexOwner is the one app-server of a saved account's sign-in generation: it owns the sign-in and its refresh, and
// every journal session on that account is one of its threads, each with its own turn ends.
type CodexOwner struct {
	connection *CodexConnection
	process    *exec.Cmd
	mutex      sync.Mutex
	turnEnds   map[string]chan CodexTurnEnd
	ended      chan struct{}
}

// StartCodexOwner starts the protected app-server in the account's environment, initializes it and checks the
// account before anything runs on it.
func StartCodexOwner(ctx context.Context, executable string, environment []string, root string) (*CodexOwner, error) {
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
	owner := &CodexOwner{process: process, turnEnds: map[string]chan CodexTurnEnd{}, ended: make(chan struct{})}
	owner.connection = NewCodexConnection(output, input, owner.route)
	go owner.wait()
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
	if account.Account == nil || account.Account.Type != "chatgpt" {
		return ErrNotChatgptAccount
	}
	return nil
}

// StartThread starts one thread and answers the id the app-server acknowledged, the thread's only identity.
func (owner *CodexOwner) StartThread(ctx context.Context, settings CodexThreadSettings) (string, error) {
	params := map[string]any{"cwd": settings.Root, "sandbox": "workspace-write", "approvalPolicy": "never"}
	if settings.Model != "" {
		params["model"] = settings.Model
	}
	var started struct {
		Thread struct {
			ID string `json:"id"`
		} `json:"thread"`
	}
	if err := owner.connection.Request(ctx, "thread/start", params, &started); err != nil {
		return "", err
	}
	if started.Thread.ID == "" {
		return "", errors.New("the Codex app-server acknowledged no thread id")
	}
	owner.mutex.Lock()
	owner.turnEnds[started.Thread.ID] = make(chan CodexTurnEnd, 4)
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

func (owner *CodexOwner) route(notification CodexNotification) {
	if notification.Method != "turn/completed" {
		return
	}
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
