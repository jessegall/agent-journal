package recording

import (
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"
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

// testPlace keeps a script's place in memory, with the test's steps that ran.
type testPlace struct {
	mutex    sync.Mutex
	played   int
	ran      map[string]bool
	failures []ScriptFailure
}

func (place *testPlace) Played() int { return place.played }

func (place *testPlace) Answered(count int) { place.played = count }

func (place *testPlace) HasRun(step string) bool {
	place.mutex.Lock()
	defer place.mutex.Unlock()
	return place.ran[step]
}

func (place *testPlace) Story() string { return "StartsSignIn" }

func (place *testPlace) Failed(failure ScriptFailure) { place.failures = append(place.failures, failure) }

func (place *testPlace) run(step string) {
	place.mutex.Lock()
	defer place.mutex.Unlock()
	place.ran[step] = true
}

// scriptOf is a script whose recordings are the exchange fixture, saved in a folder of the test.
func scriptOf(t *testing.T, steps ...ScriptStep) Script {
	t.Helper()
	folder := filepath.Join(t.TempDir(), "exchange")
	if err := os.MkdirAll(folder, 0o700); err != nil {
		t.Fatal(err)
	}
	if err := exchangeFixture().Save(folder); err != nil {
		t.Fatal(err)
	}
	for number := range steps {
		for index := range steps[number].Actions {
			if steps[number].Actions[index].Type != "wait" {
				steps[number].Actions[index].Recording = folder
			}
		}
	}
	return Script{Program: "codex app-server", Opening: folder, Steps: steps}
}

func played(t *testing.T, script Script, place ScriptPlace, written ...string) ([]map[string]any, error) {
	t.Helper()
	reader, writer := io.Pipe()
	printed := &lockedBuilder{}
	done := make(chan error, 1)
	environment := func(name string) string { return map[string]string{"HOME_FOLDER": "/live/home"}[name] }
	go func() {
		done <- ScriptReplay(script, place, reader, printed, io.Discard, environment, func(string) {})
	}()
	for _, line := range written {
		_, _ = io.WriteString(writer, line+"\n")
		time.Sleep(10 * time.Millisecond)
	}
	_ = writer.Close()
	err := <-done
	var messages []map[string]any
	for _, line := range strings.Split(strings.TrimSpace(printed.String()), "\n") {
		var message map[string]any
		if json.Unmarshal([]byte(line), &message) == nil {
			messages = append(messages, message)
		}
	}
	return messages, err
}

// lockedBuilder collects what answers running side by side write.
type lockedBuilder struct {
	mutex   sync.Mutex
	builder strings.Builder
}

func (builder *lockedBuilder) Write(bytes []byte) (int, error) {
	builder.mutex.Lock()
	defer builder.mutex.Unlock()
	return builder.builder.Write(bytes)
}

func (builder *lockedBuilder) String() string {
	builder.mutex.Lock()
	defer builder.mutex.Unlock()
	return builder.builder.String()
}

func reply() []ScriptAction { return []ScriptAction{{Type: "reply"}} }

func TestAnExpectedRequestIsRepliedUnderItsOwnIdWithTheEnvironmentsValues(t *testing.T) {
	script := scriptOf(t, ScriptStep{Method: "thread/start", Actions: reply()})

	messages, err := played(t, script, &testPlace{ran: map[string]bool{}}, `{"id":"live.thread","method":"thread/start","params":{}}`)

	if err != nil {
		t.Fatal(err)
	}
	if home := messages[0]["params"].(map[string]any)["home"]; home != "/live/home" {
		t.Fatalf("home %v", home)
	}
	if id := messages[1]["id"]; id != "live.thread" {
		t.Fatalf("id %v", id)
	}
}

func TestAThreadStartedTwiceIsTwoThreads(t *testing.T) {
	script := scriptOf(t,
		ScriptStep{Method: "thread/start", Actions: reply()},
		ScriptStep{Method: "thread/start", Actions: reply()},
	)

	messages, err := played(t, script, &testPlace{ran: map[string]bool{}},
		`{"id":"a.thread","method":"thread/start","params":{}}`,
		`{"id":"b.thread","method":"thread/start","params":{}}`,
	)

	if err != nil {
		t.Fatal(err)
	}
	first := messages[1]["result"].(map[string]any)["thread"].(map[string]any)["id"]
	second := messages[2]["result"].(map[string]any)["thread"].(map[string]any)["id"]
	if first == second {
		t.Fatalf("both threads are %v", first)
	}
}

func TestALineTheScriptDidNotExpectFailsNamingItsStepTheStoryAndTheLine(t *testing.T) {
	script := scriptOf(t, ScriptStep{Method: "thread/start", Actions: reply()})
	place := &testPlace{ran: map[string]bool{}}

	_, err := played(t, script, place, `{"id":"x","method":"turn/start","params":{}}`)

	if err == nil || len(place.failures) != 1 {
		t.Fatalf("no failure: %v", err)
	}
	failure := place.failures[0]
	if failure.Position != 1 || failure.Expected != "thread/start" || failure.Story != "StartsSignIn" || !strings.Contains(failure.Got, "turn/start") {
		t.Fatalf("failure %+v", failure)
	}
}

func TestAWaitHoldsTheNotificationUntilTheTestsStepRan(t *testing.T) {
	script := scriptOf(t, ScriptStep{Method: "turn/start", Actions: []ScriptAction{
		{Type: "reply"},
		{Type: "wait", Step: "ReleasesTurns"},
		{Type: "notify", Method: "turn/completed"},
	}})
	place := &testPlace{ran: map[string]bool{}}
	reader, writer := io.Pipe()
	printed := &lockedBuilder{}
	done := make(chan error, 1)
	go func() {
		done <- ScriptReplay(script, place, reader, printed, io.Discard, func(string) string { return "" }, func(string) {})
	}()

	_, _ = io.WriteString(writer, `{"id":"t","method":"turn/start","params":{}}`+"\n")
	time.Sleep(50 * time.Millisecond)
	held := strings.Contains(printed.String(), "turn/completed")
	place.run("ReleasesTurns")
	time.Sleep(50 * time.Millisecond)
	released := strings.Contains(printed.String(), "turn/completed")
	_ = writer.Close()
	<-done

	if held || !released {
		t.Fatalf("held %v, released %v: %s", held, released, printed.String())
	}
}

func TestAStartCarriesOnWhereTheStartBeforeItLeftOff(t *testing.T) {
	script := scriptOf(t,
		ScriptStep{Method: "thread/start", Actions: reply()},
		ScriptStep{Method: "turn/start", Actions: reply()},
	)
	place := &testPlace{ran: map[string]bool{}, played: 1}

	_, err := played(t, script, place, `{"id":"t","method":"turn/start","params":{}}`)

	if err != nil || place.played != 2 {
		t.Fatalf("played %d: %v", place.played, err)
	}
}
