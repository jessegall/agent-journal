from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.plans.commands.choose_plan_focus.choose_plan_focus import ChoosePlanFocus
from engine.subcommand.focus_arguments import focus_arguments


class ChoosePlanFocusSubcommand(Subcommand[ChoosePlanFocus, tuple[str, ...]]):
    """`journal plan focus [<plan>] [--clear]`: the plan the asking agent works on first, where that focus comes
    from, and what each started plan waits on. A number names the plan as the focus, and --clear brings the
    default back. A user reads and sets the focus of the running main agent."""

    cli_name = "plan"
    name = "focus"

    def arguments(self, parser: ArgumentParser) -> None:
        focus_arguments(parser, "plan_id")

    def command(self, arguments: Namespace, caller: Caller) -> ChoosePlanFocus:
        return ChoosePlanFocus(arguments.plan_id, arguments.clears)
