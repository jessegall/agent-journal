package launch

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestOnlyKeptConversationsAreOfferedNewestFirstWithTheirTitleAndLastUse(t *testing.T) {
	home := t.TempDir()
	projects := filepath.Join(home, ".claude", "projects", "-work-shop")
	if err := os.MkdirAll(projects, 0o755); err != nil {
		t.Fatal(err)
	}
	writeTranscript := func(session, lines string, modifiedAt time.Time) {
		path := filepath.Join(projects, session+".jsonl")
		if err := os.WriteFile(path, []byte(lines), 0o644); err != nil {
			t.Fatal(err)
		}
		if err := os.Chtimes(path, modifiedAt, modifiedAt); err != nil {
			t.Fatal(err)
		}
	}
	currentAt := time.Now()
	writeTranscript("old", `{"type":"ai-title","aiTitle":"Cart totals"}`+"\n", currentAt.Add(-72*time.Hour))
	writeTranscript("new", `{"type":"ai-title","aiTitle":"First"}`+"\n"+`{"type":"ai-title","aiTitle":"Checkout fix"}`+"\n", currentAt.Add(-2*time.Hour))
	conversations := ClaudeTranscripts{Home: home}.Titled("/work/shop", []Conversation{{Session: "old"}, {Session: "gone"}, {Session: "new"}})
	if len(conversations) != 2 || conversations[0].Session != "new" || conversations[1].Session != "old" {
		t.Fatalf("the conversations offered were %+v", conversations)
	}
	if label := conversations[0].Label(currentAt); label != "carry on Checkout fix (2 hours ago)" {
		t.Fatalf("the newest was labelled %q", label)
	}
	if label := conversations[1].Label(currentAt); !strings.HasSuffix(label, "Cart totals (3 days ago)") {
		t.Fatalf("the oldest was labelled %q", label)
	}
}

func TestNoMoreThanTenConversationsAreOffered(t *testing.T) {
	conversations := []Conversation{}
	for index := 0; index < 15; index++ {
		conversations = append(conversations, Conversation{Session: string(rune('a' + index))})
	}
	if offered := (ClaudeTranscripts{Home: t.TempDir()}).Titled("/work/shop", conversations); len(offered) != ConversationsShown {
		t.Fatalf("%d conversations were offered", len(offered))
	}
}
