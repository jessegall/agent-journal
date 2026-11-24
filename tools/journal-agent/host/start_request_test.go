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

func (executor *recordingExecutor) Drain(_ context.Context, request DrainRequest) (DrainReply, error) {
	return DrainReply{IsDrained: request.Account == "/accounts/a"}, nil
}

type connection struct {
	*strings.Reader
	written bytes.Buffer
}

func (connection *connection) Write(content []byte) (int, error) {
	return connection.written.Write(content)
}

func (executor *recordingExecutor) FolderUse(_ context.Context, request FolderUseRequest) (FolderUseReply, error) {
	return FolderUseReply{IsBound: request.Folder == "bound7"}, nil
}

func (executor *recordingExecutor) MakeFolder(_ context.Context, request AccountFolderRequest) (AccountFolderReply, error) {
	return AccountFolderReply{IsDone: true, Reason: "made " + request.Folder}, nil
}

func (executor *recordingExecutor) RemoveFolder(_ context.Context, request AccountFolderRequest) (AccountFolderReply, error) {
	return AccountFolderReply{IsDone: true, Reason: "removed " + request.Folder}, nil
}

func TestAFolderUseRequestNeedsAPlainIdAndReachesTheExecutor(t *testing.T) {
	for line, want := range map[string]string{
		`{"folderUse":{"folder":"bound7"}}`: `{"isBound":true}`,
		`{"folderUse":{"folder":"free7"}}`:  `{"isBound":false}`,
	} {
		pipe := &connection{Reader: strings.NewReader(line + "\n")}
		if err := AnswerHostRequest(context.Background(), pipe, &recordingExecutor{}); err != nil || strings.TrimSpace(pipe.written.String()) != want {
			t.Fatalf("%s gave %q, %v", line, pipe.written.String(), err)
		}
	}

	for _, line := range []string{`{"folderUse":{"folder":"../7"}}`, `{"folderUse":{"folder":"a7"},"drain":{"account":"/a"}}`} {
		pipe := &connection{Reader: strings.NewReader(line + "\n")}
		if err := AnswerHostRequest(context.Background(), pipe, &recordingExecutor{}); !errors.Is(err, ErrMalformedRequest) {
			t.Fatalf("%s gave %v", line, err)
		}
	}
}

func TestAStartRequestReachesTheExecutorAndItsReplyIsWritten(t *testing.T) {
	executor := &recordingExecutor{}
	line := `{"start":{"startId":"s1","runtimeId":"r1","sessionId":"sess","driver":"claude",` +
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
	line := `{"start":{"startId":"s1","driver":"claude","executionMode":"protected_host","workspace":"work"}}` + "\n"
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

func TestADrainAnswersWhetherNothingOfTheAccountRuns(t *testing.T) {
	pipe := &connection{Reader: strings.NewReader(`{"drain":{"account":"/accounts/a"}}` + "\n")}

	if err := AnswerHostRequest(context.Background(), pipe, &recordingExecutor{}); err != nil {
		t.Fatal(err)
	}

	var reply DrainReply
	if err := json.Unmarshal(pipe.written.Bytes(), &reply); err != nil || !reply.IsDrained {
		t.Fatalf("reply %+v %v", reply, err)
	}
}

func TestAnAccountFolderRequestNeedsAPlainIdAndReachesTheExecutor(t *testing.T) {
	for line, want := range map[string]string{
		`{"makeFolder":{"folder":"a7"}}`:   `{"isDone":true,"reason":"made a7"}`,
		`{"removeFolder":{"folder":"a7"}}`: `{"isDone":true,"reason":"removed a7"}`,
	} {
		pipe := &connection{Reader: strings.NewReader(line + "\n")}
		if err := AnswerHostRequest(context.Background(), pipe, &recordingExecutor{}); err != nil || strings.TrimSpace(pipe.written.String()) != want {
			t.Fatalf("%s gave %q, %v", line, pipe.written.String(), err)
		}
	}

	for _, line := range []string{`{"makeFolder":{"folder":"../a7"}}`, `{"removeFolder":{"folder":"a/7"}}`,
		`{"makeFolder":{"folder":"a7"},"removeFolder":{"folder":"a7"}}`} {
		pipe := &connection{Reader: strings.NewReader(line + "\n")}
		if err := AnswerHostRequest(context.Background(), pipe, &recordingExecutor{}); !errors.Is(err, ErrMalformedRequest) {
			t.Fatalf("%s was answered: %v", line, err)
		}
	}
}
