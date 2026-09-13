from __future__ import annotations

import fmt
import reminders
import settings as settings_mod
import tracks
from app import CATALOGUE_PAGE, answer, catalogue, now, root, stem
from command import Arg, Command, Opt, Parsed, number
from commands.options import LISTING
from templates import render

NOUN = ("reminders", "reminder", "remind")

REMINDER = Arg("n", number("a reminder number"), what="a reminder number")

PAGE = {
    "sub": "environment {env} · {n} repeated[, {retired} retired]",
    "empty": "Nothing is being repeated.",
    "lead": "Said to you at every stop[, and every {every} tool calls in between], and to the user "
            "with it — they wrote it, and seeing it come back is how they know it landed. Nothing "
            "here expires on its own.",
    "every_added": "  and again every {every} tool calls in between (settings: reminder_every)",
    "commands": (('journal reminders add "<instruction>" [--until="<condition>"]', "start repeating one; --until is prose YOU judge"),
                 ('journal reminders done <n> "<why>"', "retire one whose condition came true"),
                 ('journal reminders move <n> "<environment>"', "it belongs to an environment, like a pin"),
                 ("journal reminders --all", "the retired ones too")),
}


class List(Command):
    noun, verb, default, opts = "reminders", "list", True, LISTING

    def run(self, p: Parsed) -> int:
        conf, _ = settings_mod.load(root())
        every = bool(p.option("all"))
        n = len(reminders.live(root()))
        retired = len(reminders._all(root())) - n
        page, order = p.option("page"), p.option("order")
        return catalogue(
            "REMINDERS",
            render(PAGE["sub"], env=tracks.current(root(), stem()), n=n, retired=retired if every and retired else None),
            reminders.listing(root(), all_of_them=every, cap=CATALOGUE_PAGE, page=page, order=order),
            PAGE["empty"], render(PAGE["lead"], every=conf["reminder_every"] or None),
            PAGE["commands"], noun="reminders", page=page, order=order)


class Add(Command):
    noun, verb, writes = "reminders", "add", True
    args = (Arg("text", rest=True, what="the instruction, in one line"),)
    opts = (Opt("until"),)

    def run(self, p: Parsed) -> int:
        conf, _ = settings_mod.load(root())
        code = answer(reminders.add(root(), p.arg("text"), now(), conf["reminder_max_chars"], p.option("until") or ""))
        if code == 0 and conf["reminder_every"]:
            fmt.say(render(PAGE["every_added"], every=conf["reminder_every"]))
        return code


class Done(Command):
    noun, verb, verbs, writes = "reminders", "done", ("retire", "strike", "stop"), True
    args = (REMINDER, Arg("why", rest=True, what="what made it true"))

    def run(self, p: Parsed) -> int:
        return answer(reminders.done(root(), p.arg("n"), p.arg("why"), now()))


class Move(Command):
    noun, verb, writes = "reminders", "move", True
    args = (REMINDER, Arg("environment", rest=True, what="the environment it moves to"))

    def run(self, p: Parsed) -> int:
        return answer(reminders.move(root(), p.arg("n"), p.arg("environment"), now()))


COMMANDS = (List, Add, Done, Move)
