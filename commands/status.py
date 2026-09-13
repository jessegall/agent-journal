from __future__ import annotations

import os

import fmt
import settings as settings_mod
import tracks
import transcript
from app import project, root, stem
from command import Command, Parsed
from templates import render

NOUNS = (("status",),)

TEXT = {
    "title": "JOURNAL",
    "sub": "environment {env}",
    "none": "none",
    "environment": "{env}[   (parked: {others:, })]",
    "rules": "{n} in force on every environment",
    "pins": "{n} standing on this environment",
    "reminders": "{n} repeated at every stop",
    "open": "{n} open: {subjects:; }",
    "docs": "{n} catalogued[, {drafts} draft(s)]",
    "tools": "{n} catalogued",
    "waiting": "{n} waiting",
    "todos": "{waiting}[, {on_user} on the user][, {answered} answered][{auto}]",
    "auto_on": ", auto on",
    "context_known": "{pct} full ({used} of {window})",
    "context_unknown": "{used} tokens; window not yet known (learned at the first compaction)",
    "guessed": "guessed: {name} (no session id in the environment)",
    "hooks_disabled": "DISABLED — nothing is held, gated or filed",
    "hooks_fired": "fired in this session",
    "hooks_silent": "nothing has reached the hook in this session",
    "version": "{have}[  ({available} available: journal upgrade)]",
    "on_user": "waiting on the user",
}

STATUS_COMMANDS = (
    ("journal conversation [--back=N]", "what was said, since the last compaction or before it"),
    ("journal search <term>", "every line mentioning it on this environment, and who said it"),
    ('journal pins add "<claim>" [--doc=<doc>]', "a fact that must outlive a compaction; --doc ties it to a doc, by number or name"),
    ("journal help", "every command"),
)


def _count(template: str, n: int) -> str:
    return render(template, n=n) if n else TEXT["none"]


class Status(Command):
    signature = "status"

    def run(self, p: Parsed) -> int:
        import context
        import docs
        import pins
        import reminders
        import state
        import todo
        import tools
        import update
        import work
        conf, problems = settings_mod.load(root())
        for problem in problems:
            fmt.say(problem, error=True)
        env = tracks.current(root(), stem())
        catalogued = docs._load(root())
        drafts = [d for d in catalogued if d.get("status") != "final"]
        standing = work.open_work(root())
        on_user = todo.asking(root(), env)
        rows = [
            ("environment", render(TEXT["environment"], env=env,
                                   others=[t["name"] for t in tracks.listing(root()) if not t["current"]]),
             "journal environments"),
            ("rules", _count(TEXT["rules"], len(pins.live(root(), pins.RULES))), "journal rules"),
            ("pins", _count(TEXT["pins"], len(pins.live(root()))), "journal pins"),
            ("reminders", _count(TEXT["reminders"], len(reminders.live(root()))), "journal reminders"),
            ("open work", render(TEXT["open"], n=len(standing), subjects=[w["subject"] for w in standing])
             if standing else TEXT["none"], "journal open"),
            ("docs", render(TEXT["docs"], n=len(catalogued), drafts=len(drafts) or None)
             if catalogued else TEXT["none"], "journal docs"),
            ("tools", _count(TEXT["tools"], len(tools._all(root()))), "journal tools"),
            ("to-do", render(TEXT["todos"], waiting=_count(TEXT["waiting"], len(todo.open_items(root(), env))),
                             on_user=len(on_user) or None, answered=len(todo.answered(root(), env)) or None,
                             auto=TEXT["auto_on"] if todo.auto(root(), env) else None), "journal todo"),
        ]
        got = transcript.session_transcript(project())
        if got:
            read = context.pressure(got[0], conf["context_window"], state.get(root(), "window", 0) or 0)
            if read and read[3]:
                rows.append(("context", render(TEXT["context_known"], pct=f"{read[0]:.0%}", used=f"{read[1]:,}",
                                               window=f"{read[2]:,}"), ""))
            elif read:
                rows.append(("context", render(TEXT["context_unknown"], used=f"{read[1]:,}"), ""))
            if got[1]:
                rows.append(("transcript", render(TEXT["guessed"], name=got[0].name), ""))
        sid = os.environ.get(transcript.SESSION_ENV, "")
        fired = dict(state.runtime_files(root())).get(sid) if sid else None
        disabled = not state.hooks_enabled(root())
        rows.append(("hooks",
                     TEXT["hooks_disabled"] if disabled else TEXT["hooks_fired"] if fired else TEXT["hooks_silent"],
                     "journal enable" if disabled else "journal verify"))
        have, up = update.current(root()), update.check(root())
        newer = up["version"] if up.get("version") and update.newer(up["version"], have) else None
        rows.append(("version", render(TEXT["version"], have=have, available=newer), "journal version"))
        fmt.say(fmt.title(TEXT["title"], sub=render(TEXT["sub"], env=env)))
        fmt.say()
        fmt.say(fmt.facts(rows))
        if on_user:
            fmt.say(fmt.section(TEXT["on_user"]))
            for t in on_user:
                fmt.say(fmt.numbered(t["n"], t["title"]))
                fmt.say(fmt.wrap(t["asks"], indent=5))
        fmt.say()
        fmt.say(fmt.commands(list(STATUS_COMMANDS)))
        return 0


COMMANDS = (Status,)
