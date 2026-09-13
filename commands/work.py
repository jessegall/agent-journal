from __future__ import annotations

import time

import fmt
import pins
import settings as settings_mod
import state
import todo
import tracks
import work
from app import answer, now, refuse, root, stem, where
from command import Command, Parsed
from templates import render
from templates import render

NOUNS = (("work",), ("start",), ("end",), ("open",), ("next",))


REFUSALS = {
    "minutes": "--for wants minutes, got {value}",
    "pid": "--pid wants a number, got {value}",
}


def minutes(value: str) -> float:
    try:
        return float(value)
    except ValueError:
        raise ValueError(render(REFUSALS["minutes"], value=repr(value))) from None


def pid(value: str) -> int:
    try:
        return int(value)
    except ValueError:
        raise ValueError(render(REFUSALS["pid"], value=repr(value))) from None


def agent(value: str) -> str | None:
    return value.strip() or None


TEXT = {
    "end_words": 'work end wants the words: journal work end "<the work>"',
    "capped": "a wait is capped at {cap} minute(s) — nothing waits longer without saying so again",
    "todo_closed": "  to-do {n} is done with it.",
    "todo_note": "  {note}",
    "todo_stays": "  to-do {n} has this title and STAYS OPEN — ending work is not finishing a row:\n"
                  '    journal todos done {n} "<how>"   it is finished\n'
                  '    journal work end "<the same words>" --todo   both, in one command',
    "taught": "  did that teach anything a later reader would get wrong without?\n"
              '    journal pins add "<the claim, in one line>"   (or nothing, which is fine)',
    "false_claims": "  and did it make any of the {standing} standing claim(s) FALSE? work that changes code\n"
                    "    is what makes a pin describe a version that is gone:\n"
                    '    journal pins strike <n> "<why>"   ·   journal rules strike <n> "<why>"',
    "open_none": "Nothing is open.",
    "open_title": "OPEN WORK",
    "open_sub": "declared and never closed",
    "open_subject": "  {subject}",
    "open_since": "since {since}",
    "open_note": "{at}  {text}",
    "disabled": "hooks are disabled. `journal enable` turns them back on.",
    "next_open": "Open work: {subjects:; }",
    "next_carry_on": 'Carry on with it; `journal work end "<the same words>"` when it is done, or\n'
                     '`journal work await "<what you wait on>" --pid=<n>|--agent=<id>` if it is in flight on\n'
                     "something you cannot hurry.",
    "next_auto": "Auto mode is on and nothing is open. Next: to-do {n}, {title}",
    "next_brief": "  journal todos {n}          the brief",
    "next_pick": "  journal todos start {n}    pick it up",
    "next_empty": "The list is empty. Stop the loop if one is running.",
    "next_blocked": "Nothing to pick up: {why}. `journal todo` shows what each waits on.",
    "next_reason": "{n} {what}",
    "next_waiting_off": "Nothing is open. {n} to-do(s) waiting; auto is off, so none starts without the user's word.",
    "next_nothing": "Nothing is open and nothing is waiting.",
}

OPEN_COMMANDS = (('journal work end "<the same words>"', "close it"),
                 ('journal work update "<where it got to>"', "say where it got to"))


class Start(Command):
    signature = "work:start {subject* : the words that name the work}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(work.start(root(), p.arg("subject"), now(), where()))


class End(Command):
    signature = "work:end {subject*? : the same words that opened it} {--force} {--todo} {--todos}"
    writes = True

    def run(self, p: Parsed) -> int:
        subject = p.arg("subject") or ""
        force = bool(p.option("force"))
        if not subject and not force:
            return refuse(TEXT["end_words"])
        ok, msg = work.end(root(), subject, now(), force)
        fmt.say(msg, error=not ok)
        if not ok:
            return 1
        here = tracks.current(root(), stem())
        row = todo.titled(root(), here, subject)
        if row and (p.option("todo") or p.option("todos")):
            closed, note = todo.close_titled(root(), here, subject, now(), p.option("as") or "")
            fmt.say(render(TEXT["todo_closed"], n=closed) if closed else render(TEXT["todo_note"], note=note))
        elif row:
            fmt.say(render(TEXT["todo_stays"], n=row["n"]))
        fmt.say(TEXT["taught"])
        standing = len(pins.live(root(), pins.RULES)) + len(pins.live(root()))
        if standing:
            fmt.say(render(TEXT["false_claims"], standing=standing))
        return 0


class Update(Command):
    signature = "work:update {text* : the words that say what moved} {--on=}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(work.note(root(), p.arg("text"), now(), p.option("on")))


class Await(Command):
    signature = "work:await {what* : the words that name what you wait on} {--on=} {--for=} {--agent=} {--pid=}"
    casts = {"for": minutes, "agent": agent, "pid": pid}
    writes = True

    def run(self, p: Parsed) -> int:
        conf, _ = settings_mod.load(root())
        mins = p.option("for") if p.option("for") is not None else conf["await_default_minutes"]
        cap = conf["await_max_minutes"]
        if mins > cap:
            fmt.say(render(TEXT["capped"], cap=cap), error=True)
            mins = cap
        return answer(work.wait(root(), p.arg("what"), mins, now(), time.time(),
                                p.option("on"), p.option("agent"), p.option("pid")))


class BareStart(Start):
    signature = "start {subject* : the words that name the work}"


class BareEnd(End):
    signature = "end {subject*? : the same words that opened it} {--force} {--todo} {--todos}"


class Open(Command):
    signature = "open"

    def run(self, p: Parsed) -> int:
        standing = work.open_work(root())
        if not standing:
            fmt.say(TEXT["open_none"])
            return 0
        fmt.say(fmt.title(TEXT["open_title"], sub=TEXT["open_sub"]))
        for w in standing:
            fmt.say()
            fmt.say(render(TEXT["open_subject"], subject=w["subject"]))
            fmt.say("     " + fmt.dim(render(TEXT["open_since"], since=w["at"][:16].replace("T", " "))))
            for note in w.get("notes", []):
                fmt.say(fmt.wrap(render(TEXT["open_note"], at=note["at"][11:16], text=note["text"]), indent=5))
        fmt.say()
        fmt.say(fmt.commands(list(OPEN_COMMANDS)))
        return 0


class Next(Command):
    signature = "next"

    def run(self, p: Parsed) -> int:
        if not state.hooks_enabled(root()):
            fmt.say(TEXT["disabled"])
            return 0
        s = stem()
        here = tracks.current(root(), s)
        held = state.get(root(), "next_text", "", stem=s) if s else ""
        # a snapshot is shown once, and only while the to-do list it described is unchanged
        if held and state.get(root(), "next_rows", None, stem=s) not in (
                None, sorted(t["n"] for t in todo.open_items(root(), here))):
            held = ""
        if s:
            state.put(root(), "next_text", "", stem=s)
        if held:
            fmt.say(held)
            return 0
        standing = work.open_work(root())
        if standing:
            fmt.say(render(TEXT["next_open"], subjects=[w["subject"] for w in standing]))
            fmt.say(TEXT["next_carry_on"])
            return 0
        waiting = todo.open_items(root(), here)
        if not todo.auto(root(), here):
            fmt.say(render(TEXT["next_waiting_off"], n=len(waiting)) if waiting else TEXT["next_nothing"])
            return 0
        ready = todo.ready(root(), here)
        if ready:
            t = ready[0]
            fmt.say(render(TEXT["next_auto"], n=t["n"], title=t["title"]))
            fmt.say(render(TEXT["next_brief"], n=t["n"]))
            fmt.say(render(TEXT["next_pick"], n=t["n"]))
            return 0
        if not waiting:
            fmt.say(TEXT["next_empty"])
            return 0
        reasons = (
            (todo.asking(root(), here), "waiting on your answer"),
            (todo.blocked(root(), here), "set aside on a condition"),
            ([t for t in waiting if todo.waiting_on(root(), here, t)], "waiting on a to-do that must land first"),
            ([t for t in waiting if t.get("assigned")], "held by an agent still working"),
        )
        why = ", ".join(render(TEXT["next_reason"], n=len(rows), what=what) for rows, what in reasons if rows)
        fmt.say(render(TEXT["next_blocked"], why=why))
        return 0


COMMANDS = (Start, End, Update, Await, BareStart, BareEnd, Open, Next)
