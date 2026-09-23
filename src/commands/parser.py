import argparse
import contextvars
from functools import cache
import inspect
import os
from controllers.base import COMMANDS
from controllers.types import CONTROLLERS
import features
from features.base import generation
from engine import queries
from providers import DRIVERS
from engine.transcript import conversation, user
from resources.base import AGENT
from engine.version import version
from features.runtime_cleanup.tidy import summary, tidy
from commands.queries import attached, decided, ended, halt, healed, help_text, say, search_text, serve_forever, services, settings_text, speed, supervise, switched, transcript, upgrade_here, verify


def actions(controller: type) -> list[str]:
    return sorted(name for name, f in inspect.getmembers(controller, inspect.isfunction)
                  if not name.startswith("_") and not getattr(f, "internal", False))

@cache
def words(type_: str) -> set[str]:
    controller = CONTROLLERS[type_]
    return {controller.resource.command_names.get(name, name) for name in {*actions(controller), *COMMANDS.get(type_, {})}}

def truthy(word: str) -> bool:
    return word.strip().lower() in ("true", "yes", "on", "1")

def add_method(acts, controller: type, name: str) -> None:
    a = acts.add_parser(controller.resource.command_names.get(name, name))
    a.set_defaults(method=name)
    fn = COMMANDS.get(controller.resource.type, {}).get(name) or getattr(controller, name)
    for p in list(inspect.signature(fn).parameters.values())[1:]:
        required = p.default is inspect.Parameter.empty
        flag = p.name if required else f"--{p.name}"
        if p.kind is inspect.Parameter.VAR_KEYWORD:
            a.add_argument("--set", action="append", default=[], metavar="key=value")
        elif p.kind is inspect.Parameter.VAR_POSITIONAL:
            a.add_argument(p.name, nargs="*")
        elif p.annotation is bool or isinstance(p.default, bool):
            a.add_argument(flag, action="store_true")
        elif p.annotation == bool | None:
            a.add_argument(flag, type=truthy, default=None)
        elif p.annotation is list:
            a.add_argument(flag, nargs="+", type=int)
        elif p.annotation == list[str]:
            a.add_argument(flag, nargs="+")
        else:
            a.add_argument(flag, type=int if p.annotation is int else str, **({} if required else {"default": p.default}))

QUERIES: set[str] = set()


def add_query(cmds, name: str, help_: str, fn, *flags) -> None:
    QUERIES.add(name)
    q = cmds.add_parser(name, help=help_)
    q.set_defaults(query=fn)
    for flag, kw in flags:
        q.add_argument(flag, **kw)

class Misused(Exception):
    pass


PRINTED: contextvars.ContextVar = contextvars.ContextVar("printed", default=None)


class Parser(argparse.ArgumentParser):
    def error(self, message: str):
        raise Misused(f"{self.format_usage()}{self.prog}: error: {message}")

    def _print_message(self, message: str, file=None) -> None:
        super()._print_message(message, PRINTED.get() or file)


PARSERS: dict[tuple, argparse.ArgumentParser] = {}

DEFAULTS = ("JOURNAL_ROOT", "JOURNAL_ENV", "JOURNAL_ACTOR", "JOURNAL_SESSION", "JOURNAL_AGENT")

def parser(only: str = "") -> argparse.ArgumentParser:
    features.load()
    key = (only, generation(), *(os.environ.get(name, "") for name in DEFAULTS))
    if key not in PARSERS:
        PARSERS[key] = built(only)
    return PARSERS[key]

def built(only: str) -> argparse.ArgumentParser:
    top = Parser(prog="journal", description="the journal, every type a noun and every method its word")
    top.add_argument("--root", default=os.environ.get("JOURNAL_ROOT", ".journal"))
    top.add_argument("--env", dest="bound", default="")
    top.add_argument("--default-env", dest="fallback", default=os.environ.get("JOURNAL_ENV", ""), help=argparse.SUPPRESS)
    top.add_argument("--as", dest="as_actor", default=os.environ.get("JOURNAL_ACTOR", AGENT))
    top.add_argument("--session", default=os.environ.get("JOURNAL_SESSION", ""))
    top.add_argument("--cwd", default="", help=argparse.SUPPRESS)
    top.add_argument("--agent", default=os.environ.get("JOURNAL_AGENT", ""))
    top.add_argument("--plugin", default=os.environ.get("JOURNAL_PLUGIN", ""), help=argparse.SUPPRESS)
    cmds = top.add_subparsers(dest="command", required=True)
    features.load()
    for type_, controller in CONTROLLERS.items():
        t = cmds.add_parser(type_, help=controller.resource.details.abstract, description=controller.resource.details.help)
        acts = t.add_subparsers(dest="action", required=True)
        for name in sorted({*actions(controller), *COMMANDS.get(type_, {})}) if not only or only == type_ else ():
            add_method(acts, controller, name)
    add_query(cmds, "status", "where things stand", lambda ctx: queries.status(ctx["record"]))
    add_query(cmds, "carry", "everything standing, in full", lambda ctx: queries.carry(ctx["record"]))
    add_query(cmds, "start", "what a session is handed at its start", lambda ctx: queries.start_block(ctx["record"]))
    add_query(cmds, "open", "open work", lambda ctx: queries.lines(queries.open_work(ctx["record"])))
    add_query(cmds, "search", "every agent transcript in this environment and attached files", lambda ctx: search_text(ctx["record"], ctx["term"], ctx["page"]),
              ("term", {}), ("--page", {"type": int, "default": 0}))
    add_query(cmds, "conversation", "the stretch the last summary replaced", lambda ctx: say(conversation(transcript(ctx["record"], ctx["session"]), ctx["back"])),
              ("--back", {"type": int, "default": 1}))
    add_query(cmds, "user", "the user's own words, in full", lambda ctx: say(user(transcript(ctx["record"], ctx["session"]))))
    add_query(cmds, "nothing", "decide that nothing here needs pinning", lambda ctx: decided(ctx), ("why", {}))
    add_query(cmds, "version", "the version", lambda ctx: version())
    add_query(cmds, "enable", "the journal is in force again: the hooks report, the gate holds", lambda ctx: switched(ctx, on=True))
    add_query(cmds, "disable", "the kill switch — the hooks stay wired but report nothing and hold nothing, until enable", lambda ctx: switched(ctx, on=False))
    add_query(cmds, "verify", "wired and alive: the hooks in the agent's settings, the viewer, the engine, this session's last report", lambda ctx: verify(ctx))
    add_query(cmds, "settings", "every setting on this environment and where it is set", lambda ctx: settings_text(ctx))
    add_query(cmds, "help", "what one command does", lambda ctx: help_text(ctx["word"]), ("word", {"nargs": "?", "default": ""}))
    for name in DRIVERS:
        add_query(cmds, name, f"start {name} supervised, on this environment; everything after the word is forwarded to {name}", lambda ctx, name=name: supervise(ctx, name))
    add_query(cmds, "serve", "the web viewer", lambda ctx: serve_forever(ctx), ("--port", {"type": int, "default": 8430}))
    add_query(cmds, "attach", "watch a session that runs without a terminal and type into it; Ctrl+] leaves it running",
              lambda ctx: attached(ctx), ("target", {}))
    add_query(cmds, "upgrade", "pull the package, wire the hooks, write the skills, run the migrations", lambda ctx: upgrade_here(ctx))
    add_query(cmds, "stop", "stop this journal: its viewer, its engine and every service a plugin runs", lambda ctx: halt(ctx))
    add_query(cmds, "ended", "a session's agent has exited: put back what was set aside, and stop the journal when no session is left", lambda ctx: ended(ctx))
    add_query(cmds, "heal", "go back to the last build that started, when the one installed will not", lambda ctx: healed(ctx))
    add_query(cmds, "speed", "median milliseconds for lists, commands, a hook call and the viewer API, and the runtime folder's size", lambda ctx: speed(ctx),
              ("--runs", {"type": int, "default": 5}), ("--url", {"default": ""}), ("--out", {"default": ""}))
    add_query(cmds, "tidy", "run the housekeeping now: trim captures and logs, drop quiet sessions' files", lambda ctx: summary(tidy(ctx["record"].root, features.FEATURES["runtime_cleanup"].values(ctx["record"]).days)))
    add_query(cmds, "services", "the services plugins run: list them, start, stop or restart one, read its log, or keep them up in this terminal with up",
              lambda ctx: services(ctx), ("action", {"nargs": "?", "default": "list"}), ("which", {"nargs": "?", "default": ""}), ("--lines", {"type": int, "default": 40}))
    return top
