#!/usr/bin/env python3
"""The journal's channel: an MCP stdio server that tells an idle session the user left a message."""
from __future__ import annotations

import json
import os
import sys
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

NAME = "journal"
POLL_SECONDS = 3.0
PIDS = "session_pids"
PUSHED = "channel_pushed"
#: when this server started; nothing that happened before it is pushed
STARTED = [0.0]

INSTRUCTIONS = ("What the user does in the journal viewer while you are idle arrives as "
                '<channel source="journal" env="...">. A message (message="N"): handle it the way a stop that says the '
                "user left messages is handled: `.journal/journal.py messages show N`, split it into parts, file what each "
                "became. An answered question (question=\"N\"): `.journal/journal.py questions show N` and act on the answer. "
                "A comment (comment=\"N\"): `.journal/journal.py comments show N` and handle it.")

_OUT = threading.Lock()


def _send(obj: dict) -> None:
    with _OUT:
        sys.stdout.write(json.dumps(obj) + "\n")
        sys.stdout.flush()


def _session() -> str | None:
    """This server's session: Claude Code started it, and the hook recorded which session that process runs."""
    import state
    got = state.get(ROOT, PIDS, {})
    return got.get(str(os.getppid())) if isinstance(got, dict) else None


def _gist(text: str) -> str:
    gist = " ".join((text or "").split())
    return gist if len(gist) <= 200 else gist[:199] + "…"


def pending(stem: str) -> list[tuple[str, dict]]:
    """(key, notification params) for each thing this session should be woken for now and has not been."""
    import state
    import todo
    import tracks
    idle = state.get(ROOT, "last_event", "", stem=stem) == "Stop"
    bound = tracks.bound(ROOT, stem)
    got = []
    # a session on no environment is woken for new messages only; answers and comments belong to whoever asked
    for env in [bound] if bound else tracks.choices(ROOT):
        if not todo.auto(ROOT, env) or idle:
            got.extend(_waiting(env, STARTED[0], answers=bool(bound)))
    pushed = set(state.get(ROOT, PUSHED, [], stem=stem) or [])
    return [(key, params) for key, params in got if key not in pushed]


def _epoch(stamp) -> float:
    from datetime import datetime
    try:
        return datetime.fromisoformat(str(stamp).replace("Z", "+00:00")).timestamp()
    except (TypeError, ValueError):
        return 0.0


def _waiting(env: str, since: float = 0.0, answers: bool = True) -> list[tuple[str, dict]]:
    import comments
    import inbox
    import questions
    got = []
    for n, m in inbox.unprocessed(ROOT, env):
        if _epoch(m.get("at")) < since:
            continue
        got.append((f"{env}:{n}", {"content": f"The user left message {n} on {env}: {_gist(m.get('text', ''))}",
                                    "meta": {"env": env, "message": str(n)}}))
    if not answers:
        return got
    # keyed by when it was answered, so a changed answer wakes the session again
    for n, q in questions.untold(ROOT, env):
        if _epoch(q.get("answered_at")) < since:
            continue
        got.append((f"{env}:question:{n}:{q.get('answered_at') or ''}",
                    {"content": f"The user answered question {n} on {env}: {_gist(q.get('answer', ''))}",
                     "meta": {"env": env, "question": str(n)}}))
    for n, c in comments.untold(ROOT, env):
        if _epoch(c.get("at")) < since:
            continue
        got.append((f"{env}:comment:{n}",
                    {"content": f"The user commented on {comments.label(c.get('about', ''))} on {env}: {_gist(c.get('text', ''))}",
                     "meta": {"env": env, "comment": str(n)}}))
    return got


def _mark(stem: str, keys: list[str]) -> None:
    import state
    was = state.get(ROOT, PUSHED, [], stem=stem) or []
    state.put(ROOT, PUSHED, (was + keys)[-500:], stem=stem)


def _watch() -> None:
    while True:
        time.sleep(POLL_SECONDS)
        try:
            stem = _session()
            if not stem:
                continue
            got = pending(stem)
            for _, params in got:
                _send({"jsonrpc": "2.0", "method": "notifications/claude/channel", "params": params})
            if got:
                _mark(stem, [key for key, _ in got])
        except Exception as e:  # a bad poll must never end the server
            print(f"journal channel: {e}", file=sys.stderr)


def _version() -> str:
    try:
        return (ROOT / "VERSION").read_text().strip()
    except OSError:
        return "0"


def main() -> int:
    STARTED[0] = time.time()
    threading.Thread(target=_watch, daemon=True).start()
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except ValueError:
            continue
        method, rid = req.get("method"), req.get("id")
        if rid is None:
            continue  # a notification from the client, such as notifications/initialized
        if method == "initialize":
            want = (req.get("params") or {}).get("protocolVersion") or "2025-06-18"
            _send({"jsonrpc": "2.0", "id": rid, "result": {
                "protocolVersion": want,
                "capabilities": {"experimental": {"claude/channel": {}}},
                "serverInfo": {"name": NAME, "version": _version()},
                "instructions": INSTRUCTIONS}})
        elif method == "ping":
            _send({"jsonrpc": "2.0", "id": rid, "result": {}})
        else:
            _send({"jsonrpc": "2.0", "id": rid, "error": {"code": -32601, "message": f"no method {method}"}})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
