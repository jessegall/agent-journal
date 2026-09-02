#!/usr/bin/env python3
"""One doorbell. The payload says which event fired, so the harness config never changes.

    "command": "\"$CLAUDE_PROJECT_DIR\"/.journal/hook.py"

THE CONTRACT, and it is the whole reason this file is small:
  exit 0            silent; stdout is shown to the user
  exit 2 + stderr   the turn is HELD and stderr is fed back to the agent

The hold is what makes a rule a mechanism instead of a wish. It sits at the STOP and
nowhere else: a tool count is an arbitrary boundary that can fire mid-thought, while a
stop is the moment the stretch is about to be lost — which is the moment worth holding.

AND IT CAN ONLY HOLD ONCE PER STRETCH. A hook that re-holds on the message it provoked is
a loop the agent cannot leave, so the line it last held at is written down and it never
holds at or behind that mark again. A nudge that cannot be escaped stops being a nudge.

THE TRANSCRIPT COMES FROM THE PAYLOAD. Every event carries `session_id` and
`transcript_path`; the first version guessed the newest file by mtime instead, and with two
terminals open on one project it held session A for session B's messages. Every mark this
file writes is a fact about the transcript it was handed, and is filed under its name.
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

import asks  # noqa: E402
import settings as settings_mod  # noqa: E402
import state  # noqa: E402
import tags  # noqa: E402
import context  # noqa: E402
import docs  # noqa: E402
import pins  # noqa: E402
import work  # noqa: E402
import todo  # noqa: E402
import tracks  # noqa: E402
import transcript  # noqa: E402
import update  # noqa: E402


@dataclass(frozen=True)
class Ctx:
    """Which transcript this event is about, and where its marks go.

    `stem` names the runtime file. For the session's own events it is the transcript's
    stem. A SUBAGENT's tool call carries the PARENT's transcript and session — measured —
    and only `agent_id` tells them apart; it is keyed `agent-<id>`, the name of its own
    transcript on disk, so that nothing it does can land in the parent's file. In practice
    the handlers ignore subagents altogether (see `_subagent`), so no such file is written.
    """

    stem: str
    path: Path | None


def _ctx(payload: dict) -> Ctx | None:
    tp = payload.get("transcript_path") or ""
    sid = payload.get("session_id") or ""
    aid = payload.get("agent_id") or ""
    if aid:
        stem = f"agent-{aid}"
    elif tp:
        stem = Path(tp).stem
    elif sid:
        stem = sid
    else:
        return None
    path = Path(tp) if tp else transcript.find(ROOT.parent, sid) if sid else None
    return Ctx(stem, path)


# `filing_units` USED TO BE DEFINED HERE and now lives in `transcript.py`, because the
# digest needed the same answer. Two copies of "what counts as a message" is two rules, and
# they had already drifted: the hook stopped holding scaffolding while the digest went on
# printing it.


def untagged(lines, units: set[int]) -> list:
    """Messages that said nothing about what they carried.

    A `[!reply]` is NOT untagged — it obeyed the rule and declared itself routine. Only a
    message wearing no tag at all filed nothing, and only a FILING UNIT can be one.
    """
    return [
        l
        for l in lines
        if l.n in units
        and l.kind == "text"
        and (l.text or "").strip()
        and not tags.found(l.text)
        # A QUESTION PUT TO THE USER IS NOT A MESSAGE THAT NEEDS A TAG. It is spoken text
        # so the digest shows what the user answered, and the moment it was, the hold
        # judged it: "line 3014: asked: When a state key that a slot's factory read…".
        and not any(t in transcript.ASKS for t in l.tools)
    ]


def _floor(ctx: Ctx, lines=None) -> int:
    """The line under which nothing is held against anyone, written on FIRST SIGHT.

    A transcript the hook was not present for has a history, all of it untagged because
    there was no vocabulary to tag it with. That history exists for a fresh install into a
    running session, for a resumed or forked session whose transcript was copied at line N,
    and for a SessionStart hook that failed once in a session that then ran for hours. The
    first version drew this line only at install, into a transcript guessed by mtime; the
    second only at SessionStart, which does not fire when a hook is picked up mid-session.

    So WHICHEVER HANDLER FIRST SEES A TRANSCRIPT with no floor writes one, at the line count
    of that moment. In a fresh session that is SessionStart at line one or two and nothing
    is suppressed; in a session joined late it is the line it was joined at.
    """
    got = state.get(ROOT, "floor", None, stem=ctx.stem)
    if got is not None:
        return got
    if lines is None:
        lines = transcript.read(ctx.path)[0] if ctx.path else []
    floor = lines[-1].n if lines else 0
    state.put(ROOT, "floor", floor, stem=ctx.stem)
    return floor


#: The shapes a deferral takes in an agent's own words. "I'll rename it once the Editor
#: agent finishes", "for now, back to the failures", "I'll come back to that". Measured:
#: the user asked whether to rename a component, the agent said it would do it next, and
#: nothing was written down — one distraction away from being forgotten.
_DEFERRAL = re.compile(
    r"\b(?:I(?:'|’)ll|I will|let me|I(?:'|’)m going to|going to|we(?:'|’)ll)\b[^.!?\n]{0,90}?"
    r"\b(?:once|after|when|later|next|afterwards|then|as soon as)\b"
    r"|\b(?:for now|later on|come back to (?:that|this|it)|circle back|after this|"
    r"once that(?:'|’)s done|when that(?:'|’)s done|in a moment|in a bit)\b",
    re.I,
)


def deferred(text: str) -> str | None:
    """The sentence in which this message puts work off, if it does."""
    m = _DEFERRAL.search(tags.strip(text or ""))
    if not m:
        return None
    body = " ".join(tags.strip(text).split())
    i = max(0, body.lower().find(m.group(0).lower().split()[0], max(0, m.start() - 5)))
    return body[max(0, i - 40):i + 140]


def _deferral(conf: dict, ctx: Ctx) -> tuple[str, str] | None:
    """(the one-line instruction, the reasoning) if the agent's latest reply puts work
    off and nothing was parked since the user asked; None otherwise. Said once per reply.

    THE USER ASKED, THE AGENT SAID "LATER", NOTHING WAS WRITTEN. Measured: "Let's rename
    Nothing to Empty? or None?" — "I'll rename it once the Editor agent finishes; for now,
    back to the failures." — and the rename lived nowhere but that sentence, one
    distraction from gone. The skill said to park it and was not enough, so it is a gate.

    Three things must all hold, so that an agent describing the order of its own work is
    not stopped: the last prompt asked for work (`asks.asks_for_work`, recorded at
    UserPromptSubmit); no to-do has been added since that prompt; and the latest reply
    contains a deferral. Then it fires once for that reply, and a retry passes, so a false
    match costs one call and never traps.
    """
    if "deferral" in conf["silenced"] or ctx.path is None:
        return None
    asked = state.get(ROOT, "prompt", None, stem=ctx.stem)
    if not asked or not asked.get("asked"):
        return None
    here = tracks.current(ROOT)
    if len(todo.open_items(ROOT, here)) > asked.get("todos", 0):
        return None
    got = transcript.last_reply(ctx.path)
    if not got:
        return None
    text, uid = got
    if uid == state.get(ROOT, "deferral_at", "", stem=ctx.stem):
        return None
    said = deferred(text)
    if not said:
        return None
    state.put(ROOT, "deferral_at", uid, stem=ctx.stem)
    return (
        "journal: your reply puts work off — park it as a to-do before going on, or run this "
        "again if nothing is actually deferred",
        f"You wrote:\n  …{said}…\n\nThe user asked for something and this says it will happen "
        "later. Work held only in words lives in this window, and one distraction or one "
        "compaction loses it. Park it now:\n"
        '  .journal/journal.py todo "<title>" --brief\n'
        "and say in your next message that it is parked as to-do n. If nothing is deferred — "
        "you were describing the order of the current work — run the call again; this is "
        "said once per reply.",
    )


def on_user_prompt(conf: dict, payload: dict, ctx: Ctx) -> int:
    """The moment the user asks. Record whether they asked for work; remind if work is open.

    The reminder rides only on a prompt that asks for work while something is open —
    exactly the case where the answer might be "later" — so it is not wallpaper on every
    message. With nothing open the request is the work and needs no reminder.
    """
    prompt = str(payload.get("prompt") or "")
    asked = asks.asks_for_work(prompt)
    here = tracks.current(ROOT)
    state.put(ROOT, "prompt", {"asked": asked, "todos": len(todo.open_items(ROOT, here))},
              stem=ctx.stem)
    standing = work.open_work(ROOT)
    if not asked or not standing or "prompt_reminder" in conf["silenced"]:
        return 0
    return _context(
        "UserPromptSubmit",
        "journal: work is open — " + "; ".join(w["subject"] for w in standing) + ". If this "
        "asks for something else that can wait, park it before answering: "
        '`.journal/journal.py todo "<title>" --brief`, and say it is parked. If it cannot '
        "wait, `update` the open work and `start` the new one. If it is the same work, carry on.",
    )


def _rung(conf: dict, ctx: Ctx, got, stretch=()) -> tuple[str, str, str] | None:
    """(label, instruction, reasoning) if a new rung of the ladder was just passed.

    ONE RUNG, ONCE. The highest rung already passed is written down, so a session that
    sits at 71% for an hour is told once and not at every stop — a warning that repeats
    while nothing has changed is one the reader learns to clear without looking.

    CALLED FROM THE STOP AND FROM EVERY TOOL CALL. A rung that fires only at a stop is
    missed by exactly the session that needs it: one long stretch of tool calls can cross
    95% and compact before the agent ever stops. Measured — the user had to ask "did you
    get the 95% warning?" and the answer was no. So the tool-call hook checks a cheap tail
    reading too; the rung is recorded the same way, and the decision gate that follows it
    is the same gate.
    """
    ladder = sorted(conf["context_warn_ladder"])
    if not ladder or "context" in conf["silenced"]:
        return None
    done = state.get(ROOT, "warned_at", 0.0, stem=ctx.stem)
    passed = [r for r in ladder if got[0] >= r > done]
    if not passed:
        return None
    rung = passed[-1]
    state.put(ROOT, "warned_at", rung, stem=ctx.stem)
    standing = pins.live(ROOT)
    # How many were written since the last rung — a fact, and the one that would expose
    # padding to the reader who is doing it.
    seen = state.get(ROOT, "pins_at_warn", 0, stem=ctx.stem)
    state.put(ROOT, "pins_at_warn", len(standing), stem=ctx.stem)
    gated = bool(conf["gate_after_context_rung"]) and "pin_due" not in conf["silenced"]
    if gated:
        # RECORDED HERE, ENFORCED AT THE NEXT TOOL CALL. A Stop can only hold; PreToolUse
        # is the one event that can refuse an act.
        state.put(ROOT, "pin_due", {"rung": rung, "used": got[1], "window": got[2]}, stem=ctx.stem)
    pct = 100 * got[1] / got[2]
    text = context.warning(
        got[1], got[2], len(standing), context.shape(stretch), rung,
        latest=standing[-1]["fact"] if standing else "",
        since=max(0, len(standing) - seen), gated=gated,
    )
    # THE RULES RIDE EVERY RUNG. A rule read at the session's start is far behind by the
    # time the window is half full, and it is a few lines.
    ruled = pins.carry(ROOT, "compact", key=pins.RULES)
    if ruled:
        text += "\n\n" + ruled.replace(
            "Decided, and still in force:",
            "Again, because the block you read at the start is far behind you:")
    return (
        f"context {pct:.0f}% full",
        f"journal: context {pct:.0f}% full — "
        + ("decide before any other tool runs: `remember \"<claim>\"` or `nothing \"<why>\"`"
           if gated else "consider what must outlive it"),
        text,
    )


def on_stop(conf: dict, payload: dict, ctx: Ctx) -> int:
    if not conf["hold_stop_on_untagged"] or "untagged" in conf["silenced"]:
        return 0
    if ctx.path is None:
        return 0
    lines, boundaries = transcript.read(ctx.path)
    stretch = transcript.since(lines, boundaries, 0)
    floor = _floor(ctx, lines)
    # CONTEXT PRESSURE FIRST — it outranks both other holds, because it is the only one
    # with a deadline. The others can be said at the next stop; this one cannot.
    # ONE RUNG, ONCE. The highest rung already passed is written down, so a session that
    # sits at 71% for an hour is told once and not once per stop — a warning that repeats
    # while nothing has changed is one the reader learns to clear without looking.
    # AND NEVER ON A GUESSED WINDOW. See `context.window_for`: a rung climbed against the
    # wrong window is a wrong nudge, and four of them leave the ladder mute for the real
    # compaction.
    got = context.pressure(ctx.path, conf["context_window"], state.get(ROOT, "window", 0) or 0)
    rung = _rung(conf, ctx, got, stretch) if got and got[3] else None
    if rung:
        return _hold(rung[0], rung[1], rung[2])

    units = transcript.filing_units(lines)
    missing = untagged(stretch, units)

    # A NEWER JOURNAL IS OUT: said at a stop, once per transcript per version, as context.
    # The agent is the one that can run the upgrade, and a stop is where it has a moment.
    if "update_check" not in conf["silenced"] and not missing:
        note = update.notice(ROOT)
        if note:
            latest = update.check(ROOT).get("version", "")
            if latest and latest != state.get(ROOT, "update_said", "", stem=ctx.stem):
                state.put(ROOT, "update_said", latest, stem=ctx.stem)
                return _context("Stop", note + " Run it now if nothing is mid-flight: "
                                "`.journal/journal.py upgrade`.")

    # THE MISFILED CHECK USED TO LIVE HERE, and it is gone because the thing it policed
    # is gone. It held on a message wearing `[!update]` with no work open — the one tag
    # whose correctness depended on something outside the message it rode on. The user
    # struck the tag and made it `journal update` instead, and a command cannot be
    # misfiled: `work.note` refuses when nothing is open rather than filing a claim about
    # nothing. The check moved from after the fact to before it, which is where a check
    # belongs when it can.
    if not missing:
        # A DEFERRAL SAID AND NOT WRITTEN, in the message that ended the turn. The same
        # check runs at every tool call mid-turn (see `_deferral`); this catches the case
        # where the deferring message was the last thing said.
        due = _deferral(conf, ctx)
        if due:
            return _hold("work deferred in words, not parked", due[0])
        here = tracks.current(ROOT)
        standing = work.open_work(ROOT)
        if standing and todo.auto(ROOT, here):
            # AUTO IS ON, WORK IS STILL OPEN, AND THE AGENT STOPPED. Measured: the sweep
            # committed and merged, "left for the user's ruling", and the work never ended
            # — so nothing was open in the agent's mind and everything was open in the
            # journal's, and the list sat. Held once per state: the same open work and the
            # same list are not raised twice, so an agent that said it is waiting on the
            # user is not held again for saying so.
            # EVERY STOP, NOT ONCE PER STATE. The user's ruling: with auto on, every stop
            # with the list waiting is held, so finishing one thing and stopping brings the
            # next. What keeps it from trapping the agent is `stop_hook_active`: the harness
            # sets it on the stop that follows a hold in the same turn, and that stop is
            # let through, so an agent that answered the hold — started a to-do, or said it
            # is waiting on the user — is not held again until the next turn.
            if not payload.get("stop_hook_active"):
                # THIS IS THE STILL-OPEN HOLD TOO. It says to end the work; a second hold
                # saying the same thing at the next stop would be the same nudge twice.
                held = set(state.get(ROOT, "held_work", [], stem=ctx.stem))
                state.put(ROOT, "held_work", sorted(held | {w["subject"] for w in standing}), stem=ctx.stem)
                names = "; ".join(w["subject"] for w in standing)
                listed = bool(todo.open_items(ROOT, here))
                return _hold(
                    "auto is on, work still open",
                    f"journal: auto is on, and `{names}` is still open — `end` it if it is done, "
                    "or park what is left as a to-do and `end` it"
                    + ("; then the list starts" if listed else "; open work is never left standing"),
                    f"Open: {names}\n\nAuto is on for `{here}`, and the next to-do starts only "
                    "when nothing is open. If this work is finished, close it:\n"
                    '  .journal/journal.py end "<the same words>"\n'
                    "If part of it is waiting on the user — a ruling, a review — that part is a "
                    "to-do, not open work: park it with the questions in its brief, then `end` "
                    "the work:\n"
                    '  .journal/journal.py todo "<what is left, and on what it waits>" --brief\n'
                    "If you are mid-work and stopped to ask the user something, say so; the "
                    "stop after your answer passes, and the next turn asks again.",
                )
        # Open work is the other half of the same question: is the stretch safe to lose?
        # ONLY WORK THIS TRANSCRIPT OPENED. The journal is shared, so work opened in another
        # session is still open here — and this session was TOLD so at its start. Holding
        # it again at the first stop is the same nudge said twice, about a commitment
        # somebody else made and this reader cannot act on. A hold is for one's own.
        # ONCE PER PIECE OF WORK. Work legitimately spans a stop — that is what declaring
        # it is FOR — so a hold that repeats until it closes is a trap, not a reminder.
        mine = ctx.path.name if ctx.path else None
        held = set(state.get(ROOT, "held_work", [], stem=ctx.stem))
        fresh = [w for w in work.open_work(ROOT)
                 if w.get("session") == mine and w["subject"] not in held]
        if fresh:
            state.put(ROOT, "held_work", sorted(held | {w["subject"] for w in fresh}),
                      stem=ctx.stem)
            return _hold(
                "work still open",
                f"journal: still open — {'; '.join(w['subject'] for w in fresh)} — `end` it, or "
                "`update` where it got to",
            )
        # NOTHING IS OPEN, AND SOMETHING IS WAITING. Said, never held, and only when the
        # list differs from the last time it was said in this transcript — a reminder at
        # every idle stop is wallpaper within the hour. And it is not permission: an idle
        # agent told "three are waiting" will start one, and whether it should is the
        # user's call.
        if not standing:
            waiting = todo.open_items(ROOT, here)
            ids = sorted(t["n"] for t in waiting)
            auto = todo.auto(ROOT, here)
            ready = todo.ready(ROOT, here)
            if ids and auto and not ready:
                # EVERY WAITING TO-DO WAITS ON THE USER. There is nothing to hold for: the
                # exit is the user's answer. Said once per state, as context.
                if ids != state.get(ROOT, "todos_said", [], stem=ctx.stem):
                    state.put(ROOT, "todos_said", ids, stem=ctx.stem)
                    return _context(
                        "Stop",
                        f"journal: auto is on for `{here}`, but every waiting to-do waits on the "
                        "user (`journal todo` shows the questions). Nothing to pick up until "
                        "they answer.",
                    )
                return 0
            unstuck = todo.answered(ROOT, here)
            if ids and not auto and unstuck and not payload.get("stop_hook_active"):
                # AUTO IS OFF, BUT THE USER ANSWERED. Their answer is their word to do
                # that one: held, naming it, once per state of the answered set.
                key = [str(t["n"]) for t in unstuck]
                if key != state.get(ROOT, "answered_said", [], stem=ctx.stem):
                    state.put(ROOT, "answered_said", key, stem=ctx.stem)
                    t = unstuck[0]
                    return _hold(
                        f"the user answered to-do {t['n']}",
                        f"journal: the user answered to-do {t['n']} ({t['title']}) — that is their "
                        f"word to do it: `.journal/journal.py todo start {t['n']}`",
                        "\n".join(f"To-do {u['n']}: {u['title']}\n  asked:    {u['asks']}\n"
                                  f"  answered: {u['answer']}" for u in unstuck)
                        + "\n\nStart it, do it, `end` it. The answer stays on the to-do; "
                        f"`journal todo {t['n']}` shows both.",
                    )
            if ids and auto and not payload.get("stop_hook_active"):
                # AUTO IS ON: the user has said to work through the list. EVERY idle stop
                # with to-dos waiting is HELD, naming the next one that is not waiting on
                # the user — answered ones first — except the stop that follows this very
                # hold in the same turn (`stop_hook_active`), which is what lets an agent
                # that answered it end its turn instead of looping.
                nxt = ready[0]
                if todo.answered_one(nxt):
                    return _hold(
                        f"auto is on, the user answered to-do {nxt['n']}",
                        f"journal: the user answered to-do {nxt['n']} ({nxt['title']}) — you are "
                        f"unstuck: `.journal/journal.py todo start {nxt['n']}`",
                        "\n".join(f"To-do {u['n']}: {u['title']}\n  asked:    {u['asks']}\n"
                                  f"  answered: {u['answer']}" for u in unstuck)
                        + f"\n\nStart with to-do {nxt['n']}: the answer is above, the brief is "
                        f"`journal todo {nxt['n']}`. Then the rest of the list:\n"
                        + "\n".join(f"  {t['n']:>3}  {t['title']}" for t in waiting if not todo.answered_one(t)),
                    )
                return _hold(
                    f"auto is on, {len(ids)} to-do(s) waiting",
                    f"journal: auto is on for `{here}` and nothing is open — pick up the "
                    f"next to-do: `.journal/journal.py todo start {nxt['n']}`",
                    f"Waiting on `{here}`:\n" + "\n".join(
                        f"  {t['n']:>3}  {t['title']}"
                        + (f"  (waits on the user: {t['asks']})" if t.get("asks") else "")
                        for t in waiting)
                    + f"\n\nThe user is away and asked for this list to be worked through. Read "
                    f"the brief (`journal todo {nxt['n']}`), start it, SOLVE IT YOURSELF, `end` it, "
                    "and the next idle stop brings the next one. Every choice the brief leaves "
                    "open is yours to make: make it, write it in `journal update`, carry on. Ask "
                    "the user only if you cannot proceed without something only they can supply, "
                    "or the hook tells you that you are stalled — then `update` what was tried, "
                    f"`end`, `journal todo ask {nxt['n']} \"<what is stuck>\"`, and the next "
                    "stop names the next to-do.",
                )
            if ids and not auto and ids != state.get(ROOT, "todos_said", [], stem=ctx.stem):
                state.put(ROOT, "todos_said", ids, stem=ctx.stem)
                return _context(
                    "Stop",
                    f"journal: {len(ids)} to-do(s) waiting on track `{here}` (`journal todo`). "
                    "Delayed work, not an instruction to start any of it — the user decides.",
                )
        return 0

    # THE HOLD FLOOR IS THE HIGHER OF TWO MARKS. `held_at` is where a hook last held
    # somebody; `floor` is where it first saw this transcript. Both are this transcript's.
    held_at = max(state.get(ROOT, "held_at", 0, stem=ctx.stem), floor)
    newest = missing[-1].n
    if newest <= held_at:
        return 0  # already held for these; do not trap the turn
    # Only what is NEW since the last hold. Re-listing lines already raised trains the
    # reader to skim the block, and the one line that matters is then skimmed with it.
    fresh = [m for m in missing if m.n > held_at]
    state.put(ROOT, "held_at", newest, stem=ctx.stem)

    # THE VOCABULARY IS TAUGHT ONCE. Measured by being on the receiving end of this hook:
    # the full list is worth reading the first time and is noise every time after, and a
    # block that is skimmed teaches the reader to skim the next one — which is how an
    # interrupt becomes ambience. So the reminder tapers to the size of the offence.
    taught = state.get(ROOT, "taught_vocabulary", False, stem=ctx.stem)
    shown = fresh[-3:]
    lines_out = [
        f"{len(fresh)} message(s) since the last nudge carried no tag, so the journal "
        f"filed nothing for them:"
    ]
    lines_out += [f"  line {m.n}: {' '.join((m.text or '').split())[:90]}…" for m in shown]
    if not taught:
        state.put(ROOT, "taught_vocabulary", True, stem=ctx.stem)
        lines_out.append(
            "\nA compaction takes exactly what was not filed. Open your next message with "
            "one of:\n"
            + "\n".join(f"  [!{t.name}]  {t.line}" for t in tags.TAGS.values())
            + "\n\nThe tag rides on a message you were sending anyway — there is no command "
            "to run."
        )
    else:
        lines_out.append(
            "\nTag the next one: "
            + " ".join(f"[!{t}]" for t in tags.TAGS)
        )
    lines_out.append("This will not hold you again for these lines.")
    return _hold(
        f"{len(fresh)} untagged message(s)",
        f"journal: {len(fresh)} message(s) carried no tag (last: line {fresh[-1].n}) — open the "
        "next one with " + " ".join(f"[!{t}]" for t in tags.TAGS),
    )


#: Tools whose ENTIRE PURPOSE is to change a file. No judgement needed for these.
WRITE_TOOLS = frozenset({"Edit", "Write", "NotebookEdit", "MultiEdit", "Update"})

#: Commands whose job is to change something. Matched as the COMMAND, never as text.
WRITE_CMDS = frozenset({
    "rm", "rmdir", "mv", "cp", "mkdir", "touch", "chmod", "chown", "truncate", "dd",
    "tee", "install", "patch", "ln", "unlink", "rsync",
})

#: `git` is only a write in some of its moods.
WRITE_GIT = frozenset({"commit", "apply", "checkout", "reset", "restore", "rm", "mv", "add"})

#: Where one command ends and the next begins. A write anywhere in a chain is a write.
_SPLIT = re.compile(r"[;&|]+|\n")
#: Quoted text is DATA, not a command, and it must be removed before anything is matched.
_QUOTED = re.compile(r"'[^']*'|\"[^\"]*\"")
#: A HEREDOC BODY IS DATA TOO, and it is the biggest body of text a command ever carries.
#: In auto mode nearly every analysis runs as `python3 - <<'PY' … PY`, and a script that
#: says `if shown >= 6` was being read as a shell redirection and denied as a write. The
#: opening `<<WORD` is kept, so `cat > file <<EOF` is still a write on the strength of its
#: own `>` — what is dropped is only what the interpreter, not the shell, will read.
_HEREDOC = re.compile(r"<<-?\s*'?\"?([A-Za-z_][A-Za-z0-9_]*)'?\"?.*?(?:\1|$)", re.S)


#: Pieces that change nothing and may lead a line: moving into a directory, setting a
#: variable. `cd proj && journal start "w" && git checkout -b x` declares before it writes.
_NEUTRAL = frozenset({"cd", "pushd", "popd", "export", "set", "true", ":"})
_REDIR = re.compile(r"^\d*>{1,2}(.*)$")


def _piece_is_write(words: list[str]) -> bool:
    """Does this one command of a chain change something on disk?"""
    if not words:
        return False
    for i, w in enumerate(words):
        m = _REDIR.match(w)
        if not m:
            continue
        target = m.group(1) or (words[i + 1] if i + 1 < len(words) else "")
        # `2>&1` and `>&2` move a file descriptor (`>&` was marked `>@` by `_pieces`);
        # `>/dev/null` throws output away. Both appear in ordinary reading — `2>&1` was
        # the third false positive this gate produced in a day, and every one stopped a
        # read.
        if target.startswith("@") or target.startswith("/dev/null"):
            continue
        return True
    verb = words[0]
    if _is_journal_verb(verb) or verb in _NEUTRAL:
        return False
    if verb in WRITE_CMDS:
        return True
    if verb == "sed" and "-i" in words:
        return True
    if verb == "git" and len(words) > 1 and words[1] in WRITE_GIT:
        return True
    return False


def _is_write(payload: dict) -> bool:
    """Is this tool call about to change something on disk?

    MATCHED AS A COMMAND, NEVER AS TEXT. The first version tested substrings — `"patch "`
    in the command line — and denied this, which is a pure read:

        cat resources/js/view/triggers.ts; echo "=== useDispatch ==="; cat …

    `useDis` + `patch ` matched inside a heading being echoed. The agent was reading, and
    it was made to declare work before it had learned enough to say what the work was.
    That is the worst possible failure for a gate: it fires on discovery, which is exactly
    when nobody can yet name the thing they are about to do, so it teaches that the gate is
    an obstacle to get around rather than a prompt to answer. Word boundaries are not a
    detail here; they are the difference between a prompt and a nuisance.

    So: quoted text is stripped first — it is data, not a command — the line is split on
    the separators that end a command, and each piece is judged by its FIRST WORD. The
    journal's own commands are never a write, but only THAT piece is exempt: the first
    version waved through any line that mentioned journal.py anywhere, so
    `journal todo "x" && rm -rf build` was not a write.
    """
    name = payload.get("tool_name") or ""
    if name in WRITE_TOOLS:
        return True
    if name != "Bash":
        return False
    cmd = str((payload.get("tool_input") or {}).get("command", ""))
    return any(_piece_is_write(w) for w in _pieces(cmd))


def _is_journal_verb(word: str) -> bool:
    return word == "journal" or word.endswith("journal.py")


def _pieces(cmd: str) -> list[list[str]]:
    """Each command of a chain as its words, quotes and heredoc bodies removed.

    NEWLINES ARE SEPARATORS, SO THEY ARE NOT COLLAPSED FIRST. The first version joined
    the whole command on spaces before splitting, and `cd proj\njournal start "w"` became
    one piece whose verb was `cd` — the `start` on the second line was never seen, and a
    line that declared before it wrote was denied. Heredoc bodies are removed on the raw
    text, where the newlines still say where a body begins and ends.

    `>&` IS A FILE-DESCRIPTOR DUP, NOT A SEPARATOR. Splitting on `&` cut `2>&1` into a
    redirect with no target, which read as a write, and stopped a read.
    """
    bare = _QUOTED.sub(" ", _HEREDOC_BODY.sub(r"\1", cmd)).replace(">&", ">@")
    out = []
    # A VARIABLE SET EARLIER IN THE LINE IS RESOLVED. `J=.journal/journal.py; $J remember`
    # is a common shape, and read literally its verb is `$J`, which is nobody's command:
    # the rung gate denied the very pin it was asking for. Only the simple form is
    # followed — NAME=value, then $NAME or ${NAME} leading a later piece.
    names: dict[str, str] = {}
    for piece in _SPLIT.split(bare):
        words = piece.split()
        while words and ("=" in words[0] or words[0] in ("sudo", "env", "time", "nohup")):
            w = words.pop(0)
            if "=" in w and w[0] not in "$-" and w.split("=", 1)[0].isidentifier():
                names[w.split("=", 1)[0]] = w.split("=", 1)[1]
        if words:
            head = words[0]
            if head.startswith("$"):
                head = names.get(head.strip("${}"), head)
            words[0] = head.rsplit("/", 1)[-1]
            out.append(words)
    return out


#: What a journal read is piped through. `journal --back=1 | head -40` is still reading.
_FILTERS = frozenset({"head", "tail", "grep", "cut", "wc", "sort", "uniq", "tr", "cat",
                      "less", "more", "fold", "column", "awk"})

def _declared_first(payload: dict) -> bool:
    """Does every write in this line come after a `journal start` in the same line?

    `journal start "w" && git commit` declares and then writes, in that order, which is
    exactly what the gate asks for. `cd proj && journal start "w" && git checkout -b x`
    too: `cd` changes nothing. `git add && journal start "w"` does not qualify — the
    write would run undeclared. The same shape the rung gate accepts: the deciding
    command leads, and neutral pieces before it do not count.
    """
    declared = False
    for words in _pieces(str((payload.get("tool_input") or {}).get("command", ""))):
        if _is_journal_verb(words[0]) and len(words) > 1 and (
                words[1] == "start" or (words[1] == "todo" and len(words) > 2 and words[2] == "start")):
            declared = True
        elif _piece_is_write(words) and not declared:
            return False
    return declared


#: The journal verbs that answer a context rung. A chain that OPENS with one of these has
#: decided before anything after it runs, so the rung gate lets the whole line through.
DECIDES = frozenset({"remember", "rule", "nothing"})


def _is_journal(payload: dict) -> bool:
    """May this call pass the rung gate? Journal-only lines, or a line that decides first.

    `journal search x` and `journal conversation --back=1` are how the decision gets made, so a line of
    nothing but journal commands passes. `journal remember "…" && git commit` passes too:
    the decision runs first and lifts the gate before the commit. `ls && journal nothing
    "…"` does not — the `ls` would run undecided.
    """
    if (payload.get("tool_name") or "") != "Bash":
        return False
    pieces = [w for w in _pieces(str((payload.get("tool_input") or {}).get("command", "")))
              if w[0] not in _NEUTRAL]
    if not pieces:
        return False
    if (any(_is_journal_verb(w[0]) for w in pieces)
            and all(_is_journal_verb(w[0]) or w[0] in _FILTERS for w in pieces)):
        return True
    first = pieces[0]
    return _is_journal_verb(first[0]) and len(first) > 1 and first[1] in DECIDES


#: Where a `remember` stops on a command line: the next shell separator or redirection.
_SEPARATORS = frozenset({"&&", "||", ";", "|", "&"})
_REDIRECT = re.compile(r"^\d*[<>]")

#: A HEREDOC BODY, ON THE RAW COMMAND. The opener's line is kept and everything from the
#: next line to the terminator is dropped. Distinct from `_HEREDOC` above, which runs on a
#: whitespace-collapsed line; this one needs the newlines to know where the body starts.
#: Caught live: a patch script piped through `python3 - <<'PY'` mentioned
#: `journal.py remember "<the claim>"` in a string, and the pin gate denied the patch.
_HEREDOC_BODY = re.compile(r"(<<-?\s*['\"]?(\w+)['\"]?[^\n]*)\n.*?(?:\n\2(?=\n|$)|\Z)", re.S)


def _pin_overflow(payload: dict, limit: int) -> str | None:
    """The refusal a `journal remember` on this command line would earn, before it runs.

    THE COMMAND'S OWN EXIT 1 WAS NOT ENOUGH. It is a line of stderr after the fact, and a
    reader in the middle of a thought reads past it and carries on believing the pin
    stands. A denied tool call is not readable past: the command never ran, and the reason
    is the whole of what comes back. So the fact is read off the command line here — the
    same tokens `journal.py` would join — and judged by the same function the CLI uses.

    If the line cannot be parsed it is left to the CLI: a gate that guesses at a quoting
    it did not understand would deny reads, and that is the failure this file keeps
    measuring. The miss costs one refused command; the guess costs trust in the gate.
    """
    if (payload.get("tool_name") or "") != "Bash":
        return None
    cmd = str((payload.get("tool_input") or {}).get("command", ""))
    if "journal" not in cmd or not ("remember" in cmd or "rule" in cmd):
        return None
    import shlex
    # ONE LINE AT A TIME. A newline ends a command as surely as `&&`, and shlex treats it
    # as whitespace: a rule of 330 characters followed by four more commands on their own
    # lines was measured as 536 and refused, with the next four commands quoted back as
    # the part to cut.
    for line in _HEREDOC_BODY.sub(r"\1", cmd).splitlines():
        if "journal" not in line or not ("remember" in line or "rule" in line):
            continue
        try:
            toks = shlex.split(line)
        except ValueError:
            continue
        for i, t in enumerate(toks):
            if t not in ("remember", "rule") or i == 0 or "journal" not in toks[i - 1]:
                continue
            fact = []
            for t2 in toks[i + 1:]:
                # A redirection ends the fact as surely as a pipe: `2>&1 | tail -1` was
                # being counted as five characters of claim.
                if t2 in _SEPARATORS or _REDIRECT.match(t2):
                    break
                if t2.startswith("--"):
                    continue
                fact.append(t2)
            got = pins.refused(" ".join(fact), limit)
            if got:
                return got
    return None


#: Journal verbs that WRITE. A subagent may read the record; it may not change it.
JOURNAL_WRITES = frozenset({"start", "end", "update", "remember", "strike", "switch", "nothing",
                            "rule", "promote", "todo", "docs"})


def _journal_write(payload: dict) -> str | None:
    """The journal write verb on this command line, if it is one, anywhere in a chain."""
    if (payload.get("tool_name") or "") != "Bash":
        return None
    if "journal" not in str((payload.get("tool_input") or {}).get("command", "")):
        return None
    import shlex
    try:
        toks = shlex.split(str((payload.get("tool_input") or {}).get("command", "")))
    except ValueError:
        return None
    for i, t in enumerate(toks[:-1]):
        verb = toks[i + 1]
        if "journal" not in t or verb not in JOURNAL_WRITES:
            continue
        nxt = toks[i + 2] if i + 2 < len(toks) else ""
        # `docs` and `todo` are read verbs too: `docs`, `docs 4`, `todo`, `todo 3` change nothing.
        if verb == "docs" and nxt not in DOCS_WRITES:
            continue
        if verb == "todo" and (not nxt or nxt.isdigit() or nxt.startswith("-")):
            continue
        return verb
    return None


DOCS_WRITES = frozenset({"add", "part", "replace", "strike", "final", "draft", "abstract", "supersede", "index"})


def _subagent(payload: dict) -> bool:
    """Is this event a subagent's? Its payload carries `agent_id`; the session's own do not.

    THE JOURNAL IS THE ORCHESTRATOR'S. A subagent is dispatched with a brief and reports
    back; what it decides is the orchestrator's to file, and what it reads fills its own
    window, not the one the marks are about. So a subagent's events file nothing, are held
    for nothing, and are nudged for nothing — and a subagent's attempt to WRITE the record
    is denied, because a pin nobody in the main conversation saw written is a fact of
    unknown provenance in the highest-authority position the system has.
    """
    return bool(payload.get("agent_id"))


def on_pre_tool(conf: dict, payload: dict, ctx: Ctx) -> int:
    """Refuse a write while no work is open. The one rule that stands IN THE PATH of an act.

    Everything else here is a nudge after the fact: the stop hook says a message went
    unfiled once it is already unfiled, and the agent can read past it. Measured on a live
    session doing eight hours of real work — 843 lines, every message dutifully tagged, and
    `journal start` run EXACTLY ZERO TIMES. The free thing got used and the costly one did
    not, which is what always happens when one rule is a side effect and the other is a
    discipline.

    So this is the second rule, and it is deliberate that there are now two. A gate is
    expensive — it stops work — and it earns that only where a nudge has been shown not to
    land. That evidence now exists.

    IT NAMES THE WAY OUT IN THE MESSAGE, and the way out is one command. A gate that says
    "denied" without saying how to proceed is an obstacle; one that hands you the next line
    is a prompt. And it never blocks `journal.py` itself, because declaring the work is the
    escape and a gate that locks its own door is a trap.
    """
    # The first event a transcript's hook sees is nearly always a tool call, so this is
    # where a session joined late gets its floor. One small read, once.
    _floor(ctx)
    over = _pin_overflow(payload, conf["pin_max_chars"])
    if over:
        return _deny("That pin would be refused, so the command is not run.\n" + over)
    # A RUNG WAS ANNOUNCED AND NOTHING WAS DECIDED. The hold at the stop was measured and
    # did not land — the user had to ask for the pin — so until `remember` or `nothing`
    # has run, no other tool does. Reads too, this once: the decision needs thought, not
    # more files, and the transcript stays readable through the journal's own commands,
    # which are never gated because they are the way out.
    if not _is_journal(payload):
        put_off = _deferral(conf, ctx)
        if put_off:
            return _deny(put_off[0] + "\n\n" + put_off[1])
    due = state.get(ROOT, "pin_due", None, stem=ctx.stem)
    if due and not _is_journal(payload):
        pct = 100 * due["used"] / due["window"] if due.get("window") else 0
        return _deny(
            f"CONTEXT IS {pct:.0f}% FULL and nothing has been decided about what must "
            f"outlive it. This call is denied until one of these has run:\n"
            '  .journal/journal.py remember "<the claim, in one line>"\n'
            '  .journal/journal.py nothing "<why nothing here needs pinning>"\n'
            "Nothing is the right answer more often than not — say so and carry on. "
            "`journal search`, `journal conversation --back=1` and `journal pins` still run, to decide with."
        )
    if not conf["gate_writes_on_start"] or "gate" in conf["silenced"]:
        return 0
    if not _is_write(payload) or work.open_work(ROOT) or _declared_first(payload):
        return 0
    return _deny(
        "Nothing is open, so this edit would not be filed against any work. Say what "
        "you are doing first — one line, and then this stops asking:\n"
        '  .journal/journal.py start "<the work, in your own words>"\n'
        "Close it with `end` when it is done. Reads are never gated; only changes."
    )


def _deny(reason: str) -> int:
    """Refuse the tool call, with the way out in the message. The one hold before an act."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))
    return 0


_MD_WRITE = re.compile(r"(?:>>?|tee(?:\s+-a)?)\s*['\"]?([^\s'\"|;&]+\.md)\b")


def _raw_markdown(conf: dict, payload: dict, ctx: Ctx) -> str | None:
    """A markdown file written by hand, not through the journal: a hint, once per file.

    A HINT, NEVER A HOLD. The user's ruling. Writing docs by hand is fine and sometimes
    right — a README, a changelog — but a design or a report written as a loose file is
    one the catalogue does not know, no session is handed, and search does not find. So
    the first write to a given .md file says so, once, and names the command. The
    journal's own writes are exempt, and so is anything already catalogued: editing a
    doc's own file by hand is how a human maintains it.
    """
    if "markdown_hint" in conf["silenced"]:
        return None
    name = payload.get("tool_name") or ""
    inp = payload.get("tool_input") or {}
    path = ""
    if name in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
        path = str(inp.get("file_path") or "")
    elif name == "Bash":
        cmd = str(inp.get("command") or "")
        # the journal's own commands are exempt — judged by the verb, not by the substring,
        # because `.journal/docs/x.md` contains the word too
        if any(_is_journal_verb(w[0]) for w in _pieces(cmd)):
            return None
        m = _MD_WRITE.search(cmd)
        path = m.group(1) if m else ""
    if not path.endswith(".md"):
        return None
    try:
        rel = str(Path(path).resolve().relative_to(ROOT.parent.resolve()))
    except ValueError:
        rel = path
    if rel.startswith(".claude/") or rel.lower().startswith("readme") or (
            rel.startswith(".journal/") and not rel.startswith(".journal/docs/")):
        return None
    try:
        for d in docs._load(ROOT):
            if d["path"].resolve() == Path(path).resolve() or any(
                    x["path"].resolve() == Path(path).resolve() for x in d["parts"]):
                return None
    except Exception:
        pass
    said = state.get(ROOT, "md_hinted", [], stem=ctx.stem) or []
    if rel in said:
        return None
    state.put(ROOT, "md_hinted", (said + [rel])[-50:], stem=ctx.stem)
    return (
        f"journal: {rel} is a markdown file written outside the journal. Not a problem — but if "
        "it is a design, a report or a finding, the docs catalogue is where it is handed to every "
        "session and found by search:\n"
        '  .journal/journal.py docs add "<title>" --abstract "<one line>" --brief < the file\n'
        '  .journal/journal.py docs part <n> "<title>" --brief < the file      as a part of doc n\n'
        "A README or a changelog is fine as it is. Said once per file."
    )


def _stall(conf: dict, ctx: Ctx) -> str | None:
    """Many tool calls on one started to-do with no progress filed: say so, once.

    THE MEASUREMENT BEHIND "SPENDING TOO MUCH TIME WITHOUT RESULT". With auto on the
    agent must decide for itself, and the one thing it cannot judge from inside is how
    long it has been going round. So the hook counts tool calls since the to-do was
    started and, past the setting, says so once — unless an `update` has been filed on the
    work since the last count, which is the agent saying it moved. A nudge, not a hold: the
    agent may well be one call from done. Fires at most once per to-do per multiple of
    the setting, so a long to-do with real progress notes is left alone.
    """
    limit = conf["stall_calls"]
    if not limit or "stall" in conf["silenced"]:
        return None
    here = tracks.current(ROOT)
    started = [t for t in todo.open_items(ROOT, here) if t.get("started")]
    if not started:
        return None
    t = started[-1]
    mark = state.get(ROOT, "stall", {}, stem=ctx.stem) or {}
    if mark.get("n") != t["n"]:
        mark = {"n": t["n"], "calls": 0, "updates": 0, "said": 0}
    mark["calls"] = mark.get("calls", 0) + 1
    standing = [w for w in work.open_work(ROOT) if w["subject"].lower() == t["title"].lower()]
    updates = len(standing[0].get("notes", [])) if standing else 0
    if updates > mark.get("updates", 0):
        mark.update({"updates": updates, "calls": 1, "said": 0})  # progress was filed: this call starts a new count
    state.put(ROOT, "stall", mark, stem=ctx.stem)
    if mark["calls"] < limit or mark.get("said"):
        return None
    mark["said"] = 1
    state.put(ROOT, "stall", mark, stem=ctx.stem)
    return (
        f"journal: {mark['calls']} tool calls on to-do {t['n']} ({t['title']}) with no progress "
        "filed. If there is a measurable result, file it — `journal update \"<what moved>\"` — "
        "and carry on. If there is not, stop pouring time in: `update` what was tried, `end` "
        f"the work, `journal todo ask {t['n']} \"<what is stuck>\"`, and move on."
    )


def _response_size(payload: dict) -> int:
    """How much this tool actually handed back, in characters."""
    r = payload.get("tool_response")
    if isinstance(r, str):
        return len(r)
    if isinstance(r, dict):
        for key in ("stdout", "content", "output", "text"):
            v = r.get(key)
            if isinstance(v, str):
                return len(v)
            if isinstance(v, list):
                return sum(len(x.get("text", "")) for x in v if isinstance(x, dict))
    return len(json.dumps(r)) if r is not None else 0


def on_post_tool(conf: dict, payload: dict, ctx: Ctx) -> int:
    """Say what a tool call cost, at the moment it cost it — and almost never say it.

    THE SIZE IS A FACT AND THE COMMAND IS A GUESS. The first shape of this was going to
    check whether a bash line contained a `grep` or a `head`, and refuse it if not. That
    reads the intent instead of the result: a piped `grep` can still return forty thousand
    characters, and a bare `cat` of a short file costs nothing. What is worth saying is
    what actually came back, which is measured and cannot be argued with.

    IT SPEAKS ONLY ON A NEW RECORD. Not every large result — the LARGEST SO FAR in this
    context, above a floor. That is the rate limit, and it is self-decaying: the second
    40k read after a 60k one says nothing, and a session settles into silence on its own
    without a counter or an interval. Every rule in here that fired on a condition rather
    than a record ended up teaching the reader to skim it — eleven wrong nudges to catch
    three — and a per-tool complaint is the worst possible place for that, because it lands
    mid-thought where the agent is least able to weigh it.

    SUBAGENTS ARE OUT OF THIS. When this mark was project-wide, three critics reading the
    package raised it from 28,780 to 83,700 and the parent session was silenced by output
    it never saw. A subagent's events go to `on_subagent_post` instead, which hands it the
    rules and nothing else.
    """
    _floor(ctx)
    # THE CONTEXT LADDER, MID-WORK. Only with the window set: a tail reading has no peak
    # to infer one from, and the ladder never climbs a guess.
    window = conf["context_window"] or (state.get(ROOT, "window", 0) or 0)
    if window and ctx.path is not None and "context" not in conf["silenced"]:
        used = context.reading_tail(ctx.path)
        if used is not None:
            got = (used / window, used, window, True)
            rung = _rung(conf, ctx, got)
            if rung:
                return _context("PostToolUse", rung[1] + "\n\n" + rung[2])
    hint = _raw_markdown(conf, payload, ctx)
    if hint:
        return _context("PostToolUse", hint)
    stalled = _stall(conf, ctx)
    if stalled:
        return _context("PostToolUse", stalled)
    if "tool_cost" in conf["silenced"]:
        return 0
    floor = conf["tool_cost_floor"]
    if not floor:
        return 0
    size = _response_size(payload)
    if size < floor or size <= state.get(ROOT, "biggest_result", 0, stem=ctx.stem):
        return 0
    state.put(ROOT, "biggest_result", size, stem=ctx.stem)
    name = payload.get("tool_name") or "that tool"
    return _context(
        "PostToolUse",
        f"THAT {name} CALL RETURNED {size:,} CHARACTERS — the largest this session, and it "
        f"is in the context now for good.\n"
        f"If you need it, fine. If you were looking for one thing in it, the next one can "
        f"be narrower: grep for the line, sed a range, head the file. Nothing to run and "
        f"nothing to undo — this is said once per new record, not per call.",
    )


# `on_message_display` LIVED HERE and wrote `last_untagged`, which nothing ever read. The
# event is real in the harness but was never wired for this package, and a handler whose
# only output is a key nobody reads is a write that reports success and lands nowhere.


def _hold(label: str, brief: str, text: str = "") -> int:
    """Hold the stop: a small label for the user, the instruction and reasoning for the agent.

    The user asked for less: the one-line instruction was still the agent's business
    rendered in their terminal at every hold, under a heading that calls it an error. So
    the reason — the only half the harness prints — is now a label saying that the journal
    reminded Claude and of what, in a few words. The instruction line leads the context
    block, so the agent still reads it first.

    The first version did this with `exit 2` + stderr, which works — and which the harness
    renders to the user as `Stop hook error`. `decision: "block"` was the same hold said
    properly: exit 0, the turn continues so the agent can act. The harness still labels
    the block's reason an error on the user's screen, and prints ALL of it — twenty lines
    of reasoning about pins, every stop, in the user's terminal, for a nudge addressed to
    the agent.

    So the hold has two halves. `reason` is ONE LINE, and it is the whole instruction: what
    happened and the one thing to do, so an agent that received nothing else could still
    act. `additionalContext` carries the reasoning, which the harness delivers to the agent
    and folds away on the user's side. The user sees one line and can open it; the agent
    reads the rest.
    """
    # THE HARNESS PRINTS BOTH HALVES TO THE USER. Measured: "Stop hook feedback:" followed
    # by the whole reasoning, in the terminal, for an untagged message. So a hold carries
    # its one-line instruction and nothing else; the reasoning is in the skill's hold
    # table, read on demand. The context rung is the exception: its text IS the decision
    # material — what stands, what fills the window, the rules — and it fires four times
    # a session at most.
    print(json.dumps({
        "decision": "block",
        "reason": f"journal reminded Claude: {label}",
        "hookSpecificOutput": {"hookEventName": "Stop",
                               "additionalContext": brief + ("\n\n" + text if text else "")},
    }))
    return 0


#: Events whose `hookSpecificOutput.additionalContext` the harness ACCEPTS. Measured, not
#: assumed: PreCompact is not among them, and emitting it there is rejected by schema
#: validation — the hook runs, exits 0, writes its state, and its payload is thrown away.
#: That is a third state past wired-and-fired: ACCEPTED. This list is the one place it
#: lives, so a handler cannot quietly address an event that will not listen.
DELIVERS_CONTEXT = frozenset({
    "UserPromptSubmit", "PostToolUse", "PostToolBatch", "Stop", "SubagentStop",
    "SessionStart",
})


def _context(event: str, text: str) -> int:
    """Hand the harness something to put in front of the agent.

    Refuses an event that cannot carry it. A rejected payload looks identical to a
    delivered one from in here — same exit 0, same written state — so the refusal is
    LOUD: it goes to stderr and to the user, because a delivery that fails invisibly is
    the one shape this system exists to prevent.
    """
    if event not in DELIVERS_CONTEXT:
        print(
            f"journal: {event} cannot carry additionalContext — the harness rejects it. "
            f"{len(text.splitlines())} lines were NOT delivered.",
            file=sys.stderr,
        )
        return 0
    print(json.dumps({"hookSpecificOutput": {"hookEventName": event,
                                             "additionalContext": text}}))
    return 0


# `on_pre_compact` LIVED HERE. PreCompact cannot shape the summary — the harness accepts no
# additionalContext on it, verified by having the payload rejected while the hook exited 0
# — and the one thing left for it to do was write `compacted_pending`, which nothing read.
# The bridge that delivers is SessionStart(source="compact"), on the far side of the loss.
# A doorbell wired to a handler that does nothing is the wired-and-silent shape `verify`
# exists to report, so the event is no longer wired at all.


def carried(source: str = "compact") -> str:
    """Exactly what a session is handed at its start, built without writing anything.

    THE INJECTED BLOCK IS THE ONE THING NOBODY COULD LOOK AT. It is assembled inside a
    hook, delivered to a context the user cannot read, and until now the only way to see it
    was to pipe a fake payload into the hook — which also wrote state, so looking changed
    the thing being looked at. A mechanism whose output is invisible until it fires is the
    shape this whole package exists to argue against, and this one had it.

    So the assembling lives here, pure, and the handler is what writes. `journal carry`
    reads it and nothing moves.

    THE STORE IS DELIVERED AT EVERY START. The journal is shared by every session, and a
    session that starts fresh, or after `/clear`, or as a fork, has lost as much as one that
    compacted. Only the closing paragraph about "the summary you are holding" is kept for a
    compaction, because on any other source there is no summary and a message claiming one
    is a nudge about an event that did not happen.
    """
    here = tracks.current(ROOT)
    parts = [
        # THE RULES ARE SAID AT THE START, NOT ONLY ENFORCED AT THE STOP. Until this, the
        # vocabulary reached the agent exactly one way: by being held for breaking it. A
        # system whose rules are learnable only through their own violation trains the
        # reader that a rule is something that appears after a mistake — and this one is
        # supposed to be the opposite of that.
        #
        # WHICH TRACK OF WORK THIS IS comes first: a fresh agent inherits a track it did
        # not choose and cannot see, and every pin and open item below belongs to that one.
        f"THE JOURNAL IS IN FORCE HERE — you are on track `{here}`"
        " (`journal tracks` for the others).\nOpen every message with exactly one tag:\n"
        + "\n".join(f"  [!{t.name}]  {t.line}" for t in tags.TAGS.values())
        + "\n\nThe tag is free — it rides on a message you were sending anyway. Work is "
        "not:\n"
        "  journal start \"<the work>\"     declare it\n"
        "  journal update \"<what moved>\"  progress on it — a command, never a tag\n"
        "  journal end \"<the same words>\" close it\n"
        "  journal remember \"<fact>\"      survives a compaction, on this track\n"
        "  journal rule \"<ruling>\"        survives on every track\n"
        "  journal todo \"<title>\"         delayed work, on this track\n"
        "WHEN THE USER ASKS FOR SOMETHING YOU ARE NOT WORKING ON AND IT CAN WAIT, park it: "
        "`journal todo \"<title>\"`, say you did, and carry on. It is listed at every start "
        "and picked up with `journal todo start <n>` when the user says so.\n\n"
        # THE BLOCK IS THE RULES; THE SKILL IS THE REASONING. This has to stay short — it
        # arrives at every session start and again after every compaction — so the why, the
        # refusals, and how to read the transcript back live in a skill that is loaded only
        # when somebody wants them.
        # THE REFLEX, AND IT IS THE HALF THAT WAS MISSING. Everything above tells the
        # agent how to WRITE the record. Nothing told it when to READ one — so the default
        # when asked about an earlier decision is to answer from whatever survived the
        # summary, confidently, which is exactly the failure the record exists to prevent.
        # A half-remembered ruling is worse than an admitted gap: it sounds like knowledge.
        "IF YOU ARE UNSURE WHAT WAS DECIDED, LOOK — do not answer from what survived:\n"
        "  journal search <term>   every line mentioning it, and who said it\n"
        "  journal conversation --back=1   the stretch the last summary replaced\n"
        "  journal user            the user's own words, in full\n"
        "The transcript lost nothing. Checking costs one command; guessing costs the "
        "user their own decision.\n\n"
        # THE SKILL IS WHERE "WHEN" LIVES. This block can only hold the rules; the skill
        # says when to pin and when not to, when to search instead of answering from
        # memory, and what each hold means. A reader who never loads it learns the rules
        # by being held for them, which is the shape this block was written to end.
        "LOAD THE `journal` SKILL before your first pin, rule, declaration or search in "
        "this session — it says WHEN to do each, with examples — and again whenever a "
        "hook holds or denies you."
    ]
    # RULES BEFORE PINS. A rule binds every track, so a reader meets the constraints
    # before the facts of the one track they happen to be on.
    ruled = pins.carry(ROOT, source, key=pins.RULES)
    if ruled:
        parts.append(ruled)
    # THE DOCS CATALOGUE, not the docs. One line each, so an agent knows what has been
    # settled before it re-investigates it; the doc itself is read on demand.
    catalogued = docs.carry(ROOT)
    if catalogued:
        parts.append(catalogued)
    pinned = pins.carry(ROOT, source)
    if pinned:
        parts.append(pinned)
    standing = work.open_work(ROOT)
    if standing:
        parts.append("STILL OPEN, from this or an earlier session:\n"
                     + "\n".join(f"  - {w['subject']}" for w in standing)
                     + "\n`journal open` shows where each got to.")
    waiting = todo.carry(ROOT, here)
    if waiting:
        parts.append(waiting)
    if source == "compact":
        parts.append(
            "THE SUMMARY YOU ARE HOLDING DROPPED WHAT WAS DECIDED. Before you touch anything:\n"
            "  .journal/journal.py conversation --back=1    the stretch that summary REPLACED\n"
            "  .journal/journal.py user        the user's own words, in full\n"
            "  .journal/journal.py open        work you declared and never closed\n"
            "The transcript lost nothing. Read it rather than half-remembering it."
        )
    return "\n\n".join(parts)


def on_subagent_post(conf: dict, payload: dict) -> int:
    """Hand a subagent the rules: on its first tool call, and again as its window fills.

    A RULE BINDS A SUBAGENT'S WORK. "A component is never a field on another component's
    State" is as true for the agent editing the PHP as for the one that dispatched it, and
    until this a subagent never saw it. Pins and open work stay out — those are the main
    conversation's, and the subagent cannot write the journal anyway — so this is rules
    only, with one line saying whose journal it is.

    NO SESSIONSTART FIRES FOR A SUBAGENT, so the block rides the first PostToolUse, which
    is measured to reach it. It comes back at the marks in `subagent_rules_ladder`, read
    from the SUBAGENT'S OWN transcript: the payload names the parent's, and the agent's
    sits one level down under it. Context, never a hold: there is nothing to decide.
    """
    aid = payload.get("agent_id") or ""
    stem = f"agent-{aid}"
    ruled = pins.live(ROOT, pins.RULES)
    if not ruled:
        return 0
    given = state.get(ROOT, "rules_at", None, stem=stem)
    passed: list[float] = []
    if given is None:
        given, passed = [], [0.0]
    else:
        own = transcript.find(ROOT.parent, stem)
        got = context.pressure(own, conf["context_window"]) if own else None
        if got and got[3]:
            passed = [r for r in sorted(conf["subagent_rules_ladder"]) if got[0] >= r and r not in given]
    if not passed:
        return 0
    # EVERY MARK CROSSED IS RECORDED, not only the highest: a step from 20% to 55% passes
    # two, and recording one would hand the block over again at the very next call.
    mark = passed[-1]
    state.put(ROOT, "rules_at", sorted(set(given) | set(passed)), stem=stem)
    lead = (
        "YOU ARE A SUBAGENT. The journal here is the main conversation's, not yours to write: "
        "report what you find and it decides what to file. These rules bind your work:"
        if mark == 0.0 else
        f"YOUR CONTEXT IS {mark:.0%} FULL. The rules of this project again, because a block "
        "read at the start is far behind you now:"
    )
    body = "\n".join(f"  - {r['fact']}" for r in ruled)
    return _context("PostToolUse", lead + "\n" + body)


def _prune() -> None:
    """Drop the runtime file of any transcript this machine no longer has.

    BY EVIDENCE, NEVER BY A COUNTER. A file is kept as long as its transcript is, however
    old, because `verify` counts these as proof the hook ran and nothing here deletes what
    it cannot account for. Subagent transcripts live one level down and are found there.
    Only `*.json` is touched: a writer's tmp is somebody else's file mid-flight.
    """
    project = ROOT.parent
    for stem, _ in state.runtime_files(ROOT):
        if transcript.find(project, stem) is None:
            try:
                state.runtime_file(ROOT, stem).unlink()
            except OSError:
                pass


def on_session_start(conf: dict, payload: dict, ctx: Ctx) -> int:
    """Hand the session the store, and mark that this hook is alive in this transcript.

    EVIDENCE THAT THIS RAN, written by the only thing that can write it. Until now the
    only proof a hook had fired was a HOLD, so a journal doing its job quietly — teaching
    the vocabulary at every session start and never needing to hold anybody — was
    indistinguishable from one that had never been invoked. `verify` would have called it
    dead. A hook that works has to leave a mark, or the check that looks for marks is
    measuring how often the agent misbehaves rather than whether the mechanism is alive.
    """
    source = payload.get("source") or "startup"
    _floor(ctx)
    state.put(ROOT, "session_started", source, stem=ctx.stem)
    if source == "compact" and ctx.path is not None and not conf["context_window"]:
        peak = context.peak_before_compaction(ctx.path)
        if peak and not state.get(ROOT, "window", 0):
            state.put(ROOT, "window", context.window_from_peak(peak))
    tracks.carried(ROOT, tracks.current(ROOT), ctx.stem)
    _prune()
    block = carried(source)
    # WHAT CHANGED SINCE THIS TRANSCRIPT LAST SAW THE JOURNAL, once. An upgrade writes the
    # version pair to the record; each transcript is handed the changelog the first time
    # it starts on the new version, and never again.
    up = state.get(ROOT, "upgraded", None)
    seen = state.get(ROOT, "seen_version", "", stem=ctx.stem)
    now = update.current(ROOT)
    if up and up.get("to") == now and seen != now:
        log = (ROOT / "CHANGELOG.md").read_text() if (ROOT / "CHANGELOG.md").is_file() else ""
        text = update.render_since(log, str(up.get("from", "0")), now)
        if text:
            block = text + "\n\n" + block
    state.put(ROOT, "seen_version", now, stem=ctx.stem)
    if "update_check" not in conf["silenced"]:
        note = update.notice(ROOT)
        if note:
            block += "\n\n" + note
    return _context("SessionStart", block)


#: EVERY EVENT, IN ONE TABLE. The harness has to name this script once per event it should
#: hear about — that part is its rule, not ours — but the script is a single door, and what
#: happens behind it is decided in exactly one place.
#:
#: Every handler takes the same triple — settings, payload, and which transcript this is —
#: and uses what it needs, so the table is the whole routing story. The lowercase spellings
#: are the same events as the harness has also spelled them; an unknown event is silence,
#: because a doorbell that argues with a caller it does not recognise is worse than one
#: that does not ring.
HANDLERS = {
    "Stop": on_stop,
    "stop": on_stop,
    "UserPromptSubmit": on_user_prompt,
    "user-prompt-submit": on_user_prompt,
    "SessionStart": on_session_start,
    "session-start": on_session_start,
    "PreToolUse": on_pre_tool,
    "pre-tool-use": on_pre_tool,
    "PostToolUse": on_post_tool,
    "post-tool-use": on_post_tool,
}


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0  # a doorbell that crashes on a payload it did not expect is worse than none
    conf, problems = settings_mod.load(ROOT)
    for p in problems:
        print(f"journal: {p}", file=sys.stderr)

    event = payload.get("hook_event_name") or payload.get("event") or ""
    handler = HANDLERS.get(event)
    if handler is None:
        return 0
    state.retire_old(ROOT)
    # SUBAGENTS ARE OUT, AT THE DOOR. Measured across ten subagent transcripts: Stop does
    # not fire for them today, only the tool events do. Closing every event here rather
    # than inside two handlers means a harness that starts firing more of them changes
    # nothing. The one thing a subagent's event can still do is be refused a journal write.
    if _subagent(payload):
        if handler is on_pre_tool:
            verb = _journal_write(payload)
            if verb:
                return _deny(
                    f"`journal {verb}` from a subagent is refused: the journal is the main "
                    f"conversation's. Report what you found and let it decide what to file. "
                    f"Reads (`search`, `pins`, `open`, `--back`) are fine."
                )
            return 0
        if handler is on_post_tool:
            return on_subagent_post(conf, payload)
        return 0
    ctx = _ctx(payload)
    if ctx is None:
        print(f"journal: {event} payload names no session or transcript — nothing filed",
              file=sys.stderr)
        return 0
    # A CRASH IS WORSE THAN SILENCE. A traceback here is rendered to the user as a hook
    # error, which teaches that the journal is broken where it was only surprised. Say
    # what happened on stderr and let the turn go on.
    try:
        return handler(conf, payload, ctx)
    except Exception as e:  # noqa: BLE001
        print(f"journal: {event} handler failed ({type(e).__name__}: {e}) — nothing filed",
              file=sys.stderr)
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
