package hostapi

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"journal-agent/client"
	"journal-agent/host"
)

func TestAReadProjectInstructionReportsTheFileItNamesOnItsOwnRead(t *testing.T) {
	root := t.TempDir()
	if err := os.WriteFile(filepath.Join(root, "notes.txt"), []byte("hello"), 0o600); err != nil {
		t.Fatal(err)
	}
	var path string
	var report client.ProjectReadReport
	journal := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		path = request.URL.Path
		_ = json.NewDecoder(request.Body).Decode(&report)
		writer.Header().Set("Content-Type", "application/json")
		_, _ = writer.Write([]byte("{}"))
	}))
	defer journal.Close()
	reads := ProjectReads{Reader: host.ProjectReader{Root: root},
		Journal: Journal{Client: client.New(client.Enrollment{JournalURL: journal.URL, HostID: "h", Secret: "s"})}}
	payload := `{"id":"read-1","binding_id":"b","type":"file","path":"notes.txt","entries_limit":10,"text_limit":100}`

	_, err := carry(testInstructions{reads: &reads}, "read_project")(context.Background(), Instruction{ID: "o", Type: "read_project", Payload: payload})

	if err != nil || path != "/host/reports/project-reads/read-1" || report.Text == nil || *report.Text != "hello" {
		t.Fatalf("the read was not reported on its own read: %v, %s, %+v", err, path, report)
	}
}

func TestAReadProjectInstructionThatNamesNoReadIsRefusedAsUnsafe(t *testing.T) {
	reads := ProjectReads{Reader: host.ProjectReader{Root: t.TempDir()}}

	_, err := carry(testInstructions{reads: &reads}, "read_project")(context.Background(), Instruction{ID: "o", Payload: `{}`})

	if refusal, isRefusal := err.(RefusalError); !isRefusal || refusal.Refusal != Unsafe {
		t.Fatalf("an instruction with no read was not refused as unsafe: %v", err)
	}
}
