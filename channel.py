import json
import sys
import threading
import time
from pathlib import Path

PROTOCOL = "2025-06-18"
NAME = "journal"
WAIT = 0.3
BETWEEN = 5.0
FLOOD = 20


def queue(root: Path) -> Path:
    return root / "runtime" / "channel.jsonl"


def alive(root: Path) -> Path:
    return root / "runtime" / "channel.on"


def say(message: dict) -> None:
    sys.stdout.write(json.dumps(message) + "\n")
    sys.stdout.flush()


def fresh_lines(f: Path, at: int | None) -> tuple[list[str], int | None]:
    try:
        size = f.stat().st_size
    except OSError:
        return [], at
    if at is None or size < at:
        return [], size
    if size == at:
        return [], at
    with f.open() as lines:
        lines.seek(at)
        read = lines.read()
        return read.splitlines(), lines.tell()


def contents(lines: list[str]) -> list[str]:
    said = []
    for line in lines:
        try:
            said.append(str(json.loads(line).get("content") or ""))
        except ValueError:
            continue
    return [s for s in said if s]


def push(root: Path) -> None:
    f = queue(root)
    at = None
    held: list[str] = []
    last = 0.0
    while True:
        time.sleep(WAIT)
        alive(root).touch()
        lines, at = fresh_lines(f, at)
        held.extend(contents(lines))
        if not held or time.time() - last < BETWEEN:
            continue
        if len(held) > FLOOD:
            said = f"the journal held back {len(held)} lines at once and dropped them - that many is a fault, not news"
        else:
            said = "; ".join(dict.fromkeys(held))
        held, last = [], time.time()
        say({"jsonrpc": "2.0", "method": "notifications/claude/channel", "params": {"content": said, "meta": {"from": "journal"}}})


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
