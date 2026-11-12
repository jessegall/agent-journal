from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.choose_task_focus.choose_task_focus import ChooseTaskFocus


class ChooseTaskFocusSubcommand(Subcommand[ChooseTaskFocus, tuple[str, ...]]):
    """`journal task focus [<task>] [--clear]`: the started task the asking agent works on now and the
    started tasks behind it. A number makes that started task the one in hand, and --clear makes it the
    one started last again."""

    cli_name = "task"
    name = "focus"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int, nargs="?", default=None)
        parser.add_argument("--clear", dest="clears", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> ChooseTaskFocus:
        return ChooseTaskFocus(arguments.task_id, arguments.clears)
