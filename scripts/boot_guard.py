import os
from concurrent.futures import ThreadPoolExecutor
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parents[1] / "src"
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from engine.load import factor, quiet, scaled
from engine.viewer import busy
from install import git_env
from providers import DRIVERS

STANDIN = ("#!/bin/sh\ntouch \"$0.started\"\necho \"Ask Codex to do anything\"\n(read line; echo \"$line\" > \"$0.typed\") &\n"
           "while [ ! -f \"$0.quit\" ]; do sleep 0.1; done\n")
OFFLINE = HERE.parent / "tests" / "fixtures" / "offline-bin"


WAIT = scaled(45.0)
PROJECT = "Project builds"
LIMIT = 15.0


def launches(place: Path, entry: Path, name: str, during=None, alone: bool = True) -> None:
    (place / "bin").mkdir(parents=True, exist_ok=True)
    (place / PROJECT / f".{name}").mkdir(parents=True, exist_ok=True)
    standin = place / "bin" / name
    standin.write_text(STANDIN)
    standin.chmod(0o755)
    env = {**git_env(), "PATH": os.pathsep.join([str(place / "bin"), str(OFFLINE), os.environ["PATH"]]), "AGENT_JOURNAL_HOME": str(place / "home"), "HOME": str(place / "home"),
           "AGENT_JOURNAL_REPO": str(place / "no-journal-releases")}
    env.pop("JOURNAL_ENV", None)
    journal = [sys.executable, str(entry), "--root", str(place / PROJECT / ".journal")]
    launched = subprocess.Popen([*journal, name], cwd=place / PROJECT, env=env, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    try:
        began = time.time()
        awaited = place / "bin" / (f"{name}.typed" if DRIVERS[name].opening(b"Ask Codex to do anything") else f"{name}.started")
        while not awaited.exists() and launched.poll() is None and time.time() - began < WAIT:
            time.sleep(0.1)
        if during:
            during()
        (place / "bin" / f"{name}.quit").touch()
        text = launched.communicate(timeout=WAIT)[0].decode(errors="replace")
        left = lingering(place) if alone else []
    finally:
        if alone:
            subprocess.run([*journal, "stop"], cwd=place / PROJECT, env=env, capture_output=True, timeout=WAIT)
        (place / "bin" / f"{name}.quit").touch()
        launched.kill()
        launched.wait(WAIT)
        if alone:
            cleared(place)
        (place / "bin" / f"{name}.quit").unlink(missing_ok=True)
    assert "Traceback" not in text, f"journal {name} crashed:\n{text}"
    assert (place / "bin" / f"{name}.started").exists(), f"journal {name} never started the agent:\n{text}"
    assert awaited.exists(), f"journal {name} never typed its first message:\n{text}"
    assert not left, f"journal {name} left processes running after the session ended:\n" + "\n".join(left)


def lingering(place: Path, within: float = 10.0) -> list[str]:
    calm, began = 0.0, time.time()
    while True:
        found = subprocess.run(["pgrep", "-fl", str(place).removeprefix("/private")], capture_output=True, text=True, timeout=WAIT).stdout.splitlines()
        if not found or calm >= within or time.time() - began >= WAIT:
            return found
        time.sleep(0.1)
        calm += 0.0 if busy() else 0.1


def cleared(place: Path) -> None:
    subprocess.run(["pkill", "-9", "-f", str(place).removeprefix("/private")], capture_output=True, timeout=WAIT)


def ended(place: Path) -> None:
    """Ends every process that mentions the place, and fails when one still lives after a moment."""
    cleared(place)
    for _ in range(25):
        left = subprocess.run(["pgrep", "-f", str(place).removeprefix("/private")], capture_output=True, text=True, timeout=WAIT).stdout.split()
        if not left:
            return
        time.sleep(0.2)
    raise AssertionError(f"processes of {place} are still running: {left}")


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
        (place / PROJECT).mkdir()
        env = {**git_env(), "PATH": f"{OFFLINE}{os.pathsep}{os.environ['PATH']}", "HOME": str(place / "home"), "AGENT_JOURNAL_HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1",
               "AGENT_JOURNAL_REPO": str(place / "no-journal-releases")}
        env.pop("JOURNAL_ENV", None)
        installed = subprocess.run([sys.executable, str(HERE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, text=True, timeout=WAIT)
        root = place / PROJECT / ".journal"
        assert installed.returncode == 0 and (root / "journal.pyz").is_file(), f"the install failed:\n{installed.stdout}{installed.stderr}"
        journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
        created = subprocess.run([*journal, "todo", "create", "a row"], cwd=place / PROJECT, env=env, capture_output=True, text=True, timeout=WAIT)
        assert created.returncode == 0, f"journal todo create failed:\n{created.stdout}{created.stderr}"
        serves(journal, place / PROJECT, env)
        with ThreadPoolExecutor() as pool:
            for running in [pool.submit(launches, place, root / "journal.py", name, alone=False) for name in DRIVERS]:
                running.result()
        left = lingering(place)
        assert not left, "the journal left processes running after its last session ended:\n" + "\n".join(left)
        return time.time() - began
    finally:
        cleared(place)
        shutil.rmtree(place, ignore_errors=True)


if __name__ == "__main__":
    calm = quiet()
    try:
        took = guard()
    except AssertionError as failed:
        print(f"boot guard: the journal does not boot, push refused\n{failed}", file=sys.stderr)
        sys.exit(1)
    print(f"boot guard: installs, serves and launches {', '.join(DRIVERS)} in {took:.1f}s")
    if not calm or not quiet():
        print(f"boot guard: boot speed not judged, the machine ran at {factor():.1f} times its cores; it boots, which is what a busy machine can prove")
        sys.exit(0)
    if took > LIMIT:
        print(f"boot guard: slower than {LIMIT:.0f}s on a quiet machine", file=sys.stderr)
        sys.exit(1)
