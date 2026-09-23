import json
import os
import sys
import threading
import time
from dataclasses import dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from engine import runtime  # noqa: E402
from engine.sessions import ACTIVE_ENV  # noqa: E402
from engine.fields import Loaded  # noqa: E402

PROTOCOL = "2025-06-18"
NAME = "journal"
WAIT = 0.3
READ_AT = "JOURNAL_CHANNEL_READ_AT"

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


def push(root: Path) -> None:
    f = queue(root)
    at = start(f)
    began = build(root)
    while True:
        time.sleep(WAIT)
        if renewed(root, began):
            sys.stdout.flush()
            os.environ[READ_AT] = str(at)
            os.execv(sys.executable, sys.orig_argv)
        try:
            alive(root).touch()
            lines, at = fresh_lines(f, at)
            texts = contents(lines)
            if texts:
                say({"jsonrpc": "2.0", "method": "notifications/claude/channel", "params": {"content": "; ".join(texts), "meta": {"from": "journal"}}})
        except Exception:
            from engine.watch import threw
            threw(root, runtime.env(root), "the channel that carries lines to the agent")


def launched() -> bool:
    return os.environ.get(ACTIVE_ENV) == "1"


def answer(asked: Asked) -> dict | None:
    method = asked.method
    if method == "initialize" and not launched():
        return {"protocolVersion": PROTOCOL, "serverInfo": {"name": NAME, "version": "1"}, "capabilities": {}}
    if method == "initialize":
        return {"protocolVersion": PROTOCOL, "serverInfo": {"name": NAME, "version": "1"},
                "capabilities": {"experimental": {"claude/channel": {}}},
                "instructions": "The journal pushes its own notices here: unread messages, answered questions, work it wants you to close. Read them as lines from the user's side of the journal and act on them."}
    if method in ("tools/list", "prompts/list", "resources/list"):
        return {method.split("/")[0]: []}
    return {} if method and not method.startswith("notifications/") else None


def main(argv: list[str]) -> int:
    root = Path(argv[0]) if argv else Path.cwd() / ".journal"
    queue(root).parent.mkdir(parents=True, exist_ok=True)
    if launched():
        threading.Thread(target=push, args=(root,), daemon=True).start()
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
