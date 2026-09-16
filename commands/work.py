from __future__ import annotations

import fmt
import state
import plans
import todo
import tracks
import work
from app import root, stem, where
from command import Command, Parsed
from commands.resource import Resource
from controllers.work import WorkController
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
    "open_file": "changed  {path}  +{added} -{removed}{new}",
    "open_file_new": "  (new)",
    "disabled": "hooks are disabled. `journal enable` turns them back on.",
    "next_open": "Open work: {subjects:; }",
    "next_carry_on": 'Carry on with it; `journal work end "<the same words>"` when it is done, or\n'
                     '`journal work await "<what you wait on>" --pid=<n>|--agent=<id>` if it is in flight on\n'
                     "something you cannot hurry.",
    "next_auto": "Auto mode is on and nothing is open. Next: to-do {n}, {title}",
    "next_brief": "  journal todos {n}          the brief",
    "next_pick": "  journal todos start {n}    pick it up",
    "next_empty": "The list is empty. Stop the loop if one is running.",
    "next_blocked": "Nothing to pick up: {why}. `journal todo` shows what each waits on.[\n  {asked}]",
    "next_asked": "A question waiting on you does not stop the work: a plan being shaped, a doc, anything already "
                  "open — asking is not waiting. `journal questions` reads what was asked.",
    "next_reason": "{n} {what}",
    "next_waiting_off": "Nothing is open. {n} to-do(s) waiting; auto is off, so none starts without the user's word.",
    "next_nothing": "Nothing is open and nothing is waiting.",
}

OPEN_COMMANDS = (('journal work end "<the same words>"', "close it"),
                 ('journal work update "<where it got to>"', "say where it got to"))


CONTROLLER = WorkController()


class Start(Resource):
    signature = "work:start {subject* : the words that name the work}"
    writes = True
    controller = CONTROLLER
    action = "store"

    def extra(self, p: Parsed):
        return {"where": where()}


class End(Resource):
    signature = "work:end {subject*? : the same words that opened it} {--force} {--todo} {--todos}"
    writes = True
    controller = CONTROLLER
    action = "end"

    def render(self, p: Parsed, result) -> int:
        code = super().render(p, result)
        if not result.ok:
            return code
        m = result.meta
        if "todo_closed" in m:
            fmt.say(render(TEXT["todo_closed"], n=m["todo_closed"]) if m["todo_closed"]
                    else render(TEXT["todo_note"], note=m["todo_note"]))
        elif m.get("todo_open"):
            fmt.say(render(TEXT["todo_stays"], n=m["todo_open"]))
        fmt.say(TEXT["taught"])
        if m["standing"]:
            fmt.say(render(TEXT["false_claims"], standing=m["standing"]))
        return 0


class Update(Resource):
    signature = "work:update {text* : the words that say what moved} {--on=}"
    writes = True
    controller = CONTROLLER
    action = "note"


class Await(Resource):
    signature = "work:await {what* : the words that name what you wait on} {--on=} {--for=} {--agent=} {--pid=}"
    casts = {"for": minutes, "agent": agent, "pid": pid}
    writes = True
    controller = CONTROLLER
    action = "wait"

    def render(self, p: Parsed, result) -> int:
        if result.meta and result.meta.get("capped"):
            fmt.say(render(TEXT["capped"], cap=result.meta["capped"]), error=True)
        return super().render(p, result)


class Park(Resource):
    signature = "work:park {why* : why it is set aside} {--on=}"
    writes = True
    controller = CONTROLLER
    action = "park"


class BareStart(Start):
    signature = "start {subject* : the words that name the work}"


class BareEnd(End):
    signature = "end {subject*? : the same words that opened it} {--force} {--todo} {--todos}"


class Open(Resource):
    signature = "open"
    controller = CONTROLLER
    action = "index"

    def render(self, p: Parsed, result) -> int:
        if not result.data:
            fmt.say(TEXT["open_none"])
            return 0
        fmt.say(fmt.title(TEXT["open_title"], sub=TEXT["open_sub"]))
        for w in result.data:
            fmt.say()
            fmt.say(render(TEXT["open_subject"], subject=w["subject"]))
            fmt.say("     " + fmt.dim(render(TEXT["open_since"], since=w["at"][:16].replace("T", " "))))
            for note in w["notes"]:
                fmt.say(fmt.wrap(render(TEXT["open_note"], at=note["at"][11:16], text=note["text"]), indent=5))
            for f in w.get("files") or []:
                fmt.say("     " + render(TEXT["open_file"], path=f["path"], added=f["added"], removed=f["removed"],
                                         new=TEXT["open_file_new"] if f["created"] else ""))
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
        if not todo.auto(root()):
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
        stalled = plans.stall(root(), here)
        if stalled:
            fmt.say(stalled)
            return 0
        reasons = (
            (todo.asking(root(), here), "waiting on your answer"),
            (todo.blocked(root(), here), "set aside on a condition"),
            ([t for t in waiting if todo.waiting_on(root(), here, t)], "waiting on a to-do that must land first"),
            ([t for t in waiting if t.get("reported")], "reported finished by an agent, yours to close with `journal todos done <n>`"),
            ([t for t in waiting if t.get("assigned") and not t.get("reported")], "held by an agent still working"),
        )
        why = ", ".join(render(TEXT["next_reason"], n=len(rows), what=what) for rows, what in reasons if rows)
        fmt.say(render(TEXT["next_blocked"], why=why,
                       asked=TEXT["next_asked"] if todo.asking(root(), here) else None))
        return 0


COMMANDS = (Start, End, Update, Await, Park, BareStart, BareEnd, Open, Next)
