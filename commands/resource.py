from __future__ import annotations

import textwrap

import fmt
from command import Command, Parsed
from controller import Result, dispatch
from templates import render

SEARCH_TEXT = {
    "none": "NO {label} MENTION {term}",
    "found": "{n} {label} LINE(S) MENTION {term}",
    "closed_hidden": "{n} in closed {label} (--all)",
    "page": "page {page} of {pages}",
    "section": "{noun} {n}  {title}",
    "section_closed": "{noun} {n}  {title}  (closed)",
    "everything": "journal {verb} search {term} --all",
    "next": "journal {verb} search {term} --page={page}",
    "next_n": "the next {n}",
}


class Resource(Command):
    controller = None
    action = ""
    id_arg = "n"
    env_arg = ""            # the argument that names the environment, when it is not the session's

    def extra(self, p: Parsed) -> dict | int:
        return {}

    def run(self, p: Parsed) -> int:
        from app import root
        extra = self.extra(p)
        if isinstance(extra, int):
            return extra
        said = self.said(p)
        if isinstance(said, int):
            return said
        return self.render(p, dispatch(root(), self.controller, self.action, p, {**extra, **said}))

    def said(self, p: Parsed) -> dict | int:
        if not self.prose or not p.option("stdin"):
            return {}
        from app import STDIN_REFUSED, brief, refuse
        text = brief(True)
        if not (text or "").strip():
            return refuse(STDIN_REFUSED)
        return {self.prose: text.strip()}

    def render(self, p: Parsed, result: Result) -> int:
        if result.message:
            fmt.say(result.message, error=not result.ok)
        return 0 if result.ok else 1


def search_command(verb: str, controller, label: str, noun: str) -> type:
    from app import PAGE
    from commands.options import LISTING_CASTS

    def render_hits(self, p: Parsed, result: Result) -> int:
        if not result.ok:
            return Resource.render(self, p, result)
        term, hits, hidden = p.arg("term") or "", result.data, result.meta["closed"]
        needle = term.lower()
        away = render(SEARCH_TEXT["closed_hidden"], n=hidden, label=label) if hidden else ""
        if not hits:
            fmt.say(fmt.title(render(SEARCH_TEXT["none"], label=label.upper(), term=repr(term)), sub=away))
            if hidden:
                fmt.say(fmt.commands([(render(SEARCH_TEXT["everything"], verb=verb, term=term), "include closed ones")]))
            return 0
        pages = max(1, -(-len(hits) // PAGE))
        page = min(max(1, p.option("page")), pages)
        lo, hi = (page - 1) * PAGE, page * PAGE
        said = [s for s in (render(SEARCH_TEXT["page"], page=page, pages=pages) if pages > 1 else "", away) if s]
        fmt.say(fmt.title(render(SEARCH_TEXT["found"], n=len(hits), label=label.upper(), term=repr(term)),
                          sub=" · ".join(said)))
        width, last = fmt.room(None), None
        for hit in hits[lo:hi]:
            if hit["n"] != last:
                key = "section" if hit["open"] else "section_closed"
                fmt.say(fmt.section(render(SEARCH_TEXT[key], noun=noun, n=hit["n"], title=hit["title"])))
                last = hit["n"]
            body = " ".join(hit["text"].split())
            j = body.lower().find(needle)
            if j >= 0:
                body = body[:j] + "«" + body[j:j + len(term)] + "»" + body[j + len(term):]
            fmt.say(textwrap.fill(body, width=width, initial_indent="    ", subsequent_indent="    "))
        if hi < len(hits):
            fmt.say(fmt.commands([(render(SEARCH_TEXT["next"], verb=verb, term=term, page=page + 1),
                                   render(SEARCH_TEXT["next_n"], n=min(PAGE, len(hits) - hi)))]))
        return 0

    return type(f"{verb.title()}Search", (Resource,), {
        "signature": f"{verb}:search {{term*? : a word or phrase}} {{--all}} {{--page=1}}",
        "casts": {"page": LISTING_CASTS["page"]}, "controller": controller, "action": "search",
        "render": render_hits})
