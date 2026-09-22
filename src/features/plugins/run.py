import json
import os
import signal
import subprocess
from pathlib import Path

CAP = 64 * 1024
SECONDS = 10.0
LONGEST = 60.0
SHOWN = 400


def words(command) -> str:
    return command if isinstance(command, str) else " ".join(command)


def call(command, cwd: Path, env: dict, payload: dict, seconds: float = SECONDS) -> tuple[bool, dict | str]:
    shell = isinstance(command, str)
    seconds = max(0.1, min(float(seconds), LONGEST))
    try:
        child = subprocess.Popen(["/bin/sh", "-c", command] if shell else list(command), cwd=cwd, env=env,
                                 stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
    except (OSError, ValueError) as error:
        return False, str(error)
    try:
        out, err = child.communicate(json.dumps(payload), timeout=seconds)
    except subprocess.TimeoutExpired:
        stop(child)
        return False, f"{words(command)} was still running after {seconds:g}s"
    if child.returncode:
        return False, (err.strip() or out.strip() or f"{words(command)} exited {child.returncode}")[-SHOWN:]
    return read(out[:CAP])


def read(out: str) -> tuple[bool, dict | str]:
    if not out.strip():
        return True, {}
    try:
        reply = json.loads(out)
    except ValueError:
        return False, f"the reply was not JSON: {out.strip()[:SHOWN]}"
    if reply == []:
        return True, {}
    if not isinstance(reply, dict):
        return False, "the reply was not an object"
    return True, reply


def stop(child) -> None:
    for sign in (signal.SIGTERM, signal.SIGKILL):
        try:
            os.killpg(child.pid, sign)
        except (OSError, ProcessLookupError):
            break
        try:
            child.communicate(timeout=2)
            return
        except subprocess.TimeoutExpired:
            continue
