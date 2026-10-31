package main

import (
	"crypto/sha256"
	"encoding/hex"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal/socket"
)

func shortHome(t *testing.T) string {
	t.Helper()
	home, err := os.MkdirTemp("/tmp", "jh")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { os.RemoveAll(home) })
	resolved, _ := filepath.EvalSymlinks(home)
	return resolved
}

func listening(t *testing.T, socket string, handler http.Handler) {
	t.Helper()
	listener, err := net.Listen("unix", socket)
	if err != nil {
		t.Fatal(err)
	}
	server := &http.Server{Handler: handler}
	go server.Serve(listener)
	t.Cleanup(func() { server.Close() })
}

func healthHandler() http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) { writer.WriteHeader(http.StatusOK) })
}

func TestASocketPathTooLongBecomesAShortOneNamedByItsHashAsTheServerNamesIt(t *testing.T) {
	deep := "/" + strings.Repeat("deep-folder-", 10)
	path := filepath.Join(deep, "server.sock")
	sum := sha256.Sum256([]byte(path))
	if got := socket.Path(deep); got != "/tmp/journal-"+hex.EncodeToString(sum[:])[:16]+".sock" {
		t.Fatalf("socket path %s", got)
	}
	home := shortHome(t)
	if got := socket.Path(home); got != filepath.Join(home, "server.sock") {
		t.Fatalf("socket path %s", got)
	}
}

func TestAHealthyServerIsUsedAndNothingIsStarted(t *testing.T) {
	home := shortHome(t)
	listening(t, socket.Path(home), healthHandler())
	_, started, err := Connect(home, func(string) (*os.Process, error) {
		t.Error("a server was started beside a healthy one")
		return nil, nil
	})
	if err != nil || started != nil {
		t.Fatalf("connect: %v %v", started, err)
	}
}

func TestWithNothingAnsweringAndTheLockFreeTheClientStartsTheServer(t *testing.T) {
	home := shortHome(t)
	starts := 0
	_, _, err := Connect(home, func(string) (*os.Process, error) {
		starts++
		listening(t, socket.Path(home), healthHandler())
		return &os.Process{Pid: os.Getpid()}, nil
	})
	if err != nil || starts != 1 {
		t.Fatalf("starts %d, err %v", starts, err)
	}
}

func TestAHeldLockMeansWaitAndAServerLettingItGoIsReplacedAtOnce(t *testing.T) {
	home := shortHome(t)
	lock, err := os.OpenFile(filepath.Join(home, "server.lock"), os.O_CREATE|os.O_RDWR, 0o600)
	if err != nil {
		t.Fatal(err)
	}
	if err := syscall.Flock(int(lock.Fd()), syscall.LOCK_EX|syscall.LOCK_NB); err != nil {
		t.Fatal(err)
	}
	go func() { time.Sleep(200 * time.Millisecond); lock.Close() }()
	starts := 0
	_, _, err = Connect(home, func(string) (*os.Process, error) {
		starts++
		listening(t, socket.Path(home), healthHandler())
		return &os.Process{Pid: os.Getpid()}, nil
	})
	if err != nil || starts != 1 {
		t.Fatalf("starts %d, err %v", starts, err)
	}
}

func TestAServerThatNeverAnswersEndsTheWaitWithNoServer(t *testing.T) {
	home := shortHome(t)
	previous := StartLimit
	StartLimit = 200 * time.Millisecond
	t.Cleanup(func() { StartLimit = previous })
	_, started, err := Connect(home, func(string) (*os.Process, error) { return &os.Process{Pid: os.Getpid()}, nil })
	if err != ErrNoServer || started == nil {
		t.Fatalf("connect: %v %v", started, err)
	}
}

func TestAMaintenanceMarkMeansNoServerIsStartedWhileTheLockIsFree(t *testing.T) {
	home := shortHome(t)
	if err := os.WriteFile(filepath.Join(home, MaintenanceMark), nil, 0o600); err != nil {
		t.Fatal(err)
	}
	starts := 0
	deadline := StartLimit
	StartLimit = 300 * time.Millisecond
	t.Cleanup(func() { StartLimit = deadline })
	_, _, err := Connect(home, func(string) (*os.Process, error) {
		starts++
		return &os.Process{Pid: os.Getpid()}, nil
	})
	if err != ErrNoServer || starts != 0 {
		t.Fatalf("starts %d, err %v", starts, err)
	}
}

func TestAMaintenanceMarkLongForgottenIsIgnored(t *testing.T) {
	home := shortHome(t)
	mark := filepath.Join(home, MaintenanceMark)
	if err := os.WriteFile(mark, nil, 0o600); err != nil {
		t.Fatal(err)
	}
	old := time.Now().Add(-2 * MaintenanceLimit)
	if err := os.Chtimes(mark, old, old); err != nil {
		t.Fatal(err)
	}
	starts := 0
	_, _, err := Connect(home, func(string) (*os.Process, error) {
		starts++
		listening(t, socket.Path(home), healthHandler())
		return &os.Process{Pid: os.Getpid()}, nil
	})
	if err != nil || starts != 1 {
		t.Fatalf("starts %d, err %v", starts, err)
	}
}
