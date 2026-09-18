from __future__ import annotations

from pathlib import Path

#: WHAT THE VIEWER LEFT FOR A SESSION, AS THE LINES IT IS TOLD. This was the channel server's half
#: that decided what to say; the launcher outside the agent asks it the same question and types
#: the answer in. ROOT is the .journal this process serves.
ROOT = Path(__file__).resolve().parent
UPDATE_TOLD = "update_told"
AUTO_OFF_NOTE = " Auto mode is off: handle this only, and do not start on the to-do list."
#: WHAT IS TOLD RIGHT AWAY, mid-turn, and what waits for the agent to be idle
REACH_NOW = ("message", "question", "comment", "reaction")
_OWN_HANDLER = {"message", "question", "suggestion", "comment", "plan"}

def _read_it(said: str, command: str) -> str:
    return f"{said} Read it before you act on it: `.journal/journal.py {command}`."



def _reach_now() -> set:
    import settings
    got = settings.load(ROOT)[0].get("channel_reach_now")
    return set(got if isinstance(got, (list, tuple, set)) else REACH_NOW)



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
        edited = m.get("edited_at") or ""
        # AN EDIT IS ITS OWN EVENT. The key carries when it was edited, so a message the agent has
        # already been told about is told again when its words change — and said as a CHANGE, because
        # anything already filed from the old words may need correcting.
        if edited and _epoch(edited) >= since:
            got.append((f"{env}:{n}:edited:{edited}",
                        {"content": inbox.say("edit_note", n=n, env=env),
                         "meta": {"env": env, "message": str(n)}}))
            continue
        if _epoch(m.get("at")) < since:
            continue
        got.append((f"{env}:{n}", {"content": _read_it(f"The user left message {n} on {env}.",
                                                       f"messages show {n}"),
                                    "meta": {"env": env, "message": str(n)}}))
    if not answers:
        return got
    # no `since` here: the reply's own told_at is the gate, so a turn taken before this process
    # started is still owed to somebody rather than lost with the process that missed it
    for n, i, r in inbox.untold_replies(ROOT, env):
        got.append((f"{env}:reply:{n}:{i}",
                    {"content": _read_it(f"The user answered under message {n} on {env}.",
                                         f"messages show {n}"),
                     "meta": {"env": env, "message": str(n)}}))
    # A FACE THE USER LEFT IS AN ANSWER. A thumbs up on "I'll do this next" is a yes, and one nobody
    # hears is one nobody gave — so it is told once, the way a reply under a message is.
    import reactions
    for turn, i, r in reactions.untold(ROOT, env):
        got.append((f"{env}:react:{turn}:{i}",
                    {"content": f"The user reacted {r.get('face') or ''} to {turn.replace(':', ' ')} on {env}. "
                                f"Read it as what it is — a yes, a thanks, a laugh — and carry on; nothing needs filing.",
                     "meta": {"env": env, "reaction": turn}}))
    got.extend(_plan_events(env, since))
    # keyed by when it was answered, so a changed answer wakes the session again
    for n, q in questions.untold(ROOT, env):
        if _epoch(q.get("answered_at")) < since:
            continue
        # THE KEY COUNTS THE ANSWERS, not just when the last one landed. Stamps are whole seconds, so
        # two answers in one second produced the same key and the second one was deduped away —
        # the user changed their mind and nobody was told. `earlier_answers` grows with every
        # re-answer, which is what makes each answer its own event.
        got.append((f"{env}:question:{n}:{q.get('answered_at') or ''}:{len(q.get('earlier_answers') or [])}",
                    {"content": _read_it(f"The user answered question {n} on {env}.",
                                         f"questions show {n}"),
                     "meta": {"env": env, "question": str(n)}}))
    # keyed by when it was decided, so a changed decision wakes the session again
    for n, s in suggestions.untold(ROOT, env):
        decided = s.get("decided_at") or s.get("declined_at")
        if _epoch(decided) < since:
            continue
        status, todo_n = suggestions.status(s), (s.get("became") or "").partition(":")[2]
        if status in ("accepted", "adjusted") and todo_n:
            change = " with a change of their own, which the to-do carries" if status == "adjusted" else ""
            content = (f"The user accepted suggestion {n} on {env}{change}. It is filed as to-do {todo_n}: "
                       f"pick it up with `.journal/journal.py todos start {todo_n}`, or leave it on the list if other work comes first.")
        elif status == "declined":
            content = f"The user declined suggestion {n} on {env}. Do not suggest it again; read why before you do anything near it."
        else:
            content = f"The user decided suggestion {n} on {env}."
        got.append((f"{env}:suggestion:{n}:{decided or ''}", {"content": content, "meta": {"env": env, "suggestion": str(n)}}))
    got.extend(_did(env, since))
    for n, c in comments.untold(ROOT, env):
        if _epoch(c.get("at")) < since:
            continue
        got.append((f"{env}:comment:{n}",
                    {"content": _read_it(f"The user commented on {comments.label(c.get('about', ''))} on {env}.",
                                         f"comments show {n}"),
                     "meta": {"env": env, "comment": str(n)}}))
    return got


#: kinds with a handler of their own above: they say more than a log line can, and mark themselves told

def _did(env: str, since: float) -> list[tuple[str, dict]]:
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
    import plans
    import todo
    auto = todo.auto(ROOT)
    open_rows = {t["n"]: t for t in todo.open_items(ROOT, env)}
    got = []
    for n, plan in enumerate(plans._all(ROOT, env), 1):
        rows = plans.phases(ROOT, plan, env)
        now = plans.current(plan, rows)
        ahead = f" Phase {now['p']} is current: start its to-dos with `.journal/journal.py next`." if now else ""
        events = []
        at = plan.get("activated_at") or ""
        if at and plan.get("activated_by") == "web":
            events.append((at, f"{env}:plan:{n}:approved:{at}",
                           {"content": f"The user approved plan {n} on {env}.{ahead}",
                            "meta": {"env": env, "plan": str(n)}}))
        for p, ph in enumerate(plan.get("phases") or [], 1):
            at = ph.get("continued_at") or ""
            if at:
                events.append((at, f"{env}:plan:{n}:continued:{p}:{at}",
                               {"content": f"The user continued plan {n} on {env} past phase {p}.{ahead}",
                                "meta": {"env": env, "plan": str(n)}}))
        # the whole plan is waiting on the agent when its current phase has rows and none has been picked up
        waiting = bool(now and now["todos"] and not plans.checkpoint(plan, rows, auto)
                       and not any((open_rows.get(r["n"]) or {}).get("started") for r in now["todos"]))
        # only the LATEST event stands in for that wait: a plan past three checkpoints would else announce all four
        latest = max(events)[1] if waiting and events else ""
        got.extend((key, payload) for at, key, payload in events if _epoch(at) >= since or key == latest)
    return got



def _told(keys: list[str]) -> None:
    from datetime import datetime, timezone
    import comments
    import inbox
    import questions
    import suggestions
    stores = {"question": questions, "suggestion": suggestions, "comment": comments}
    at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    for key in keys:
        parts = key.split(":")
        if len(parts) >= 3 and parts[1] in stores and parts[2].isdigit():
            stores[parts[1]].mark_told(ROOT, parts[0], [int(parts[2])], at)
        # a reply is told per TURN, so the mark goes on the reply itself and not on the message
        elif len(parts) >= 4 and parts[1] == "reply" and parts[2].isdigit() and parts[3].isdigit():
            inbox.mark_replies_told(ROOT, parts[0], [(int(parts[2]), int(parts[3]))], at)
        # a reaction's key carries the turn it is on, which has colons of its own: the index is last
        elif len(parts) >= 4 and parts[1] == "react" and parts[-1].isdigit():
            import reactions
            reactions.mark_told(ROOT, parts[0], [(":".join(parts[2:-1]), int(parts[-1]))], at)


#: the poll code loaded from disk, and the newest modification time of the package it was loaded at
