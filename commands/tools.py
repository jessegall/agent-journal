from __future__ import annotations

import fmt
import tracks
from app import BRIEF_REFUSED, CATALOGUE_PAGE, answer, brief, refuse, root, stem
from command import Command, Parsed
from commands.options import LISTING, LISTING_CASTS
from templates import render

NOUNS = (("tools",),)


def _tools():
    import tools
    return tools


def here() -> str:
    return tracks.current(root(), stem())


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


class List(Command):
    signature = "tools:list " + LISTING
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        tools = _tools()
        loose = tools.uncatalogued(root())
        fmt.say(fmt.title(TEXT["title"], sub=render(TEXT["sub"], n=len(tools._all(root())))))
        fmt.say()
        fmt.say(tools.catalogue(root(), cap=CATALOGUE_PAGE, page=p.option("page"), order=p.option("order")))
        if loose:
            fmt.say()
            fmt.say(fmt.wrap(render(TEXT["loose"], n=len(loose), names=[x.name for x in loose])))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead"]))
        fmt.say(fmt.commands(list(LIST_COMMANDS)))
        return 0


class Show(Command):
    signature = "tools:show {name : the tool's name}"
    verbs = ("info", "read")
    default = True

    def run(self, p: Parsed) -> int:
        return answer(_tools().show(root(), p.arg("name")))


class Add(Command):
    signature = ("tools:add {name : the tool's name} {title* : what it does, in a few words} "
                 "{--summary=} {--usage=} {--when=} {--entry=} {--brief}")
    writes = True

    def run(self, p: Parsed) -> int:
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return answer(_tools().add(root(), p.arg("name"), p.arg("title"), p.option("summary") or "",
                                   p.option("usage") or "", p.option("when") or "", p.option("entry") or "",
                                   body, here()))


class Set(Command):
    signature = "tools:set {name : the tool's name} {field : summary, usage, when or entry} {value* : the new value}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_tools().set_field(root(), p.arg("name"), p.arg("field"), p.arg("value")))


class Remove(Command):
    signature = "tools:remove {name : the tool's name} {why* : why it is retired}"
    verbs = ("strike",)
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_tools().remove(root(), p.arg("name"), p.arg("why")))


class Index(Command):
    signature = "tools:index"
    writes = True

    def run(self, p: Parsed) -> int:
        for line in _tools().adopt(root(), here()):
            fmt.say(line)
        return 0


class Run(Command):
    # journal.main hands `tools run` to the script before parsing, so its arguments reach it untouched;
    # not a registry write, so a lent subagent may run a tool — the hook's shell-write rule still wants work open
    signature = "tools:run {name : the tool's name} {args*? : the arguments it takes}"

    def run(self, p: Parsed) -> int:
        return _tools().run(root(), p.arg("name"), (p.arg("args") or "").split())


COMMANDS = (List, Show, Add, Set, Remove, Index, Run)
