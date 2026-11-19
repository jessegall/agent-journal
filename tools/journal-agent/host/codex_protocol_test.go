package host

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"io"
	"testing"
	"time"
)

// fakeAppServer answers each request with the result its method maps to and sends the notifications given after the
// first answer.
func fakeAppServer(t *testing.T, results map[string]string, notifications []string) (*CodexConnection,
	chan CodexNotification, func()) {
	t.Helper()
	requests, requestWriter := io.Pipe()
	answers, answerWriter := io.Pipe()
	heard := make(chan CodexNotification, 8)
	go func() {
		scanner := bufio.NewScanner(requests)
		sent := false
		for scanner.Scan() {
			var request struct {
				ID     *int   `json:"id"`
				Method string `json:"method"`
			}
			_ = json.Unmarshal(scanner.Bytes(), &request)
			if request.ID == nil {
				continue
			}
			answer, _ := json.Marshal(map[string]any{"id": *request.ID, "result": json.RawMessage(results[request.Method])})
			_, _ = answerWriter.Write(append(answer, '\n'))
			if !sent {
				for _, notification := range notifications {
					_, _ = answerWriter.Write([]byte(notification + "\n"))
				}
				sent = true
			}
		}
	}()
	connection := NewCodexConnection(answers, requestWriter, func(notification CodexNotification) {
		heard <- notification
	})
	return connection, heard, func() { answerWriter.Close() }
}

func TestARequestGetsItsOwnAnswerAndNotificationsArePassedOn(t *testing.T) {
	connection, heard, _ := fakeAppServer(t, map[string]string{"thread/start": `{"thread":{"id":"thread-9"}}`},
		[]string{`{"method":"turn/completed","params":{"threadId":"thread-9","turn":{"id":"t1","status":"completed"}}}`})

	var started struct {
		Thread struct {
			ID string `json:"id"`
		} `json:"thread"`
	}
	if err := connection.Request(context.Background(), "thread/start", map[string]any{}, &started); err != nil {
		t.Fatal(err)
	}

	if started.Thread.ID != "thread-9" {
		t.Fatalf("started %+v", started)
	}
	select {
	case notification := <-heard:
		if notification.Method != "turn/completed" {
			t.Fatalf("heard %s", notification.Method)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("the notification never came")
	}
}

func TestARequestWaitingWhenTheAppServerEndsFails(t *testing.T) {
	requests, requestWriter := io.Pipe()
	answers, answerWriter := io.Pipe()
	go func() { _, _ = io.Copy(io.Discard, requests) }()
	connection := NewCodexConnection(answers, requestWriter, func(CodexNotification) {})
	answerWriter.Close()

	err := connection.Request(context.Background(), "account/read", map[string]any{}, nil)

	if !errors.Is(err, ErrOwnerGone) {
		t.Fatalf("got %v, want ErrOwnerGone", err)
	}
}

func TestOneOwnerIsStartedForAnAccountGenerationAndAnotherForTheNext(t *testing.T) {
	owners := &CodexOwners{}
	starts := 0
	start := func(context.Context) (*CodexOwner, error) {
		starts++
		return &CodexOwner{ended: make(chan struct{}), turnEnds: map[string]chan CodexTurnEnd{}}, nil
	}

	first, _ := owners.Of(context.Background(), "/accounts/a", 1, start)
	again, _ := owners.Of(context.Background(), "/accounts/a", 1, start)
	_, _ = owners.Of(context.Background(), "/accounts/b", 1, start)
	_, _ = owners.Of(context.Background(), "/accounts/a", 2, start)

	if first != again || starts != 3 {
		t.Fatalf("started %d owners; the same generation shared one: %v", starts, first == again)
	}
}
