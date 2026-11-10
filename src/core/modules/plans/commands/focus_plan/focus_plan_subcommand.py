from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from engine.types.type_guards import is_tuple
from core.modules.plans.commands.focus_plan.focus_plan import FocusPlan


class FocusPlanSubcommand(Subcommand[FocusPlan, tuple[str, ...]]):
    """`journal plan focus [<plan>] [--clear]`: the plan the asking agent works on first, where that focus comes
    from, and what each started plan waits on. A number names the plan as the focus, and --clear brings the
    default back. A person reads and sets the focus of the running main agent."""

    cli_name = "plan"
    name = "focus"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int, nargs="?", default=None)
        parser.add_argument("--clear", dest="clears", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> FocusPlan:
        return FocusPlan(arguments.plan_id, arguments.clears)

    def write_output(self, value: object, output: Output) -> None:
        for line in value if is_tuple(value) else ():
            output.line(str(line))
