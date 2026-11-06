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
	"runtime"
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
	sandbox, err := checkedSandbox(program, []string{writable}, readLimit{})
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
	for index, shell := range []string{"/bin/bash", "/bin/zsh"} {
		if _, err := os.Stat(shell); os.IsNotExist(err) {
			continue
		}
		body := strings.Repeat("report text\n", 2000)
		line := quoted(journal) + " report make Findings --body - <<'END'\n" + body + "END\n"
		runner := exec.Command(program, "--process", fmt.Sprint(10+index), "--limit", "0", "--read-only-shell", "--", line)
		runner.Env = append(os.Environ(), "JOURNAL_HOME="+folder, "SHELL="+shell, "TMPPREFIX=/not-writable/zsh")
		output, err := runner.CombinedOutput()
		if runtime.GOOS == "darwin" && shell == "/bin/bash" {
			if err == nil || !strings.Contains(string(output), "cannot create temp file for here document") {
				t.Fatalf("macOS bash here document: %v: %s", err, output)
			}
			continue
		}
		if err != nil || !strings.Contains(string(output), "journal works") {
			t.Fatalf("%s here document: %v: %s", shell, err, output)
		}
		reportFound := false
		for len(reports) > 0 {
			arguments := <-reports
			if len(arguments) == 5 && arguments[0] == "report" && arguments[4] == body {
				reportFound = true
			}
		}
		if !reportFound {
			t.Fatalf("%s did not send the report body", shell)
		}
	}
	if !recorded {
		t.Fatal("runner did not record its sandbox level")
	}
	if output, err := exec.Command(program, "--sandbox-probe", protected).CombinedOutput(); err == nil {
		t.Fatalf("unprotected self-test passed: %s", output)
	}
}

func TestDeclaredFoldersNeverHoldTheMainFolderOrAPathOutsideIt(t *testing.T) {
	main, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	rulesFolder := filepath.Join(main, ".rules")
	if err := os.Mkdir(rulesFolder, 0o755); err != nil {
		t.Fatal(err)
	}
	externalFolder := t.TempDir()
	home := filepath.Join(main, ".journal")
	worktrees := filepath.Join(home, "worktrees")
	if err := os.MkdirAll(worktrees, 0o755); err != nil {
		t.Fatal(err)
	}
	journalLink := filepath.Join(main, "link-in")
	if err := os.Symlink(home, journalLink); err != nil {
		t.Fatal(err)
	}
	folders := declaredFolders([]string{main, externalFolder, rulesFolder, filepath.Join(main, "missing"), home, worktrees, journalLink}, main, home)
	if len(folders) != 1 || folders[0] != rulesFolder {
		t.Fatalf("declared folders %v", folders)
	}
}

func TestAWorkerKeepsItsOwnWorktreeAndThePluginDataWithNothingDeclared(t *testing.T) {
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	main := filepath.Join(folder, "main")
	home := filepath.Join(main, ".journal")
	worktree := filepath.Join(home, "worktrees", "worker")
	if err := os.MkdirAll(worktree, 0o700); err != nil {
		t.Fatal(err)
	}
	limit, err := workerReadLimit(worktree, home, nil)
	if err != nil {
		t.Fatal(err)
	}
	expectedPaths := map[string]bool{worktree: false, filepath.Join(home, "plugin-data"): false}
	for _, path := range limit.Readable {
		if _, expected := expectedPaths[path]; expected {
			expectedPaths[path] = true
		}
	}
	for path, readable := range expectedPaths {
		if !readable {
			t.Fatalf("a worker cannot read %s", path)
		}
	}
}

func TestReadFoldersVariableIsReadClearedAndAMissingOneIsNothing(t *testing.T) {
	t.Setenv("JOURNAL_RUN_READ_FOLDERS", "/a"+string(os.PathListSeparator)+"/b")
	if folders := readFolders(); len(folders) != 2 || folders[0] != "/a" {
		t.Fatalf("read folders %v", folders)
	}
	if _, exists := os.LookupEnv("JOURNAL_RUN_READ_FOLDERS"); exists {
		t.Fatal("the variable stays for the line to read")
	}
	if folders := readFolders(); len(folders) != 0 {
		t.Fatalf("a missing variable gave %v", folders)
	}
}
