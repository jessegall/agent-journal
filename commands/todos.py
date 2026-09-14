from __future__ import annotations

import fmt
import todo
from app import (BRIEF_REFUSED, CATALOGUE_PAGE, answer, brief, doc_where, refuse,
                 where)
from command import Parsed, number
from commands.auto import AutoMode
from commands.resource import Resource
from controllers.todos import TodosController
from commands.options import LISTING, LISTING_CASTS, words
from templates import render

NOUNS = (("todos", "todo"),)

TODO = {"n": number("a to-do number")}
CONTROLLER = TodosController()
N = "{n : a to-do number}"

TEXT = {
    "list_title": "TO-DO",
    "list_sub": "environment {env} · {waiting} waiting[ · {done} done][{hint}][{auto}]",
    "done_hint": " (--all shows them)",
    "auto_on_tag": " · auto ON",
    "lead_auto": "Auto is on: with nothing open, the agent picks up the next one on its own.",
    "lead_manual": "Delayed work on this environment, listed at every session start. Not an instruction to start one.",
    "names_no_todo": "{sha} names no to-do — a commit closes one with a trailer:\n  {trailer} todos done <n>",
    "commit_line": "  {line}",
    "commit_refused": "  ! {line}",
    "report_needs_as": '`todos report` is a subagent saying a row is finished — put --as="<your agent name>" on it. '
                       'If you are the agent that dispatched one, `journal todos done {n} "<how>"` closes it.',
    "started_agent": "  to-do {n} is started, and it stays open — a row closes when whoever dispatched you closes it.",
    "started": '  to-do {n} is started. It stays open until you say it is done:\n'
               '    journal todos done {n} "<how>"\n'
               '    journal work end "{title}" --todo   closes the work AND the row',
    "held_for": '  it is held for `{agent}` while you are writing; `journal todos report {n} "<how>" --as={agent}` '
                "says it is finished.",
    "trailer": "  or close it from the commit that finishes it, as a trailer:\n    {trailer} todos done {n}",
    "say_why": 'say why: journal todos {verb} <n> "<why it is abandoned>"',
}

LIST_COMMANDS = (("journal todos <n>", "the brief, and the question if it waits on the user"),
                 ("journal todos start <n>", "pick one up"),
                 ('journal todos add "<title>" --brief', "add one, with a brief on stdin"),
                 ('journal todos answer <n> "<answer>"', "answer one that waits on you"))
AUTO_COMMAND = {True: ("journal auto-mode disable", "stop working through the list on your own"),
                False: ("journal auto-mode enable", "work through the list without asking")}


class List(Resource):
    signature = "todos:list " + LISTING + " {--order-by-id}"
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return dict(cap=CATALOGUE_PAGE, open=not p.option("all"))

    def render(self, p: Parsed, result) -> int:
        env, done, draining = result.meta["env"], result.meta["done"], result.meta["auto"]
        every = bool(p.option("all"))
        fmt.say(fmt.title(TEXT["list_title"], sub=render(
            TEXT["list_sub"], env=env, waiting=result.meta["waiting"], done=done or None,
            hint=TEXT["done_hint"] if done and not every else None, auto=TEXT["auto_on_tag"] if draining else None)))
        fmt.say()
        if result.data:
            fmt.say(todo.render_rows(result.data) + fmt.more("todos", result.meta["left"], p.option("page"), p.option("order")))
        else:
            fmt.say(todo.say("empty_all" if every else "empty_open"))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead_auto"] if draining else TEXT["lead_manual"]))
        fmt.say(fmt.commands([*LIST_COMMANDS, AUTO_COMMAND[draining]]))
        return 0


class Show(Resource):
    signature = "todos:show " + N
    casts = TODO
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        return answer((True, todo.show_text(result.data)))


class Add(Resource):
    signature = "todos:add {title* : the title, in a few words} {--brief} {--doc=} {--after=} {--needs=}"
    casts = {"title": words("a to-do title")}
    default = True
    writes = True
    controller = CONTROLLER
    action = "store"

    def extra(self, p: Parsed):
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        got = doc_where(p.option("doc") or "")
        if got is None:
            return 1
        return dict(body=body, where=got)


class Start(Resource):
    signature = "todos:start " + N
    casts = TODO
    writes = True
    controller = CONTROLLER
    action = "start"

    def extra(self, p: Parsed):
        return {"where": where()}

    def render(self, p: Parsed, result) -> int:
        code = super().render(p, result)
        if not result.ok or not result.data:
            return code
        n, acting = result.data["n"], p.option("as") or ""
        if acting:
            fmt.say(render(TEXT["started_agent"], n=n))
            fmt.say(render(TEXT["held_for"], agent=acting, n=n))
        else:
            fmt.say(render(TEXT["started"], n=n, title=result.data["title"]))
            fmt.say(render(TEXT["trailer"], trailer=todo.TRAILER, n=n))
        import reports
        if tip := reports.hint(result.data["title"], result.data.get("body", "")):
            fmt.say(tip)
        return code


def _action(name: str, signature: str, verbs: tuple = ()) -> type:
    return type(name, (Resource,), {"signature": signature, "casts": TODO, "verbs": verbs, "writes": True,
                                    "controller": CONTROLLER, "action": name.lower()})


Done = _action("Done", "todos:done " + N + " {how*? : how it was resolved}")
Reopen = _action("Reopen", "todos:reopen " + N + " {why*? : why it is open again}")


class Move(Resource):
    signature = "todos:move " + N + " {environment*? : the environment it moves to}"
    casts = TODO
    writes = True
    controller = CONTROLLER
    action = "move"

    def extra(self, p: Parsed):
        if not (p.arg("environment") or "").strip():
            return refuse(todo.say("move_where"))
        return {}


Ask = _action("Ask", "todos:ask " + N + " {question*? : what the user must decide}")
Answer = _action("Answer", "todos:answer " + N + " {answer*? : the answer}")
Block = _action("Block", "todos:block " + N + " {why*? : what has to be true first}", ("skip",))
Unblock = _action("Unblock", "todos:unblock " + N)
After = _action("After", "todos:after " + N + " {names*? : the to-do numbers it waits on} {--none}", ("needs",))
Priority = _action("Priority", "todos:priority " + N + " {value*? : a number or low, default, high, critical}")


class Drop(Resource):
    signature = "todos:drop " + N + " {why*? : why it is abandoned}"
    casts = TODO
    verbs = ("strike",)
    writes = True
    controller = CONTROLLER
    action = "destroy"

    def extra(self, p: Parsed):
        if not (p.arg("why") or "").strip():
            return refuse(render(TEXT["say_why"], verb="drop"))
        return {}


class Report(Resource):
    signature = "todos:report " + N + " {how*? : how it was finished}"
    casts = TODO
    writes = True
    controller = CONTROLLER
    action = "report"

    def extra(self, p: Parsed):
        if not p.option("as"):
            return refuse(render(TEXT["report_needs_as"], n=p.arg("n")))
        return {}


class _WithBrief(Resource):
    casts = TODO
    writes = True
    controller = CONTROLLER

    def extra(self, p: Parsed):
        text = brief(bool(p.option("brief")))
        if text is None:
            return refuse(BRIEF_REFUSED)
        return {"body": text}


class Amend(_WithBrief):
    signature = "todos:amend " + N + " {title*? : the section title} {--brief}"
    action = "amend"


class Replace(_WithBrief):
    signature = "todos:replace " + N + " {title*? : the section title} {--brief}"
    action = "replace"


class Auto(AutoMode):
    signature = "todos:auto {state? : enable or disable}"
    writes = True

    def extra(self, p: Parsed):
        return {}


class Prune(Resource):
    signature = "todos:prune {--older-than=} {--before=} {--force}"
    writes = True
    controller = CONTROLLER
    action = "prune"


class FromCommit(Resource):
    signature = "todos:from-commit {ref? : a commit, HEAD by default} {--quiet}"
    verbs = ("from_commit",)
    writes = True
    controller = CONTROLLER
    action = "commit"

    def render(self, p: Parsed, result) -> int:
        if result.data is None:
            return super().render(p, result)
        if not result.data:
            if not p.option("quiet"):
                fmt.say(render(TEXT["names_no_todo"], sha=result.meta["sha"], trailer=todo.TRAILER))
            return 0
        for row in result.data:
            fmt.say(render(TEXT["commit_line" if row["ok"] else "commit_refused"], line=row["line"]))
        return 0 if result.ok else 1


COMMANDS = (List, Show, Add, Start, Done, Drop, Reopen, Move, Ask, Answer, Block, Unblock, After, Report,
            Priority, Amend, Replace, Auto, Prune, FromCommit)
