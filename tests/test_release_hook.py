import os
import stat
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tests.kit import check, done  # noqa: E402

HERE = Path(__file__).resolve().parents[1]
project = Path(tempfile.mkdtemp())
web = project / "web"
dist = web / "dist"
binary = project / "bin"
dist.mkdir(parents=True)
binary.mkdir()
(project / "VERSION").write_text("1.0.0\n")
(project / "notes.txt").write_text("before\n")
(dist / "index.html").write_text("before\n")
npm = binary / "npm"
npm.write_text("#!/bin/sh\nmkdir -p web/dist\nprintf built\\n > web/dist/index.html\nprintf '%s\\n' \"$*\" > npm-called\n")
npm.chmod(npm.stat().st_mode | stat.S_IXUSR)


def git(*args):
    return subprocess.run(["git", *args], cwd=project, capture_output=True, text=True, check=True)


def hook():
    env = {**os.environ, "PATH": f"{binary}{os.pathsep}{os.environ['PATH']}"}
    return subprocess.run([str(HERE / ".githooks" / "pre-commit")], cwd=project, env=env, capture_output=True, text=True, check=True)


git("init", "-q")
git("config", "user.name", "Test")
git("config", "user.email", "test@example.com")
git("add", ".")
git("commit", "-qm", "initial")

(project / "notes.txt").write_text("after\n")
git("add", "notes.txt")
hook()
check("an ordinary commit does not build the viewer", (project / "npm-called").exists(), False)
check("an ordinary commit stages only its own changes", git("diff", "--cached", "--name-only").stdout.splitlines(), ["notes.txt"])
git("commit", "-qm", "notes")

(project / "VERSION").write_text("1.0.1\n")
git("add", "VERSION")
hook()
check("a release build uses the viewer package", (project / "npm-called").read_text().strip(), "--prefix web run build")
check("a release stages the generated viewer", git("diff", "--cached", "--name-only").stdout.splitlines(), ["VERSION", "web/dist/index.html"])
check("the tracked hook is executable", bool((HERE / ".githooks" / "pre-commit").stat().st_mode & stat.S_IXUSR), True)

done()
