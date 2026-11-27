package recording

import (
	"encoding/json"
	"io"
	"strings"
	"testing"
	"time"
)

func exchangeFixture() Fixture {
	return Fixture{
		Output: []OutputChunk{
			{Offset: 1, Stream: "stdout", Bytes: []byte("{\"method\":\"ready\",\"params\":{\"home\":\"{env:HOME_FOLDER}\"}}\n")},
			{Offset: 3, Stream: "stdout", Bytes: []byte("{\"id\":\"thread.1\",\"result\":{\"thread\":{\"id\":\"11111111-2222-3333-4444-555555555555\"}}}\n")},
			{Offset: 5, Stream: "stdout", Bytes: []byte("{\"id\":\"turn.1\",\"result\":{\"turn\":{\"id\":\"aaaaaaaa-2222-3333-4444-555555555555\"}}}\n" +
				"{\"method\":\"turn/completed\",\"params\":{\"threadId\":\"11111111-2222-3333-4444-555555555555\"}}\n")},
		},
		Inputs: []InputEvent{
			{Offset: 2, Bytes: []byte("{\"id\":\"thread.1\",\"method\":\"thread\\/start\",\"params\":{}}\n")},
			{Offset: 4, Bytes: []byte("{\"id\":\"turn.1\",\"method\":\"turn/start\",\"params\":{\"threadId\":\"11111111-2222-3333-4444-555555555555\"}}\n")},
		},
	}
}

func replayed(t *testing.T, written ...string) []map[string]any {
	t.Helper()
	reader, writer := io.Pipe()
	printed := &strings.Builder{}
	done := make(chan error, 1)
	environment := func(name string) string { return map[string]string{"HOME_FOLDER": "/live/home"}[name] }
	go func() {
		done <- ExchangeReplay([]Fixture{exchangeFixture()}, reader, printed, io.Discard, environment, func(string) {}, func(string) {}, 0, func() {}, false)
	}()
	for _, line := range written {
		_, _ = io.WriteString(writer, line+"\n")
		time.Sleep(10 * time.Millisecond)
	}
	_ = writer.Close()
	if err := <-done; err != nil {
		t.Fatal(err)
	}
	var messages []map[string]any
	for _, line := range strings.Split(strings.TrimSpace(printed.String()), "\n") {
		var message map[string]any
		if err := json.Unmarshal([]byte(line), &message); err != nil {
			t.Fatalf("%q: %v", line, err)
		}
		messages = append(messages, message)
	}
	return messages
}

func TestAWrittenRequestIsAnsweredUnderItsOwnIdWithTheEnvironmentsValues(t *testing.T) {
	messages := replayed(t, `{"id":"live.thread","method":"thread/start","params":{}}`)

	if home := messages[0]["params"].(map[string]any)["home"]; home != "/live/home" {
		t.Fatalf("home %v", home)
	}
	if id := messages[1]["id"]; id != "live.thread" {
		t.Fatalf("id %v", id)
	}
}

func TestAThreadStartedTwiceIsTwoThreadsAndATurnRunsOnTheThreadItNames(t *testing.T) {
	messages := replayed(t,
		`{"id":"a.thread","method":"thread/start","params":{}}`,
		`{"id":"b.thread","method":"thread/start","params":{}}`,
	)
	first := messages[1]["result"].(map[string]any)["thread"].(map[string]any)["id"]
	second := messages[2]["result"].(map[string]any)["thread"].(map[string]any)["id"]
	if first == second {
		t.Fatalf("both threads are %v", first)
	}

	turn := replayed(t, `{"id":"b.turn","method":"turn/start","params":{"threadId":"`+second.(string)+`"}}`)
	completed := turn[len(turn)-1]["params"].(map[string]any)["threadId"]
	if completed != second {
		t.Fatalf("the turn completed on %v, not %v", completed, second)
	}
}
