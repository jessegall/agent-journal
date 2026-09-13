from __future__ import annotations

import fmt
import grants
import settings as settings_mod
import state
import todo
import tracks
import worktree
from app import answer, now, package, project, refuse, root, stem
from command import Command, Parsed, number
from templates import render

NOUNS = (("environments", "environment", "envs", "env", "tracks", "track"), ("switch",), ("claim",),
         ("prepare",), ("grant",), ("grants",), ("lent",), ("assign",), ("worktree",))

TEXT = {
    "list_title": "ENVIRONMENTS",
    "list_sub": "* this session · > where new sessions start",
    "row": " {mark} {name} {pins} pin(s), {open} open[   sessions: {sessions:, }]",
    "list_lead": "Nothing is ever closed by switching.[ One running session works an environment at a time; a stale "
                 "session is one not seen for {hours} h.]",
    "back_no_sessions": "--back takes no sessions",
    "moved": "the project starts on {name}; moved {n} session(s): {ids:, }",
    "not_moved": "  ! not moved, one running session works an environment: {ids:, }",
    "prepare_what": 'prepare what? journal prepare "<environment>" — letters, digits and dashes',
    "prepare_title": "PREPARE",
    "granted_title": "GRANTED",
    "granted_sub": "{n} lent by this session",
    "granted_none": "This session has lent nothing. A subagent's journal writes are refused.",
    "granted_item": "its subagents may write there with --env",
    "granted_footer": '`journal grant` lends the environment you are on; `journal grant "<other>"` lends a different '
                      "one, and `--off` takes one back. A grant belongs to this session and dies with it.",
    "lent_title": "LENT",
    "lent_sub": "{n} environment(s) this session has lent",
    "lent_lead": "You are a SESSION, not a dispatched agent — nothing lent this to you, and the journal is yours. "
                 "`journal lent` is the command an agent you dispatch runs to learn its own name and its environment; "
                 "put it first in the prompt you give it.",
    "lent_item": "its agents write here with --env and --as",
    "lent_none": "This session has lent nothing.",
    "lent_footer": '`journal grant "<environment>"` lends one and prints the sentence to paste into the dispatch.',
    "assign_wants": 'assign wants an agent: `journal assign {n} --to="<agent>"`, or `journal assign {n} --off` to put it '
                    "back on the list",
    "worktree_linked": "a linked worktree of {main}; .journal {state}",
    "worktree_symlink": "is a symlink to its journal",
    "worktree_copy": "is a COPY — `journal worktree link` fixes that",
    "worktree_not": "not a linked worktree",
}

LIST_COMMANDS = (
    ('journal switch "<name>"', "this session onto that environment (from a terminal: the project's start environment)"),
    ('journal switch "<name>" --project', "this session, and where new sessions start"),
    ('journal switch "<name>" --session=<id>', "move one bound session; --all-sessions moves every one"),
    ("journal switch --back", "the one you came from"),
    ('journal environments remove "<name>"', "take one off the list — it says what it holds, --yes does it"),
)

PREPARE = """\
Preparing {name}: an environment ready to be picked up from A to Z, by you, by another
session. Only when the user asked for it. In order:

  1  the source        the issue, the PR, the user's words — fetch it whole (gh, the tracker's tool, or ask)
  2  the brief         journal docs add "{name}: <title>" --abstract="<one line>" --brief   < the source
                       journal docs attach <doc> <path> "<what it is>"                   designs, screenshots, exports
  3  the plan          a Plan agent: phases and the work in each, from the brief — file it: docs part <doc> "Plan" --brief
  4  the steps         a second agent: concrete steps per phase, what is missing, what could go wrong — docs part <doc> "Steps" --brief
  5  what must hold    journal pins add "<constraint>" --doc=<doc>      the facts every later reader needs; rule if project-wide
  6  the to-dos        one per unit of work, in order, the brief citing the doc:
                       journal todos add "<title>" --brief --doc=<doc>.<p>   < the brief
                       journal todos ask <n> "<question>"                what only the user can answer
                       the last one: verify and close — the definition of done
  7  auto?             ask the user: journal todos auto on   works the list without asking
  8  the page          journal environments "{name}"   — read it as the one who picks this up would

Then offer: work it now (todo start 1), leave it for a session (journal switch "{name}"), or
or leave it for a later session.
"""


def is_agent() -> bool:
    # the process never carries agent_id; a harness that put one there would be read here
    return False


def _settings() -> tuple[bool, float]:
    conf, _ = settings_mod.load(root())
    return conf["one_session_per_environment"], conf["session_stale_hours"]


# ------------------------------------------------------------------ environments
class List(Command):
    signature = "environments:list"
    default = True
    writes = True

    def run(self, p: Parsed) -> int:
        exclusive, stale = _settings()
        rows = tracks.listing(root(), stem(), stale)
        fmt.say(fmt.title(TEXT["list_title"], sub=TEXT["list_sub"]))
        fmt.say()
        wide = max([len(t["name"]) for t in rows] + [12])
        for t in rows:
            fmt.say(render(TEXT["row"], mark=("*" if t["current"] else " ") + (">" if t["start"] else " "),
                           name=t["name"].ljust(wide), pins=t["pins"], open=t["open"],
                           sessions=[f"{sid[:8]} ({t['seen'].get(sid, '')})" for sid in t["sessions"]]))
        fmt.say()
        fmt.say(fmt.wrap(render(TEXT["list_lead"], hours=f"{stale:g}" if exclusive else None)))
        fmt.say(fmt.commands(list(LIST_COMMANDS)))
        return 0


class Page(Command):
    signature = "environments {name* : a name}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(tracks.page(root(), p.arg("name"), commands=True))


class Show(Page):
    signature = "environments:show {name* : a name}"
    verbs = ("read",)


class Remove(Command):
    signature = "environments:remove {name* : a name} {--yes}"
    verbs = ("rm", "delete", "forget")
    writes = True

    def run(self, p: Parsed) -> int:
        _, stale = _settings()
        return answer(tracks.remove(root(), p.arg("name"), now(), stem() or "", yes=bool(p.option("yes")),
                                    stale_hours=stale))


# ------------------------------------------------------------------ the verbs that move a session
class Switch(Command):
    signature = "switch {name*? : the environment's name} {--back} {--project} {--session=*} {--all-sessions}"
    writes = True

    def run(self, p: Parsed) -> int:
        name, session = p.arg("name") or "", stem() or ""
        exclusive, stale = _settings()
        chosen, every = p.option("session") or None, bool(p.option("all-sessions"))
        if chosen or every:
            if p.option("back"):
                return refuse(TEXT["back_no_sessions"])
            ok, msg = tracks.switch(root(), name, now(), "", project=True)
            if not ok and "already on" not in msg:
                return refuse(msg)
            moved, refused = tracks.move_sessions(root(), name, None if every else chosen, exclusive, stale)
            fmt.say(render(TEXT["moved"], name=name, n=len(moved), ids=[m[:8] for m in moved]))
            if refused:
                fmt.say(render(TEXT["not_moved"], ids=[r[:8] for r in refused]), error=True)
                return 1
            return 0
        if p.option("back"):
            return answer(tracks.back(root(), now(), session, exclusive, stale))
        return answer(tracks.switch(root(), name, now(), session, project=bool(p.option("project")) or not session,
                                    exclusive=exclusive, stale_hours=stale))


class Claim(Command):
    signature = "claim {name? : the environment's name} {why*? : why you are taking it}"
    writes = True

    def run(self, p: Parsed) -> int:
        _, stale = _settings()
        return answer(tracks.claim(root(), p.arg("name") or "", now(), stem() or "", p.arg("why") or "",
                                   stale_hours=stale))


class Prepare(Command):
    signature = "prepare {name*? : the environment's name}"
    writes = True

    def run(self, p: Parsed) -> int:
        name = state.slug(p.arg("name") or "")
        if not name:
            return refuse(TEXT["prepare_what"])
        session = stem() or ""
        exclusive, stale = _settings()
        ok, msg = tracks.switch(root(), name, now(), session, project=not session, exclusive=exclusive,
                                stale_hours=stale)
        if not ok and "already on" not in msg:
            return refuse(msg)
        fmt.say(fmt.title(TEXT["prepare_title"], sub=name))
        fmt.say("")
        fmt.say(render(PREPARE, name=name))
        return 0


class EnvironmentsSwitch(Switch):
    signature = "environments:switch {name*? : the environment's name} {--back} {--project} {--session=*} {--all-sessions}"


class EnvironmentsClaim(Claim):
    signature = "environments:claim {name? : the environment's name} {why*? : why you are taking it}"


class EnvironmentsPrepare(Prepare):
    signature = "environments:prepare {name*? : the environment's name}"


# ------------------------------------------------------------------ lending to subagents
def _granted_page() -> int:
    lent = grants.granted(root(), stem())
    fmt.say(fmt.Out(title=TEXT["granted_title"], sub=render(TEXT["granted_sub"], n=len(lent)),
                    lead="" if lent else TEXT["granted_none"],
                    items=tuple(fmt.Item(title=n, text=TEXT["granted_item"]) for n in lent),
                    footer=TEXT["granted_footer"]))
    return 0


class Grant(Command):
    signature = "grant {name*? : the environment to lend} {--off} {--list}"
    writes = True

    def run(self, p: Parsed) -> int:
        if p.option("list"):
            return _granted_page()
        session, off = stem(), bool(p.option("off"))
        name = p.arg("name") or ("" if off else tracks.current(root(), session))
        return answer((grants.revoke if off else grants.grant)(root(), session or "", name))


class Grants(Command):
    signature = "grants {name*? : ignored; grants lists} {--off} {--list}"
    writes = True

    def run(self, p: Parsed) -> int:
        return _granted_page()


class Lent(Command):
    signature = "lent"

    def run(self, p: Parsed) -> int:
        lent = grants.granted(root(), stem())
        fmt.say(fmt.Out(title=TEXT["lent_title"], sub=render(TEXT["lent_sub"], n=len(lent)),
                        lead="" if is_agent() else TEXT["lent_lead"],
                        items=tuple(fmt.Item(title=n, text=TEXT["lent_item"]) for n in lent)
                        or (fmt.Item(text=TEXT["lent_none"]),),
                        footer=TEXT["lent_footer"]))
        return 0


class Assign(Command):
    signature = "assign {n : a to-do number} {agent*? : the agent's name} {--to=} {--off}"
    casts = {"n": number("a to-do number")}

    def run(self, p: Parsed) -> int:
        n, off = p.arg("n"), bool(p.option("off"))
        who = p.option("to") or p.arg("agent") or ""
        if not who and not off:
            return refuse(render(TEXT["assign_wants"], n=n))
        return answer(todo.assign(root(), tracks.current(root(), stem()), n, "--off" if off else who))


# ------------------------------------------------------------------ worktrees
class Worktree(Command):
    signature = "worktree"
    writes = True

    def run(self, p: Parsed) -> int:
        main = worktree.main_root(project())
        if not main:
            fmt.say(TEXT["worktree_not"])
            return 0
        linked = (project() / ".journal").is_symlink()
        fmt.say(render(TEXT["worktree_linked"], main=main,
                       state=TEXT["worktree_symlink"] if linked else TEXT["worktree_copy"]))
        return 0


class WorktreeLink(Command):
    signature = "worktree:link"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(worktree.link(package()))


COMMANDS = (List, Page, Show, Remove, EnvironmentsSwitch, EnvironmentsClaim, EnvironmentsPrepare,
            Switch, Claim, Prepare, Grant, Grants, Lent, Assign, Worktree, WorktreeLink)
