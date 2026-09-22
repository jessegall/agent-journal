import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from providers import DRIVERS

STANDIN = ("#!/bin/sh\ntouch \"$0.started\"\necho \"Ask Codex to do anything\"\n(read line; echo \"$line\" > \"$0.typed\") &\n"
           "while [ ! -f \"$0.quit\" ]; do sleep 0.1; done\n")
WAIT = 20.0
LIMIT = 5.0


def launches(place: Path, entry: Path, name: str, during=None) -> None:
    (place / "bin").mkdir(parents=True, exist_ok=True)
    (place / "project" / f".{name}").mkdir(parents=True, exist_ok=True)
    standin = place / "bin" / name
    standin.write_text(STANDIN)
    standin.chmod(0o755)
    env = {**os.environ, "PATH": f"{place / 'bin'}{os.pathsep}{os.environ['PATH']}", "AGENT_JOURNAL_HOME": str(place / "home"), "HOME": str(place / "home")}
    env.pop("JOURNAL_ENV", None)
    journal = [sys.executable, str(entry), "--root", str(place / "project" / ".journal")]
    launched = subprocess.Popen([*journal, name], cwd=place / "project", env=env, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    try:
        began = time.time()
        awaited = place / "bin" / (f"{name}.typed" if DRIVERS[name].confirm(b"Ask Codex to do anything") else f"{name}.started")
        while not awaited.exists() and launched.poll() is None and time.time() - began < WAIT:
            time.sleep(0.1)
        if during:
            during()
        (place / "bin" / f"{name}.quit").touch()
        text = launched.communicate(timeout=WAIT)[0].decode(errors="replace")
        left = lingering(place)
    finally:
        subprocess.run([*journal, "stop"], cwd=place / "project", env=env, capture_output=True, timeout=WAIT)
        (place / "bin" / f"{name}.quit").touch()
        launched.kill()
        launched.wait(WAIT)
        cleared(place)
        (place / "bin" / f"{name}.quit").unlink(missing_ok=True)
    assert "Traceback" not in text, f"journal {name} crashed:\n{text}"
    assert (place / "bin" / f"{name}.started").exists(), f"journal {name} never started the agent:\n{text}"
    assert awaited.exists(), f"journal {name} never typed its first message:\n{text}"
    assert not left, f"journal {name} left processes running after the session ended:\n" + "\n".join(left)


def lingering(place: Path, within: float = 3.0) -> list[str]:
    began = time.time()
    while True:
        found = subprocess.run(["pgrep", "-fl", str(place).removeprefix("/private")], capture_output=True, text=True, timeout=WAIT).stdout.splitlines()
        if not found or time.time() - began >= within:
            return found
        time.sleep(0.1)


def cleared(place: Path) -> None:
    subprocess.run(["pkill", "-9", "-f", str(place).removeprefix("/private")], capture_output=True, timeout=WAIT)


def serves(journal: list[str], cwd: Path, env: dict) -> None:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    server = subprocess.Popen([*journal, "serve", "--port", str(port)], cwd=cwd, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    try:
        began = time.time()
        while time.time() - began < WAIT:
            assert server.poll() is None, f"the server exited:\n{server.communicate()[0].decode(errors='replace')}"
            try:
                page = urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=2)
                listed = urllib.request.urlopen(f"http://127.0.0.1:{port}/api/main/todo", timeout=2).read()
                assert page.status == 200 and b'"rows"' in listed, f"the server answered wrongly: {page.status} {listed[:200]!r}"
                return
            except OSError:
                time.sleep(0.05)
        raise AssertionError("the server never answered")
    finally:
        server.terminate()
        server.wait(WAIT)


def guard() -> float:
    began = time.time()
    place = Path(tempfile.mkdtemp(prefix="guard-"))
    try:
        (place / "project").mkdir()
        env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
        env.pop("JOURNAL_ENV", None)
        installed = subprocess.run([sys.executable, str(HERE / "install.py"), "upgrade", str(place / "project")], env=env, capture_output=True, text=True, timeout=WAIT)
        root = place / "project" / ".journal"
        assert installed.returncode == 0 and (root / "journal.pyz").is_file(), f"the install failed:\n{installed.stdout}{installed.stderr}"
        journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
        created = subprocess.run([*journal, "todo", "create", "a row"], cwd=place / "project", env=env, capture_output=True, text=True, timeout=WAIT)
        assert created.returncode == 0, f"journal todo create failed:\n{created.stdout}{created.stderr}"
        serves(journal, place / "project", env)
        for name in DRIVERS:
            launches(place, root / "journal.py", name)
        return time.time() - began
    finally:
        cleared(place)
        shutil.rmtree(place, ignore_errors=True)


if __name__ == "__main__":
    try:
        took = guard()
    except AssertionError as failed:
        print(f"boot guard: the journal does not boot, push refused\n{failed}", file=sys.stderr)
        sys.exit(1)
    print(f"boot guard: installs, serves and launches {', '.join(DRIVERS)} in {took:.1f}s")
    if took > LIMIT:
        print(f"boot guard: slower than {LIMIT:.0f}s", file=sys.stderr)
        sys.exit(1)
