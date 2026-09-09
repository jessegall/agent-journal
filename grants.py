"""A session lending one environment to the subagents it dispatches, and to nobody else.

THE PROBLEM IS NOT PERMISSION, IT IS IDENTITY. A subagent's shell carries its PARENT's
session id — measured, and written into `transcript.py` long before this file existed — so
`journal pins add` run inside a subagent is, at the operating system, the same act as the
parent running it. Nothing the CLI can look at tells them apart. `agent_id` exists, but only
in the JSON a hook receives, and only for the instant of the tool call; it never reaches the
process the subagent actually runs.

SO THE GRANT CANNOT BE DETECTED. It has to be DECLARED, twice over: once by the session, in
the record, saying which environment it is lending; and once by the subagent, on its command
line, saying which environment it is writing to. The hook holds the two against each other.
That is what makes "this agent works on its own journal" a mechanism rather than a wish —
and it is exactly the sentence the user asked the dispatcher to have to say out loud.

WHAT THIS IS NOT. It is not `delegate`, which bound the SESSION to the environment so that
its subagents' writes landed there by accident of sharing an id — and which cost nine
branches across six functions before it was deleted. Nothing here binds the session,
nothing moves it, and no other line of the package asks whether an actor is a subagent: the
one place that ever asks is the door in `hook.main`, and it asks once.

WHAT A GRANTED SUBAGENT CAN TOUCH, measured rather than asserted: its full write repertoire
— `work start`, `todos add`, `todos start`, `todos report` — changes these files and no
others:

    environments/<lent>/agents/<its own id>/work.json
    environments/<lent>/todo/NNN-*.md

Nothing shared. Not `record.json`, not another environment, not the bindings, and not
another agent's ledger. That is the whole property, and it is why `rules`, `docs` and
`tools` are refused rather than merely discouraged: each writes somewhere every session
reads, and allowing one would be the single exception that makes the sentence untrue.

PINS AND REMINDERS ARE INHERITED AND NOT WRITTEN, which is a different reason and the
user's own ruling. They are not shared across environments — a pin belongs to one
environment exactly as work does — so this is not about blast radius. It is about
PROVENANCE: a pin is re-read in full at the top of every compaction by every session that
binds here, and nothing revisits it, so a claim whose reasoning nobody in the main
conversation saw would stand in the highest-authority position the system has, forever. The
lent agent reads them and reports; the session that dispatched it decides what is kept.

AND NO HIERARCHY. There is no parent field on an environment. Five agents argued it and the
evidence went the other way: this codebase has never kept a field inert — `docs.track` was
documented as "provenance, not ownership" and was deciding what `cleanup` flags within one
release — and nobody has yet named work a flat namespace cannot do. A granted environment is
an ordinary environment. What makes it a subagent's is that a session lent it, which is a
fact about the SESSION and lives on the session.
"""
from __future__ import annotations

from pathlib import Path

import state

KEY = "granted"


def _now() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

#: VERBS A SUBAGENT MAY NEVER RUN, granted or not — each with the reason it may not, because
#: there are two different reasons and one sentence for both would be wrong about one of them.
#:
#: THE SESSION ONES. Everything here moves or re-points a SESSION, and a subagent has no
#: session of its own — it runs under its dispatcher's id. `journal switch` from inside one
#: would rebind the ORCHESTRATOR's live session, mid-task, to somewhere it never chose. That
#: is not a misfiled pin; it is the ground moving under the agent that dispatched it.
#:
#: THE PROJECT-WIDE ONE. A grant lends ONE environment, and everything written there is
#: confined to it. A rule is not: it binds every environment, for every session, forever, and
#: lives in the shared record. A subagent lent one environment writing a rule that binds all
#: of them is the fact-of-unknown-provenance this mechanism exists to prevent, arriving
#: through the door opened for it.
_MOVES_A_SESSION = ("it moves a SESSION, and you are running under your dispatcher's session "
                    "id — this would move the agent that dispatched you, not you")
_BINDS_EVERYTHING = ("a rule binds every environment, for every session, and you were lent "
                     "ONE — report the ruling and let the agent that dispatched you make it")
_THE_PROJECT_S = ("docs and tools are the PROJECT's — every environment reads them and every "
                  "session runs them — and you were lent one environment. Report what you "
                  "found; the agent that dispatched you decides what the project keeps")
#: THE INHERITED ONES, AND THIS IS THE USER'S RULING, NOT AN INFERENCE. A lent agent reads
#: the environment's pins and reminders and writes neither: "it will have all the pins, it
#: cannot create pins itself, but it will inherit the pins from the parent."
#:
#: THE REASON IS PROVENANCE. A pin is re-read in full at the top of every compaction, in the
#: highest-authority position this system has, by every session that ever binds to that
#: environment — and nothing revisits it. A claim written by an actor whose reasoning nobody
#: in the main conversation saw is a fact of unknown origin sitting in that position
#: forever. A reminder is worse: the user wrote every one of them, and seeing it come back
#: is how they know it landed. An agent that adds one is putting words in their mouth.
#:
#: WHAT IT DOES INSTEAD IS NOT A LESSER THING. It reports, and the session that dispatched
#: it — which has the conversation, and the user in it — decides what the record keeps.
_INHERITED = ("a {noun} is inherited, never written, by a lent agent: it is re-read by every "
              "session that binds to this environment and nothing revisits it, so a claim "
              "whose reasoning nobody saw would stand in the record's highest-authority "
              "position forever. Report what you found and let the agent that dispatched "
              "you decide what is kept — `--env` reads are never refused")
NEVER = {
    "switch": _MOVES_A_SESSION, "claim": _MOVES_A_SESSION, "prepare": _MOVES_A_SESSION,
    "grant": _MOVES_A_SESSION, "environments": _MOVES_A_SESSION,
    "rule": _BINDS_EVERYTHING, "rules": _BINDS_EVERYTHING,
    "docs": _THE_PROJECT_S, "tools": _THE_PROJECT_S,
    "pins": _INHERITED.format(noun="pin"), "pin": _INHERITED.format(noun="pin"),
    "reminders": _INHERITED.format(noun="reminder"),
    "reminder": _INHERITED.format(noun="reminder"),
    # THE NOUN SPELLINGS OF THE SAME LIFECYCLE VERBS. `journal environments switch "x"` is
    # the documented twin of `journal switch "x"`, so refusing one and not the other would
    # be refusing a spelling rather than an act.
    "environment": _MOVES_A_SESSION, "envs": _MOVES_A_SESSION, "env": _MOVES_A_SESSION,
    "tracks": _MOVES_A_SESSION, "track": _MOVES_A_SESSION, "grants": _MOVES_A_SESSION,
}


def unreachable() -> set:
    """Entries of NEVER the gate can never reach — a refusal nothing enforces.

    THE LIST AND THE GATE MUST AGREE, and for one release they did not: five verbs were
    named here as forbidden while `hook._journal_write` classified them as not-a-write, so
    a granted subagent could `journal claim` a live session's environment out from under it.
    `test_bind` asserts this is empty, which is the assertion that would have caught it.
    """
    import hook
    return set(NEVER) - set(hook.JOURNAL_WRITES)


def granted(root: Path, stem: str | None) -> list[str]:
    """The environments this session has lent to its subagents."""
    got = state.get(root, KEY, [], stem=stem) if stem else []
    return got if isinstance(got, list) else []


def grant(root: Path, stem: str, name: str) -> tuple[bool, str]:
    """Lend an environment to this session's subagents. The session itself does not move."""
    import tracks
    name = state.slug(name)
    if not name:
        return False, 'grant what? `journal grant "<environment>"`'
    # LENDING MAKES THE ENVIRONMENT IT LENDS. This refused an unknown name and pointed at
    # `prepare`, which CREATES AND SWITCHES — so handing out three environments meant
    # prepare, switch back, prepare, switch back, prepare, switch back: six moves of a
    # session that was never going anywhere, to do a thing whose whole definition is "this
    # session does not move". The refusal was correct about the state and wrong about the
    # intent. A name nobody has used before, given to `grant`, is a request for a new
    # environment to lend — so it is made, and the answer says so rather than pretending
    # it was already there.
    fresh = name not in tracks._all(root)
    if fresh:
        with state.locked(root):
            tracks.create(root, name, at=_now())
    if not stem:
        return False, ("a grant belongs to a session, and this process is not in one — run it "
                       "from the session that will dispatch the subagent")
    have = granted(root, stem)
    if name in have:
        return True, _briefing(name, already=True)
    state.put(root, KEY, have + [name], stem=stem)
    return True, _briefing(name, fresh=fresh)


def revoke(root: Path, stem: str, name: str = "") -> tuple[bool, str]:
    """Take a grant back. Without a name, all of them."""
    have = granted(root, stem)
    if not have:
        return False, "this session has granted nothing"
    if not name:
        state.put(root, KEY, [], stem=stem)
        return True, f"granted nothing now; {', '.join(have)} {'is' if len(have) == 1 else 'are'} no longer lent"
    name = state.slug(name)
    if name not in have:
        return False, f"this session has not granted {name!r}; it granted {', '.join(have)}"
    state.put(root, KEY, [x for x in have if x != name], stem=stem)
    return True, f"{name} is no longer lent to this session's subagents"


def allows(root: Path, stem: str | None, verb: str, command: str) -> tuple[bool, str]:
    """May this subagent's journal write go through? (yes/no, the refusal when no).

    BOTH DECLARATIONS OR NEITHER. The session must have lent the environment, and the
    command must name it. A subagent that names an environment nobody lent it is refused
    the same as one that names none — otherwise the grant would be a suggestion.
    """
    if verb in NEVER:
        return False, (f"`journal {verb}` is refused from a subagent even on a granted "
                       f"environment: {NEVER[verb]}.")
    lent = granted(root, stem)
    if not lent:
        return False, (
            "`journal " + verb + "` from a subagent is refused: the journal is the main "
            "conversation's, and your shell carries its session id, so this would file under "
            "its name. Report what you found and let it decide what to keep. Reads "
            "(`search`, `pins`, `open`, `--back`) are fine."
        )
    named = _env_in(command)
    if named and named in lent:
        # BOTH FLAGS OR NEITHER. `--env` says which environment; `--as` says which AGENT,
        # and without it the write lands in the environment's shared `work.json` instead of
        # this agent's own ledger — which is the collision the sub-environment exists to
        # prevent, arriving silently. Measured in a dogfood run: an agent ran `todos start 1`
        # with no `--as`, was answered "open: …" with no complaint, worked the row, and was
        # refused by `report` with "held by nobody". The command that could have said it
        # said nothing, and the one that had to say it said it far too late to help.
        #
        # THE CHECK IS HERE BECAUSE THE IDENTITY IS HERE. The CLI cannot see `agent_id` and
        # so cannot tell a session from an agent; this door is the one place that can, which
        # is why the CLI's own version of this warning fired for the parent too.
        if not acting_in(command):
            return False, (
                f"`journal {verb}` from a lent agent needs `--as=<your name>` as well as "
                "`--env`. Without it the write files under the environment rather than under "
                "you: your ledger is not yours, a to-do you start is held by nobody, and "
                "`report` will refuse it later. Your name was given to you on your first "
                "tool call."
            )
        return True, ""
    # IT NEVER NAMES THE OTHERS, and that is not tidiness — it is the fix for a live
    # failure. This refusal used to list every environment the session had lent and then
    # suggest the first one. A trial subagent, dispatched for `trial-two` before the grant
    # existed, read that list, picked `scout-run` — a different dispatch's environment —
    # and filed eight pins into it. The message did exactly what a good message should and
    # was obeyed; what it asked for was wrong. A subagent that was not lent what it was
    # told to use has hit a mistake in its DISPATCH, and the only correct next move is to
    # report that upward, never to choose an environment for itself.
    if named:
        return False, (
            f"`journal {verb}`: you were not lent `{named}`. That is a mistake in your "
            "dispatch, not something to work around — do NOT pick a different environment. "
            "Report to the agent that dispatched you that the grant is missing, and let it "
            "run `journal grant` before you try again."
        )
    return False, (
        f"`journal {verb}` needs the environment it was lent, and this command names none. "
        'Put `--env="<name>"` on it, exactly as your dispatch told you — the name is in the '
        "prompt you were given. If it is not, report that upward rather than guessing."
    )


def acting_in(command: str) -> str:
    """The agent a command claims to be, with `--as=` — slugged, or ""."""
    return _flag_in(command, ("--as=",))


def _env_in(command: str) -> str:
    """The environment a command names with `--env=`, slugged — or ""."""
    return _flag_in(command, ("--env=", "--environment=", "--track="))


def _flag_in(command: str, prefixes: tuple) -> str:
    """The slugged value of the first of `prefixes` on this command line — one reader."""
    import shlex
    try:
        toks = shlex.split(command or "")
    except ValueError:
        toks = (command or "").split()
    for t in toks:
        if t.startswith(prefixes):
            return state.slug(t.split("=", 1)[1])
    return ""


def _briefing(name: str, already: bool = False, fresh: bool = False) -> str:
    """What the dispatcher must pass on, verbatim. The whole point of the command.

    IT PRINTS THE SENTENCE RATHER THAN DESCRIBING IT, because the dispatcher's job is to
    copy it into the prompt, and a sentence somebody paraphrases is a sentence that loses
    the flag the entire mechanism turns on.
    """
    head = (f"`{name}` is already lent to this session's subagents." if already else
            (f"`{name}` is a new environment, made and lent to this session's subagents. "
             "This session has not moved." if fresh else
             f"`{name}` is lent to this session's subagents. This session has not moved."))
    # EVERY EXAMPLE HERE IS A WRITE THE AGENT MAY ACTUALLY MAKE. It used to offer
    # `pins add` — which a lent agent is refused, by the user's ruling that pins are
    # inherited and never written by one. A briefing that teaches a forbidden command
    # teaches the agent to hit a wall on its first useful act, and it is copied verbatim
    # into the prompt, so the error arrives with the dispatcher's own authority behind it.
    return (head + "\n\n  TELL THE AGENT, IN ITS PROMPT:\n"
            "    Run `.journal/journal.py lent` first: it answers with your own name.\n"
            f'    You work on your own journal: environment `{name}`. Every journal command\n'
            f'    you run must carry --env="{name}", e.g.\n'
            f'      .journal/journal.py --env="{name}" work start "<what you are doing>"\n'
            f'      .journal/journal.py --env="{name}" todos report <n> "<how it was done>"\n'
            "    Without the flag your writes are refused, because your shell carries the\n"
            "    dispatching session's id and would file under its name.\n"
            f'    You INHERIT this environment\'s pins and reminders — `--env="{name}" pins`\n'
            "    reads them — and write neither: report what you found instead.\n\n"
            f'  read what it wrote: `journal environments "{name}"`\n'
            f'  take it back:       `journal grant --off "{name}"`')
