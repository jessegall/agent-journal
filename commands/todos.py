from __future__ import annotations

import re

import fmt
import todo
import tracks
import work
from app import (BRIEF_REFUSED, CATALOGUE_PAGE, answer, brief, doc_where, now, refuse, root, stem,
                 where)
from command import Command, Parsed, number
from commands.options import LISTING, LISTING_CASTS, words
from templates import render

NOUNS = (("todos", "todo"),)

TODO = {"n": number("a to-do number")}
N = "{n : a to-do number}"

TEXT = {
    "commit_how": "{subject} ({sha})",
    "list_title": "TO-DO",
    "list_sub": "environment {env} · {waiting} waiting[ · {done} done][{hint}][{auto}]",
    "done_hint": " (--all shows them)",
    "auto_on_tag": " · auto ON",
    "lead_auto": "Auto is on: with nothing open, the agent picks up the next one on its own.",
    "lead_manual": "Delayed work on this environment, listed at every session start. Not an instruction to start one.",
    "auto_state": "auto is {state} for `{env}`. `journal todos auto on|off` sets it.",
    "auto_wants": "auto wants on or off, got {got}",
    "auto_working": "  Agent currently working on: {subjects:; }",
    "auto_after_work": "  {n} to-do(s) waiting; the first ready one is picked up when that work ends.",
    "auto_next": "  Nothing is open, {n} to-do(s) waiting: the next idle stop starts to-do {next}, {title}.",
    "auto_stuck": "  Nothing is open and none of the {n} waiting to-do(s) can be started — they wait on you, on a "
                  "condition, or on each other. `journal todos` says which.",
    "auto_empty": "  Nothing is open and nothing is waiting.",
    "no_commit": "no commit at {ref} to read",
    "names_no_todo": "{sha} names no to-do — a commit closes one with a trailer:\n  {trailer} todos done <n>",
    "commit_line": "  {line}",
    "commit_refused": "  ! {line}",
    "report_needs_as": '`todos report` is a subagent saying a row is finished — put --as="<your agent name>" on it. '
                       'If you are the agent that dispatched one, `journal todos done {n} "<how>"` closes it.',
    "closed_waiting": "\n  closed the work `{title}` — it waits on the answer",
    "closed_aside": "\n  closed the work `{title}` — it is set aside",
    "closed_note": "\n  {note}",
    "started_agent": "  to-do {n} is started, and it stays open — a row closes when whoever dispatched you closes it.",
    "started": '  to-do {n} is started. It stays open until you say it is done:\n'
               '    journal todos done {n} "<how>"\n'
               '    journal work end "{title}" --todo   closes the work AND the row',
    "held_for": '  it is held for `{agent}` while you are writing; `journal todos report {n} "<how>" --as={agent}` '
                "says it is finished.",
    "trailer": "  or close it from the commit that finishes it, as a trailer:\n    {trailer} todos done {n}",
    "say_why": 'say why: journal todos {verb} <n> "<why it is abandoned>"',
    "dropped": "dropped: {why}",
    "after_note": "  {note}",
}

LIST_COMMANDS = (("journal todos <n>", "the brief, and the question if it waits on the user"),
                 ("journal todos start <n>", "pick one up"),
                 ('journal todos add "<title>" --brief', "add one, with a brief on stdin"),
                 ('journal todos answer <n> "<answer>"', "answer one that waits on you"))
AUTO_COMMAND = {True: ("journal todos auto off", "stop working through the list on your own"),
                False: ("journal todos auto on", "work through the list without asking")}


def here() -> str:
    return tracks.current(root(), stem())


def _close_opened_work(n: int, key: str) -> str:
    t, _ = todo._get(root(), here(), n)
    if not t or not any(w["subject"] == t["title"] for w in work.open_work(root())):
        return ""
    closed, note = work.end(root(), t["title"], now())
    return render(TEXT[key], title=t["title"]) if closed else render(TEXT["closed_note"], note=note)


class List(Command):
    signature = "todos:list " + LISTING + " {--order-by-id}"
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        env, every = here(), bool(p.option("all"))
        waiting = todo.open_items(root(), env)
        done = len(todo._all(root(), env)) - len(waiting)
        draining = todo.auto(root(), env)
        fmt.say(fmt.title(TEXT["list_title"], sub=render(
            TEXT["list_sub"], env=env, waiting=len(waiting), done=done or None,
            hint=TEXT["done_hint"] if done and not every else None, auto=TEXT["auto_on_tag"] if draining else None)))
        fmt.say()
        fmt.say(todo.render(root(), env, all_of_them=every, cap=CATALOGUE_PAGE, page=p.option("page"),
                            order=p.option("order"), order_by_id=bool(p.option("order-by-id"))))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead_auto"] if draining else TEXT["lead_manual"]))
        fmt.say(fmt.commands([*LIST_COMMANDS, AUTO_COMMAND[draining]]))
        return 0


class Show(Command):
    signature = "todos:show " + N
    casts = TODO
    default = True

    def run(self, p: Parsed) -> int:
        return answer(todo.show(root(), here(), p.arg("n")))


class Add(Command):
    signature = "todos:add {title* : the title, in a few words} {--brief} {--doc=} {--after=} {--needs=}"
    casts = {"title": words("a to-do title")}
    default = True
    writes = True

    def run(self, p: Parsed) -> int:
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        got = doc_where(p.option("doc") or "")
        if got is None:
            return 1
        env = here()
        ok, msg = todo.add(root(), env, p.arg("title"), body, now(), got)
        fmt.say(msg, error=not ok)
        after = p.option("after") or p.option("needs")
        added = re.search(r"to-do (\d+)", msg) if ok else None
        if added and after:
            good, note = todo.after(root(), env, int(added.group(1)), after)
            fmt.say(render(TEXT["after_note"], note=note), error=not good)
        return 0 if ok else 1


class Start(Command):
    signature = "todos:start " + N
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        n, acting = p.arg("n"), p.option("as") or ""
        t, err = todo.start(root(), here(), n, now(), agent=acting)
        if t is None:
            return refuse(err)
        ok, msg = work.start(root(), t["title"], now(), where())
        fmt.say(msg, error=not ok)
        if not ok:
            return 1
        if acting:
            fmt.say(render(TEXT["started_agent"], n=n))
            fmt.say(render(TEXT["held_for"], agent=acting, n=n))
        else:
            fmt.say(render(TEXT["started"], n=n, title=t["title"]))
            fmt.say(render(TEXT["trailer"], trailer=todo.TRAILER, n=n))
        return 0


class Done(Command):
    signature = "todos:done " + N + " {how*? : how it was resolved}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(todo.done(root(), here(), p.arg("n"), p.arg("how") or "", now()))


class Drop(Command):
    signature = "todos:drop " + N + " {why*? : why it is abandoned}"
    casts = TODO
    verbs = ("strike",)
    writes = True

    def run(self, p: Parsed) -> int:
        why = (p.arg("why") or "").strip()
        if not why:
            return refuse(render(TEXT["say_why"], verb="drop"))
        return answer(todo.done(root(), here(), p.arg("n"), render(TEXT["dropped"], why=why), now()))


class Reopen(Command):
    signature = "todos:reopen " + N + " {why*? : why it is open again}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(todo.reopen(root(), here(), p.arg("n"), p.arg("why") or "", now()))


class Move(Command):
    signature = "todos:move " + N + " {environment*? : the environment it moves to}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(todo.move(root(), here(), p.arg("n"), p.arg("environment") or "", now()))


class Ask(Command):
    signature = "todos:ask " + N + " {question*? : what the user must decide}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        ok, msg = todo.ask(root(), here(), p.arg("n"), p.arg("question") or "")
        return answer((ok, msg + _close_opened_work(p.arg("n"), "closed_waiting") if ok else msg))


class Answer(Command):
    signature = "todos:answer " + N + " {answer*? : the answer}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(todo.answer(root(), here(), p.arg("n"), p.arg("answer") or ""))


class Block(Command):
    signature = "todos:block " + N + " {why*? : what has to be true first}"
    casts = TODO
    verbs = ("skip",)
    writes = True

    def run(self, p: Parsed) -> int:
        ok, msg = todo.block(root(), here(), p.arg("n"), p.arg("why") or "")
        return answer((ok, msg + _close_opened_work(p.arg("n"), "closed_aside") if ok else msg))


class Unblock(Command):
    signature = "todos:unblock " + N
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(todo.unblock(root(), here(), p.arg("n")))


class After(Command):
    signature = "todos:after " + N + " {names*? : the to-do numbers it waits on} {--none}"
    casts = TODO
    verbs = ("needs",)
    writes = True

    def run(self, p: Parsed) -> int:
        names = "--none" if p.option("none") else (p.arg("names") or "")
        return answer(todo.after(root(), here(), p.arg("n"), names))


class Report(Command):
    signature = "todos:report " + N + " {how*? : how it was finished}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        acting = p.option("as") or ""
        if not acting:
            return refuse(render(TEXT["report_needs_as"], n=p.arg("n")))
        return answer(todo.report(root(), here(), p.arg("n"), p.arg("how") or "", acting))


class Priority(Command):
    signature = "todos:priority " + N + " {value*? : a number or low, default, high, critical}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(todo.priority(root(), here(), p.arg("n"), p.arg("value") or ""))


class Amend(Command):
    signature = "todos:amend " + N + " {title*? : the section title} {--brief}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        text = brief(bool(p.option("brief")))
        if text is None:
            return refuse(BRIEF_REFUSED)
        return answer(todo.amend(root(), here(), p.arg("n"), p.arg("title") or "", text))


class Replace(Command):
    signature = "todos:replace " + N + " {title*? : the section title} {--brief}"
    casts = TODO
    writes = True

    def run(self, p: Parsed) -> int:
        text = brief(bool(p.option("brief")))
        if text is None:
            return refuse(BRIEF_REFUSED)
        return answer(todo.replace_section(root(), here(), p.arg("n"), p.arg("title") or "", text))


class Auto(Command):
    signature = "todos:auto {state? : on or off}"
    writes = True

    def run(self, p: Parsed) -> int:
        env = here()
        want = (p.arg("state") or "").lower()
        if not want:
            fmt.say(render(TEXT["auto_state"], state="ON" if todo.auto(root(), env) else "OFF", env=env))
            return 0
        if want not in ("on", "off", "true", "false", "yes", "no"):
            return refuse(render(TEXT["auto_wants"], got=repr(p.arg("state"))))
        on = want in ("on", "true", "yes")
        fmt.say(todo.set_auto(root(), env, on))
        if not on:
            return 0
        standing = work.open_work(root())
        waiting = todo.open_items(root(), env)
        ready = todo.ready(root(), env)
        if standing:
            fmt.say(render(TEXT["auto_working"], subjects=[w["subject"] for w in standing]))
            fmt.say(render(TEXT["auto_after_work"], n=len(waiting)))
        elif ready:
            fmt.say(render(TEXT["auto_next"], n=len(waiting), next=ready[0]["n"], title=ready[0]["title"]))
        elif waiting:
            fmt.say(render(TEXT["auto_stuck"], n=len(waiting)))
        else:
            fmt.say(TEXT["auto_empty"])
        return 0


class Prune(Command):
    signature = "todos:prune {--older-than=} {--before=} {--force}"
    writes = True

    def run(self, p: Parsed) -> int:
        cutoff = p.option("older-than") or p.option("before") or ""
        return answer(todo.prune(root(), here(), cutoff, now(), bool(p.option("force"))))


class FromCommit(Command):
    signature = "todos:from-commit {ref? : a commit, HEAD by default} {--quiet}"
    verbs = ("from_commit",)
    writes = True

    def run(self, p: Parsed) -> int:
        ref = p.arg("ref") or "HEAD"
        at = todo.commit_at(root().parent, ref)
        if at is None:
            return refuse(render(TEXT["no_commit"], ref=ref))
        sha, subject, message = at
        said = todo.close_from_commit(root(), message, render(TEXT["commit_how"], subject=subject, sha=sha[:9]),
                                      now(), here())
        if not said:
            if not p.option("quiet"):
                fmt.say(render(TEXT["names_no_todo"], sha=sha[:9], trailer=todo.TRAILER))
            return 0
        for ok, line in said:
            fmt.say(render(TEXT["commit_line" if ok else "commit_refused"], line=line))
        return 0 if any(ok for ok, _ in said) else 1


COMMANDS = (List, Show, Add, Start, Done, Drop, Reopen, Move, Ask, Answer, Block, Unblock, After, Report,
            Priority, Amend, Replace, Auto, Prune, FromCommit)
