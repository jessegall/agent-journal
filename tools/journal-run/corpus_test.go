package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"math/rand"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"slices"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// The command corpus is private and stays outside the repository: JOURNAL_CORPUS names its file, one command a line as a
// JSON string. JOURNAL_CORPUS_RUNS is how many lines the run test runs, 2000 by default. Lines that differ are written
// beside the corpus, in runner-differing.txt.
const (
	corpusVariable    = "JOURNAL_CORPUS"
	corpusRunsName    = "JOURNAL_CORPUS_RUNS"
	sandboxedName     = "JOURNAL_CORPUS_SANDBOXED"
	sandboxPathPrefix = "/private/var/"
	// sandboxProbeFolder is a folder this user may write in, which the sandbox must refuse.
	sandboxProbeFolder = "/Users/Shared"
	corpusSeed         = 20261104
	lineTimeout        = 5 * time.Second
	// runnerTimeout is long, so a run that ends late on a busy machine is not taken for one that hangs.
	runnerTimeout    = 60 * time.Second
	mixedLines       = 500000
	standInFunctions = `command_not_found_handler() { printf 'ran:'; printf ' %s' "$@"; printf '\n'; return 0; }
command_not_found_handle() { command_not_found_handler "$@"; }
`
)

// realPrograms stay real in a run, since the runner's script and the filters need them; every other program is a
// stand-in that prints its name and arguments, and the sandbox refuses to start anything else by its full path.
var realPrograms = []string{"awk", "cat", "cut", "env", "false", "grep", "head", "mkfifo", "printf", "rm", "sed", "sort", "tail", "tee", "tr", "true", "uniq", "wc"}

// unsteadyLine is a line whose output changes from one run to the next, whatever runs it.
var unsteadyLine = regexp.MustCompile(`\$\$|:\?|\$!|RANDOM|SECONDS|EPOCH|BASHPID|PPID|sleep|wait|nohup|disown|\bjobs\b|\bps\b|/dev/tcp|\btime\b|\bexec\b|\btrap\b|\bsource\b|^\.\s|\bkill\b|\bulimit\b|\bset\b|\bsetopt\b|\bshopt\b|\benv\b|\bprintenv\b|\bwhich\b|\btype\b|\bcommand\b|\bhash\b|\bfc\b|\bhistory\b|\$\(\(|\$0|\$_|\bread\b|LINENO|\bdeclare\b|\btypeset\b|\bexport\b`)

func corpusFile(t *testing.T) string {
	t.Helper()
	path := os.Getenv(corpusVariable)
	if path == "" {
		t.Skipf("%s names no corpus file", corpusVariable)
	}
	return path
}

func corpusLines(t *testing.T, path string) []string {
	t.Helper()
	file, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer file.Close()
	var lines []string
	reader := bufio.NewReaderSize(file, 1<<26)
	for {
		text, err := reader.ReadBytes('\n')
		var line string
		if json.Unmarshal(text, &line) == nil {
			lines = append(lines, line)
		}
		if err != nil {
			return lines
		}
	}
}

// mixedLine joins lines of the corpus as a shell line joins commands.
func mixedLine(random *rand.Rand, lines []string) string {
	joiners := []string{" && ", " || ", "; ", " | ", " & ", "\n", " | tail -3 && ", " | grep -v x; "}
	var mixed strings.Builder
	mixed.WriteString(lines[random.Intn(len(lines))])
	for count := random.Intn(3) + 1; count > 0; count-- {
		mixed.WriteString(joiners[random.Intn(len(joiners))])
		mixed.WriteString(lines[random.Intn(len(lines))])
	}
	return mixed.String()
}

func eachLine(t *testing.T, lines []string, check func(line string) string) []string {
	t.Helper()
	var mutex sync.Mutex
	var failing []string
	work := make(chan string, 1024)
	var workers sync.WaitGroup
	for range runtime.NumCPU() {
		workers.Add(1)
		go func() {
			defer workers.Done()
			for line := range work {
				if problem := check(line); problem != "" {
					mutex.Lock()
					failing = append(failing, problem)
					mutex.Unlock()
				}
			}
		}()
	}
	for _, line := range lines {
		work <- line
	}
	close(work)
	workers.Wait()
	return failing
}

func writeFailing(t *testing.T, path string, failing []string) {
	t.Helper()
	slices.Sort(failing)
	if err := os.WriteFile(filepath.Join(filepath.Dir(path), "runner-differing.txt"), []byte(strings.Join(failing, "\n=====\n")), 0o644); err != nil {
		t.Fatal(err)
	}
}

// partsProblem says what is wrong with how a line is cut: it never panics and its script is one a shell can read.
func partsProblem(line string) (problem string) {
	defer func() {
		if failure := recover(); failure != nil {
			problem = fmt.Sprintf("panic %v\n%s", failure, line)
		}
	}()
	if _, _, err := shell.Split(line); err != nil {
		return ""
	}
	if _, err := shell.Parse(Script(Parts(line), "/folder")); err != nil {
		return fmt.Sprintf("the script does not read: %v\n%s", err, line)
	}
	return ""
}

func TestEveryCorpusLineAndMixOfThemIsCutIntoAScriptAShellReads(t *testing.T) {
	path := corpusFile(t)
	lines := corpusLines(t, path)
	random := rand.New(rand.NewSource(corpusSeed))
	all := append([]string(nil), lines...)
	for range mixedLines {
		all = append(all, mixedLine(random, lines))
	}
	failing := eachLine(t, all, partsProblem)
	t.Logf("%d lines, %d failing", len(all), len(failing))
	if len(failing) > 0 {
		writeFailing(t, path, failing)
		t.Fatalf("%d of %d lines failed, the first: %s", len(failing), len(all), failing[0])
	}
}

func sandboxPolicy(folder string, programs []string) string {
	var policy strings.Builder
	policy.WriteString("(version 1)(allow default)(deny network*)(deny file-write*)(deny signal)(allow signal (target same-sandbox))\n")
	fmt.Fprintf(&policy, "(allow file-write* (subpath %q) (literal \"/dev/null\") (literal \"/dev/tty\") (regex #\"^/dev/fd/\"))\n", folder)
	policy.WriteString("(deny process-exec*)\n(allow process-exec*")
	for _, program := range programs {
		fmt.Fprintf(&policy, " (literal %q)", program)
	}
	policy.WriteString(")\n")
	return policy.String()
}

// runInSandbox starts this test again inside the sandbox: no network, no write outside its own folder, no signal to
// another process and no program but the ones listed, so no line of the corpus can do anything real.
func runInSandbox(t *testing.T, path, testName string) {
	t.Helper()
	sandbox, err := exec.LookPath("sandbox-exec")
	if err != nil {
		t.Skip("no sandbox-exec here, and the corpus is never run outside a sandbox")
	}
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	program, err := os.Executable()
	if err != nil {
		t.Fatal(err)
	}
	if program, err = filepath.EvalSymlinks(program); err != nil {
		t.Fatal(err)
	}
	programs := []string{program, "/bin/sh", "/bin/zsh", "/bin/bash", "/bin/dash"}
	tools := filepath.Join(folder, "tools")
	if err := os.Mkdir(tools, 0o755); err != nil {
		t.Fatal(err)
	}
	for _, name := range realPrograms {
		real, err := exec.LookPath(name)
		if err != nil {
			t.Fatal(err)
		}
		resolved, err := filepath.EvalSymlinks(real)
		if err != nil {
			t.Fatal(err)
		}
		programs = append(programs, resolved)
		if err := os.Symlink(resolved, filepath.Join(tools, name)); err != nil {
			t.Fatal(err)
		}
	}
	command := exec.Command(sandbox, "-p", sandboxPolicy(folder, programs), program, "-test.run=^"+testName+"$", "-test.timeout=2h", "-test.v")
	command.Env = append(os.Environ(), sandboxedName+"="+folder, "HOME="+folder, "TMPDIR="+folder)
	output, err := command.CombinedOutput()
	differing, readErr := os.ReadFile(filepath.Join(folder, "differing.txt"))
	if readErr == nil {
		if err := os.WriteFile(filepath.Join(filepath.Dir(path), "runner-differing.txt"), differing, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	t.Logf("%s", tailOf(string(output), 2000))
	if err != nil {
		t.Fatalf("the sandboxed run failed: %v", err)
	}
}

func tailOf(text string, most int) string {
	if len(text) > most {
		return text[len(text)-most:]
	}
	return text
}

// shellResult runs a line in a shell, in a folder of its own that holds nothing, with stand-ins for every program.
func shellResult(folder, shellPath, line string) (string, int, bool) {
	tools := filepath.Join(os.Getenv(sandboxedName), "tools")
	command := exec.Command(shellPath, "-c", standInFunctions+line)
	command.Dir = folder
	command.Env = []string{"PATH=" + tools, "HOME=" + folder}
	return boundedResult(command, folder)
}

// shellPrefix is how a shell starts an error line: its name or script, the command and the line number, all of which
// differ between a line and the script that holds it.
var shellPrefix = regexp.MustCompile(`(?m)^[^\n:]*(?:run\.sh|zsh|bash)(?:: -c)?(?::[a-zA-Z_.-]+)?(?:: line \d+)?(?::\d+)?:`)

// failedPipesHint is the line the runner adds on purpose when a failed test's pipes print nothing.
var failedPipesHint = regexp.MustCompile(`(?m)^the command failed and its pipes printed nothing: .*\n`)

// comparable leaves out what must differ between a line and the script that holds it: the folder, the shell's prefix,
// the group a syntax error quotes and the hint after a failed test.
func comparable(text, folder string) string {
	return failedPipesHint.ReplaceAllString(strings.ReplaceAll(shellPrefix.ReplaceAllString(strings.ReplaceAll(text, folder, "FOLDER"), "SHELL:"), "`{ ", "`"), "")
}

// isUnjudged says a difference is one of how a shell names itself, not of what ran: a syntax error quotes the text
// around it, and an error line that passed a pipe carries the script's path past the point comparable can reach it, so
// those lines leave the comparison and the rest must still match.
func isUnjudged(line, runnerOutput, shellOutput string) bool {
	if strings.Contains(runnerOutput+shellOutput, "parse error") || strings.Contains(runnerOutput+shellOutput, "syntax error") {
		return true
	}
	return strings.Contains(line, "|") && withoutErrorLines(runnerOutput) == withoutErrorLines(shellOutput)
}

func withoutErrorLines(text string) string {
	return strings.Join(slices.DeleteFunc(strings.Split(text, "\n"), func(line string) bool {
		return strings.Contains(line, "SHELL:") || strings.Contains(line, sandboxPathPrefix)
	}), "\n")
}

// holdsLines says a run that left a part behind printed only lines the shell printed: what the part prints after the
// line ended is read by number.
func holdsLines(shellOutput, runnerOutput string) bool {
	lines := strings.Split(shellOutput, "\n")
	return !slices.ContainsFunc(strings.Split(runnerOutput, "\n"), func(line string) bool { return !slices.Contains(lines, line) })
}

// sameLines says two outputs hold the same lines: the two sides of a pipe or an & run at once in any shell, so their
// lines may swap.
func sameLines(first, second string) bool {
	firstLines, secondLines := strings.Split(first, "\n"), strings.Split(second, "\n")
	slices.Sort(firstLines)
	slices.Sort(secondLines)
	return slices.Equal(firstLines, secondLines)
}

func boundedResult(command *exec.Cmd, folder string) (string, int, bool) {
	var output strings.Builder
	command.Stdout, command.Stderr = &output, &output
	if err := command.Start(); err != nil {
		return "", 0, false
	}
	ending := make(chan error, 1)
	go func() { ending <- command.Wait() }()
	select {
	case err := <-ending:
		code := 0
		if exit, isExit := err.(*exec.ExitError); isExit {
			code = exit.ExitCode()
		}
		return comparable(output.String(), folder), code, true
	case <-time.After(lineTimeout):
		_ = command.Process.Kill()
		return "", 0, false
	}
}

func readText(path string) string {
	text, _ := os.ReadFile(path)
	return string(text)
}

func lineWorks(line string) bool {
	if unsteadyLine.MatchString(line) {
		return false
	}
	_, _, err := shell.Split(line)
	return err == nil
}

func sampledLines(lines []string, count int) []string {
	random := rand.New(rand.NewSource(corpusSeed))
	var sample []string
	for len(sample) < count {
		line := lines[random.Intn(len(lines))]
		if len(sample)%2 == 1 {
			line = mixedLine(random, lines)
		}
		if lineWorks(line) {
			sample = append(sample, line)
		}
	}
	return sample
}

func runnerProblem(sandbox, shellPath, line string, number *int, mutex *sync.Mutex) string {
	mutex.Lock()
	*number++
	id := *number
	mutex.Unlock()
	folder := filepath.Join(sandbox, "lines", strconv.Itoa(id))
	work, home := filepath.Join(folder, "work"), filepath.Join(folder, "home")
	if err := os.MkdirAll(work, 0o755); err != nil {
		return ""
	}
	defer os.RemoveAll(folder)
	shellOutput, shellCode, ended := shellResult(work, shellPath, line)
	secondOutput, _, steady := shellResult(work, shellPath, line)
	if !ended || !steady || shellOutput != secondOutput {
		return ""
	}
	setting := fmt.Sprintf("cd %s\nPATH=%s\nHOME=%s\n", quoted(work), quoted(filepath.Join(sandbox, "tools")), quoted(work))
	setup := Options{Process: 4, LimitSeconds: 30, Line: setting + standInFunctions + line, Home: home, Shell: shellPath, HeartbeatEvery: time.Hour, CapCharacters: 1 << 24,
		ShellAlive: func() bool { return true }}
	var output strings.Builder
	codes := make(chan int, 1)
	go func() { codes <- Run(setup, newClient(), &output) }()
	select {
	case code := <-codes:
		runnerOutput := comparable(output.String(), work)
		if code == shellCode && sameLines(runnerOutput, shellOutput) && strings.ContainsAny(line, "|&") {
			return ""
		}
		if code == shellCode && (isUnjudged(line, runnerOutput, shellOutput) || (strings.Contains(line, "&") && holdsLines(shellOutput, runnerOutput))) {
			return ""
		}
		if runnerOutput != shellOutput || code != shellCode {
			return fmt.Sprintf("%s\nthe runner: exit %d\n%s\nthe shell: exit %d\n%s\nline:\n%s", shellPath, code, tailOf(runnerOutput, 600), shellCode, tailOf(shellOutput, 600), line)
		}
	case <-time.After(runnerTimeout):
		folder := NewFolder(home, setup.Process)
		if pid, recorded := folder.Pid(); recorded {
			_ = syscall.Kill(-pid, syscall.SIGKILL)
		}
		files, _ := filepath.Glob(filepath.Join(folder.Path, "*"))
		names := make([]string, 0, len(files))
		for _, file := range files {
			names = append(names, filepath.Base(file))
		}
		return fmt.Sprintf("%s\nthe runner did not end\nfiles: %s\nscript:\n%s\nline:\n%s", shellPath, strings.Join(names, " "), tailOf(readText(folder.Script()), 1500), line)
	}
	return ""
}

// expectSandboxHolds stops the run before any line starts unless the sandbox really refuses a write outside its folder
// and a connection to the outside: the variable alone could be set by anyone.
func expectSandboxHolds(t *testing.T) {
	t.Helper()
	probe := filepath.Join(sandboxProbeFolder, fmt.Sprintf(".journal-sandbox-probe-%d", os.Getpid()))
	if err := os.WriteFile(probe, nil, 0o644); err == nil {
		_ = os.Remove(probe)
		t.Fatal("a write outside the sandbox worked, so no line of the corpus runs")
	}
	if connection, err := net.DialTimeout("tcp", "1.1.1.1:443", 2*time.Second); err == nil {
		connection.Close()
		t.Fatal("a connection out of the sandbox worked, so no line of the corpus runs")
	}
}

// TestSampledCorpusLinesRunAsInAShell runs a sample of the corpus and of mixes of it through the runner and through
// plain shells, and compares what they print and their exit code. It runs only inside the sandbox it starts itself.
func TestSampledCorpusLinesRunAsInAShell(t *testing.T) {
	sandbox := os.Getenv(sandboxedName)
	if sandbox == "" {
		runInSandbox(t, corpusFile(t), t.Name())
		return
	}
	expectSandboxHolds(t)
	count, err := strconv.Atoi(os.Getenv(corpusRunsName))
	if err != nil {
		count = 2000
	}
	sample := sampledLines(corpusLines(t, os.Getenv(corpusVariable)), count)
	var mutex sync.Mutex
	number := 0
	var failing []string
	for _, shellPath := range []string{"/bin/zsh", "/bin/bash"} {
		failing = append(failing, eachLine(t, sample, func(line string) string { return runnerProblem(sandbox, shellPath, line, &number, &mutex) })...)
	}
	t.Logf("%d lines in 2 shells, %d differ", len(sample), len(failing))
	if err := os.WriteFile(filepath.Join(sandbox, "differing.txt"), []byte(strings.Join(failing, "\n=====\n")), 0o644); err != nil {
		t.Fatal(err)
	}
	if len(failing) > 0 {
		t.Fatalf("%d of %d runs differ, the first:\n%s", len(failing), len(sample)*2, failing[0])
	}
}

func TestEveryCorpusTestAndBuildNamesAKnownProgram(t *testing.T) {
	if os.Getenv(sandboxedName) == "" {
		runInSandbox(t, corpusFile(t), t.Name())
		return
	}
	expectSandboxHolds(t)
	table := classify.LoadTable("")
	classifier := classify.NewClassifier(table)
	programs, unknown := map[string]bool{}, map[string]bool{}
	for _, line := range corpusLines(t, os.Getenv(corpusVariable)) {
		for _, part := range classifier.Line(line).Parts {
			if part.Classification.Category != "test run" && part.Classification.Category != "build" {
				continue
			}
			programs[part.Program] = true
			if !classifier.IsTestOrBuildProgram(part.Program, part.Subcommand) {
				unknown[part.Program] = true
			}
		}
	}
	names := make([]string, 0, len(programs))
	for program := range programs {
		names = append(names, program)
	}
	slices.Sort(names)
	t.Logf("test and build programs: %s", strings.Join(names, ", "))
	for program := range unknown {
		t.Errorf("test or build does not resolve to a known program: %q", program)
	}
}
