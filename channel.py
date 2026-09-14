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

INSTRUCTIONS = ("Messages the user leaves for you in the journal viewer arrive as "
                '<channel source="journal" env="..." message="N">. Handle one the way a stop that says the user left '
                "messages is handled: `.journal/journal.py messages show N`, split it into parts, file what each became.")

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


def pending(stem: str) -> list[tuple[str, int, str]]:
    """(environment, message number, text) for each waiting message this session should be woken for now."""
    import inbox
    import state
    import todo
    import tracks
    env = tracks.bound(ROOT, stem)
    if not env:
        return []
    idle = state.get(ROOT, "last_event", "", stem=stem) == "Stop"
    if todo.auto(ROOT, env) and not idle:
        return []
    pushed = set(state.get(ROOT, PUSHED, [], stem=stem) or [])
    return [(env, n, m.get("text", "")) for n, m in inbox.unprocessed(ROOT, env) if f"{env}:{n}" not in pushed]


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
            for env, n, text in got:
                gist = " ".join(text.split())
                gist = gist if len(gist) <= 200 else gist[:199] + "…"
                _send({"jsonrpc": "2.0", "method": "notifications/claude/channel",
                       "params": {"content": f"The user left message {n} on {env}: {gist}",
                                  "meta": {"env": env, "message": str(n)}}})
            if got:
                _mark(stem, [f"{env}:{n}" for env, n, _ in got])
        except Exception as e:  # a bad poll must never end the server
            print(f"journal channel: {e}", file=sys.stderr)


def _version() -> str:
    try:
        return (ROOT / "VERSION").read_text().strip()
    except OSError:
        return "0"


def main() -> int:
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
