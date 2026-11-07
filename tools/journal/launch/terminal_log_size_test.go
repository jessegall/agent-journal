package launch

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestALongOutputLineIsCutWithBoundedMemory(t *testing.T) {
	path := filepath.Join(t.TempDir(), "agent.log")
	log, err := OpenTerminalLog(path)
	if err != nil {
		t.Fatal(err)
	}
	payload := []byte(strings.Repeat("x", 64*1024))
	for range 80 {
		if _, err := log.Write(payload); err != nil {
			t.Fatal(err)
		}
	}
	var statsBefore, statsAfter runtime.MemStats
	runtime.ReadMemStats(&statsBefore)
	_, _ = log.Write([]byte("tail of the long line\nnext line\n"))
	runtime.ReadMemStats(&statsAfter)
	if cap(log.pending) > 4*TerminalLineBytes {
		t.Errorf("the pending buffer grew to %d bytes", cap(log.pending))
	}
	_ = log.Close()
	text, _ := os.ReadFile(path)
	if !strings.Contains(string(text), cutMark) || !strings.Contains(string(text), "next line") || strings.Contains(string(text), "tail of the long line") {
		t.Errorf("the log kept %d bytes without its cut mark or next line", len(text))
	}
	if len(text) > 2*TerminalLineBytes {
		t.Errorf("the log kept %d bytes", len(text))
	}
}

func TestALogKeepsAboutItsByteLimit(t *testing.T) {
	path := filepath.Join(t.TempDir(), "agent.log")
	log, err := OpenTerminalLog(path)
	if err != nil {
		t.Fatal(err)
	}
	line := []byte(strings.Repeat("y", 60*1024) + "\n")
	for range 200 {
		_, _ = log.Write(line)
	}
	_ = log.Close()
	stat, _ := os.Stat(path)
	if stat.Size() > TerminalLogBytes {
		t.Errorf("the log holds %d bytes", stat.Size())
	}
}
