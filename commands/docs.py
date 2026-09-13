from __future__ import annotations

import textwrap

import fmt
import tracks
from app import BRIEF_REFUSED, CATALOGUE_PAGE, PAGE, answer, brief, refuse, root, stem
from command import Command, Parsed
from commands.options import LISTING, LISTING_CASTS
from templates import render

NOUNS = (("docs",),)


def _docs():
    import docs
    return docs


def here() -> str:
    return tracks.current(root(), stem())


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
    "move_both": "`docs move {doc}` was given both `--global` and `{dst}`. A doc belongs to the project or to one "
                 "environment; say which.",
    "move_where": '`journal docs move <doc> "<environment>"` — or `--global` to give it to the project, which lists '
                  "it on every environment",
    "search_wants": "docs search wants a term",
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
    ("journal docs search <term>", "every line of every doc mentioning it"),
    ('journal pins add "<claim>" --doc=<doc>[.<p>]', "cite a doc, or one part, from a pin; rule and todo take it too"),
)
INDEX_COMMAND = ("journal docs index", "catalogue the loose files")


class List(Command):
    signature = "docs:list " + LISTING
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        docs, env, every_env = _docs(), here(), bool(p.option("all"))
        every = docs._load(root())
        shelf = every if every_env else [d for d in every if docs.here(d, env)]
        loose = docs.uncatalogued(root())
        fmt.say(fmt.title(TEXT["title"], sub=render(
            TEXT["sub"], n=len(shelf), drafts=len([d for d in shelf if d.get("status") != "final"]) or None,
            elsewhere=(len(every) - len(shelf)) or None)))
        fmt.say()
        fmt.say(docs.catalogue(root(), cap=CATALOGUE_PAGE, page=p.option("page"), order=p.option("order"),
                               track=env, all_of_them=every_env))
        if loose:
            fmt.say()
            fmt.say(fmt.wrap(render(TEXT["loose"], n=len(loose), folder=docs.folder(root()).name,
                                    names=[x.name for x in loose])))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead"]))
        fmt.say(fmt.commands([*LIST_COMMANDS, *([INDEX_COMMAND] if loose else [])]))
        return 0


class FilesOf(Command):
    signature = "docs {doc* : a doc number or name, then files}"
    casts = {"doc": trailing_files}

    def run(self, p: Parsed) -> int:
        return answer(_docs().list_attachments(root(), p.arg("doc")))


class Show(Command):
    signature = "docs:show {doc* : a doc number or name}"
    verbs = ("read",)
    default = True

    def run(self, p: Parsed) -> int:
        return answer(_docs().show(root(), p.arg("doc")))


class Files(Command):
    signature = "docs:files {doc*? : a doc number or name}"
    verbs = ("attachments",)

    def run(self, p: Parsed) -> int:
        return answer(_docs().list_attachments(root(), p.arg("doc") or ""))


class Add(Command):
    signature = "docs:add {title*? : the doc's title} {--abstract=} {--brief} {--global}"
    writes = True

    def run(self, p: Parsed) -> int:
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        docs = _docs()
        scope = docs.GLOBAL if p.option("global") else here()
        return answer(docs.add(root(), p.arg("title") or "", p.option("abstract") or "", body, scope))


class Part(Command):
    signature = "docs:part {doc : a doc number or name} {title* : the part's title} {--brief}"
    writes = True

    def run(self, p: Parsed) -> int:
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return answer(_docs().part(root(), p.arg("doc"), p.arg("title"), body, here()))


class Replace(Command):
    signature = "docs:replace {part : a part, like 4.2} {--brief}"
    writes = True

    def run(self, p: Parsed) -> int:
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return answer(_docs().replace(root(), p.arg("part"), body, here()))


class Strike(Command):
    signature = "docs:strike {part : a part, like 4.2} {why* : why it is struck}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_docs().strike(root(), p.arg("part"), p.arg("why")))


class Final(Command):
    signature = "docs:final {doc : a doc number or name}"
    status = "final"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_docs().set_status(root(), p.arg("doc"), self.status))


class Draft(Final):
    signature = "docs:draft {doc : a doc number or name}"
    status = "draft"


class Abstract(Command):
    signature = "docs:abstract {doc : a doc number or name} {line* : the one-line abstract}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_docs().set_abstract(root(), p.arg("doc"), p.arg("line")))


class Move(Command):
    signature = "docs:move {doc : a doc number or name} {environment*? : the environment it belongs to} {--global}"
    writes = True

    def run(self, p: Parsed) -> int:
        docs, dst, to_project = _docs(), p.arg("environment") or "", bool(p.option("global"))
        if to_project and dst:
            return refuse(render(TEXT["move_both"], doc=p.arg("doc"), dst=dst))
        if not (dst or to_project):
            return refuse(TEXT["move_where"])
        return answer(docs.move(root(), p.arg("doc"), docs.GLOBAL if to_project else dst))


class Supersede(Command):
    signature = "docs:supersede {old : the doc being replaced} {by : the word by} {new : the doc that replaces it}"
    casts = {"by": the_word_by}
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_docs().supersede(root(), p.arg("old"), p.arg("new")))


class Attach(Command):
    signature = "docs:attach {doc : a doc number or name} {path : the file or folder} {title*? : what it is} {--replace}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_docs().attach(root(), p.arg("doc"), p.arg("path"), p.arg("title") or "", here(),
                                     replace=bool(p.option("replace"))))


class Detach(Command):
    signature = "docs:detach {doc : a doc number or name} {name : the attachment} {why* : why it is removed}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(_docs().detach(root(), p.arg("doc"), p.arg("name"), p.arg("why")))


class Index(Command):
    signature = "docs:index"
    writes = True

    def run(self, p: Parsed) -> int:
        for line in _docs().adopt(root(), here()):
            fmt.say(line)
        return 0


class Search(Command):
    signature = "docs:search {term*? : a word or phrase} {--all} {--page=1}"
    casts = {"page": LISTING_CASTS["page"]}

    def run(self, p: Parsed) -> int:
        term = p.arg("term") or ""
        needle = term.lower()
        if not needle:
            return refuse(TEXT["search_wants"])
        docs = _docs()
        every = docs.search_lines(root(), all_of_them=True)
        lines = every if p.option("all") else docs.search_lines(root(), track=here())
        hits = [(ref, title, i, line) for ref, title, i, line in lines if needle in line.lower()]
        elsewhere = len([1 for _, _, _, line in every if needle in line.lower()]) - len(hits)
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
        for ref, title, i, line in hits[lo:hi]:
            if ref != last:
                fmt.say(fmt.section(render(TEXT["search_section"], ref=ref, title=title)))
                last = ref
            body = " ".join(line.split())
            j = body.lower().find(needle)
            body = body[:j] + "«" + body[j:j + len(term)] + "»" + body[j + len(term):]
            fmt.say(textwrap.fill(body, width=width, initial_indent=f"  {i:>4}  ", subsequent_indent="        "))
        fmt.say()
        rows = [("journal docs <doc>", "read the doc, by number or name")]
        if page < pages:
            rows.insert(0, (render(TEXT["search_next"], term=term, page=page + 1),
                            render(TEXT["search_next_n"], n=min(PAGE, len(hits) - hi))))
        fmt.say(fmt.commands(rows))
        return 0


COMMANDS = (List, FilesOf, Show, Files, Add, Part, Replace, Strike, Final, Draft, Abstract, Move, Supersede,
            Attach, Detach, Index, Search)
