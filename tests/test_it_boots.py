import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from providers import DRIVERS
from scripts.checks.imports import imports, missing

HERE = Path(__file__).resolve().parents[1]
STANDIN = "#!/bin/sh\ntouch \"$0.started\"\necho \"Ask Codex to do anything\"\nread line\necho \"$line\" > \"$0.typed\"\nsleep 30\n"
WAIT = 20.0


def test_every_import_in_the_package_resolves():
    assert [f"{path.name}:{node.lineno}" for path, node in imports() for alias in node.names if missing(node.module, alias.name)] == []


def test_every_agent_launches_under_the_journal_and_exits_cleanly():
    for name in DRIVERS:
        place = Path(tempfile.mkdtemp(prefix="boot-"))
        (place / "bin").mkdir()
        (place / "project" / f".{name}").mkdir(parents=True)
        standin = place / "bin" / name
        standin.write_text(STANDIN)
        standin.chmod(0o755)
        env = {**os.environ, "PATH": f"{place / 'bin'}{os.pathsep}{os.environ['PATH']}", "AGENT_JOURNAL_HOME": str(place / "home")}
        env.pop("JOURNAL_ENV", None)
        launched = subprocess.Popen([sys.executable, str(HERE / "journal.py"), "--root", str(place / "project" / ".journal"), name],
                                    cwd=place / "project", env=env, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        began = time.time()
        awaited = place / "bin" / (f"{name}.typed" if DRIVERS[name].confirm(b"Ask Codex to do anything") else f"{name}.started")
        while not awaited.exists() and launched.poll() is None and time.time() - began < WAIT:
            time.sleep(0.1)
        launched.stdin.close()
        text = launched.stdout.read().decode(errors="replace")
        launched.wait(timeout=WAIT)
        subprocess.run([sys.executable, str(HERE / "journal.py"), "--root", str(place / "project" / ".journal"), "stop"],
                       cwd=place / "project", env=env, capture_output=True, timeout=WAIT)
        assert "Traceback" not in text, f"journal {name} crashed:\n{text}"
        assert (place / "bin" / f"{name}.started").exists(), f"journal {name} never started the agent:\n{text}"
        assert awaited.exists(), f"journal {name} never typed its first message:\n{text}"


def test_the_journal_starts_on_a_record_with_a_damaged_row():
    place = Path(tempfile.mkdtemp(prefix="boot-"))
    root = place / ".journal"
    journal = [sys.executable, str(HERE / "journal.py"), "--root", str(root)]
    subprocess.run([*journal, "todo", "create", "a row"], cwd=place, capture_output=True, timeout=WAIT)
    (root / "environments" / "main" / "todo" / "002.md").write_text("")
    ran = subprocess.run([*journal, "status"], cwd=place, capture_output=True, text=True, timeout=WAIT)
    assert (ran.returncode, "Traceback" in ran.stderr) == (0, False), f"a damaged row stopped the journal:\n{ran.stderr}"
