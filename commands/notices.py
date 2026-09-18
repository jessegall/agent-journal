from __future__ import annotations

import fmt
from app import CATALOGUE_PAGE, catalogue
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.notices import NoticesController
from templates import render

NOUNS = (("notices", "notice"),)

NOTICE = {"n": number("a notice number")}
CONTROLLER = NoticesController()

PAGE = {
    "sub": "{standing} up",
    "empty": "Nothing is pinned to the chat.",
    "lead": "One line pinned over the conversation until the user closes it — where a link or a result has to stay "
            "in front of them. News that can age belongs in a notification; a fact belongs in a pin.",
    "commands": (('journal notice "<the line>" [--tone=note|good|warn] [--link=<url> --label="Open the PR"]', "pin it to the top of the chat"),
                 ("journal notices", "what is up now"),
                 ("journal notices close <n>", "take one down yourself; the user's X does the same")),
}


class List(Resource):
    signature = "notices:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        items = [fmt.Item(n=r["n"], text=r["text"], meta=r["meta"], struck=r["closed"]) for r in result.data]
        return catalogue("NOTICES", render(PAGE["sub"], standing=result.meta["standing"]),
                         (items, result.meta["left"]), PAGE["empty"], PAGE["lead"], PAGE["commands"],
                         noun="notices", page=p.option("page"), order=p.option("order"))


class Add(Resource):
    signature = 'notices:add {text* : the line the user sees} {--tone= : note, good or warn} {--link= : a url it points at} {--label= : what the button says}'
    writes = True
    controller = CONTROLLER
    action = "store"


class Notice(Add):
    signature = 'notice {text* : the line the user sees} {--tone= : note, good or warn} {--link= : a url it points at} {--label= : what the button says}'


class Close(Resource):
    signature = "notices:close {n : a notice number}"
    casts = NOTICE
    writes = True
    controller = CONTROLLER
    action = "close"


COMMANDS = (List, Add, Notice, Close)
