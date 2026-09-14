from __future__ import annotations

import fmt
from app import CATALOGUE_PAGE, catalogue
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.notifications import NotificationsController
from templates import render

NOUNS = (("notifications", "notification"), ("notify",))

NOTIFICATION = {"n": number("a notification number")}
CONTROLLER = NotificationsController()

PAGE = {
    "sub": "{unread} unread",
    "empty": "No notifications.",
    "lead": "What the agent told the user about, shown on Home: work the user asked to hear about, or a long piece "
            "of work that landed. Routine progress is a work update, not a notification.",
    "commands": (('journal notify "<what finished>" [--about="todo 22"]', "tell the user, sparingly"),
                 ("journal notifications read <n>", "mark one read"),
                 ("journal notifications --all", "read ones too")),
}


class List(Resource):
    signature = "notifications:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        items = [fmt.Item(n=r["n"], text=r["text"], meta=r["meta"], struck=r["read"]) for r in result.data]
        return catalogue("NOTIFICATIONS", render(PAGE["sub"], unread=result.meta["unread"]), (items, result.meta["left"]),
                         PAGE["empty"], PAGE["lead"], PAGE["commands"], noun="notifications",
                         page=p.option("page"), order=p.option("order"))


class Add(Resource):
    signature = "notifications:add {text* : what finished, in one line} {--about=}"
    writes = True
    controller = CONTROLLER
    action = "store"


class Notify(Add):
    signature = "notify {text* : what finished, in one line} {--about=}"


class Read(Resource):
    signature = "notifications:read {n : a notification number}"
    casts = NOTIFICATION
    writes = True
    controller = CONTROLLER
    action = "read"


COMMANDS = (List, Add, Notify, Read)
