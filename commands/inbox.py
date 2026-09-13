from __future__ import annotations

import fmt
import inbox
from app import CATALOGUE_PAGE, catalogue
from command import Parsed, number
from commands.options import LISTING_CASTS, words
from commands.resource import Resource
from controllers.inbox import InboxController
from templates import render

NOUNS = (("inbox",),)

MESSAGE = {"n": number("a message number")}
CONTROLLER = InboxController()

PAGE = {
    "sub": "{waiting} waiting, {processed} processed",
    "empty": "The inbox is empty.",
    "lead": "Messages the user left for the agent on this environment, waiting ones first. Each is split into "
            "parts, and each part says what it became: a to-do, a pin, a rule, a reminder, a work update, a "
            "question, or noted.",
    "commands": (('journal inbox "<message>"', "leave one"),
                 ("journal inbox show <n>", "read one, with what it became"),
                 ('journal inbox process <n> --part="<words>" --became=<ref>', "record a part"),
                 ("journal inbox done <n>", "mark it processed"),
                 ('journal inbox move <n> "<environment>"', "carry a waiting one to another environment")),
}


class List(Resource):
    signature = "inbox:list {--page=1} {--order=desc}"
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        page, order = p.option("page"), p.option("order")
        items = [fmt.Item(n=r["n"], text=r["gist"], meta=r["facts"]) for r in result.data]
        return catalogue(
            "INBOX", render(PAGE["sub"], waiting=result.meta["waiting"], processed=result.meta["processed"]),
            (items, result.meta["left"]), PAGE["empty"], PAGE["lead"], PAGE["commands"],
            noun="inbox", page=page, order=order)


class Show(Resource):
    signature = "inbox:show {n : a message number}"
    casts = MESSAGE
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        print(inbox.show_text(result.data))
        return 0


class Add(Resource):
    signature = "inbox:add {text* : the message}"
    casts = {"text": words("a message")}
    default = True
    writes = True
    controller = CONTROLLER
    action = "store"


class Edit(Resource):
    signature = "inbox:edit {n : a message number} {text* : the message, reworded}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "update"


class Process(Resource):
    signature = "inbox:process {n : a message number} {--part=} {--became=*}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "process"


class Done(Resource):
    signature = "inbox:done {n : a message number}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "done"


class Move(Resource):
    signature = "inbox:move {n : a message number} {environment* : the environment it moves to}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "move"


COMMANDS = (List, Show, Add, Edit, Process, Done, Move)
