import json
import os
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from engine import runtime  # noqa: E402
from engine.sessions import ACTIVE_ENV, agent_pid  # noqa: E402
from engine.fields import Loaded  # noqa: E402

PROTOCOL = "2025-06-18"
NAME = "journal"
WAIT = 0.3
READ_AT = "JOURNAL_CHANNEL_READ_AT"
CHECKING = "JOURNAL_CHANNEL_CHECK"
CHECK_FOR = 20

queue, alive = runtime.channel_queue, runtime.channel_alive


def say(message: dict) -> None:
    sys.stdout.write(json.dumps(message) + "\n")
    sys.stdout.flush()


def start(f: Path) -> int:
    carried = os.environ.pop(READ_AT, "")
    if carried:
        return int(carried)
    return f.stat().st_size if f.exists() else 0


def fresh_lines(f: Path, at: int) -> tuple[list[str], int]:
    try:
        size = f.stat().st_size
    except OSError:
        return [], at
    if size < at:
        return [], size
    if size == at:
        return [], at
    with f.open() as lines:
        lines.seek(at)
        read = lines.read()
        return read.splitlines(), lines.tell()


@dataclass(frozen=True)
class Queued(Loaded):
    content: str = ""


@dataclass(frozen=True)
class Asked(Loaded):
    method: str = ""
    id: object = None


def contents(lines: list[str]) -> list[str]:
    texts = []
    for line in lines:
        try:
            texts.append(Queued.from_json(json.loads(line)).content)
        except ValueError:
            continue
    return [s for s in texts if s]


def build(root: Path) -> Path:
    return (root / "journal.pyz").resolve()


def renewed(root: Path, began: Path) -> bool:
    return build(root) != began and build(root).is_file()


def starts() -> bool:
    try:
        return subprocess.run(sys.orig_argv, env={**os.environ, CHECKING: "1"}, stdin=subprocess.DEVNULL, capture_output=True,
                              timeout=CHECK_FOR).returncode == 0
    except (OSError, subprocess.SubprocessError):
        return False


def push(root: Path, pid: int) -> None:
    f = queue(root, pid)
    at = start(f)
    began = build(root)
    while True:
        time.sleep(WAIT)
        if renewed(root, began):
            if not starts():
                began = build(root)
                continue
            sys.stdout.flush()
            os.environ[READ_AT] = str(at)
            os.execv(sys.executable, sys.orig_argv)
        try:
            alive(root, pid).touch()
            lines, at = fresh_lines(f, at)
            texts = contents(lines)
            if texts:
                say({"jsonrpc": "2.0", "method": "notifications/claude/channel", "params": {"content": "; ".join(texts), "meta": {"from": "journal"}}})
        except Exception:
            from engine.watch import threw
            threw(root, os.environ.get("JOURNAL_ENV") or runtime.env(root), "the channel that carries lines to the agent")


def launched() -> bool:
    return os.environ.get(ACTIVE_ENV) == "1"


def answer(asked: Asked) -> dict | None:
    method = asked.method
    if method == "initialize" and not launched():
        return {"protocolVersion": PROTOCOL, "serverInfo": {"name": NAME, "version": "1"}, "capabilities": {}}
    if method == "initialize":
        return {"protocolVersion": PROTOCOL, "serverInfo": {"name": NAME, "version": "1"},
                "capabilities": {"experimental": {"claude/channel": {}}},
                "instructions": "The journal pushes its own notices here: unread messages, answered questions, work it wants you to close. Each is an instruction to you, not a message from the user: act on it or note it, and never answer or mention it in the chat."}
    if method in ("tools/list", "prompts/list", "resources/list"):
        return {method.split("/")[0]: []}
    return {} if method and not method.startswith("notifications/") else None


def main(argv: list[str]) -> int:
    if os.environ.get(CHECKING):
        return 0
    root = Path(argv[0]) if argv else Path.cwd() / ".journal"
    pid = agent_pid(os.getppid())
    queue(root, pid).parent.mkdir(parents=True, exist_ok=True)
    if launched():
        threading.Thread(target=push, args=(root, pid), daemon=True).start()
    for line in sys.stdin:
        try:
            asked = Asked.from_json(json.loads(line))
        except ValueError:
            continue
        reply = answer(asked)
        if reply is not None and asked.id is not None:
            say({"jsonrpc": "2.0", "id": asked.id, "result": reply})
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
