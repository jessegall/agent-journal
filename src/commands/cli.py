from contextlib import nullcontext
import io
import os
import sys
from pathlib import Path

from controllers.base import networked, runs_here
from controllers.types import CONTROLLERS
import features
from providers import DRIVERS, workspace_folders
from engine.record import Record
from engine.sessions import Sessions, allowed
from resources.base import OWNER, Refused
from resources.shapes import typed
from commands.invoke import invoked
from commands.parser import PRINTED, QUERIES, Misused, parser, words
from engine.command_line import CommandLine, wire
from engine.timing import measured
from engine.binding import bound_environment
from engine.worktree import checkout
from typing import TypedDict
from commands.boot import boot


class CommandContext(TypedDict):
    record: Record
    session: str
    actor: str
    agent: str
    plugin: str
    force: str
    sessions: Sessions


def context(args: dict) -> CommandContext:
    root = Path(args.pop("root")).resolve()
    boot(root)
    sessions = Sessions(root)
    session = args.pop("as_session")
    top = checkout(Path(args.pop("cwd") or os.getcwd()), workspace_folders())
    env = bound_environment(root, sessions, session, args.pop("bound"), top, args.pop("fallback"))
    session = session or sessions.holder(env)
    return {"record": Record(root, env, memo=True), "session": session, "actor": args.pop("as_actor"), "agent": args.pop("as_agent"),
            "plugin": args.pop("as_plugin"), "force": "", "sessions": sessions}


READS = {"all", "show", "find", "search", "files", "folder", "comments", "linked_to", "unread", "read", "board"}
LOCAL = {"browser"}
SERVED_QUERIES = frozenset({"search"})


def served() -> frozenset:
    features.load()
    return frozenset(CONTROLLERS) - LOCAL


def asked_of_server(argv: list[str]) -> bool:
    """Whether the server runs this command with the warm copies it keeps: a noun's command, or a query that reads the whole history, such as search."""
    return noun_of(argv) in served() or first_word(argv) in SERVED_QUERIES


TAKES = {"--root", "--env", "--default-env", "--as", "--session", "--agent", "--force", "--cwd", "--plugin"}


def first_word(argv: list[str]) -> str:
    return next(plain_words(argv), "")


def plain_words(argv: list[str]):
    at = 0
    while at < len(argv):
        word = argv[at]
        if word in TAKES:
            at += 2
            continue
        at += 1
        if not word.startswith("-"):
            yield word


def noun_of(argv: list[str]) -> str:
    word = first_word(argv)
    return word if word in CONTROLLERS else "-"


def captured(argv: list[str], root: Path) -> tuple[str, int | None]:
    noun, word = (list(plain_words(argv)) + ["", ""])[:2]
    if not argv or not asked_of_server(argv) or runs_here(noun, word):
        return f"{first_word(argv) or 'the journal'} is not a command the server runs", None
    out, err = io.StringIO(), io.StringIO()
    try:
        code = run(["--root", str(root), *argv], out=out, err=err)
    except SystemExit as e:
        code = 0 if e.code is None else int(e.code)
    except Exception as e:
        return f"! {type(e).__name__}: {e}", 1
    output = out.getvalue() or err.getvalue()
    if code and not output.strip():
        return f"! {' '.join(argv)} was refused and printed nothing", code
    return output, code


def lifted(argv: list[str]) -> tuple[list[str], str]:
    if "--force" not in argv:
        return argv, ""
    at = argv.index("--force")
    why = argv[at + 1] if at + 1 < len(argv) and not argv[at + 1].startswith("--") else ""
    return argv[:at] + argv[at + 2 if why else at + 1:], why


def run(argv: list[str], out=None, err=None) -> int:
    out, err = out or sys.stdout, err or sys.stderr
    PRINTED.set(out)
    features.load()
    forced = "--force" in argv
    argv, why = lifted(argv)
    if forced and not why:
        print("! --force takes the reason it is forced: --force \"<why>\"", file=err)
        return 1
    if not first_word(argv) and not {"-h", "--help"} & set(argv):
        argv = [*argv, "help"]
    noun = "" if {"-h", "--help"} & set(argv[:1]) else noun_of(argv)
    try:
        parsed, passed = parser(noun).parse_known_args(argv)
        args = vars(parsed)
        command = args.pop("command")
        if passed and command not in DRIVERS:
            parser(noun).error(f"unrecognized arguments: {' '.join(passed)}")
    except Misused as e:
        print(e, file=err)
        return 2
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
        word = args.pop("action")
        extra = {k: typed(v) for k, v in (kv.split("=", 1) for kv in args.pop("set", []))}
        if ctx["plugin"] and method == "create":
            extra = {OWNER: ctx["plugin"], "locked": True, **extra}
        if ctx["agent"] and method not in READS:
            why = allowed(ctx["sessions"], ctx["session"], ctx["record"].env, ctx["agent"], command)
            if why:
                raise Refused(why)
        controller = CONTROLLERS[command](ctx["record"], actor=ctx["actor"], session=ctx["session"], agent=ctx["agent"], force=ctx["force"])
        with measured(ctx["record"], "command", f"{command} {method}") if not networked(command, method) else nullcontext():
            got = invoked(controller, word, named=args, extra=extra)
    except Refused as e:
        print(f"! {e}", file=err)
        return 1
    if isinstance(got, list):
        for r in got:
            print(f"{r.n:>4}  {r.title}{controller.mark(r)}" if hasattr(r, "n") else r, file=out)
    elif isinstance(got, dict):
        print(got.get("out", "") or got, file=out)
    elif got is not None:
        if getattr(got, "preface", ""):
            print(got.preface, file=out)
        print(got.dump() if hasattr(got, "dump") else got, file=out)
    return 0


wire(CommandLine(run=run, parser=parser, words=words, queries=QUERIES, captured=captured))


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    sys.exit(run(sys.argv[1:]))
