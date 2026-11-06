package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"slices"
	"testing"
)

func TestWorkerShellSandbox(t *testing.T) {
	folder := t.TempDir()
	worktree := filepath.Join(folder, "worker")
	main := filepath.Join(folder, "main")
	sibling := filepath.Join(folder, "other-worker")
	for _, path := range []string{worktree, main, sibling} {
		if err := os.Mkdir(path, 0o700); err != nil {
			t.Fatal(err)
		}
	}
	program := filepath.Join(folder, "journal-run")
	if output, err := exec.Command("go", "build", "-o", program, ".").CombinedOutput(); err != nil {
		t.Fatalf("runner build: %v: %s", err, output)
	}
	allowed, err := workerFolders(worktree, filepath.Join(main, ".journal"))
	if err != nil {
		t.Fatal(err)
	}
	limit, err := workerReadLimit(worktree, filepath.Join(main, ".journal"), nil)
	if err != nil {
		t.Fatal(err)
	}
	sandbox, err := checkedSandbox(program, allowed, limit)
	if err != nil {
		t.Fatal(err)
	}
	script := `import errno, pathlib, subprocess, sys
for folder in sys.argv[1:]:
    target = str(pathlib.Path(folder, 'damaged'))
    try:
        pathlib.Path(target).write_text('direct')
        raise AssertionError('write outside worktree succeeded')
    except OSError as error:
        assert error.errno in (errno.EACCES, errno.EPERM, errno.EROFS), error
    child = subprocess.run([sys.executable, '-c', 'import pathlib,sys; pathlib.Path(sys.argv[1]).write_text("child")', target], capture_output=True)
    assert child.returncode != 0, child
pathlib.Path('worker-output').write_text('allowed')
`
	command := sandbox.command("python3", "-c", script, main, sibling)
	command.Dir = worktree
	if output, err := command.CombinedOutput(); err != nil {
		t.Fatalf("worker boundary: %v: %s", err, output)
	}
	files := map[string]string{
		"go.mod":           "module sandbox.example\n\ngo 1.26\n",
		"main.go":          "package main\nfunc main() {}\n",
		"main_test.go":     "package main\nimport \"testing\"\nfunc TestBuild(t *testing.T) {}\n",
		"test_example.py":  "def test_build():\n    assert 2 + 2 == 4\n",
		"package.json":     `{"name":"sandbox-test","version":"1.0.0","scripts":{"test":"node --test example.test.cjs","build":"node build.cjs"}}`,
		"example.test.cjs": "require('node:test')('build', () => require('node:assert').equal(2+2,4));\n",
		"build.cjs":        "require('node:fs').writeFileSync('built.txt', 'built');\n",
	}
	for name, text := range files {
		if err := os.WriteFile(filepath.Join(worktree, name), []byte(text), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	root, err := filepath.Abs("../..")
	if err != nil {
		t.Fatal(err)
	}
	python := filepath.Join(root, ".venv", "bin", "python3")
	temporary := filepath.Join(worktree, "temporary")
	if err := os.Mkdir(temporary, 0o700); err != nil {
		t.Fatal(err)
	}
	for _, line := range []string{"go test ./... && go build -o application .", quoted(python) + " -m pytest test_example.py -q", "npm test && npm run build"} {
		command := sandbox.command("/bin/sh", "-c", line)
		command.Dir = worktree
		command.Env = append(os.Environ(), "GOWORK=off", "TMPDIR="+temporary)
		if output, err := command.CombinedOutput(); err != nil {
			t.Fatalf("%s: %v: %s", line, err, output)
		}
	}
}

func TestWorkerCacheRejectsCheckout(t *testing.T) {
	main := t.TempDir()
	worktree := filepath.Join(main, "worker")
	if err := os.Mkdir(worktree, 0o700); err != nil {
		t.Fatal(err)
	}
	cache := filepath.Join(t.TempDir(), "cache-link")
	if err := os.Symlink(main, cache); err != nil {
		t.Fatal(err)
	}
	t.Setenv("GOCACHE", cache)
	if _, err := workerFolders(worktree, filepath.Join(main, ".journal")); err == nil {
		t.Fatal("a cache granted write access to the main checkout")
	}
}

func TestWorkerSandboxFlag(t *testing.T) {
	flags, err := ParseFlags([]string{"--process", "4", "--write-folder", "/worker", "--", "go test"})
	if err != nil {
		t.Fatal(err)
	}
	options := flags.runOptions("/journal", "/bin/sh")
	if !options.ReadOnlyShell || options.WriteFolder != "/worker" {
		t.Fatalf("sandbox flags were lost: %+v", options)
	}
}

func TestTheRulesFolderIsReadableOnlyWhenDeclared(t *testing.T) {
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	main := filepath.Join(folder, "main")
	home := filepath.Join(main, ".journal")
	worktree := filepath.Join(home, "worktrees", "worker")
	rules := filepath.Join(main, ".commandments")
	for _, path := range []string{worktree, rules} {
		if err := os.MkdirAll(path, 0o700); err != nil {
			t.Fatal(err)
		}
	}
	isReadable := func(declared []string) bool {
		limit, err := workerReadLimit(worktree, home, declared)
		if err != nil {
			t.Fatal(err)
		}
		for _, path := range limit.Readable {
			if path == rules {
				return true
			}
		}
		return false
	}
	if isReadable(nil) {
		t.Fatal("the rules folder is readable with nothing declared")
	}
	if !isReadable([]string{rules}) {
		t.Fatal("a declared rules folder is not readable")
	}
}

func TestWorkerReadLimit(t *testing.T) {
	if runtime.GOOS != "darwin" {
		t.Skip("the read limit is enforced by the macOS sandbox only so far")
	}
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	main := filepath.Join(folder, "main")
	home := filepath.Join(main, ".journal")
	worktree := filepath.Join(home, "worktrees", "worker")
	sibling := filepath.Join(home, "worktrees", "other-worker")
	library := filepath.Join(main, ".venv")
	rules := filepath.Join(main, ".commandments")
	for _, path := range []string{worktree, sibling, library, rules, filepath.Join(home, "bin")} {
		if err := os.MkdirAll(path, 0o700); err != nil {
			t.Fatal(err)
		}
	}
	files := map[string]string{filepath.Join(main, "secret.txt"): "main", filepath.Join(sibling, "secret.txt"): "other", filepath.Join(library, "lib.txt"): "library", filepath.Join(worktree, "own.txt"): "own", filepath.Join(rules, "config.json"): "{}"}
	for path, text := range files {
		if err := os.WriteFile(path, []byte(text), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.Symlink(library, filepath.Join(worktree, "linked")); err != nil {
		t.Fatal(err)
	}
	program := filepath.Join(home, "bin", "journal-run")
	if output, err := exec.Command("go", "build", "-o", program, ".").CombinedOutput(); err != nil {
		t.Fatalf("runner build: %v: %s", err, output)
	}
	allowed, err := workerFolders(worktree, home)
	if err != nil {
		t.Fatal(err)
	}
	limit, err := workerReadLimit(worktree, home, nil)
	if err != nil {
		t.Fatal(err)
	}
	sandbox, err := checkedSandbox(program, allowed, limit)
	if err != nil {
		t.Fatal(err)
	}
	reads := func(path string) error {
		command := sandbox.command("cat", path)
		command.Dir = worktree
		return command.Run()
	}
	for _, path := range []string{filepath.Join(main, "secret.txt"), filepath.Join(sibling, "secret.txt"), "../other-worker/secret.txt", filepath.Join(rules, "config.json")} {
		if reads(path) == nil {
			t.Fatalf("a worker read %s", path)
		}
	}
	for _, path := range []string{"own.txt", "linked/lib.txt", filepath.Join(library, "lib.txt")} {
		if err := reads(path); err != nil {
			t.Fatalf("a worker could not read %s: %v", path, err)
		}
	}
}

func TestWorkerReadLimitOpensALibraryLinkedLowerInTheWorktree(t *testing.T) {
	root, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	main, worktree := filepath.Join(root, "main"), filepath.Join(root, "worktree")
	library, gitFolder := filepath.Join(main, "src", "viewer", "node_modules"), filepath.Join(root, "worktree-git")
	for _, folder := range []string{library, filepath.Join(main, ".journal"), filepath.Join(worktree, "src", "viewer"), gitFolder} {
		if err := os.MkdirAll(folder, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.Symlink(library, filepath.Join(worktree, "src", "viewer", "node_modules")); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(worktree, ".git"), []byte("gitdir: "+gitFolder+"\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(gitFolder, worktreeExcludeFile), []byte("/src/viewer/node_modules\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	limit, err := workerReadLimit(worktree, filepath.Join(main, ".journal"), nil)
	if err != nil {
		t.Fatal(err)
	}
	if !slices.Contains(limit.Readable, library) {
		t.Fatalf("the library is not readable: %v", limit.Readable)
	}
}

func TestWorkerReadLimitOpensADeclaredFolderAndNeverTheCheckoutItself(t *testing.T) {
	root, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	main, worktree, externalFolder := filepath.Join(root, "main"), filepath.Join(root, "worktree"), filepath.Join(root, "outside")
	rules := filepath.Join(main, ".rules")
	for _, folder := range []string{rules, filepath.Join(main, ".journal"), worktree, externalFolder} {
		if err := os.MkdirAll(folder, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	externalLink := filepath.Join(main, "linked-out")
	if err := os.Symlink(externalFolder, externalLink); err != nil {
		t.Fatal(err)
	}
	limit, err := workerReadLimit(worktree, filepath.Join(main, ".journal"), []string{rules, main, externalFolder, externalLink, filepath.Join(main, "missing")})
	if err != nil {
		t.Fatal(err)
	}
	if !slices.Contains(limit.Readable, rules) {
		t.Fatalf("the declared folder is not readable: %v", limit.Readable)
	}
	for _, deniedFolder := range []string{main, externalFolder, externalLink, filepath.Join(main, "missing")} {
		if slices.Contains(limit.Readable, deniedFolder) {
			t.Fatalf("%s must stay closed: %v", deniedFolder, limit.Readable)
		}
	}
}

func TestReadFoldersVariableIsReadAndCleared(t *testing.T) {
	t.Setenv(readFoldersVariable, "/project/.rules"+string(os.PathListSeparator)+"/project/.more")
	if folders := readFolders(); !slices.Equal(folders, []string{"/project/.rules", "/project/.more"}) {
		t.Fatalf("the folders were misread: %v", folders)
	}
	if value, present := os.LookupEnv(readFoldersVariable); present {
		t.Fatalf("the variable stays set for a run inside this one: %q", value)
	}
}

func TestWorkerShellReadsADeclaredFolderAndNotItsNeighbour(t *testing.T) {
	if runtime.GOOS != "darwin" {
		t.Skip("the read limit is enforced by the macOS sandbox only so far")
	}
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	main := filepath.Join(folder, "main")
	home := filepath.Join(main, ".journal")
	worktree := filepath.Join(home, "worktrees", "worker")
	rulesFolder, extraFolder, privateFolder := filepath.Join(main, ".rules"), filepath.Join(main, ".more"), filepath.Join(main, ".private")
	for _, path := range []string{worktree, rulesFolder, extraFolder, privateFolder, filepath.Join(home, "bin")} {
		if err := os.MkdirAll(path, 0o700); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(path, "config.json"), []byte("{}"), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	program := filepath.Join(home, "bin", "journal-run")
	if output, err := exec.Command("go", "build", "-o", program, ".").CombinedOutput(); err != nil {
		t.Fatalf("runner build: %v: %s", err, output)
	}
	allowed, err := workerFolders(worktree, home)
	if err != nil {
		t.Fatal(err)
	}
	limit, err := workerReadLimit(worktree, home, []string{rulesFolder, extraFolder})
	if err != nil {
		t.Fatal(err)
	}
	sandbox, err := checkedSandbox(program, allowed, limit)
	if err != nil {
		t.Fatal(err)
	}
	reads := func(path string) error {
		command := sandbox.command("cat", filepath.Join(path, "config.json"))
		command.Dir = worktree
		return command.Run()
	}
	for _, path := range []string{rulesFolder, extraFolder} {
		if err := reads(path); err != nil {
			t.Fatalf("a worker could not read the declared %s: %v", path, err)
		}
	}
	if reads(privateFolder) == nil {
		t.Fatalf("a worker read %s, which no plugin declared", privateFolder)
	}
}
