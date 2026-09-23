import json
import os
import sys
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from engine import runtime  # noqa: E402
from engine.sessions import ACTIVE_ENV  # noqa: E402
from engine.fields import text_of  # noqa: E402

PROTOCOL = "2025-06-18"
NAME = "journal"
WAIT = 0.3

queue, alive = runtime.channel_queue, runtime.channel_alive


def say(message: dict) -> None:
    sys.stdout.write(json.dumps(message) + "\n")
    sys.stdout.flush()


def start(f: Path) -> int:
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


def contents(lines: list[str]) -> list[str]:
    texts = []
    for line in lines:
        try:
            texts.append(text_of(json.loads(line), "content"))
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


def answer(asked: dict) -> dict | None:
    method = text_of(asked, "method")
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
            asked = json.loads(line)
        except ValueError:
            continue
        reply = answer(asked)
        if reply is not None and asked.get("id") is not None:
            say({"jsonrpc": "2.0", "id": asked["id"], "result": reply})
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
