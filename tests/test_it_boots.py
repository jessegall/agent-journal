import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from providers import DRIVERS
from scripts.checks.imports import imports, missing

HERE = Path(__file__).resolve().parents[1]
STANDIN = "#!/bin/sh\ntouch \"$0.started\"\nsleep 30\n"
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
        while not (place / "bin" / f"{name}.started").exists() and launched.poll() is None and time.time() - began < WAIT:
            time.sleep(0.1)
        launched.stdin.close()
        said = launched.stdout.read().decode(errors="replace")
        launched.wait(timeout=WAIT)
        subprocess.run([sys.executable, str(HERE / "journal.py"), "--root", str(place / "project" / ".journal"), "stop"],
                       cwd=place / "project", env=env, capture_output=True, timeout=WAIT)
        assert "Traceback" not in said, f"journal {name} crashed:\n{said}"
        assert (place / "bin" / f"{name}.started").exists(), f"journal {name} never started the agent:\n{said}"
