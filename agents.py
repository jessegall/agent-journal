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


def briefing(lent: list, agent: str) -> str:
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
    env = f'--env="{one}"' if one else '--env="<the environment your dispatch named>"'
    head = (f"YOU ARE AGENT `{agent}` WORKING UNDER `{one}`, and you have your own ledger."
            if one else
            f"YOU ARE AGENT `{agent}`, and you have your own ledger under the environment "
            f"your dispatch lent you. This session has lent {len(lent)}, so only your own "
            f"prompt says which is yours — use that name and no other.")
    return (head + "\n"
            f"  Put both flags on every journal command you run:\n"
            f'    .journal/journal.py {env} --as="{agent}" work start "<what you are doing>"\n'
            f'    .journal/journal.py {env} --as="{agent}" todos          what was assigned to you\n'
            f'    .journal/journal.py {env} --as="{agent}" todos report <n> "<how>"\n'
            "  Your work is yours: no other agent can open or close it. The environment's\n"
            "  PINS and REMINDERS are the parent's — read them, and report what you find\n"
            "  rather than writing either. You may REPORT a to-do complete; only the parent\n"
            "  closes one.")
