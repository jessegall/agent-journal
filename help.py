"""Every command, grouped by the noun that owns it — the detail `journal --help` stopped printing.

THE SYNOPSIS WAS THE BIGGEST WALL THE CLI COULD PRODUCE, and it arrived at every `-h`,
every `--help` and every unknown verb: 77 lines of it, one per command, in a package whose
whole argument is that output costs the reader something. For the person at a terminal that
wall is a feature — it is how you find a verb you half-remember without knowing which noun
owns it — so it is not deleted, it is MOVED: `journal --help` is now an index of the groups,
and each group's own lines are one command away, behind `journal <noun> help`.

ONE TABLE, NOT TWO. GROUPS below is the only place a command's line is written. The index in
journal.py's docstring names the groups and nothing else, so it cannot fall out of step with
what the commands actually are — the failure that a second hand-maintained list guarantees
eventually. `_help` reads this module; nothing greps the docstring for a command any more.

EVERY SPELLING ANSWERS, canonical or alias. ALIAS maps each legacy and singular spelling to
the group whose lines it borrows, because ruling R3 keeps every current spelling running
forever and an alias with no help is a spelling the reader is told does not exist — which is
the one thing an alias promised not to be. When a verb is in neither table, `_help` falls
back to matching it against every line here, so a command can never regress to "No such
command" merely because nobody remembered to file it under a noun.
"""
from __future__ import annotations

#: group -> its commands, in the order a reader meets them. The ONLY list of them.
GROUPS: dict[str, tuple[str, ...]] = {
    "work": (
        'journal work start "<what>"   declare work — a commitment, which is why it costs a command',
        'journal work update "<what moved>" [--on="<work>"]   progress on the open work',
        'journal work await "<what you wait on>" [--agent=<id>|--pid=<n>] [--for=<minutes>]   in flight on something you cannot hurry; the stop stops nudging it',
        'journal work end "<what>"     the same words, to close it',
        "journal open                  work declared and never closed, with its notes",
        "journal next                  what to do now: the details of the last hold, or the next to-do",
    ),
    "pins": (
        'journal pins add "<claim>" [--supersedes=N] [--doc=<doc>[.<p>]]   a claim that must survive a compaction',
        'journal pin "<claim>"         the same command; `remember` too. Permanent aliases, never deprecated',
        "journal pins [--all]          every pin, numbered — the number is what --supersedes takes",
        "journal pins N --full         the conversation around where pin N was written",
        'journal pins strike N "<why>"   retire a pin that stopped being true — bare `journal strike N "<why>"` is the same',
        "journal pins promote N        lift pin N into a rule; the pin is struck and says where it went — bare `journal promote N` is the same",
        'journal nothing "<why>"       after a context warning: nothing here needs pinning, and why',
    ),
    "rules": (
        'journal rules add "<ruling>" [--doc=<doc>[.<p>]]   a pin for EVERY environment — what the project decided, not one line of work',
        'journal rule "<ruling>"       the same command. A permanent alias, never deprecated',
        "journal rules [--all]         every rule, numbered; `rules N --full` reads around one",
        'journal rules strike N "<why>"   repeal a rule that stopped being true — `journal rule --strike N "<why>"` is the same',
    ),
    "todos": (
        'journal todos add "<title>" [--brief] [--doc=<doc>[.<p>]]   delayed work, on this environment; --brief reads a longer brief from stdin',
        'journal todo "<title>"        the same command; `todo` and `todos` are twins everywhere',
        "journal todos [--all] [--page=N]   the titles, numbered",
        "journal todos show N          the whole brief — bare `journal todo N` is the same",
        "journal todos start N         open work with that title; `work end` closes both",
        'journal todos done N "<how>"    resolved without starting it',
        'journal todos strike N "<why>"  abandoned, on the record — `journal todo drop N "<why>"` is the same',
        'journal todos ask N "<question>"    it waits on the user; auto moves on to the next',
        'journal todos answer N "<answer>"   the user answers it; the agent is told at its next stop and picks it up first',
        'journal todos amend N "<section title>" --brief     append a new section to a brief, from stdin',
        'journal todos replace N ["<section title>"] --brief   swap one named section, or the whole brief with none; old text kept under struck/',
        "journal todo auto [on|off]    work through this environment's list without asking, or wait for the user's word",
    ),
    "docs": (
        "journal docs                  the catalogue: every doc, its status, parts, files and abstract",
        "journal docs <doc>            read a doc — <doc> is its number or its name, here and everywhere below",
        "journal docs <doc>.<p>        read one part of it",
        "journal docs files <doc>      its attachments, as a tree; `journal docs <doc> files` and bare `journal docs files` still work",
        'journal docs add "<title>" --abstract="<one line>" --brief   a new doc; the brief on stdin is its intro',
        'journal docs part <doc> "<title>" --brief   a new part, from stdin — a report, a section, a finding',
        "journal docs replace <doc>.<p> --brief      a new body for a part; the old one is kept under struck/",
        'journal docs strike <doc>.<p> "<why>"       drop a part, on the record',
        "journal docs final <doc> | draft <doc>      its status",
        'journal docs abstract <doc> "<one line>"    the line every session is handed',
        "journal docs supersede <doc> by <doc>       point readers of the first at the second",
        'journal docs attach <doc> <path> ["<what it is>"] [--replace]   copy a file or a folder into the doc, beside its parts',
        'journal docs detach <doc> <name> "<why>"    drop an attachment; it is kept under struck/',
        "journal docs index            catalogue the files docs/ already holds",
        "journal docs search <term> [--page=N]       every line of every doc, and every attachment by name",
        "--doc=<doc> or --doc=<doc>.<p> on pins, rules and todos cites a doc (or one part) from the entry",
    ),
    "tools": (
        "journal tools                 the tools: scripts kept for repeated work, with what each does and how to call it",
        "journal tools <name>          read one",
        "journal tools run <name> [args…]   run it from the project root",
        'journal tools add <name> "<title>" --summary="<one line>" [--usage="<how>"] [--when="<when>"] [--entry=<file>] [--brief]',
        'journal tools set <name> summary|usage|when|entry "<value>"',
        'journal tools strike <name> "<why>"   retire it, kept under struck/ — `journal tools remove` is the same',
        "journal tools index           a tool.md for every folder under .journal/tools/ that has none",
    ),
    "environments": (
        "journal environments          every environment, this session's marked, which sessions are on which and whether they are running",
        'journal environments "<name>"   the pickup page of one: docs to read first, what stands, open work, to-dos in order, how to begin',
        'journal switch "<name>" [--project|--session=<id>|--all-sessions]   this session\'s environment; --project also where new sessions start',
        "journal switch --back         the one you came from",
        'journal prepare "<name>"      create an environment for a piece of work and switch to it',
        'journal delegate "<name>"     this session and its subagents act on that environment; --off ends it',
        'journal handoff "<name>" "<source>"   an environment made ready BY AGENTS: creates and delegates it, prints the hand-off agent\'s prompt',
        'journal handoff "<name>" --run        when it reports READY: the runner\'s prompt; --off when the run is over',
        "journal --env=<name> <command>   run any command on a named environment without switching to it",
        "journal worktree [link]       is this a linked worktree, and does .journal link to the main checkout's? `link` makes it so",
    ),
    "transcript": (
        "journal conversation          what was said since the last compaction",
        "journal conversation --back=N   N compactions back; --back=1 is what the last summary REPLACED",
        "journal user                  only the user's own words, in full",
        "journal search <term> [--all] [--page=N]   every line mentioning it on this environment, in every session, 25 a page newest first",
        "journal carry                 exactly what a compaction will hand back — nothing is written",
    ),
    "system": (
        "journal verify                is any of this in force? wired is not the same as fired",
        "journal version               this project's version of the journal, and whether a newer one is out",
        "journal update [--from=<path or git url>]    pull the latest journal and print what changed",
        "journal settings              every setting, its value, and where it came from",
        "journal loop set              this session has a loop running (the hook could not see it); `journal loop` says whether one is known",
    ),
}

#: every other spelling -> the group whose lines it borrows. Ruling R3: these run forever,
#: so they answer forever. A spelling that dispatches but has no help is a broken promise.
#: THE CONVERSE IS THE OTHER HALF, and it is why `doc`, `tool`, `environment`, `auto` and
#: `await` are absent: none of them dispatches. `journal doc 1` refuses, so `journal doc
#: help` must refuse too — a CLI that answers for a noun it does not have is disagreeing
#: with itself about what exists, and the reader believes the help. Only a spelling that
#: RUNS gets an entry here; test_tracks.py holds all five to their refusal.
ALIAS: dict[str, str] = {
    "start": "work", "end": "work", "open": "work", "next": "work",
    "pin": "pins", "remember": "pins", "promote": "pins", "strike": "pins",
    "nothing": "pins",
    "rule": "rules",
    "todo": "todos",
    "tracks": "environments", "envs": "environments",
    "switch": "environments", "prepare": "environments", "delegate": "environments",
    "handoff": "environments", "worktree": "environments",
    "conversation": "transcript", "user": "transcript", "search": "transcript",
    "carry": "transcript",
    "verify": "system", "version": "system", "update": "system", "settings": "system",
    "loop": "system",
}


def lines(verb: str) -> list[str]:
    """The lines that answer `journal <verb> help`, or an empty list if nothing does.

    A GROUP FIRST, THEN THE VERB ITSELF. `journal pin help` wants the pins group, not the
    one line that happens to start with `journal pin` — a reader asking about a noun is
    asking what can be done with it. Only when the verb names no group does the match fall
    to the lines themselves, which is what keeps a command that nobody filed under a noun
    from answering "No such command".
    """
    group = ALIAS.get(verb, verb)
    if group in GROUPS:
        return list(GROUPS[group])
    # THE MATCH ENDS AT A WORD, not at a prefix: `journal doc` must not answer with every
    # `journal docs …` line and then refuse `journal doc 1`, which is the CLI disagreeing
    # with its own help about what exists.
    heads = (f"journal {verb}", f"journal --{verb}")
    return [l for g in GROUPS.values() for l in g
            if any(l == h or l.startswith(h + " ") for h in heads)]


def groups() -> list[str]:
    """The group names, for the index and for anything that needs to list them."""
    return list(GROUPS)
