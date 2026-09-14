from __future__ import annotations

import fmt
from app import BRIEF_REFUSED, CATALOGUE_PAGE, brief, refuse
from command import Parsed
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.style import StyleController
from templates import render

NOUNS = (("style",),)

TEXT = {
    "title": "CODING STYLE OF THIS PROJECT",
    "sub": "{n} rule(s), one skill each",
    "lead": "One rule per subject, each generated into a skill agents load before writing or reviewing code it covers. "
            "An answered coding style questionnaire is where rules come from.",
}

LIST_COMMANDS = (
    ("journal style show <subject>", "read one rule"),
    ('journal style add <subject> "<title>" --decision="…" --when="…" --brief', "record a rule; its body on stdin"),
    ('journal style set <subject> decision "…"', "change a rule's title, decision or when"),
    ("journal style sync", "regenerate the skills from the rules"),
)


def _style():
    import style
    return style


CONTROLLER = StyleController()


class List(Resource):
    signature = "style:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        style, m = _style(), result.meta
        fmt.say(fmt.title(TEXT["title"], sub=render(TEXT["sub"], n=m["total"])))
        fmt.say()
        fmt.say(style.render_rows(result.data) + fmt.more("style", m["left"], p.option("page"), p.option("order"))
                if result.data else style.say("empty"))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead"]))
        fmt.say(fmt.commands(list(LIST_COMMANDS)))
        return 0


class Show(Resource):
    signature = "style:show {subject : the rule's subject}"
    verbs = ("info", "read")
    default = True
    controller = CONTROLLER
    action = "show"
    id_arg = "subject"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        fmt.say(_style().show_text(result.data))
        return 0


class Add(Resource):
    signature = ("style:add {subject : a short name, like naming} {title* : what it covers, in a few words} "
                 "{--decision=} {--when=} {--brief}")
    writes = True
    controller = CONTROLLER
    action = "store"
    id_arg = ""

    def extra(self, p: Parsed):
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return {"body": body}


class Set(Resource):
    signature = "style:set {subject : the rule's subject} {field : title, decision or when} {value* : the new value}"
    writes = True
    controller = CONTROLLER
    action = "update"
    id_arg = "subject"

    def extra(self, p: Parsed):
        field = p.arg("field")
        if field not in StyleController.FIELDS:
            return refuse(_style().say("not_a_field", field=repr(field)))
        return {field: p.arg("value"), "field": None, "value": None}


class Remove(Resource):
    signature = "style:remove {subject : the rule's subject} {why* : why it no longer holds}"
    verbs = ("strike",)
    writes = True
    controller = CONTROLLER
    action = "destroy"
    id_arg = "subject"


class Sync(Resource):
    signature = "style:sync"
    writes = True
    controller = CONTROLLER
    action = "sync"


COMMANDS = (List, Show, Add, Set, Remove, Sync)
