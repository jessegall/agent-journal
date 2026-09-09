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

SEEN = "agent_seen"      # {track: {agent: unix seconds}} — the heartbeat, in the record
ASSIGNED = "assigned"    # a to-do's field: the agent it is held for


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
        return "never written"
    secs = time.time() - float(got)
    if secs < 90:
        return "active just now"
    if secs < 3600:
        return f"last wrote {int(secs // 60)} min ago"
    return f"last wrote {secs / 3600:.1f} h ago"


def briefing(track: str, agent: str) -> str:
    """What the hook says to a subagent on its first tool call: its own name, and the flags.

    IT IS TOLD, RATHER THAN ASKED TO REMEMBER. The dispatcher pastes the grant's sentence
    into the prompt and that names the environment; this names the AGENT, which the
    dispatcher could not have known when it wrote the prompt. Both halves have to reach the
    command line, and only one of them can come from a human.
    """
    return (f"YOU ARE AGENT `{agent}` WORKING UNDER `{track}`, and you have your own ledger.\n"
            f"  Put both flags on every journal command you run:\n"
            f'    .journal/journal.py --env="{track}" --as="{agent}" work start "<what you are doing>"\n'
            f'    .journal/journal.py --env="{track}" --as="{agent}" todos          what was assigned to you\n'
            f'    .journal/journal.py --env="{track}" --as="{agent}" todos report <n> "<how>"\n'
            "  Your work is yours: no other agent can open or close it. The environment's\n"
            "  PINS are the parent's — read them, and report what you find rather than\n"
            "  pinning it. You may REPORT a to-do complete; only the parent closes one.")
