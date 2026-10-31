package programs

import (
	"bufio"
	"bytes"
	"encoding/json"
	"flag"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
	"github.com/jessegall/agent-journal/tools/journal-hook/internal/schemacheck"
)

// go test ./programs -update writes the expected objects again from what the program gives; read the difference before
// committing it.
var update = flag.Bool("update", false, "write the expected objects of the recorded bodies again")

var testContext = Context{Environment: "development", Actor: "agent", Firing: "7731-1793395000123", FiredAtMs: 1793395000123, Classifier: classify.NewClassifier(classify.LoadTable("")), Programs: LoadTable("")}

// checkRecordings runs every recorded body of the program and compares each object, its raw body left out, with the
// expected one beside it in testdata/prepared; every object must fit the schema and keep its body as raw.
func checkRecordings(t *testing.T, program string) {
	recordings, _ := filepath.Glob(filepath.Join("..", "testdata", "recorded", program, "*.jsonl"))
	if len(recordings) == 0 {
		t.Fatalf("no recorded %s bodies", program)
	}
	for _, recording := range recordings {
		expectedFile := filepath.Join("testdata", "prepared", program, filepath.Base(recording))
		var outputs []string
		for number, body := range lines(t, recording) {
			prepared, skip, err := Prepared(program, body, testContext)
			if err != nil {
				t.Errorf("%s:%d: %v", recording, number+1, err)
				continue
			}
			if skip {
				outputs = append(outputs, "skip")
				continue
			}
			schemacheck.Fits(t, prepared)
			if !bytes.Equal(prepared.Raw, body) {
				t.Errorf("%s:%d: raw is not the body", recording, number+1)
			}
			prepared.Raw = nil
			text, _ := json.Marshal(prepared)
			outputs = append(outputs, strings.Replace(string(text), `,"raw":null`, "", 1))
		}
		if *update {
			_ = os.MkdirAll(filepath.Dir(expectedFile), 0o755)
			if err := os.WriteFile(expectedFile, []byte(strings.Join(outputs, "\n")+"\n"), 0o644); err != nil {
				t.Fatal(err)
			}
			continue
		}
		expected := lines(t, expectedFile)
		if len(expected) != len(outputs) {
			t.Errorf("%s gives %d objects, %s holds %d", recording, len(outputs), expectedFile, len(expected))
			continue
		}
		for index := range outputs {
			if outputs[index] == string(expected[index]) {
				continue
			}
			t.Errorf("%s:%d gives\n %s\nwant\n %s", recording, index+1, outputs[index], expected[index])
		}
	}
}

func lines(t *testing.T, path string) [][]byte {
	t.Helper()
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	var collected [][]byte
	for scanner.Scan() {
		collected = append(collected, append([]byte(nil), scanner.Bytes()...))
	}
	if err := scanner.Err(); err != nil {
		t.Fatal(err)
	}
	return collected
}
