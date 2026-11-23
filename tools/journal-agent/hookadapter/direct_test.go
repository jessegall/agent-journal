package hookadapter

import (
	"io"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"journal-agent/client"
)

// A session container's hook reaches the journal itself: one signed POST to the driver's hook address with the
// native call as its body, answered with the journal's reply.
func TestAHookFromASessionContainerAsksTheJournalItself(t *testing.T) {
	native := `{"hook_event_name":"Stop","session_id":"s1"}`
	var asked []*http.Request
	journal := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		body, _ := io.ReadAll(request.Body)
		if string(body) != native {
			t.Errorf("the journal was sent %q, want the native call", body)
		}
		asked = append(asked, request)
		if len(asked) == 1 {
			writer.WriteHeader(http.StatusBadGateway)

			return
		}
		_, _ = writer.Write([]byte(`{"stdout":"{}","stderr":"","exitCode":0}`))
	}))
	defer journal.Close()
	grant := client.StartGrant{JournalURL: journal.URL, Token: "start-token", ProfileKey: "main-agent", ProfileRevision: 3}
	adapter := Adapter{
		Ask:             AskJournal(grant, "claude-code", 4),
		PreparationFile: filepath.Join(t.TempDir(), "prepared"),
	}

	reply := adapter.Answer([]byte(native))

	if reply.Stdout != "{}" || reply.ExitCode != 0 {
		t.Fatalf("the provider was answered %+v, want the journal's reply", reply)
	}
	if len(asked) != 2 {
		t.Fatalf("the journal was asked %d times, want a second try after the failed one", len(asked))
	}
	first, second := asked[0], asked[1]
	if first.URL.RequestURI() != "/hooks/claude-code?generation=4" || first.Method != http.MethodPost {
		t.Fatalf("the call went to %s %s", first.Method, first.URL.RequestURI())
	}
	for _, header := range []string{"X-Journal-Call-Id", "X-Journal-Call-Issued-At", "X-Journal-Call-Signature"} {
		if first.Header.Get(header) == "" || first.Header.Get(header) != second.Header.Get(header) {
			t.Fatalf("the second try's %s is %q, the first's %q: it must be the same call", header,
				second.Header.Get(header), first.Header.Get(header))
		}
	}
	if first.Header.Get("Authorization") != "Bearer start-token" || first.Header.Get("X-Journal-Profile") != "main-agent" ||
		first.Header.Get("X-Journal-Profile-Revision") != "3" {
		t.Fatalf("the call carried the headers %v", first.Header)
	}
}

// With no grant in its environment and an answer that is no reply, the provider gets its own blocking reply.
func TestAHookThatCannotAskTheJournalIsRefused(t *testing.T) {
	native := []byte(`{"hook_event_name":"UserPromptSubmit"}`)
	journal := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
		_, _ = writer.Write([]byte(`{"stdout":"{}"}`))
	}))
	defer journal.Close()
	grant := client.StartGrant{JournalURL: journal.URL, Token: "start-token", ProfileKey: "main-agent", ProfileRevision: 3}

	for name, ask := range map[string]func() Adapter{
		"no grant":         func() Adapter { return Adapter{Ask: RefuseWithoutGrant} },
		"a malformed body": func() Adapter { return Adapter{Ask: AskJournal(grant, "claude-code", 0)} },
	} {
		reply := ask().Answer(native)
		if reply.Stdout != `{"decision":"block","reason":"`+journalAway+`"}` {
			t.Fatalf("%s: the provider was answered %q, want its blocking reply", name, reply.Stdout)
		}
	}
}
