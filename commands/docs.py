from __future__ import annotations

import textwrap

import fmt
from app import BRIEF_REFUSED, CATALOGUE_PAGE, PAGE, brief, refuse
from command import Parsed
from commands.resource import Resource
from controllers.docs import DocsController
from commands.options import LISTING, LISTING_CASTS
from templates import render

NOUNS = (("docs",),)


def _docs():
    import docs
    return docs


def trailing_files(text: str) -> str:
    words = text.split()
    if len(words) > 1 and words[-1] in ("files", "attachments"):
        return " ".join(words[:-1])
    raise ValueError("not a `<doc> files` listing")


def the_word_by(word: str) -> str:
    if word != "by":
        raise ValueError("journal docs supersede <old> by <new>")
    return word


TEXT = {
    "title": "DOCS OF THIS PROJECT",
    "sub": "{n} catalogued[ · {drafts} draft(s)][ · {elsewhere} on other environments (--all)]",
    "loose": "{n} file(s) under {folder}/ are not catalogued: {names:, }",
    "lead": "What was settled, so it is not re-investigated: a doc is read on demand and never injected, and one "
            "line of its catalogue reaches every session. A pin, rule or to-do that rests on one cites it with --doc=N.",
    "search_none": "NO DOC MENTIONS {term}",
    "search_found": "{n} DOC LINE(S) MENTION {term}",
    "search_elsewhere": "{n} on other environments (--all)",
    "search_page": "page {page} of {pages}",
    "search_section": "doc {ref}  {title}",
    "search_transcript": "journal search {term}",
    "search_everywhere": "journal docs search {term} --all",
    "search_next": "journal docs search {term} --page={page}",
    "search_next_n": "the next {n}",
}

LIST_COMMANDS = (
    ("journal docs show <doc>", "read one, by number or name; <doc>.<p> reads one part"),
    ('journal docs add "<title>" --abstract="<one line>" --brief', "a new doc, its intro on stdin"),
    ('journal docs part <doc> "<title>" --brief', "a new part, from stdin"),
    ('journal docs attach <doc> <path> "<what it is>"', "copy a file or folder (HTML, a design, a PDF) into the doc"),
    ("journal docs <doc> files", "its attachments, as a tree; `docs files` lists every doc's"),
    ("journal docs paths <doc>", "one absolute path per attached file, for a subagent's prompt"),
    ("journal docs search <term>", "every line of every doc mentioning it"),
    ('journal pins add "<claim>" --doc=<doc>[.<p>]', "cite a doc, or one part, from a pin; rule and todo take it too"),
)
INDEX_COMMAND = ("journal docs index", "catalogue the loose files")


CONTROLLER = DocsController()


class List(Resource):
    signature = "docs:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return dict(cap=CATALOGUE_PAGE, scope="here")

    def render(self, p: Parsed, result) -> int:
        m, page, order = result.meta, p.option("page"), p.option("order")
        fmt.say(fmt.title(TEXT["title"], sub=render(TEXT["sub"], n=m["shelf"], drafts=m["drafts"] or None,
                                                    elsewhere=m["elsewhere"] or None)))
        fmt.say()
        if result.data:
            items = tuple(fmt.Item(n=r["n"], text=r["title"], meta=r["facts"], struck=bool(r["superseded_by"]))
                          for r in result.data)
            fmt.say(fmt.render(fmt.Out(items=items)) + fmt.more("docs", m["left"], page, order))
        else:
            fmt.say(_docs().say("empty"))
        if m["loose"]:
            fmt.say()
            fmt.say(fmt.wrap(render(TEXT["loose"], n=len(m["loose"]), folder=m["folder"], names=m["loose"])))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead"]))
        fmt.say(fmt.commands([*LIST_COMMANDS, *([INDEX_COMMAND] if m["loose"] else [])]))
        return 0


class FilesOf(Resource):
    signature = "docs {doc* : a doc number or name, then files}"
    casts = {"doc": trailing_files}
    controller = CONTROLLER
    action = "files"
    id_arg = "doc"


class Show(Resource):
    signature = "docs:show {doc* : a doc number or name}"
    verbs = ("read",)
    default = True
    controller = CONTROLLER
    action = "show"
    id_arg = "doc"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        fmt.say(_docs().show_text(result.data))
        return 0


class Files(Resource):
    signature = "docs:files {doc*? : a doc number or name}"
    verbs = ("attachments",)
    controller = CONTROLLER
    action = "files"
    id_arg = "doc"


class _WithBody(Resource):
    writes = True
    controller = CONTROLLER

    def extra(self, p: Parsed):
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return {"body": body}


class Add(_WithBody):
    signature = "docs:add {title*? : the doc's title} {--abstract=} {--brief} {--global}"
    action = "store"


class Part(_WithBody):
    signature = "docs:part {doc : a doc number or name} {title* : the part's title} {--brief}"
    action = "part"
    id_arg = "doc"


class Replace(_WithBody):
    signature = "docs:replace {part : a part, like 4.2} {--brief}"
    action = "update"
    id_arg = "part"


class Strike(Resource):
    signature = "docs:strike {part : a part, like 4.2} {why* : why it is struck}"
    writes = True
    controller = CONTROLLER
    action = "destroy"
    id_arg = "part"


class Final(Resource):
    signature = "docs:final {doc : a doc number or name}"
    writes = True
    controller = CONTROLLER
    action = "final"
    id_arg = "doc"


class Draft(Final):
    signature = "docs:draft {doc : a doc number or name}"
    action = "draft"


class Abstract(Resource):
    signature = "docs:abstract {doc : a doc number or name} {line* : the one-line abstract}"
    writes = True
    controller = CONTROLLER
    action = "update"
    id_arg = "doc"

    def extra(self, p: Parsed):
        return {"abstract": p.arg("line")}


class Title(Resource):
    signature = "docs:title {doc : a doc number or name} {title* : the doc's new title}"
    writes = True
    controller = CONTROLLER
    action = "update"
    id_arg = "doc"

    def extra(self, p: Parsed):
        return {"title": p.arg("title")}


class Paths(Resource):
    signature = "docs:paths {doc : a doc number or name}"
    controller = CONTROLLER
    action = "paths"
    id_arg = "doc"

    def render(self, p: Parsed, result) -> int:
        if result.ok and result.data:
            print("\n".join(result.data))
            return 0
        return super().render(p, result)


class Move(Resource):
    signature = "docs:move {doc : a doc number or name} {environment*? : the environment it belongs to} {--global}"
    writes = True
    controller = CONTROLLER
    action = "move"
    id_arg = "doc"


class Supersede(Resource):
    signature = "docs:supersede {old : the doc being replaced} {by : the word by} {new : the doc that replaces it}"
    casts = {"by": the_word_by}
    writes = True
    controller = CONTROLLER
    action = "supersede"
    id_arg = "old"


class Attach(Resource):
    signature = "docs:attach {doc : a doc number or name} {path : the file or folder} {title*? : what it is} {--replace}"
    writes = True
    controller = CONTROLLER
    action = "attach"
    id_arg = "doc"


class Detach(Resource):
    signature = "docs:detach {doc : a doc number or name} {name : the attachment} {why* : why it is removed}"
    writes = True
    controller = CONTROLLER
    action = "detach"
    id_arg = "doc"


class Index(Resource):
    signature = "docs:index"
    writes = True
    controller = CONTROLLER
    action = "adopt"


class Search(Resource):
    signature = "docs:search {term*? : a word or phrase} {--all} {--page=1}"
    casts = {"page": LISTING_CASTS["page"]}
    controller = CONTROLLER
    action = "search"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        term, hits, elsewhere = p.arg("term") or "", result.data, result.meta["elsewhere"]
        needle = term.lower()
        away = render(TEXT["search_elsewhere"], n=elsewhere) if elsewhere else ""
        if not hits:
            fmt.say(fmt.title(render(TEXT["search_none"], term=repr(term)), sub=away))
            fmt.say(fmt.commands([(render(TEXT["search_transcript"], term=term), "the transcript instead")]
                                 + ([(render(TEXT["search_everywhere"], term=term), "every environment's docs")]
                                    if elsewhere else [])))
            return 0
        pages = max(1, -(-len(hits) // PAGE))
        page = min(max(1, p.option("page")), pages)
        lo, hi = (page - 1) * PAGE, page * PAGE
        said = [s for s in (render(TEXT["search_page"], page=page, pages=pages) if pages > 1 else "", away) if s]
        fmt.say(fmt.title(render(TEXT["search_found"], n=len(hits), term=repr(term)), sub=" · ".join(said)))
        width, last = fmt.room(None), None
        for hit in hits[lo:hi]:
            if hit["ref"] != last:
                fmt.say(fmt.section(render(TEXT["search_section"], ref=hit["ref"], title=hit["title"])))
                last = hit["ref"]
            body = " ".join(hit["text"].split())
            j = body.lower().find(needle)
            body = body[:j] + "«" + body[j:j + len(term)] + "»" + body[j + len(term):]
            fmt.say(textwrap.fill(body, width=width, initial_indent=f"  {hit['line']:>4}  ", subsequent_indent="        "))
        fmt.say()
        rows = [("journal docs <doc>", "read the doc, by number or name")]
        if page < pages:
            rows.insert(0, (render(TEXT["search_next"], term=term, page=page + 1),
                            render(TEXT["search_next_n"], n=min(PAGE, len(hits) - hi))))
        fmt.say(fmt.commands(rows))
        return 0


COMMANDS = (List, FilesOf, Show, Files, Add, Part, Replace, Strike, Final, Draft, Abstract, Title, Paths, Move, Supersede,
            Attach, Detach, Index, Search)
