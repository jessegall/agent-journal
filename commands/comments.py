from __future__ import annotations

import fmt
from app import CATALOGUE_PAGE, catalogue
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.comments import CommentsController
from templates import render

NOUNS = (("comments", "comment"),)

COMMENT = {"n": number("a comment number")}
CONTROLLER = CommentsController()

PAGE = {
    "sub": "{open} not handled",
    "empty": "Nobody has commented on anything.",
    "lead": "What the user said about a to-do, doc, pin, rule or reminder. Act on what each asks — amend it, "
            "drop it, answer it — then say what was done.",
    "commands": (('journal comments done <n> "<what was done>" [--became="todo 22"]', "it is handled, and what it made"),
                 ('journal comments add "todo 22" "<the comment>"', "comment on something"),
                 ("journal comments show <n>", "read one in full")),
    "show": "COMMENT {n}\n\n{text}\n\n  {meta}",
}


class List(Resource):
    signature = "comments:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        items = [fmt.Item(n=r["n"], text=r["text"], meta=r["meta"], struck=bool(r["done"])) for r in result.data]
        return catalogue("COMMENTS", render(PAGE["sub"], open=result.meta["open"]), (items, result.meta["left"]),
                         PAGE["empty"], PAGE["lead"], PAGE["commands"], noun="comments",
                         page=p.option("page"), order=p.option("order"))


class Show(Resource):
    signature = "comments:show {n : a comment number}"
    casts = COMMENT
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        print(render(PAGE["show"], n=result.data["n"], text=result.data["text"], meta=result.data["meta"]))
        return 0


class Add(Resource):
    signature = "comments:add {about : what it is about, like `todo 22`} {text* : the comment}"
    writes = True
    controller = CONTROLLER
    action = "store"


class Done(Resource):
    signature = ("comments:done {n : a comment number} {how*? : what was done about it} {--stdin} "
                 "{--became=* : what it produced, like `todo 22` or `doc 4`}")
    prose = "how"
    casts = COMMENT
    writes = True
    controller = CONTROLLER
    action = "done"


COMMANDS = (List, Show, Add, Done)
