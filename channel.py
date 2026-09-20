import json
import sys
import threading
import time
from pathlib import Path

PROTOCOL = "2025-06-18"
NAME = "journal"
WAIT = 0.3


def queue(root: Path) -> Path:
    return root / "runtime" / "channel.jsonl"


def alive(root: Path) -> Path:
    return root / "runtime" / "channel.on"


def say(message: dict) -> None:
    sys.stdout.write(json.dumps(message) + "\n")
    sys.stdout.flush()


def push(root: Path) -> None:
    f = queue(root)
    at = f.stat().st_size if f.is_file() else 0
    while True:
        time.sleep(WAIT)
        alive(root).touch()
        try:
            if not f.is_file() or f.stat().st_size <= at:
                at = min(at, f.stat().st_size) if f.is_file() else 0
                continue
            with f.open() as lines:
                lines.seek(at)
                fresh = lines.read()
                at = lines.tell()
        except OSError:
            continue
        for line in fresh.splitlines():
            try:
                told = json.loads(line)
            except ValueError:
                continue
            say({"jsonrpc": "2.0", "method": "notifications/claude/channel",
                 "params": {"content": str(told.get("content") or ""), "meta": told.get("meta") or {}}})


def answer(asked: dict) -> dict | None:
    method = asked.get("method")
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
