import argparse
import inspect
import os
import sys
from pathlib import Path

from v2.controllers.base import Controller
from v2.controllers.types import CONTROLLERS
from v2.engine import queries
from v2.engine.drivers import DRIVERS
from v2.engine.record import Record
from v2.engine.sessions import Sessions
from v2.engine.transcript import conversation, search, user
from v2.providers import PROVIDERS
from v2.resources.base import AGENT, Refused, SYSTEM

HIDDEN = ("path", "numbers", "load", "save", "named", "method", "sessions")
VERSION = "2.0.0"


def actions(controller: type) -> list[str]:
    return sorted(name for name, f in inspect.getmembers(controller, inspect.isfunction)
                  if not name.startswith("_") and name not in HIDDEN)


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
    row = CONTROLLERS["agent"](record, actor=SYSTEM).by_session(session)
    provider = PROVIDERS.get(row.data.get("provider", ""))
    return provider().transcript(row.data.get("transcript", "")) if provider else []


def say(turns) -> str:
    return "\n".join(f"{t.line:>6}  {t.who:<7} {t.text}" for t in turns)


def parser() -> argparse.ArgumentParser:
    top = argparse.ArgumentParser(prog="journal", description="the journal, every type a noun and every method its word")
    top.add_argument("--root", default=os.environ.get("JOURNAL_ROOT", ".journal"))
    top.add_argument("--env", default=os.environ.get("JOURNAL_ENV", ""))
    top.add_argument("--as", dest="actor", default=os.environ.get("JOURNAL_ACTOR", AGENT))
    top.add_argument("--session", default=os.environ.get("JOURNAL_SESSION", ""))
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
    add_query(cmds, "search", "this session's transcript, newest hits first", lambda ctx: say(search(transcript(ctx["record"], ctx["session"]), ctx["term"], ctx["page"])),
              ("term", {}), ("--page", {"type": int, "default": 0}))
    add_query(cmds, "conversation", "the stretch the last summary replaced", lambda ctx: say(conversation(transcript(ctx["record"], ctx["session"]), ctx["back"])),
              ("--back", {"type": int, "default": 1}))
    add_query(cmds, "user", "the user's own words, in full", lambda ctx: say(user(transcript(ctx["record"], ctx["session"]))))
    add_query(cmds, "nothing", "decide that nothing here needs pinning", lambda ctx: decided(ctx), ("why", {}))
    add_query(cmds, "version", "the version", lambda ctx: VERSION)
    for name in DRIVERS:
        add_query(cmds, name, f"start {name} under the supervisor, on this environment", lambda ctx, name=name: supervise(ctx, name), ("args", {"nargs": argparse.REMAINDER}))
    add_query(cmds, "serve", "the web viewer", lambda ctx: serve_forever(ctx), ("--port", {"type": int, "default": 8430}))
    return top


def supervise(ctx, agent: str) -> str:
    from v2.engine.supervisor import run as run_supervisor
    record = ctx["record"]
    return str(run_supervisor(record.root, Path.cwd(), record.env, agent, ctx["args"]))


def serve_forever(ctx) -> str:
    from v2.serve import serve
    server = serve(ctx["record"].root, ctx["port"])
    print(f"http://127.0.0.1:{server.server_address[1]}/")
    server.serve_forever()
    return ""


def decided(ctx) -> str:
    agents = CONTROLLERS["agent"](ctx["record"], actor=SYSTEM)
    row = agents.by_session(ctx["session"] or "cli")
    agents.update(row.n, **{**row.data, "decided": ctx["why"]})
    return f"noted: {ctx['why']}"


def context(args: dict) -> dict:
    root = Path(args.pop("root"))
    sessions = Sessions(root)
    session = args.pop("session")
    env = args.pop("env") or (sessions.environment(session) if session else "") or ((root / "runtime" / "env").read_text().strip() if (root / "runtime" / "env").is_file() else "main")
    session = session or sessions.holder(env)
    return {"record": Record(root, env), "session": session, "actor": args.pop("actor")}


def run(argv: list[str]) -> int:
    args = vars(parser().parse_args(argv))
    ctx = context(args)
    command = args.pop("command")
    try:
        if "query" in args:
            query = args.pop("query")
            print(query({**ctx, **args}))
            return 0
        method = args.pop("method")
        args.pop("action", None)
        extra = dict(kv.split("=", 1) for kv in args.pop("set", []))
        controller = CONTROLLERS[command](ctx["record"], actor=ctx["actor"], session=ctx["session"])
        got = getattr(controller, method)(**args, **extra)
    except Refused as e:
        print(f"! {e}", file=sys.stderr)
        return 1
    if isinstance(got, list):
        for r in got:
            print(f"{r.n:>4}  {r.title}" if hasattr(r, "n") else r)
    elif isinstance(got, dict):
        print(got.get("out", "") or got)
    elif got is not None:
        print(got.dump() if hasattr(got, "dump") else got)
    return 0


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    sys.exit(run(sys.argv[1:]))
