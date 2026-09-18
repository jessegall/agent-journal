import argparse
import inspect
import sys
from pathlib import Path

from v2.controllers.base import Controller
from v2.controllers.types import CONTROLLERS
from v2.engine.record import Record
from v2.resources.base import Refused


def actions(controller: type) -> list[str]:
    return sorted(name for name, f in inspect.getmembers(controller, inspect.isfunction)
                  if not name.startswith("_") and name not in ("path", "numbers", "load", "save"))


def parser() -> argparse.ArgumentParser:
    top = argparse.ArgumentParser(prog="journal")
    top.add_argument("--root", default=".journal")
    top.add_argument("--env", default="main")
    top.add_argument("--as", dest="dispatcher", default=None)
    types = top.add_subparsers(dest="type", required=True)
    for type_, controller in CONTROLLERS.items():
        t = types.add_parser(type_, help=controller.resource.abstract_, description=controller.resource.help_)
        acts = t.add_subparsers(dest="action", required=True)
        for name in actions(controller):
            a = acts.add_parser(name)
            for p in list(inspect.signature(getattr(controller, name)).parameters.values())[1:]:
                flag = f"--{p.name}" if p.default is not inspect.Parameter.empty else p.name
                kind = int if p.annotation is int else str
                if p.kind is inspect.Parameter.VAR_KEYWORD:
                    a.add_argument("--set", action="append", default=[], metavar="key=value")
                elif p.annotation is bool or isinstance(p.default, bool):
                    a.add_argument(flag, action="store_true")
                else:
                    a.add_argument(flag, type=kind, **({"default": p.default} if p.default is not inspect.Parameter.empty else {}))
    return top


def run(argv: list[str]) -> int:
    args = vars(parser().parse_args(argv))
    root, env, dispatcher = Path(args.pop("root")), args.pop("env"), args.pop("dispatcher")
    type_, action = args.pop("type"), args.pop("action")
    extra = dict(kv.split("=", 1) for kv in args.pop("set", []))
    controller = CONTROLLERS[type_](Record(root, env), dispatcher=dispatcher)
    try:
        got = getattr(controller, action)(**args, **extra)
    except Refused as e:
        print(f"! {e}", file=sys.stderr)
        return 1
    if isinstance(got, list):
        for r in got:
            print(f"{r.n:>4}  {r.title}")
    elif got is not None:
        print(got.dump())
    return 0


if __name__ == "__main__":
    sys.exit(run(sys.argv[1:]))
