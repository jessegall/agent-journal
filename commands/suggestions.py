from __future__ import annotations

import fmt
import suggestions
from app import BRIEF_REFUSED, CATALOGUE_PAGE, brief, catalogue, refuse
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.suggestions import SuggestionsController
from templates import render

NOUNS = (("suggestions", "suggestion"), ("suggest",))

SUGGESTION = {"n": number("a suggestion number")}
CONTROLLER = SuggestionsController()

PAGE = {
    "sub": "{open} waiting on the user, {decided} decided",
    "empty": "No suggestions are waiting.",
    "lead": "What the agent proposes that nobody asked for. The user accepts one (a to-do is filed from it), accepts "
            "it with a change, or declines it; a decline is a ruling and is not filed again.",
    "commands": (('journal suggest "<the change>" [--about="todo 22"] --brief', "propose one, the reasoning on stdin"),
                 ("journal suggestions show <n>", "read one"),
                 ('journal suggestions withdraw <n> "<why>"', "take one back"),
                 ('journal suggestions accept <n> | adjust <n> "<change>" | decline <n> "<why>"', "the user's decision")),
}


class List(Resource):
    signature = "suggestions:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        items = [fmt.Item(n=r["n"], text=r["title"], meta=r["meta"], struck=r["status"] in ("declined", "withdrawn"))
                 for r in result.data]
        return catalogue("SUGGESTIONS", render(PAGE["sub"], open=result.meta["open"], decided=result.meta["decided"]),
                         (items, result.meta["left"]), PAGE["empty"], PAGE["lead"], PAGE["commands"],
                         noun="suggestions", page=p.option("page"), order=p.option("order"))


class Show(Resource):
    signature = "suggestions:show {n : a suggestion number}"
    casts = SUGGESTION
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        print(suggestions.show_text(result.data))
        return 0


class Add(Resource):
    signature = "suggestions:add {title* : the change, in one line} {--about=*} {--brief} {--despite=} {--because=}"
    casts = {"despite": number("--despite")}
    writes = True
    controller = CONTROLLER
    action = "store"

    def extra(self, p: Parsed):
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return {"body": body}


class Suggest(Add):
    signature = "suggest {title* : the change, in one line} {--about=*} {--brief} {--despite=} {--because=}"


class Edit(Resource):
    signature = "suggestions:edit {n : a suggestion number} {title* : the change, reworded}"
    casts = SUGGESTION
    writes = True
    controller = CONTROLLER
    action = "update"


class Withdraw(Resource):
    signature = "suggestions:withdraw {n : a suggestion number} {why* : why it is no longer worth it}"
    casts = SUGGESTION
    writes = True
    controller = CONTROLLER
    action = "destroy"


class Accept(Resource):
    signature = "suggestions:accept {n : a suggestion number} {note*? : a note for the to-do}"
    casts = SUGGESTION
    writes = True
    user_only = True
    controller = CONTROLLER
    action = "accept"


class Adjust(Resource):
    signature = "suggestions:adjust {n : a suggestion number} {change* : what to do differently}"
    casts = SUGGESTION
    writes = True
    user_only = True
    controller = CONTROLLER
    action = "adjust"


class Decline(Resource):
    signature = "suggestions:decline {n : a suggestion number} {why*? : why not}"
    casts = SUGGESTION
    writes = True
    user_only = True
    controller = CONTROLLER
    action = "decline"


COMMANDS = (List, Show, Add, Suggest, Edit, Withdraw, Accept, Adjust, Decline)
