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
                "(suggestion=\"N\"): `.journal/journal.py suggestions show N` and act on the decision. A newer journal "
                "(update=\"X\"): run `.journal/journal.py update` once nothing is mid-flight. A plan approved or continued "
                "(plan=\"N\"): `.journal/journal.py next` and start the current phase. Anything else the user did in the viewer (did=\"<what>\"): the line says what they did and to what — read that thing and act on it. They arrive only while you are idle, "
                "whatever auto mode is; with auto mode off handle that one item and do not start on the to-do list.")

#: runtime key shared with the hook: the newest version this session's agent was told about
UPDATE_TOLD = "update_told"

AUTO_OFF_NOTE = " Auto mode is off: handle this only, and do not start on the to-do list."

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
    # the channel is the fallback for an idle session: a working one hears everything from its own hooks
    live = tracks.live(ROOT)
    loose = _unbound_live(live)
    for env in [bound] if bound else tracks.choices(ROOT):
        if not _recipient(stem, env, live, loose):
            continue
        if not idle:
            continue
        auto = todo.auto(ROOT)
        for key, params in _waiting(env, STARTED[0], answers=bool(bound)):
            quiet = auto or "message" in params["meta"]
            got.append((key, params if quiet else {**params, "content": params["content"] + AUTO_OFF_NOTE}))
    if idle:
        got.extend(_update(stem))
        if bound:
            got.extend(_idle_nudge(stem, bound))
    pushed = set(state.get(ROOT, PUSHED, [], stem=stem) or [])
    return [(key, params) for key, params in got if key not in pushed]


def _idle_nudge(stem: str, env: str) -> list[tuple[str, dict]]:
    """Auto is on, the agent has stopped, and work is ready: send it back to the list.

    This is the one thing nothing else notices. A session's own hooks fire when it ACTS, so a
    session that stopped hears nothing from them; and the channel otherwise speaks only when the
    user does. A loop or a cron usually covers it, and when one was never set, nothing did.

    It fires only while `todo.ready` has something — not merely rows on the list — so an empty
    or wholly blocked list is never nagged, and never while auto is off, because handing work out
    is the user's call then. The key carries the interval it fired in: PUSHED dedupes by key, and
    a fixed one would be sent once and never again.
    """
    import settings
    import state
    import todo
    if not todo.auto(ROOT):
        return []
    minutes = settings.load(ROOT)[0].get("idle_nudge_minutes", 0) or 0
    if minutes <= 0:
        return []
    seen = state.get(ROOT, "seen_at", 0, stem=stem) or 0
    idle_for = time.time() - seen
    if not seen or idle_for < minutes * 60:
        return []
    rows = todo.ready(ROOT, env)
    if not rows:
        return []
    row = rows[0]
    return [(f"{env}:idle:{int(idle_for // (minutes * 60))}",
             {"content": f"Nothing has moved on {env} for {int(idle_for // 60)} minutes and auto mode is on. "
                         f"{len(rows)} to-do(s) are ready — the next is {row['n']}, {row.get('title', '')}. "
                         f"`.journal/journal.py next`, then pick it up and carry on.",
              "meta": {"env": env, "did": "idle"}})]


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
        files = [f.get("name", "") for f in (m.get("files") or []) if not f.get("removed")]
        carried = f" (with {', '.join(files)})" if files else ""
        got.append((f"{env}:{n}", {"content": f"The user left message {n} on {env}: {_gist(m.get('text', ''))}{carried}",
                                    "meta": {"env": env, "message": str(n)}}))
    if not answers:
        return got
    got.extend(_plan_events(env, since))
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
    got.extend(_did(env, since))
    for n, c in comments.untold(ROOT, env):
        if _epoch(c.get("at")) < since:
            continue
        got.append((f"{env}:comment:{n}",
                    {"content": f"The user commented on {comments.label(c.get('about', ''))} on {env}: {_gist(c.get('text', ''))}",
                     "meta": {"env": env, "comment": str(n)}}))
    return got


#: kinds with a handler of their own above: they say more than a log line can, and mark themselves told
_OWN_HANDLER = {"message", "question", "suggestion", "comment", "plan"}


def _did(env: str, since: float) -> list[tuple[str, dict]]:
    """Everything ELSE the user did in the viewer, from the one record every web write already leaves.

    ONE FUNNEL, SO A NEW VERB NEEDS NO NEW CASE HERE. `commandlog.record_web` is called for every write
    the viewer makes, from one place in `serve.py`, and stamps it `by: "You"` — so the list of things
    the user can do is already written down, in the same words Activity shows them. Reading that is
    what makes editing a to-do, changing a setting, accepting something, and whatever verb is added
    next all reach an idle agent, instead of each one being remembered here one at a time.
    """
    import commandlog
    got = []
    for e in commandlog.entries(ROOT, env):
        if not isinstance(e, dict) or e.get("by") != "You" or _epoch(e.get("at")) < since:
            continue
        if e.get("kind") in _OWN_HANDLER:
            continue
        what = " ".join(str(e.get("text") or "").split())
        if not what:
            continue
        detail = f" ({e['detail']})" if e.get("detail") else ""
        got.append((f"{env}:did:{e.get('at')}:{what}:{e.get('n') or ''}",
                    {"content": f"The user did this on {env}: {what}{detail}. Read what it changed and act on it.",
                     "meta": {"env": env, "did": what}}))
    return got


def _plan_events(env: str, since: float) -> list[tuple[str, dict]]:
    """A plan the user approved, or continued past a checkpoint, in the viewer: the agent has work to start.

    AN APPROVAL IS NOT OLD NEWS UNTIL SOMEBODY ACTS ON IT. Every other source here has a record of
    what it has already told, and `since` only keeps a fresh channel process from replaying history.
    A plan has no such record, so an approval stamped before this process started was dropped and
    never reached anyone — and a channel restarts far more often than a plan is approved. What makes
    one of these events stale is the work STARTING, not the clock: so the latest of them also fires
    while the current phase is sitting there with nothing picked up, and PUSHED keeps it to once a
    session.
    """
    import plans
    import todo
    auto = todo.auto(ROOT)
    open_rows = {t["n"]: t for t in todo.open_items(ROOT, env)}
    got = []
    for n, plan in enumerate(plans._all(ROOT, env), 1):
        rows = plans.phases(ROOT, plan, env)
        now = plans.current(plan, rows)
        ahead = f" Phase {now['p']}, {now['title']}, is current: start its to-dos with `.journal/journal.py next`." if now else ""
        title = _gist(plan.get("title", ""))
        events = []
        at = plan.get("activated_at") or ""
        if at and plan.get("activated_by") == "web":
            events.append((at, f"{env}:plan:{n}:approved:{at}",
                           {"content": f"The user approved plan {n} on {env}: {title}.{ahead}",
                            "meta": {"env": env, "plan": str(n)}}))
        for p, ph in enumerate(plan.get("phases") or [], 1):
            at = ph.get("continued_at") or ""
            if at:
                events.append((at, f"{env}:plan:{n}:continued:{p}:{at}",
                               {"content": f"The user continued plan {n} on {env} past phase {p}, {_gist(ph.get('title', ''))}.{ahead}",
                                "meta": {"env": env, "plan": str(n)}}))
        # the whole plan is waiting on the agent when its current phase has rows and none has been picked up
        waiting = bool(now and now["todos"] and not plans.checkpoint(plan, rows, auto)
                       and not any((open_rows.get(r["n"]) or {}).get("started") for r in now["todos"]))
        # only the LATEST event stands in for that wait: a plan past three checkpoints would else announce all four
        latest = max(events)[1] if waiting and events else ""
        got.extend((key, payload) for at, key, payload in events if _epoch(at) >= since or key == latest)
    return got


def _update(stem: str) -> list[tuple[str, dict]]:
    """A newer journal upstream, for an idle session not yet told about that version."""
    import settings
    import state
    import update
    if "update_check" in settings.load(ROOT)[0]["silenced"]:
        return []
    note, latest = update.available(ROOT)
    if not note or state.get(ROOT, UPDATE_TOLD, "", stem=stem) == latest:
        return []
    return [(f"update:{latest}", {"content": f"{note} Run it now if nothing is mid-flight: `.journal/journal.py update`.",
                                  "meta": {"update": latest}})]


def _mark(stem: str, keys: list[str]) -> None:
    import state
    was = state.get(ROOT, PUSHED, [], stem=stem) or []
    state.put(ROOT, PUSHED, (was + keys)[-500:], stem=stem)
    for key in keys:
        if key.startswith("update:"):
            state.put(ROOT, UPDATE_TOLD, key.partition(":")[2], stem=stem)
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
