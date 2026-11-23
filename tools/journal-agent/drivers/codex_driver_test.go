package drivers

import (
	"context"
	"errors"
	"strconv"
	"sync"
	"testing"
	"time"

	"journal-agent/drivers/contracts"
	"journal-agent/host"
)

// fakeOwner is one shared app-server: each thread gets its own turn ends, and it records what was interrupted.
type fakeOwner struct {
	mutex       sync.Mutex
	threads     int
	ends        map[string]chan host.CodexTurnEnd
	interrupted []string
	// threadRefusal, when set, fails every thread start.
	threadRefusal error
}

func newFakeOwner() *fakeOwner { return &fakeOwner{ends: map[string]chan host.CodexTurnEnd{}} }

func (owner *fakeOwner) StartThread(context.Context, host.CodexThreadSettings) (string, error) {
	owner.mutex.Lock()
	defer owner.mutex.Unlock()
	if owner.threadRefusal != nil {
		return "", owner.threadRefusal
	}
	owner.threads++
	id := "thread-" + strconv.Itoa(owner.threads)
	owner.ends[id] = make(chan host.CodexTurnEnd, 4)
	return id, nil
}

func (owner *fakeOwner) StartTurn(_ context.Context, threadID, _, _ string, _ []string) (string, error) {
	return threadID + "-turn", nil
}

func (owner *fakeOwner) Interrupt(_ context.Context, threadID, turnID string) error {
	owner.mutex.Lock()
	defer owner.mutex.Unlock()
	owner.interrupted = append(owner.interrupted, turnID)
	owner.ends[threadID] <- host.CodexTurnEnd{TurnID: turnID, Status: "interrupted"}
	return nil
}

func (owner *fakeOwner) TurnEnds(threadID string) <-chan host.CodexTurnEnd {
	owner.mutex.Lock()
	defer owner.mutex.Unlock()
	return owner.ends[threadID]
}

func (owner *fakeOwner) complete(threadID string) {
	owner.ends[threadID] <- host.CodexTurnEnd{TurnID: threadID + "-turn", Status: "completed"}
}

func endOf(t *testing.T, driver *CodexDriver) error {
	t.Helper()
	select {
	case err := <-driver.Finished():
		return err
	case <-time.After(2 * time.Second):
		t.Fatal("the turn never ended")
		return nil
	}
}

func TestTwoRuntimesRunSeparateThreadsAndAnInterruptReachesOnlyOne(t *testing.T) {
	owner := newFakeOwner()
	first := NewCodexDriver(owner, host.CodexThreadSettings{}, 1)
	second := NewCodexDriver(owner, host.CodexThreadSettings{}, 1)
	request := contracts.RequestIdentity{RuntimeID: "runtime"}

	if _, err := first.Deliver(context.Background(), contracts.Delivery{Request: request, Parts: contracts.TextParts("one")}); err != nil {
		t.Fatal(err)
	}
	if _, err := second.Deliver(context.Background(), contracts.Delivery{Request: request, Parts: contracts.TextParts("two")}); err != nil {
		t.Fatal(err)
	}
	if _, err := first.Interrupt(context.Background(), contracts.InterruptRequest{Request: request, Turn: 1}); err != nil {
		t.Fatal(err)
	}
	owner.complete("thread-2")

	if err := endOf(t, first); !errors.Is(err, ErrTurnInterrupted) {
		t.Fatalf("the first thread ended with %v", err)
	}
	if err := endOf(t, second); err != nil {
		t.Fatalf("the second thread ended with %v", err)
	}
	if owner.threads != 2 || len(owner.interrupted) != 1 || owner.interrupted[0] != "thread-1-turn" {
		t.Fatalf("threads %d, interrupted %v", owner.threads, owner.interrupted)
	}
}

func TestAFailedTurnIsNotASuccessAndTheThreadIsKept(t *testing.T) {
	owner := newFakeOwner()
	driver := NewCodexDriver(owner, host.CodexThreadSettings{}, 1)
	request := contracts.RequestIdentity{RuntimeID: "runtime"}

	_, _ = driver.Deliver(context.Background(), contracts.Delivery{Request: request, Parts: contracts.TextParts("one")})
	owner.ends["thread-1"] <- host.CodexTurnEnd{TurnID: "thread-1-turn", Status: "failed"}
	failed := endOf(t, driver)
	_, _ = driver.Wake(context.Background(), contracts.WakeRequest{Request: request})
	owner.complete("thread-1")

	if !errors.Is(failed, ErrProviderTurnFailed) {
		t.Fatalf("a failed turn ended with %v", failed)
	}
	if err := endOf(t, driver); err != nil || owner.threads != 1 {
		t.Fatalf("the next turn ended with %v on %d threads", err, owner.threads)
	}
}

func TestAnOwnerThatExitsFailsTheRunningTurn(t *testing.T) {
	owner := newFakeOwner()
	driver := NewCodexDriver(owner, host.CodexThreadSettings{}, 1)

	_, _ = driver.Deliver(context.Background(), contracts.Delivery{Parts: contracts.TextParts("one")})
	owner.ends["thread-1"] <- host.CodexTurnEnd{Status: "ownerExited"}

	if err := endOf(t, driver); !errors.Is(err, ErrProviderTurnFailed) {
		t.Fatalf("got %v", err)
	}
}

func TestABootstrapStartsTheThreadOnceAndTheFirstTurnRunsOnIt(t *testing.T) {
	owner := newFakeOwner()
	driver := NewCodexDriver(owner, host.CodexThreadSettings{}, 1)

	first, err := driver.Bootstrap(context.Background(), contracts.RequestIdentity{})
	if err != nil {
		t.Fatal(err)
	}
	again, err := driver.Bootstrap(context.Background(), contracts.RequestIdentity{})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := driver.Wake(context.Background(), contracts.WakeRequest{}); err != nil {
		t.Fatal(err)
	}

	if first.Progress != contracts.ProgressApplied || first.Outcome != contracts.OutcomeConfirmed {
		t.Fatalf("the bootstrap answered %+v", first)
	}
	if first.ActualBinding != "thread-1" || again.ActualBinding != "thread-1" || owner.threads != 1 {
		t.Fatalf("bootstraps bound %q and %q over %d threads", first.ActualBinding, again.ActualBinding, owner.threads)
	}
	if driver.NativeIdentity() != "thread-1" {
		t.Fatalf("the turn ran on %q", driver.NativeIdentity())
	}
}

func TestAFailedBootstrapBindsNothing(t *testing.T) {
	owner := newFakeOwner()
	owner.threadRefusal = errors.New("the app-server refused the thread")
	driver := NewCodexDriver(owner, host.CodexThreadSettings{}, 1)

	_, err := driver.Bootstrap(context.Background(), contracts.RequestIdentity{})

	if err == nil || driver.NativeIdentity() != "" || owner.threads != 0 {
		t.Fatalf("a refused thread start answered %v and bound %q", err, driver.NativeIdentity())
	}
}
