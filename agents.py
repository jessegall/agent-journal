"""A subagent's own ledger, inside the environment it was lent.

TWO SUBAGENTS IN ONE ENVIRONMENT SHARED EVERYTHING, and that was measured before this
existed: agent B ran `work end` with agent A's words and closed A's work. Neither had done
anything wrong — the record simply could not tell them apart, because every write from
either carried the DISPATCHING SESSION's id. The same identity collision that makes the
grant necessary makes one ledger per agent necessary.

SO THE LEDGER IS SCOPED AND NOTHING ELSE IS. `environments/<lent>/agents/<id>/work.json` is
the subagent's; the environment's pins, reminders and to-dos remain the parent's. A subagent
READS the pins and cannot write one — findings go up in its report and the parent decides
what becomes a claim. That one-directional inheritance is deliberate: the child cannot write
what it inherits, so there is exactly one answer to "which pin applies" and it is the
parent's. What made hierarchy unreadable elsewhere — ESLint's dropped cascade, the CSS
cascade — was inheritance WITH override, two places to look and a rule deciding which wins.
There is no override here because there is no write path.

AND IT LEARNS ITS OWN NAME FROM THE ONE THING THAT KNOWS IT. A subagent cannot identify
itself: nothing in its process carries `agent_id`, and two concurrent subagents have
byte-identical environments. The HOOK sees `agent_id` on every tool call, so on the first
one it creates the sub-environment, stamps the heartbeat, and tells that subagent its own
name and the flags to use. The name still travels on the command line — the CLI genuinely
cannot see `agent_id` — but nobody has to remember to put it there, and `--as=` is checked
against the payload rather than trusted, or one subagent could claim another's ledger.
"""
from __future__ import annotations

import time
from pathlib import Path

import state
from templates import render as fill

SEEN = "agent_seen"      # {track: {agent: unix seconds}} — the heartbeat, in the record
PARENT = "agent_parent"  # {track: {agent: the dispatching session}} — who sent it
DONE = "agents_done"  # {track: {agent: when its SubagentStop came}}
#: a subagent with no tool call for this long is idle, not working
ACTIVE_MINUTES = 2


def dir_of(root: Path, track: str, agent: str) -> Path:
    return state.agent_dir(root, track, agent)


def seen(root: Path) -> dict:
    got = state.get(root, SEEN, {})
    return got if isinstance(got, dict) else {}


def touch(root: Path, track: str, agent: str) -> None:
    """Mark this agent alive, now. Every write of its own stamps this.

    ACTIVE IS OBSERVED, NEVER DECLARED. Nothing can tell us a subagent died — it has no
    session to end and no stop the journal hears — so a hold that waited for someone to
    release it would wedge a to-do the first time a dispatch crashed. A heartbeat lapses on
    its own, which is the same answer this package already gives for a terminal closed
    without a SessionEnd.
    """
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


def heartbeat(root: Path, track: str, agent: str, parent: str, every: float = 30.0) -> None:
    """Mark a subagent alive from its tool calls, and who dispatched it; at most once per `every` seconds."""
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


def finish(root: Path, track: str, agent: str) -> None:
    """The subagent has stopped: it is finished until it makes another tool call."""
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
    """The model a custom agent's own definition sets, matched by its `name:`, in the project's or the user's agents; else ""."""
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
    """Has this agent written anything recently enough to still hold what it holds?"""
    got = (seen(root).get(track) or {}).get(state.slug(agent))
    return bool(got) and (time.time() - float(got)) <= stale_minutes * 60


def live(root: Path, track: str, stale_minutes: float) -> list[str]:
    """Every agent on this environment still counted as working."""
    return sorted(a for a, t in (seen(root).get(track) or {}).items()
                  if (time.time() - float(t)) <= stale_minutes * 60)


def age(root: Path, track: str, agent: str) -> str:
    """How long since this agent last wrote, in words — for a listing to read."""
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
    """When this agent's SubagentStop came, in unix seconds — 0.0 if it never did."""
    got = state.get(root, DONE, {})
    when = ((got if isinstance(got, dict) else {}).get(track) or {}).get(state.slug(agent))
    return float(when) if when else 0.0


def done_age(root: Path, track: str, agent: str) -> str:
    """How long since this agent finished, in words; "" while it is still running."""
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
    """The DISPATCHER'S OWN WORDS for this agent, if the harness kept them, else "".

    THE READABLE NAME WAS ALREADY THERE AND NOBODY HAD LOOKED. The open question was how a
    subagent could come by a name a person can read — `agent_id` being a hex string, and the
    obvious alternative being to let the agent invent one, which then has to be checked for
    collisions against every other live agent and bound back to the real id anyway.

    None of that is needed. Claude Code writes each subagent's transcript to
    `<project>/<parent session>/subagents/agent-<id>.jsonl` and a `.meta.json` beside it
    holding the `description` the DISPATCHER typed — "Flag and command tables", "Close the
    leaks past fmt.say". It is already unique per dispatch, already written by the one party
    with the context to name the work, and already on disk before the agent's first tool
    call. A name nobody has to invent cannot collide with one somebody else invented.

    IT IS A LABEL ON A VERIFIED IDENTITY, NEVER A SUBSTITUTE FOR ONE. Everything the gate
    decides still turns on `agent_id` from the payload; this only makes the ledger readable
    by a person, which is the whole reason the ledger is separate.

    ABSENT IS NORMAL. Another harness, an older one, a payload with no parent — all of them
    give "" and the caller falls back to the id, which always exists.
    """
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
    """What the hook says to a subagent on its first tool call: its own name, and the flags.

    IT IS TOLD, RATHER THAN ASKED TO REMEMBER. The dispatcher pastes the grant's sentence
    into the prompt and that names the environment; this names the AGENT, which the
    dispatcher could not have known when it wrote the prompt. Both halves have to reach the
    command line, and only one of them can come from a human.

    AND IT NEVER GUESSES WHICH ENVIRONMENT. This took `lent[0]` — the first environment the
    session happened to have lent — and stated it as fact. Measured, in this package's own
    dogfood run: three agents were dispatched to `flags`, `listings` and `leaks` while an
    older grant still stood, and every one of them was told, on its first tool call, that it
    was working under `cleanup-run`. The agent id was right and the environment was wrong,
    in a sentence written with the hook's full authority, contradicting the dispatch prompt
    that had just named the correct one.

    THIS IS THE SAME FAILURE THE REFUSAL ALREADY HAD, in a second place. That one listed the
    other lent environments and suggested one, and a trial agent picked a different
    dispatch's and filed eight pins into it. The lesson was written down — a message that
    names an environment nobody told this agent to use is a message that will be obeyed —
    and then this function did it again by picking an index.

    So: one grant standing, and it can be named, because there is nothing to be wrong about.
    Several, and the agent is told to use the one its own dispatch named — which is the only
    place that knowledge exists.
    """
    one = lent[0] if len(lent) == 1 else ""
    named = say("called", called=called) if called else ""
    env = say("env_one", env=one) if one else say("env_unknown")
    head = (say("head_one", agent=agent, called=named, env=one) if one
            else say("head_many", agent=agent, called=named, n=len(lent)))
    return say("briefing", head=head, env=env, agent=agent)
