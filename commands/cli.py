import argparse
import inspect
import json
import os
import sys
import time
from pathlib import Path

from controllers.base import Controller
from controllers.types import Agents, CONTROLLERS
import features
import migrations
from engine import queries
from engine.drivers import DRIVERS
from engine.record import Record
from engine.sessions import Sessions, allowed
from engine.transcript import conversation, search as search_transcript, user
from providers import PROVIDERS
from resources.base import AGENT, Refused, SYSTEM
from resources.types import AgentRow

HIDDEN = ("path", "numbers", "load", "save", "named", "method", "sessions")
VERSION = next((f.read_text().strip() for f in (Path(__file__).resolve().parents[1] / "VERSION", Path(__file__).resolve().parents[1] / "VERSION") if f.is_file()), "0")


def actions(controller: type) -> list[str]:
    return sorted(name for name, f in inspect.getmembers(controller, inspect.isfunction)
                  if not name.startswith("_") and name not in HIDDEN)


def truthy(word: str) -> bool:
    return word.strip().lower() in ("true", "yes", "on", "1")


def add_method(acts, controller: type, name: str) -> None:
    a = acts.add_parser(controller.resource.names.get(name, name))
    a.set_defaults(method=name)
    for p in list(inspect.signature(getattr(controller, name)).parameters.values())[1:]:
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


def say(turns) -> str:
    return "\n".join(f"{t.line:>6}  {t.who:<7} {t.text}" for t in turns)


def search_text(record, session: str, term: str, page: int) -> str:
    want = term.lower()
    transcript_hits = say(search_transcript(transcript(record, session), term, page))
    file_hits = [f"  file  {r.ref}  {name}" + (f" — {tags}" if tags else "")
                 for type_, controller in CONTROLLERS.items() for r in controller(record).all()
                 for name, tags in r.files.items() if want in name.lower() or want in str(tags).lower()]
    return "\n".join(part for part in (transcript_hits, "\n".join(file_hits)) if part)


def parser() -> argparse.ArgumentParser:
    top = argparse.ArgumentParser(prog="journal", description="the journal, every type a noun and every method its word")
    top.add_argument("--root", default=os.environ.get("JOURNAL_ROOT", ".journal"))
    top.add_argument("--env", dest="bound", default=os.environ.get("JOURNAL_ENV", ""))
    top.add_argument("--as", dest="as_actor", default=os.environ.get("JOURNAL_ACTOR", AGENT))
    top.add_argument("--session", default=os.environ.get("JOURNAL_SESSION", ""))
    top.add_argument("--agent", default=os.environ.get("JOURNAL_AGENT", ""))
    cmds = top.add_subparsers(dest="command", required=True)
    for type_, controller in CONTROLLERS.items():
        t = cmds.add_parser(type_, help=controller.resource.abstract_, description=controller.resource.help_)
        acts = t.add_subparsers(dest="action", required=True)
        for name in actions(controller):
            add_method(acts, controller, name)
    add_query(cmds, "status", "where things stand", lambda ctx: queries.status(ctx["record"]))
    add_query(cmds, "carry", "everything standing, in full", lambda ctx: queries.carry(ctx["record"]))
    add_query(cmds, "start", "what a session is handed at its start", lambda ctx: queries.start_block(ctx["record"]))
    add_query(cmds, "open", "open work", lambda ctx: queries.lines(queries.open_work(ctx["record"])))
    add_query(cmds, "search", "this session's transcript and attached files", lambda ctx: search_text(ctx["record"], ctx["session"], ctx["term"], ctx["page"]),
              ("term", {}), ("--page", {"type": int, "default": 0}))
    add_query(cmds, "conversation", "the stretch the last summary replaced", lambda ctx: say(conversation(transcript(ctx["record"], ctx["session"]), ctx["back"])),
              ("--back", {"type": int, "default": 1}))
    add_query(cmds, "user", "the user's own words, in full", lambda ctx: say(user(transcript(ctx["record"], ctx["session"]))))
    add_query(cmds, "nothing", "decide that nothing here needs pinning", lambda ctx: decided(ctx), ("why", {}))
    add_query(cmds, "version", "the version", lambda ctx: VERSION)
    add_query(cmds, "enable", "the journal is in force again: the hooks report, the gate holds", lambda ctx: switched(ctx, on=True))
    add_query(cmds, "disable", "the kill switch — the hooks stay wired but report nothing and hold nothing, until enable", lambda ctx: switched(ctx, on=False))
    add_query(cmds, "verify", "wired and alive: the hooks in the agent's settings, the viewer, the engine, this session's last report", lambda ctx: verify(ctx))
    add_query(cmds, "settings", "every setting on this environment and where it is set", lambda ctx: settings_text(ctx))
    add_query(cmds, "help", "what one command does", lambda ctx: help_text(ctx["word"]), ("word", {"nargs": "?", "default": ""}))
    for name in DRIVERS:
        add_query(cmds, name, f"start {name} supervised, on this environment; everything after the word is forwarded to {name}", lambda ctx, name=name: supervise(ctx, name))
    add_query(cmds, "serve", "the web viewer", lambda ctx: serve_forever(ctx), ("--port", {"type": int, "default": 8430}))
    add_query(cmds, "upgrade", "pull the package, wire the hooks, write the skills, run the migrations", lambda ctx: upgrade_here(ctx))
    return top


def switched(ctx, on: bool) -> str:
    f = ctx["record"].root / "runtime" / "off"
    if on:
        f.unlink(missing_ok=True)
        return "the journal is in force"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(str(time.time()))
    return "the journal is off: the hooks report nothing and hold nothing until journal enable"


def verify(ctx) -> str:
    from providers import PROVIDERS
    root = ctx["record"].root
    lines = [f"root {root}", f"environment {ctx['record'].env}", "off" if (root / "runtime" / "off").is_file() else "in force"]
    for name, provider in PROVIDERS.items():
        settings = provider().config(root.parent)
        wired = settings.is_file() and "hook.py" in settings.read_text()
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


def upgrade_here(ctx) -> str:
    from install import upgrade
    root = ctx["record"].root
    return "\n".join(upgrade(root.parent, root))


def supervise(ctx, agent: str) -> str:
    from engine.supervisor import run as run_supervisor
    from engine.viewer import ensure
    record = ctx["record"]
    url = ensure(record.root, Path.cwd())
    print(f"journal: viewer {url}" if url else "journal: the viewer did not start; see .journal/runtime/viewer.log")
    return str(run_supervisor(record.root, Path.cwd(), record.env, agent, ctx["args"] or []))


def serve_forever(ctx) -> str:
    from serve import serve
    server = serve(ctx["record"].root, ctx["port"])
    print(f"http://127.0.0.1:{server.server_address[1]}/")
    server.serve_forever()
    return ""


def decided(ctx) -> str:
    agents = Agents(ctx["record"], actor=SYSTEM)
    row = agents.by_session(ctx["session"] or "cli")
    agents.update(row.n, **{**row.data, AgentRow.decided: ctx["why"]})
    return f"noted: {ctx['why']}"


def context(args: dict) -> dict:
    root = Path(args.pop("root")).resolve()
    migrations.run(root)
    features.load()
    sessions = Sessions(root)
    session = args.pop("session")
    env = args.pop("bound") or (sessions.environment(session) if session else "") or ((root / "runtime" / "env").read_text().strip() if (root / "runtime" / "env").is_file() else "main")
    session = session or sessions.holder(env)
    return {"record": Record(root, env), "session": session, "actor": args.pop("as_actor"), "agent": args.pop("agent"), "sessions": sessions}


READS = {"all", "show", "find", "search", "files", "folder", "comments", "linked_to", "unread", "read"}


def typed(value: str):
    try:
        return json.loads(value) if value[:1] in "[{" or value in ("true", "false") or value.lstrip("-").replace(".", "", 1).isdigit() else value
    except ValueError:
        return value


def invoke(fn, args: dict, extra: dict):
    params = list(inspect.signature(fn).parameters.values())
    at = next((i for i, p in enumerate(params) if p.kind is inspect.Parameter.VAR_POSITIONAL), None)
    positional = []
    if at is not None:
        positional = [args.pop(p.name) for p in params[:at] if p.kind in (inspect.Parameter.POSITIONAL_ONLY, inspect.Parameter.POSITIONAL_OR_KEYWORD)]
        positional.extend(args.pop(params[at].name))
    return fn(*positional, **args, **extra)


def run(argv: list[str]) -> int:
    parsed, passed = parser().parse_known_args(argv)
    args = vars(parsed)
    command = args.pop("command")
    if passed and command not in DRIVERS:
        parser().error(f"unrecognized arguments: {' '.join(passed)}")
    ctx = context(args)
    if command in DRIVERS:
        args["args"] = passed
    try:
        if "query" in args:
            query = args.pop("query")
            print(query({**ctx, **args}))
            return 0
        method = args.pop("method")
        args.pop("action", None)
        extra = {k: typed(v) for k, v in (kv.split("=", 1) for kv in args.pop("set", []))}
        if ctx["agent"] and method not in READS:
            why = allowed(ctx["sessions"], ctx["session"], ctx["record"].env, ctx["agent"], command)
            if why:
                raise Refused(why)
        controller = CONTROLLERS[command](ctx["record"], actor=ctx["actor"], session=ctx["session"], agent=ctx["agent"])
        fn = getattr(controller, method)
        got = invoke(fn, args, extra)
    except Refused as e:
        print(f"! {e}", file=sys.stderr)
        return 1
    if isinstance(got, list):
        for r in got:
            done = "  [done]" if command == "todo" and getattr(r, "completed", 0) else ""
            print(f"{r.n:>4}  {r.title}{done}" if hasattr(r, "n") else r)
    elif isinstance(got, dict):
        print(got.get("out", "") or got)
    elif got is not None:
        print(got.dump() if hasattr(got, "dump") else got)
    return 0


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    sys.exit(run(sys.argv[1:]))
