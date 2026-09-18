from __future__ import annotations

import time
from pathlib import Path

import state
from templates import render as fill

SEEN = "agent_seen"      # {track: {agent: unix seconds}} — the heartbeat, in the record
PARENT = "agent_parent"  # {track: {agent: the dispatching session}} — who sent it
CWD = "agent_cwd"        # {track: {agent: the directory it works in}} — a worktree is another branch
DONE = "agents_done"  # {track: {agent: when its SubagentStop came}}
#: a subagent with no tool call for this long is idle, not working
ACTIVE_MINUTES = 2


def dir_of(root: Path, track: str, agent: str) -> Path:
    return state.agent_dir(root, track, agent)


def seen(root: Path) -> dict:
    got = state.get(root, SEEN, {})
    return got if isinstance(got, dict) else {}


def touch(root: Path, track: str, agent: str) -> None:
    agent = state.slug(agent)
    if not agent:
        return
    with state.locked(root):
        log = seen(root)
        log.setdefault(track, {})[agent] = int(time.time())
        state.put(root, SEEN, log)


MESSAGES = {
    "age_never": "never written",
    "age_now": "active just now",
    "age_minute": "last wrote 1m ago",
    "age_minutes": "last wrote {n}m ago",
    "age_hours": "last wrote {n}h ago",
    "done_now": "finished just now",
    "done_minute": "finished 1m ago",
    "done_minutes": "finished {n}m ago",
    "done_hours": "finished {n}h ago",
    "called": ' — "{called}"',
    "env_one": '--env="{env}"',
    "env_unknown": '--env="<the environment your dispatch named>"',
    "head_one": "YOU ARE AGENT `{agent}`{called} WORKING UNDER `{env}`, and you have your own ledger.",
    "head_many": "YOU ARE AGENT `{agent}`{called}, and you have your own ledger under the environment your dispatch "
                 "lent you. This session has lent {n}, so only your own prompt says which is yours — use that name and "
                 "no other.",
    "briefing": "{head}\n  Put both flags on every journal command you run:\n"
                '    .journal/journal.py {env} --as="{agent}" work start "<what you are doing>"\n'
                '    .journal/journal.py {env} --as="{agent}" todos          what was assigned to you\n'
                '    .journal/journal.py {env} --as="{agent}" todos report <n> "<how>"\n'
                "  Your work is yours: no other agent can open or close it. The environment's\n"
                "  PINS and REMINDERS are the parent's — read them, and report what you find\n"
                "  rather than writing either. You may REPORT a to-do complete; only the parent\n"
                "  closes one.",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def heartbeat(root: Path, track: str, agent: str, parent: str, every: float = 30.0, cwd: str = "") -> None:
    agent = state.slug(agent)
    if not agent:
        return
    last = (seen(root).get(track) or {}).get(agent)
    if last and time.time() - float(last) < every:
        return
    touch(root, track, agent)
    with state.locked(root):
        got = state.get(root, PARENT, {})
        got = got if isinstance(got, dict) else {}
        got.setdefault(track, {})[agent] = parent
        state.put(root, PARENT, got)
        if cwd:
            where = state.get(root, CWD, {})
            where = where if isinstance(where, dict) else {}
            where.setdefault(track, {})[agent] = cwd
            state.put(root, CWD, where)


def working_dir(root: Path, track: str, agent: str) -> str:
    got = state.get(root, CWD, {})
    return ((got.get(track) or {}).get(state.slug(agent)) or "") if isinstance(got, dict) else ""


def finish(root: Path, track: str, agent: str) -> None:
    agent = state.slug(agent)
    if not agent:
        return
    with state.locked(root):
        got = state.get(root, DONE, {})
        got = got if isinstance(got, dict) else {}
        got.setdefault(track, {})[agent] = int(time.time())
        state.put(root, DONE, got)


def finished(root: Path, track: str, agent: str) -> bool:
    got = state.get(root, DONE, {})
    done = ((got if isinstance(got, dict) else {}).get(track) or {}).get(state.slug(agent))
    last = (seen(root).get(track) or {}).get(state.slug(agent))
    return bool(done) and (not last or float(done) >= float(last))


def working(root: Path, track: str, agent: str) -> bool:
    return not finished(root, track, agent) and active(root, track, agent, ACTIVE_MINUTES)


def defined_model(project: Path, kind: str, home: Path | None = None) -> str:
    if not kind:
        return ""
    for base in (project / ".claude" / "agents", (home or Path.home()) / ".claude" / "agents"):
        for f in sorted(base.glob("*.md")) if base.is_dir() else []:
            head = f.read_text(errors="replace").split("\n---", 1)[0]
            fields = {k.strip(): v.strip() for k, _, v in (line.partition(":") for line in head.splitlines()[1:])}
            if fields.get("name") == kind and fields.get("model"):
                return fields["model"]
    return ""


def parent_of(root: Path, track: str, agent: str) -> str:
    got = state.get(root, PARENT, {})
    return ((got if isinstance(got, dict) else {}).get(track) or {}).get(state.slug(agent), "")


def active(root: Path, track: str, agent: str, stale_minutes: float) -> bool:
    got = (seen(root).get(track) or {}).get(state.slug(agent))
    return bool(got) and (time.time() - float(got)) <= stale_minutes * 60


def live(root: Path, track: str, stale_minutes: float) -> list[str]:
    return sorted(a for a, t in (seen(root).get(track) or {}).items()
                  if (time.time() - float(t)) <= stale_minutes * 60)


def age(root: Path, track: str, agent: str) -> str:
    got = (seen(root).get(track) or {}).get(state.slug(agent))
    if not got:
        return say("age_never")
    secs = time.time() - float(got)
    if secs < 60:
        return say("age_now")
    if secs < 3600:
        return say("age_minute") if secs < 120 else say("age_minutes", n=int(secs // 60))
    return say("age_hours", n=f"{secs / 3600:.1f}")


def done_at(root: Path, track: str, agent: str) -> float:
    got = state.get(root, DONE, {})
    when = ((got if isinstance(got, dict) else {}).get(track) or {}).get(state.slug(agent))
    return float(when) if when else 0.0


def done_age(root: Path, track: str, agent: str) -> str:
    when = done_at(root, track, agent)
    if not when:
        return ""
    secs = time.time() - when
    if secs < 60:
        return say("done_now")
    if secs < 3600:
        return say("done_minute") if secs < 120 else say("done_minutes", n=int(secs // 60))
    return say("done_hours", n=f"{secs / 3600:.1f}")


def described(project: Path, parent: str, agent: str) -> str:
    import json
    import transcript
    if not (parent and agent):
        return ""
    meta = (transcript.project_dir(project) / parent / "subagents" / f"agent-{agent}.meta.json")
    try:
        got = json.loads(meta.read_text())
    except (OSError, ValueError):
        return ""
    return " ".join(str(got.get("description") or "").split())[:60]


def briefing(lent: list, agent: str, called: str = "") -> str:
    one = lent[0] if len(lent) == 1 else ""
    named = say("called", called=called) if called else ""
    env = say("env_one", env=one) if one else say("env_unknown")
    head = (say("head_one", agent=agent, called=named, env=one) if one
            else say("head_many", agent=agent, called=named, n=len(lent)))
    return say("briefing", head=head, env=env, agent=agent)
