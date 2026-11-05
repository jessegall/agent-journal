package main

import (
	"encoding/json"
	"fmt"
	"github.com/jessegall/agent-journal/tools/journal/socket"
	"io"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestReadOnlyShell(t *testing.T) {
	folder := t.TempDir()
	bin := filepath.Join(folder, "bin")
	if err := os.Mkdir(bin, 0o700); err != nil {
		t.Fatal(err)
	}
	program := filepath.Join(bin, "journal-run")
	if output, err := exec.Command("go", "build", "-o", program, ".").CombinedOutput(); err != nil {
		t.Fatalf("build: %v: %s", err, output)
	}
	journal := filepath.Join(bin, "journal")
	if output, err := exec.Command("go", "build", "-o", journal, "../journal").CombinedOutput(); err != nil {
		t.Fatalf("client build: %v: %s", err, output)
	}
	writable := filepath.Join(folder, "temporary")
	if err := os.Mkdir(writable, 0o700); err != nil {
		t.Fatal(err)
	}
	sandbox, err := checkedSandbox(program, []string{writable})
	if err != nil {
		t.Fatal(err)
	}
	connection, err := net.Listen("unix", socket.Path(folder))
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Close()
	reports := make(chan []string, 100)
	server := &http.Server{Handler: http.HandlerFunc(func(reply http.ResponseWriter, request *http.Request) {
		if request.URL.Path == "/health" {
			reply.WriteHeader(200)
			return
		}
		var body struct {
			Argv []string `json:"argv"`
		}
		if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
			http.Error(reply, err.Error(), 400)
			return
		}
		reports <- body.Argv
		reply.Header().Set("Trailer", "Journal-Exit-Code")
		_, _ = io.WriteString(reply, "journal works\n")
		reply.Header().Set("Journal-Exit-Code", "0")
	})}
	defer server.Close()
	go server.Serve(connection)
	protected := filepath.Join(folder, "protected")
	if err := os.WriteFile(protected, []byte("unchanged"), 0o600); err != nil {
		t.Fatal(err)
	}
	script := `import os, subprocess, sys
try:
    open(sys.argv[1], 'w').write('damaged')
    raise AssertionError('Python write worked')
except PermissionError:
    pass
child = subprocess.run([sys.executable, '-c', "open(__import__('sys').argv[1], 'w').write('child')", sys.argv[1] + '-child'], capture_output=True)
assert child.returncode != 0, child
open(os.path.join(os.environ['TMPDIR'], 'allowed'), 'w').write('temporary')
answer = subprocess.run([sys.argv[2], 'overview'], capture_output=True, text=True)
assert answer.returncode == 0, answer
print(answer.stdout, end='')
`
	command := sandbox.command("python3", "-c", script, protected, journal)
	command.Env = append(os.Environ(), "TMPDIR="+writable, "JOURNAL_HOME="+folder)
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("sandbox %s: %v: %s", sandbox.Level, err, output)
	}
	if string(output) != "journal works\n" {
		t.Fatal(string(output))
	}
	contents, err := os.ReadFile(protected)
	if err != nil || string(contents) != "unchanged" {
		t.Fatalf("protected file changed: %s %v", contents, err)
	}
	if _, err := os.Stat(protected + "-child"); !os.IsNotExist(err) {
		t.Fatal(fmt.Sprint("child wrote: ", err))
	}
	line := "python3 -c " + quoted(script) + " " + quoted(protected) + " " + quoted(journal)
	runner := exec.Command(program, "--process", "4", "--limit", "0", "--read-only-shell", "--", line)
	runner.Env = append(os.Environ(), "JOURNAL_HOME="+folder, "SHELL=/bin/sh")
	output, err = runner.CombinedOutput()
	if err != nil || !strings.Contains(string(output), "journal works") {
		t.Fatalf("sandboxed run: %v: %s", err, output)
	}
	recorded := false
	for len(reports) > 0 {
		if strings.Join(<-reports, " ") == "process sandbox 4 --level "+sandbox.Level {
			recorded = true
		}
	}
	if !recorded {
		t.Fatal("runner did not record its sandbox level")
	}
	if output, err := exec.Command(program, "--sandbox-probe", protected).CombinedOutput(); err == nil {
		t.Fatalf("unprotected self-test passed: %s", output)
	}
}
