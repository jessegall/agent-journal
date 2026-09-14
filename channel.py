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
                "A comment (comment=\"N\"): `.journal/journal.py comments show N` and handle it. A decided suggestion "
                "(suggestion=\"N\"): `.journal/journal.py suggestions show N` and act on the decision. With auto mode off only messages "
                "arrive, and none of them is a reason to start on the to-do list.")

_OUT = threading.Lock()


def _send(obj: dict) -> None:
    with _OUT:
        sys.stdout.write(json.dumps(obj) + "\n")
        sys.stdout.flush()


#: how long before this server started its session's hook may last have run; an older entry is another session's
TRUST_SECONDS = 120


def _session() -> str | None:
    """This server's session: Claude Code started it, and the hook recorded which session that process runs.

    A process id is reused once its process is gone, so an entry left by an earlier session can name this
    server's parent. It is believed only when that session's hook has run since shortly before this server
    started.
    """
    import state
    got = state.get(ROOT, PIDS, {})
    stem = got.get(str(os.getppid())) if isinstance(got, dict) else None
    if not stem:
        return None
    seen = state.get(ROOT, "seen_at", 0, stem=stem) or 0
    return stem if seen >= STARTED[0] - TRUST_SECONDS else None


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
    # a session on no environment is woken for new messages only; answers and comments belong to whoever asked.
    # With auto mode off only a message wakes it: nothing else may set it working on its own
    live = tracks.live(ROOT)
    loose = _unbound_live(live)
    for env in [bound] if bound else tracks.choices(ROOT):
        if not _recipient(stem, env, live, loose):
            continue
        auto = todo.auto(ROOT, env)
        if auto and not idle:
            continue
        got.extend(_waiting(env, STARTED[0], answers=bool(bound) and auto))
    pushed = set(state.get(ROOT, PUSHED, [], stem=stem) or [])
    return [(key, params) for key, params in got if key not in pushed]


def _unbound_live(live: dict) -> dict[str, float]:
    """{stem: seconds since seen} for running sessions of this project's channels that are on no environment."""
    import state
    import tracks
    pids = state.get(ROOT, PIDS, {})
    now = time.time()
    out = {}
    for sid in set(pids.values()) if isinstance(pids, dict) else ():
        if sid in live or tracks.bound(ROOT, sid) or state.get(ROOT, "ended", None, stem=sid):
            continue
        seen = state.get(ROOT, "seen_at", 0, stem=sid) or 0
        if seen and now - seen <= 24 * 3600:
            out[sid] = now - seen
    return out


def _recipient(stem: str, env: str, live: dict, loose: dict) -> bool:
    """Is this session the one to wake for `env`? Another agent's environment is never its business.

    The session on `env` is woken, and of two there the one seen most recently. An environment no
    session holds wakes one session on no environment: the one seen most recently.
    """
    holders = {sid: v["age"] for sid, v in live.items() if v["track"] == env}
    if holders:
        mine = holders.get(stem)
        return mine is not None and all(age is None or mine <= age for sid, age in holders.items() if sid != stem)
    if stem in live:
        return True
    rivals = {sid: age for sid, age in loose.items() if sid != stem}
    mine = loose.get(stem)
    return not rivals or (mine is not None and all(mine <= age for age in rivals.values()))


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
    import suggestions
    # stamps are whole seconds, so something from the second the channel started still counts
    since = float(int(since))
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
    # keyed by when it was decided, so a changed decision wakes the session again
    for n, s in suggestions.untold(ROOT, env):
        decided = s.get("decided_at") or s.get("declined_at")
        if _epoch(decided) < since:
            continue
        status, title, todo_n = suggestions.status(s), _gist(s.get("title", "")), (s.get("became") or "").partition(":")[2]
        if status in ("accepted", "adjusted") and todo_n:
            change = " with a change of their own, which the to-do carries" if status == "adjusted" else ""
            content = (f"The user accepted suggestion {n} on {env}{change}: {title}. It is filed as to-do {todo_n}: "
                       f"pick it up with `.journal/journal.py todos start {todo_n}`, or leave it on the list if other work comes first.")
        elif status == "declined":
            why = f" Why: {_gist(s['declined'])}" if s.get("declined") and s["declined"] is not True else ""
            content = f"The user declined suggestion {n} on {env}: {title}. Do not suggest it again.{why}"
        else:
            content = f"The user decided suggestion {n} on {env}: {title}"
        got.append((f"{env}:suggestion:{n}:{decided or ''}", {"content": content, "meta": {"env": env, "suggestion": str(n)}}))
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
    _told(keys)


def _told(keys: list[str]) -> None:
    """What the channel pushed is told, in the same record the stop hook reads.

    PUSHED AND TOLD WERE TWO RECORDS. The channel kept its own list and never marked an item told,
    so every comment, answer and decided suggestion it pushed was held again at the next stop.
    """
    from datetime import datetime, timezone
    import comments
    import questions
    import suggestions
    stores = {"question": questions, "suggestion": suggestions, "comment": comments}
    at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    for key in keys:
        parts = key.split(":")
        if len(parts) >= 3 and parts[1] in stores and parts[2].isdigit():
            stores[parts[1]].mark_told(ROOT, parts[0], [int(parts[2])], at)


#: the poll code loaded from disk, and the newest modification time of the package it was loaded at
_LOADED: dict = {"stamp": None, "module": None}


def _code_stamp() -> float:
    return max((f.stat().st_mtime for f in (*ROOT.glob("*.py"), *ROOT.glob("*/*.py"))), default=0.0)


def _poller():
    """This module as it is on disk now: the server lives as long as the session, and an upgrade must reach it."""
    stamp = _code_stamp()
    if _LOADED["module"] is None or stamp != _LOADED["stamp"]:
        for name, mod in list(sys.modules.items()):
            path = getattr(mod, "__file__", None)
            if name != "__main__" and path and Path(path).resolve().is_relative_to(ROOT):
                del sys.modules[name]
        import channel as fresh
        fresh.STARTED[0] = STARTED[0]
        _LOADED.update(stamp=stamp, module=fresh)
    return _LOADED["module"]


def _watch() -> None:
    while True:
        time.sleep(POLL_SECONDS)
        try:
            poll = _poller()
            stem = poll._session()
            if not stem:
                continue
            got = poll.pending(stem)
            for _, params in got:
                _send({"jsonrpc": "2.0", "method": "notifications/claude/channel", "params": params})
            if got:
                poll._mark(stem, [key for key, _ in got])
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
