package host

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"strings"
	"testing"
	"time"
)

type recordingExecutor struct {
	started []StartRequest
	stopped []StopRequest
}

func (executor *recordingExecutor) Start(_ context.Context, request StartRequest) (StartReply, error) {
	executor.started = append(executor.started, request)
	return StartReply{
		StartID: request.StartID, Execution: "execution-1", ExecutionMode: request.ExecutionMode,
		StartedAt: time.Date(2026, 11, 20, 1, 0, 0, 0, time.UTC),
	}, nil
}

func (executor *recordingExecutor) Stop(_ context.Context, request StopRequest) (StopReply, error) {
	executor.stopped = append(executor.stopped, request)
	code := 0
	return StopReply{Execution: request.Execution, ExitCode: &code, EndedAt: time.Now()}, nil
}

type connection struct {
	*strings.Reader
	written bytes.Buffer
}

func (connection *connection) Write(content []byte) (int, error) {
	return connection.written.Write(content)
}

func TestAStartRequestReachesTheExecutorAndItsReplyIsWritten(t *testing.T) {
	executor := &recordingExecutor{}
	line := `{"start":{"startId":"s1","runtimeId":"r1","sessionId":"sess","program":"claude",` +
		`"executionMode":"protected_host","policyReference":"p1","workspace":"/work","accountReference":"a1"}}` + "\n"
	pipe := &connection{Reader: strings.NewReader(line)}

	if err := AnswerHostRequest(context.Background(), pipe, executor); err != nil {
		t.Fatal(err)
	}

	if len(executor.started) != 1 || executor.started[0].RuntimeID != "r1" {
		t.Fatalf("the executor got %+v", executor.started)
	}
	var reply StartReply
	if err := json.Unmarshal(pipe.written.Bytes(), &reply); err != nil {
		t.Fatal(err)
	}
	if reply.Execution != "execution-1" || reply.Refusal != "" {
		t.Fatalf("reply %+v", reply)
	}
}

func TestAnIncompleteStartIsRefusedWithoutReachingTheExecutor(t *testing.T) {
	executor := &recordingExecutor{}
	line := `{"start":{"startId":"s1","program":"claude","executionMode":"protected_host","workspace":"work"}}` + "\n"
	pipe := &connection{Reader: strings.NewReader(line)}

	if err := AnswerHostRequest(context.Background(), pipe, executor); err != nil {
		t.Fatal(err)
	}

	if len(executor.started) != 0 {
		t.Fatal("an incomplete start reached the executor")
	}
	var reply StartReply
	if err := json.Unmarshal(pipe.written.Bytes(), &reply); err != nil {
		t.Fatal(err)
	}
	if reply.Refusal == "" || reply.StartID != "s1" {
		t.Fatalf("reply %+v", reply)
	}
}

func TestALineWithBothOrNeitherOperationIsMalformed(t *testing.T) {
	for _, line := range []string{`{}`, `{"start":{"startId":"s"},"stop":{"execution":"e"}}`, `{"stop":{}}`} {
		pipe := &connection{Reader: strings.NewReader(line + "\n")}

		err := AnswerHostRequest(context.Background(), pipe, &recordingExecutor{})

		if !errors.Is(err, ErrMalformedRequest) {
			t.Fatalf("%s: got %v, want ErrMalformedRequest", line, err)
		}
	}
}

func TestAStopReplyCarriesTheExitCode(t *testing.T) {
	executor := &recordingExecutor{}
	pipe := &connection{Reader: strings.NewReader(`{"stop":{"execution":"execution-1"}}` + "\n")}

	if err := AnswerHostRequest(context.Background(), pipe, executor); err != nil {
		t.Fatal(err)
	}

	var reply StopReply
	if err := json.Unmarshal(pipe.written.Bytes(), &reply); err != nil {
		t.Fatal(err)
	}
	if reply.ExitCode == nil || *reply.ExitCode != 0 || len(executor.stopped) != 1 {
		t.Fatalf("reply %+v", reply)
	}
}
