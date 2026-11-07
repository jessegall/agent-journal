package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

const linuxSandboxCheck = `import errno, json, os, pathlib, socket, subprocess, sys, tempfile, threading
program, expected = sys.argv[1:]
level = subprocess.check_output([program, '--sandbox-check'], text=True).strip()
assert level == expected, (level, expected)
folder = pathlib.Path(tempfile.mkdtemp())
temporary = folder / 'temporary'
temporary.mkdir()
protected = folder / 'protected'
protected.write_text('unchanged')
server = socket.socket(socket.AF_UNIX)
server.bind(str(folder / 'journal.sock'))
server.listen()
def answer():
    connection, _ = server.accept()
    connection.sendall(b'journal socket works')
    connection.close()
threading.Thread(target=answer, daemon=True).start()
wrapper = [program, '--sandbox-exec', level, json.dumps([str(temporary)]), '--']
probe = subprocess.run(wrapper + [program, '--sandbox-probe', str(protected)], capture_output=True, text=True)
assert probe.returncode == 0, probe
script = """import errno, os, pathlib, socket, subprocess, sys
protected, temporary, address = sys.argv[1:]
try:
    pathlib.Path(protected).write_text('damaged')
    raise AssertionError('direct write succeeded')
except OSError as error:
    assert error.errno in (errno.EACCES, errno.EPERM, errno.EROFS), error
child = subprocess.run([sys.executable, '-c', 'import pathlib,sys; pathlib.Path(sys.argv[1]).write_text(\"child\")', protected + '-child'], capture_output=True)
assert child.returncode != 0, child
pathlib.Path(temporary, 'allowed').write_text('temporary')
client = socket.socket(socket.AF_UNIX)
client.connect(address)
assert client.recv(100) == b'journal socket works'
"""
command = wrapper + ['python3', '-c', script, str(protected), str(temporary), str(folder / 'journal.sock')]
completed = subprocess.run(command, capture_output=True, text=True)
assert completed.returncode == 0, (completed.returncode, completed.stdout, completed.stderr)
assert protected.read_text() == 'unchanged'
assert not pathlib.Path(str(protected) + '-child').exists()
assert (temporary / 'allowed').read_text() == 'temporary'
print(level + ': self-test, Python, child, temp and socket pass')
`

func TestLinuxShellSandboxes(t *testing.T) {
	if _, err := exec.LookPath("docker"); err != nil {
		t.Skip("docker is not installed")
	}
	output, err := exec.Command("docker", "info", "--format", "{{.Architecture}}").CombinedOutput()
	if err != nil {
		t.Skipf("docker is not running: %s", output)
	}
	architecture := strings.TrimSpace(string(output))
	switch architecture {
	case "aarch64":
		architecture = "arm64"
	case "x86_64":
		architecture = "amd64"
	}
	folder := t.TempDir()
	program := filepath.Join(folder, "journal-run")
	build := exec.Command("go", "build", "-o", program, ".")
	build.Env = append(os.Environ(), "GOOS=linux", "GOARCH="+architecture)
	if output, err := build.CombinedOutput(); err != nil {
		t.Fatalf("Linux build: %v: %s", err, output)
	}
	if err := os.WriteFile(filepath.Join(folder, "check.py"), []byte(linuxSandboxCheck), 0o600); err != nil {
		t.Fatal(err)
	}
	profile := filepath.Join(folder, "no-landlock.json")
	policy := `{"defaultAction":"SCMP_ACT_ALLOW","syscalls":[{"names":["landlock_create_ruleset","landlock_add_rule","landlock_restrict_self"],"action":"SCMP_ACT_ERRNO","errnoRet":38}]}`
	if err := os.WriteFile(profile, []byte(policy), 0o600); err != nil {
		t.Fatal(err)
	}
	for _, level := range []string{"landlock", "namespace"} {
		t.Run(level, func(t *testing.T) {
			arguments := []string{"run", "--rm", "-v", folder + ":/case:ro"}
			if level == "namespace" {
				arguments = append(arguments, "--privileged", "--security-opt", "seccomp="+profile)
			}
			arguments = append(arguments, "python:3.12-slim", "python3", "/case/check.py", "/case/journal-run", level)
			output, err := exec.Command("docker", arguments...).CombinedOutput()
			if err != nil {
				t.Fatalf("%s: %v: %s", level, err, output)
			}
			t.Log(strings.TrimSpace(string(output)))
		})
	}
}
