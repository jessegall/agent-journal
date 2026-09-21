import inspect
from contextlib import nullcontext
import io
import os
import sys
from pathlib import Path

from controllers.types import CONTROLLERS
import features
import migrations
from providers import DRIVERS
from engine.record import Record
from engine.sessions import Sessions, allowed
from resources.base import Refused
from resources.shapes import typed
from engine import runtime
from commands.parser import Misused, parser
from engine.stored import undoable
from engine.worktree import checkout


MIGRATED: set[Path] = set()


def context(args: dict) -> dict:
    root = Path(args.pop("root")).resolve()
    if root not in MIGRATED:
        migrations.run(root)
        MIGRATED.add(root)
    features.load(root)
    sessions = Sessions(root)
    session = args.pop("session")
    fallback = args.pop("fallback")
    top = checkout(Path(args.pop("cwd") or os.getcwd()))
    worked = top.name if top and (root / "environments" / top.name).is_dir() else ""
    env = args.pop("bound") or (sessions.environment(session) if session else "") or worked or fallback or runtime.env(root)
    session = session or sessions.holder(env)
    return {"record": Record(root, env, memo=True), "session": session, "actor": args.pop("as_actor"), "agent": args.pop("agent"),
            "force": "", "sessions": sessions}


READS = {"all", "show", "find", "search", "files", "folder", "comments", "linked_to", "unread", "read"}
LOCAL = {"browser"}


def served() -> frozenset:
    features.load()
    return frozenset(CONTROLLERS) - LOCAL


def invoke(fn, args: dict, extra: dict):
    params = list(inspect.signature(fn).parameters.values())
    at = next((i for i, p in enumerate(params) if p.kind is inspect.Parameter.VAR_POSITIONAL), None)
    positional = []
    if at is not None:
        positional = [args.pop(p.name) for p in params[:at] if p.kind in (inspect.Parameter.POSITIONAL_ONLY, inspect.Parameter.POSITIONAL_OR_KEYWORD)]
        positional.extend(args.pop(params[at].name))
    with undoable():
        return fn(*positional, **args, **extra)


TAKES = {"--root", "--env", "--default-env", "--as", "--session", "--agent", "--force", "--cwd"}


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
    if not argv or noun_of(argv) not in served():
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
