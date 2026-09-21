import argparse
import inspect
from contextlib import nullcontext
import io
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path

from controllers.base import COMMANDS
from controllers.types import Agents, CONTROLLERS
import features
from features.base import generation
import migrations
from engine import queries
from providers import DRIVERS
from engine.record import Record
from engine.sessions import Sessions, allowed
from engine.transcript import Turn, conversation, search as search_transcript, user
from features.tags.feature import visible
from providers import PROVIDERS
from resources.base import AGENT, Refused, SYSTEM
from resources.shapes import typed
from resources.types import AgentRow
from engine.stored import write_text
from engine import runtime
from engine.stored import last_lines
from engine.version import version



def actions(controller: type) -> list[str]:
    return sorted(name for name, f in inspect.getmembers(controller, inspect.isfunction)
                  if not name.startswith("_") and not getattr(f, "internal", False))


def truthy(word: str) -> bool:
    return word.strip().lower() in ("true", "yes", "on", "1")


def add_method(acts, controller: type, name: str) -> None:
    a = acts.add_parser(controller.resource.names.get(name, name))
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
        else:
            a.add_argument(flag, type=int if p.annotation is int else str, **({} if required else {"default": p.default}))


def add_query(cmds, name: str, help_: str, fn, *flags) -> None:
    q = cmds.add_parser(name, help=help_)
    q.set_defaults(query=fn)
    for flag, kw in flags:
        q.add_argument(flag, **kw)


def transcript(record, session: str):
    if not session:
        return []
    row = Agents(record, actor=SYSTEM).by_session(session)
    provider = PROVIDERS.get(row.provider)
    return provider().transcript(row.transcript) if provider else []


def turn_text(turn, source: str = "") -> str:
    return f"{source}{turn.line:>6}  {turn.who:<7} {visible(turn.text)}"


def say(turns) -> str:
    return "\n".join(turn_text(turn) for turn in turns)


@dataclass(frozen=True)
class SourcedTurn:
    provider: str
    session: str
    turn: Turn

    @property
    def text(self) -> str:
        return self.turn.text


def environment_transcript(record) -> list[SourcedTurn]:
    seen = set()
    turns = []
    for row in Agents(record, actor=SYSTEM)._every():
        provider = PROVIDERS.get(row.provider)
        path = Path(row.transcript).expanduser() if row.transcript else None
        try:
            path = path.resolve(strict=True) if path else None
        except (OSError, RuntimeError):
            continue
        if not provider or not path or not path.is_file() or path in seen:
            continue
        seen.add(path)
        for turn in provider().transcript(path):
            turns.append((turn.at, row.n, turn.line, SourcedTurn(row.provider, row.title, turn)))
    turns.sort(key=lambda item: item[:3])
    return [item[-1] for item in turns]


def search_text(record, term: str, page: int) -> str:
    want = term.lower()
    transcript_matches = "\n".join(turn_text(hit.turn, f"{hit.provider}:{hit.session}  ")
                                   for hit in search_transcript(environment_transcript(record), term, page))
    file_hits = [f"  file  {r.ref}  {name}" + (f" — {tags}" if tags else "")
                 for type_, controller in CONTROLLERS.items() for r in controller(record)._every()
                 for name, tags in r.files.items() if want in name.lower() or want in str(tags).lower()]
    return "\n".join(part for part in (transcript_matches, "\n".join(file_hits)) if part)


PARSERS: dict[tuple, argparse.ArgumentParser] = {}
MIGRATED: set[Path] = set()
DEFAULTS = ("JOURNAL_ROOT", "JOURNAL_ENV", "JOURNAL_ACTOR", "JOURNAL_SESSION", "JOURNAL_AGENT")


def parser(only: str = "") -> argparse.ArgumentParser:
    features.load()
    key = (only, generation(), *(os.environ.get(name, "") for name in DEFAULTS))
    if key not in PARSERS:
        PARSERS[key] = built(only)
    return PARSERS[key]


def built(only: str) -> argparse.ArgumentParser:
    top = argparse.ArgumentParser(prog="journal", description="the journal, every type a noun and every method its word")
    top.add_argument("--root", default=os.environ.get("JOURNAL_ROOT", ".journal"))
    top.add_argument("--env", dest="bound", default=os.environ.get("JOURNAL_ENV", ""))
    top.add_argument("--as", dest="as_actor", default=os.environ.get("JOURNAL_ACTOR", AGENT))
    top.add_argument("--session", default=os.environ.get("JOURNAL_SESSION", ""))
    top.add_argument("--agent", default=os.environ.get("JOURNAL_AGENT", ""))
    cmds = top.add_subparsers(dest="command", required=True)
    features.load()
    for type_, controller in CONTROLLERS.items():
        t = cmds.add_parser(type_, help=controller.resource.abstract_, description=controller.resource.help_)
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
    add_query(cmds, "upgrade", "pull the package, wire the hooks, write the skills, run the migrations", lambda ctx: upgrade_here(ctx))
    add_query(cmds, "stop", "stop this journal: its viewer, its engine and every service a plugin runs", lambda ctx: halt(ctx))
    add_query(cmds, "speed", "median milliseconds for lists, commands, a hook call and the viewer API, and the runtime folder's size", lambda ctx: speed(ctx),
              ("--runs", {"type": int, "default": 5}), ("--url", {"default": ""}), ("--out", {"default": ""}))
    add_query(cmds, "tidy", "run the housekeeping now: trim captures and logs, drop quiet sessions' files", lambda ctx: str(features.FEATURES["housekeeping"].tidy(ctx["record"])))
    add_query(cmds, "services", "the services plugins run: list them, start, stop or restart one, read its log, or keep them up in this terminal with up",
              lambda ctx: services(ctx), ("what", {"nargs": "?", "default": "list"}), ("which", {"nargs": "?", "default": ""}), ("--lines", {"type": int, "default": 40}))
    return top


def switched(ctx, on: bool) -> str:
    f = runtime.off_file(ctx["record"].root)
    if on:
        f.unlink(missing_ok=True)
        return "the journal is in force"
    f.parent.mkdir(parents=True, exist_ok=True)
    write_text(f, str(time.time()))
    return "the journal is off: the hooks report nothing and hold nothing until journal enable"


def verify(ctx) -> str:
    from providers import PROVIDERS
    root = ctx["record"].root
    lines = [f"root {root}", f"environment {ctx['record'].env}", "off" if runtime.off(root) else "in force"]
    for name, provider in PROVIDERS.items():
        settings = provider().config(root.parent)
        wired = settings.is_file() and "hook.sh" in settings.read_text()
        lines.append(f"{name}: hooks {'wired' if wired else 'NOT wired'} ({settings})")
    live = [p for p in (root / "runtime").glob("seat-*.json") if time.time() - p.stat().st_mtime < 10]
    lines.append(f"engine: {len(live)} running — {', '.join(p.stem.removeprefix('seat-')[:8] for p in live) or 'none'}")
    row = Agents(ctx["record"], actor=ctx["actor"]).by_session(ctx["session"]) if ctx["session"] else None
    if row:
        lines.append(f"this session: {row.status or '?'} after {row.event or '?'}, {row.uses} tool uses")
    return "\n".join(lines)


def settings_text(ctx) -> str:
    record = ctx["record"]
    out = [f"settings on {record.env} ({record.home / 'settings.json'})"]
    for name, f in features.FEATURES.items():
        out.append(f"  features.{name:<14} {'on' if f.enabled(record) else 'off'}   {f.trigger or ''}")
    for key in Record.SETTINGS:
        if key != Record.features and record.setting(key):
            out.append(f"  {key}: {record.setting(key)}")
    out.append("  change one: journal settings are written by the viewer's Settings page, or POST /api/<env>/settings")
    return "\n".join(out)


def help_text(word: str) -> str:
    p = parser()
    if not word:
        return p.format_help()
    for action in p._actions:
        if isinstance(action, argparse._SubParsersAction) and word in action.choices:
            return action.choices[word].format_help()
    return f"no command {word!r}"


def speed(ctx) -> str:
    from engine.speed import measure
    return measure(ctx["record"].root, ctx["record"].env, ctx["runs"], ctx["url"], ctx["out"])


def upgrade_here(ctx) -> str:
    from install import upgrade
    root = ctx["record"].root
    return "\n".join(upgrade(root.parent, root))


def halt(ctx) -> str:
    from engine.stop import ask, clear, gone
    root = ctx["record"].root
    ask(root)
    went = gone(root)
    clear(root)
    return "the journal is stopped: its viewer, its engine and every service it ran" if went else "the viewer is still answering; see .journal/runtime/viewer.log"


def supervise(ctx, agent: str) -> str:
    from engine.terminal import run as run_supervisor
    from engine.viewer import start
    record = ctx["record"]
    url = start(record.root, Path.cwd())
    print(f"journal: viewer {url}" if url else "journal: the viewer did not start; see .journal/runtime/viewer.log")
    return str(run_supervisor(record.root, Path.cwd(), record.env, agent, ctx["args"] or []))


def services(ctx) -> str:
    from engine.services import DOWN, UP, listed, log_file, want
    root = ctx["record"].root
    what, which = ctx["what"], ctx["which"]
    if what == "up":
        return services_up(root)
    if what == "log":
        return tail(log_file(root, which), ctx["lines"])
    if what in ("start", "stop", "restart"):
        if not which:
            raise Refused(f"say which service to {what}: journal services {what} <plugin>.<service>")
        want(root, which, DOWN if what == "stop" else UP, nonce=time.time() if what == "restart" else 0.0)
        return f"{which} is asked to {'stop' if what == 'stop' else 'run'}"
    if what != "list":
        raise Refused(f"services knows list, up, start, stop, restart and log, not {what!r}")
    lines = [f"{s['id']:<28} {s['state']:<10} {s['url']}{'  ' + s['why'] if s['why'] else ''}" for s in listed(root)]
    return "\n".join(lines) or "no plugin declares a service"


def services_up(root: Path) -> str:
    from engine.services import Manager
    from engine.terminal import lifeline
    alive, keeping = lifeline()
    manager = Manager(root, alive)
    print("journal: keeping the plugins' services up; Ctrl-C stops them")
    try:
        while True:
            manager.tick()
            time.sleep(1.0)
    except KeyboardInterrupt:
        pass
    finally:
        os.close(keeping)
    return "the services are stopped"


def tail(path: Path, lines: int) -> str:
    return last_lines(path, lines) if path.is_file() else f"nothing is logged in {path}"


def serve_forever(ctx) -> str:
    from serve import run
    run(ctx["record"].root, ctx["port"])
    return ""


def decided(ctx) -> str:
    agents = Agents(ctx["record"], actor=SYSTEM)
    row = agents.by_session(ctx["session"] or "cli")
    agents.update(row.n, **{**row.data, AgentRow.decided: ctx["why"]})
    return f"noted: {ctx['why']}"


def context(args: dict) -> dict:
    root = Path(args.pop("root")).resolve()
    if root not in MIGRATED:
        migrations.run(root)
        MIGRATED.add(root)
    features.load(root)
    sessions = Sessions(root)
    session = args.pop("session")
    env = args.pop("bound") or (sessions.environment(session) if session else "") or runtime.env(root)
    session = session or sessions.holder(env)
    return {"record": Record(root, env, memo=True), "session": session, "actor": args.pop("as_actor"), "agent": args.pop("agent"),
            "force": "", "sessions": sessions}


READS = {"all", "show", "find", "search", "files", "folder", "comments", "linked_to", "unread", "read"}
OVER_HTTP = frozenset(CONTROLLERS) - {"browser"}


def invoke(fn, args: dict, extra: dict):
    params = list(inspect.signature(fn).parameters.values())
    at = next((i for i, p in enumerate(params) if p.kind is inspect.Parameter.VAR_POSITIONAL), None)
    positional = []
    if at is not None:
        positional = [args.pop(p.name) for p in params[:at] if p.kind in (inspect.Parameter.POSITIONAL_ONLY, inspect.Parameter.POSITIONAL_OR_KEYWORD)]
        positional.extend(args.pop(params[at].name))
    return fn(*positional, **args, **extra)


TAKES = {"--root", "--env", "--as", "--session", "--agent", "--force"}


def first_word(argv: list[str]) -> str:
    at = 0
    while at < len(argv):
        word = argv[at]
        if word in TAKES:
            at += 2
        elif word.startswith("-"):
            at += 1
        else:
            return word
    return ""


def noun_of(argv: list[str]) -> str:
    word = first_word(argv)
    return word if word in CONTROLLERS else "-"


def captured(argv: list[str], root: Path) -> tuple[str, int | None]:
    if not argv or noun_of(argv) not in OVER_HTTP:
        return f"{first_word(argv) or 'the journal'} is not a command the server runs", None
    said, wrong = io.StringIO(), io.StringIO()
    try:
        code = run(["--root", str(root), *argv], out=said, err=wrong)
    except SystemExit as e:
        code = int(e.code or 0)
    except Exception as e:
        return f"! {type(e).__name__}: {e}", 1
    spoke = said.getvalue() or wrong.getvalue()
    if code and not spoke.strip():
        return f"! {' '.join(argv)} was refused and said nothing", code
    return spoke, code


def lifted(argv: list[str]) -> tuple[list[str], str]:
    if "--force" not in argv:
        return argv, ""
    at = argv.index("--force")
    why = argv[at + 1] if at + 1 < len(argv) and not argv[at + 1].startswith("--") else ""
    return argv[:at] + argv[at + 2 if why else at + 1:], why


def run(argv: list[str], out=None, err=None) -> int:
    out, err = out or sys.stdout, err or sys.stderr
    features.load()
    forced = "--force" in argv
    argv, why = lifted(argv)
    if forced and not why:
        print("! --force takes the reason it is forced: --force \"<why>\"", file=err)
        return 1
    if not first_word(argv) and not {"-h", "--help"} & set(argv):
        argv = [*argv, "help"]
    noun = "" if {"-h", "--help"} & set(argv[:1]) else noun_of(argv)
    parsed, passed = parser(noun).parse_known_args(argv)
    args = vars(parsed)
    command = args.pop("command")
    if passed and command not in DRIVERS:
        parser(noun).error(f"unrecognized arguments: {' '.join(passed)}")
    ctx = context(args)
    ctx["force"] = why
    if command in DRIVERS:
        args["args"] = passed
    try:
        if "query" in args:
            query = args.pop("query")
            print(query({**ctx, **args}), file=out)
            return 0
        method = args.pop("method")
        args.pop("action", None)
        extra = {k: typed(v) for k, v in (kv.split("=", 1) for kv in args.pop("set", []))}
        if ctx["agent"] and method not in READS:
            why = allowed(ctx["sessions"], ctx["session"], ctx["record"].env, ctx["agent"], command)
            if why:
                raise Refused(why)
        controller = CONTROLLERS[command](ctx["record"], actor=ctx["actor"], session=ctx["session"], agent=ctx["agent"], force=ctx["force"])
        faults = features.FEATURES.get("faults")
        with faults.watched(ctx["record"].root, ctx["record"].env, "command", f"{command} {method}") if faults else nullcontext():
            got = invoke(controller.action(method), args, extra)
    except Refused as e:
        print(f"! {e}", file=err)
        return 1
    if isinstance(got, list):
        for r in got:
            print(f"{r.n:>4}  {r.title}{controller.mark(r)}" if hasattr(r, "n") else r, file=out)
    elif isinstance(got, dict):
        print(got.get("out", "") or got, file=out)
    elif got is not None:
        print(got.dump() if hasattr(got, "dump") else got, file=out)
    return 0


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    sys.exit(run(sys.argv[1:]))
