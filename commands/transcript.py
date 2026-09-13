from __future__ import annotations

import textwrap
from pathlib import Path

import fmt
import settings as settings_mod
import tags
import tracks
import transcript
from app import PAGE, project, refuse, resolved, root, stem
from command import Command, Parsed, number
from commands.resource import Resource
from controllers.search import SearchController
from templates import render

NOUNS = (("conversation",), ("user",), ("search",), ("carry",))

BACK = {"back": number("--back")}

TEXT = {
    "no_transcript": "No transcript for this project yet.",
    "only_n": "  ! only {n} compaction(s) in this session; showing the oldest stretch",
    "since_last": "since the last compaction",
    "stretch_back": "the stretch {back} summary/ies back replaced",
    "conversation_title": "CONVERSATION",
    "conversation_sub": "{where} · {lines} lines · {n} compaction(s) in this session",
    "conversation_empty": "  (nothing was said in this stretch)",
    "user_title": "THE USER'S OWN WORDS",
    "user_sub": "in full, never trimmed",
    "user_empty": "\n  (the user said nothing in this stretch)",
    "scope_all": "every environment, every session",
    "scope_env": "environment {env}, every session",
    "nothing": "NOTHING MENTIONS {term}",
    "nothing_lead": "The record does not have it. Say so rather than filling the gap.",
    "search_all": "journal search {term} --all",
    "found": "{n} LINE(S) MENTION {term}",
    "found_sub": "{scope}[ · page {page} of {pages}, newest first]",
    "this_session": "this session",
    "other_session": "session {stem}",
    "section": "{label}[, {when}]",
    "line": "  {n}  {who}",
    "next_page": "journal search {term} --page={page}",
    "next_n": "the next {n} of {total}, older",
    "citation": "A line number is a citation within its session.",
}

DROPPED = ("journal conversation --back=1", "precisely what the last summary dropped")
READ_STRETCH = ("journal conversation --back=N", "reads a whole stretch of this session")


def _transcript() -> Path:
    got = resolved()
    if got is None:
        fmt.say(TEXT["no_transcript"], error=True)
        raise SystemExit(1)
    return got[0]


def _stretch(back: int):
    import digest
    conf, problems = settings_mod.load(root())
    for problem in problems:
        fmt.say(problem, error=True)
    digest.CONTEXT = conf["context_messages"]
    lines, boundaries = transcript.read(_transcript())
    return boundaries, transcript.since(lines, boundaries, back)


class Conversation(Command):
    signature = "conversation {--back=0}"
    casts = BACK

    def run(self, p: Parsed) -> int:
        import digest
        back = p.option("back")
        boundaries, seg = _stretch(back)
        n = len(boundaries)
        if back > n:
            fmt.say(render(TEXT["only_n"], n=n), error=True)
            back = n
        where = TEXT["since_last"] if back == 0 else render(TEXT["stretch_back"], back=back)
        fmt.say(fmt.title(TEXT["conversation_title"],
                          sub=render(TEXT["conversation_sub"], where=where, lines=len(seg), n=n)))
        fmt.say()
        body = digest.render(seg)
        fmt.say(body if body.strip() else TEXT["conversation_empty"])
        if back == 0 and n:
            fmt.say()
            fmt.say(fmt.commands([DROPPED]))
        return 0


class User(Command):
    signature = "user {--back=0}"
    casts = BACK

    def run(self, p: Parsed) -> int:
        import digest
        _, seg = _stretch(p.option("back"))
        body = digest.users_only(seg)
        fmt.say(fmt.title(TEXT["user_title"], sub=TEXT["user_sub"]))
        fmt.say(body if body.strip() else TEXT["user_empty"])
        return 0


class Search(Resource):
    signature = "search {term*? : a word or phrase} {--all} {--page=1}"
    casts = {"page": number("--page")}
    controller = SearchController()
    action = "index"

    def extra(self, p: Parsed):
        return {"session": stem() or ""}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        _, problems = settings_mod.load(root())
        for problem in problems:
            fmt.say(problem, error=True)
        d, every_env = result.data, bool(p.option("all"))
        term, total, page, pages = d["term"], d["total"], d["page"], d["pages"]
        scope = TEXT["scope_all"] if every_env else render(TEXT["scope_env"], env=d["env"])
        if not total:
            fmt.say(fmt.title(render(TEXT["nothing"], term=repr(term)), sub=scope))
            fmt.say()
            fmt.say(fmt.wrap(TEXT["nothing_lead"]))
            if not every_env:
                fmt.say(fmt.commands([(render(TEXT["search_all"], term=term), "every environment")]))
            return 0
        fmt.say(fmt.title(render(TEXT["found"], n=total, term=repr(term)), sub=render(
            TEXT["found_sub"], scope=scope, page=page if pages > 1 else None, pages=pages)))
        width = fmt.room(None)
        for group in d["transcript"]:
            label = TEXT["this_session"] if group["mine"] else render(TEXT["other_session"], stem=group["session"][:8])
            fmt.say(fmt.section(render(TEXT["section"], label=label, when=group["when"])))
            for line in group["lines"]:
                fmt.say(render(TEXT["line"], n=f"{line['n']:>5}", who="USER" if line["who"] == "user" else "agent"))
                fmt.say(textwrap.fill(line["text"], width=width, initial_indent="         ", subsequent_indent="         "))
                fmt.say()
        rows = []
        if page < pages:
            rows.append((render(TEXT["next_page"], term=term, page=page + 1),
                         render(TEXT["next_n"], n=min(PAGE, total - page * PAGE), total=total)))
        rows.append(READ_STRETCH)
        fmt.say(fmt.wrap(TEXT["citation"]))
        fmt.say(fmt.commands(rows))
        return 0


class Carry(Command):
    signature = "carry {--fresh}"

    def run(self, p: Parsed) -> int:
        import hook
        fmt.say(hook.carried("startup" if p.option("fresh") else "compact", depth=hook.FULL))
        return 0


COMMANDS = (Conversation, User, Search, Carry)
