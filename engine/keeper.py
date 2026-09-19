import fcntl
import os
import select
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.stored import read_json, write_json  # noqa: E402

TAKEN = 3
WATCH = 0.5
GRACE = 5.0
KILL_AFTER = 2.0
PROBE = 1.0
STARTING, READY, STOPPED, EXITED = "starting", "ready", "stopped", "exited"


def answers(port: int, path: str) -> bool:
    if not port:
        return True
    if not path:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=PROBE):
                return True
        except OSError:
            return False
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=PROBE) as answered:
            return answered.status < 500
    except urllib.error.HTTPError as answered:
        return answered.code < 500
    except (urllib.error.URLError, OSError, ValueError):
        return False


def gone(group: int) -> bool:
    try:
        os.killpg(group, 0)
    except ProcessLookupError:
        return True
    except PermissionError:
        return False
    return False


def teardown(group: int, grace: float) -> None:
    for sign, waited in ((signal.SIGTERM, grace), (signal.SIGKILL, KILL_AFTER)):
        try:
            os.killpg(group, sign)
        except (ProcessLookupError, PermissionError):
            return
        until = time.monotonic() + waited
        while time.monotonic() < until:
            if gone(group):
                return
            time.sleep(0.05)


def state(spec: dict, said: str, child=None, **more) -> None:
    write_json(Path(spec["status"]), {**read_json(Path(spec["status"]), {}), "state": said, "at": time.time(),
                                      "keeper": os.getpid(), "pgid": child.pid if child else 0, "owner": spec.get("owner", 0),
                                      "port": spec.get("port", 0), "url": spec.get("url", ""), **more})


def lease(spec: dict):
    held = open(spec["lock"], "a")
    try:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        held.close()
        return None
    os.set_inheritable(held.fileno(), False)
    return held


def watch(spec: dict, child, lifeline: int, stopping) -> str:
    ready = False
    while child.poll() is None and not stopping[0]:
        seen, _, _ = select.select([lifeline], [], [], WATCH) if lifeline >= 0 else ([], [], [])
        if seen and not os.read(lifeline, 1):
            return STOPPED
        if not ready and answers(int(spec.get("port") or 0), str(spec.get("path") or "")):
            ready = True
            state(spec, READY, child, ready_at=time.time())
    return STOPPED if stopping[0] else EXITED


def main(argv: list[str]) -> int:
    lifeline, spec_path = int(argv[0]), Path(argv[1])
    spec = read_json(spec_path, {})
    held = lease(spec)
    if not held:
        return TAKEN
    stopping = [False]
    signal.signal(signal.SIGTERM, lambda *_: stopping.__setitem__(0, True))
    signal.signal(signal.SIGHUP, signal.SIG_IGN)
    Path(spec["log"]).parent.mkdir(parents=True, exist_ok=True)
    with open(spec["log"], "ab", buffering=0) as log:
        command = spec["run"]
        child = subprocess.Popen(["/bin/sh", "-c", command] if isinstance(command, str) else list(command),
                                 cwd=spec.get("cwd") or None, env={**os.environ, **(spec.get("env") or {})},
                                 stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        state(spec, STARTING, child, started=time.time())
        said = watch(spec, child, lifeline, stopping)
        teardown(child.pid, float(spec.get("grace") or GRACE))
        state(spec, said, child, last_exit=child.returncode if child.returncode is not None else 0)
    held.close()
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
