from __future__ import annotations

import fmt
import tracks
from app import CATALOGUE_PAGE, catalogue, root, stem
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.reminders import RemindersController
from templates import render

NOUNS = (("reminders", "reminder", "remind"),)

REMINDER = {"n": number("a reminder number")}
CONTROLLER = RemindersController()

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


class List(Resource):
    signature = "reminders:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self) -> dict:
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        import settings as settings_mod
        conf, _ = settings_mod.load(root())
        items = [fmt.Item(n=r["n"], text=r["text"], meta=r["meta"], struck=r["struck"]) for r in result.data]
        retired = result.meta["retired"]
        return catalogue(
            "REMINDERS",
            render(PAGE["sub"], env=tracks.current(root(), stem()), n=result.meta["live"],
                   retired=retired if p.option("all") and retired else None),
            (items, result.meta["left"]),
            PAGE["empty"], render(PAGE["lead"], every=conf["reminder_every"] or None),
            PAGE["commands"], noun="reminders", page=p.option("page"), order=p.option("order"))


class Add(Resource):
    signature = "reminders:add {text* : the instruction, in one line} {--until=}"
    writes = True
    controller = CONTROLLER
    action = "store"

    def render(self, p: Parsed, result) -> int:
        code = super().render(p, result)
        if result.ok and result.meta.get("every"):
            fmt.say(render(PAGE["every_added"], every=result.meta["every"]))
        return code


class Done(Resource):
    signature = "reminders:done {n : a reminder number} {why* : what made it true}"
    casts = REMINDER
    verbs = ("retire", "strike", "stop")
    writes = True
    controller = CONTROLLER
    action = "destroy"


class Move(Resource):
    signature = "reminders:move {n : a reminder number} {environment* : the environment it moves to}"
    casts = REMINDER
    writes = True
    controller = CONTROLLER
    action = "move"


COMMANDS = (List, Add, Done, Move)
