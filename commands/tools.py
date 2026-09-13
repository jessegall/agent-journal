from __future__ import annotations

import fmt
from app import BRIEF_REFUSED, CATALOGUE_PAGE, brief, refuse, root
from command import Command, Parsed
from commands.resource import Resource
from controllers.tools import ToolsController
from commands.options import LISTING, LISTING_CASTS
from templates import render

NOUNS = (("tools",),)


def _tools():
    import tools
    return tools


TEXT = {
    "title": "TOOLS OF THIS PROJECT",
    "sub": "{n} catalogued",
    "loose": "{n} folder(s) under .journal/tools/ have no tool.md: {names:, } — `journal tools index` catalogues them.",
    "lead": "Scripts kept for repeated work, so the next session runs one instead of writing it again. A tool is "
            "the project's, like a doc; one line of this catalogue reaches every session.",
}

LIST_COMMANDS = (
    ("journal tools show <name>", "read one — `show` reaches a tool named after a verb"),
    ("journal tools run <name> …", "run it from the project root"),
    ('journal tools add <name> "<title>" --summary="…" --usage="…" --entry=<file>', "catalogue a script"),
)


CONTROLLER = ToolsController()


class List(Resource):
    signature = "tools:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        tools, m = _tools(), result.meta
        fmt.say(fmt.title(TEXT["title"], sub=render(TEXT["sub"], n=m["total"])))
        fmt.say()
        fmt.say(tools.render_rows(result.data) + fmt.more("tools", m["left"], p.option("page"), p.option("order"))
                if result.data else tools.say("empty"))
        if m["loose"]:
            fmt.say()
            fmt.say(fmt.wrap(render(TEXT["loose"], n=len(m["loose"]), names=m["loose"])))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead"]))
        fmt.say(fmt.commands(list(LIST_COMMANDS)))
        return 0


class Show(Resource):
    signature = "tools:show {name : the tool's name}"
    verbs = ("info", "read")
    default = True
    controller = CONTROLLER
    action = "show"
    id_arg = "name"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        fmt.say(_tools().show_text(result.data))
        return 0


class Add(Resource):
    signature = ("tools:add {name : the tool's name} {title* : what it does, in a few words} "
                 "{--summary=} {--usage=} {--when=} {--entry=} {--brief}")
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
    signature = "tools:set {name : the tool's name} {field : summary, usage, when or entry} {value* : the new value}"
    writes = True
    controller = CONTROLLER
    action = "update"
    id_arg = "name"

    def extra(self, p: Parsed):
        field = p.arg("field")
        if field not in ToolsController.FIELDS:
            return refuse(_tools().say("not_a_field", field=repr(field)))
        return {field: p.arg("value"), "field": None, "value": None}


class Remove(Resource):
    signature = "tools:remove {name : the tool's name} {why* : why it is retired}"
    verbs = ("strike",)
    writes = True
    controller = CONTROLLER
    action = "destroy"
    id_arg = "name"


class Index(Resource):
    signature = "tools:index"
    writes = True
    controller = CONTROLLER
    action = "adopt"


class Run(Command):
    # journal.main hands `tools run` to the script before parsing, so its arguments reach it untouched;
    # not a registry write, so a lent subagent may run a tool — the hook's shell-write rule still wants work open
    signature = "tools:run {name : the tool's name} {args*? : the arguments it takes}"

    def run(self, p: Parsed) -> int:
        return _tools().run(root(), p.arg("name"), (p.arg("args") or "").split())


COMMANDS = (List, Show, Add, Set, Remove, Index, Run)
