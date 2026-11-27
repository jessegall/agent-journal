package recording

import (
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

// openRun writes an open run's file into a drafts folder, as the journal's openRun does.
func openRun(t *testing.T) Drafts {
	t.Helper()
	folder := t.TempDir()
	if err := os.WriteFile(filepath.Join(folder, "run.json"), []byte(`{"scenario":"x","opened_at":1,"closed_at":null}`), 0o664); err != nil {
		t.Fatal(err)
	}
	return Drafts{Folder: folder, IsOn: true}
}

func draftLines(t *testing.T, drafts Drafts, exchange string) []map[string]any {
	t.Helper()
	content, err := os.ReadFile(filepath.Join(drafts.Folder, "docker", exchange+".jsonl"))
	if err != nil {
		return nil
	}
	lines := []map[string]any{}
	for _, line := range strings.Split(strings.TrimSpace(string(content)), "\n") {
		decoded := map[string]any{}
		if err := json.Unmarshal([]byte(line), &decoded); err != nil {
			t.Fatal(err)
		}
		lines = append(lines, decoded)
	}
	return lines
}

func callOf(t *testing.T, line map[string]any) Call {
	t.Helper()
	encoded, _ := json.Marshal(line["call"])
	var call Call
	if err := json.Unmarshal(encoded, &call); err != nil {
		t.Fatal(err)
	}
	return call
}

func TestOffTheRecorderWritesNothing(t *testing.T) {
	drafts := openRun(t)
	drafts.IsOn = false
	request, _ := http.NewRequest("GET", "http://docker/containers/json", nil)

	if err := NewCallRecorder(WireDocker, drafts).Add("run", Asked(request, time.Now())); err != nil {
		t.Fatal(err)
	}

	if lines := draftLines(t, drafts, "run"); lines != nil {
		t.Fatalf("recording off wrote %d lines", len(lines))
	}
}

func TestACallIsKeptAskedThenAnsweredWithItsBodyCutAndUnpackedAndNoCredential(t *testing.T) {
	drafts := openRun(t)
	recorder := NewCallRecorder(WireDocker, drafts)
	request, _ := http.NewRequest("POST", "http://docker/containers/create?name=a", strings.NewReader(strings.Repeat("a", 70000)))
	request.Header.Set("Authorization", "Bearer secret")
	request.Header.Set("Content-Type", "application/json")
	packed := &bytes.Buffer{}
	writer := gzip.NewWriter(packed)
	_, _ = writer.Write([]byte(`{"Id":"c1"}`))
	_ = writer.Close()
	header := http.Header{"Content-Encoding": {"gzip"}, "Api-Version": {"1.47"}}

	if err := recorder.Add("run", Asked(request, time.Now())); err != nil {
		t.Fatal(err)
	}
	if err := recorder.Add("run", Answered(request, 201, header, packed.Bytes(), time.Now())); err != nil {
		t.Fatal(err)
	}

	lines := draftLines(t, drafts, "run")
	if len(lines) != 3 || lines[1]["type"] != "asked" || lines[2]["type"] != "answered" {
		t.Fatalf("the draft holds %v", lines)
	}
	asked, answered := callOf(t, lines[1]), callOf(t, lines[2])
	sent, _ := base64.StdEncoding.DecodeString(asked.Body)
	got, _ := base64.StdEncoding.DecodeString(answered.Body)
	_, hasCredential := asked.Headers["Authorization"]
	if len(sent) != BodyByteLimit || !asked.IsCut || hasCredential || string(got) != `{"Id":"c1"}` || *answered.Status != 201 {
		t.Fatalf("kept %d bytes cut %v credential %v, answered %q status %d", len(sent), asked.IsCut, hasCredential, got, *answered.Status)
	}
}
