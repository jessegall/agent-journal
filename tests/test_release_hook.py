import os
import stat
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]


def test_the_pre_commit_hook_builds_the_viewer_only_on_a_release(tmp_path):
    project = tmp_path
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
        return subprocess.run(["git", *args], cwd=project, capture_output=True, text=True, check=True, timeout=30)

    def hook():
        env = {**os.environ, "PATH": f"{binary}{os.pathsep}{os.environ['PATH']}"}
        return subprocess.run([str(HERE / ".githooks" / "pre-commit")], cwd=project, env=env, capture_output=True, text=True, check=True, timeout=30)

    git("init", "-q")
    git("config", "user.name", "Test")
    git("config", "user.email", "test@example.com")
    git("add", ".")
    git("commit", "-qm", "initial")

    (project / "notes.txt").write_text("after\n")
    git("add", "notes.txt")
    hook()
    assert (project / "npm-called").exists() is False, "an ordinary commit does not build the viewer"
    assert git("diff", "--cached", "--name-only").stdout.splitlines() == ["notes.txt"], "an ordinary commit stages only its own changes"
    git("commit", "-qm", "notes")

    (project / "VERSION").write_text("1.0.1\n")
    git("add", "VERSION")
    hook()
    assert (project / "npm-called").read_text().strip() == "--prefix web run build", "a release build uses the viewer package"
    assert git("diff", "--cached", "--name-only").stdout.splitlines() == ["VERSION", "web/dist/index.html"], "a release stages the generated viewer"
    assert bool((HERE / ".githooks" / "pre-commit").stat().st_mode & stat.S_IXUSR) is True, "the tracked hook is executable"
