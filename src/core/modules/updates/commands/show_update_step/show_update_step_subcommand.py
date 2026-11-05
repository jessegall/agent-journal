from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.updates.commands.show_update_step.show_update_step import ShowUpdateStep
from core.modules.updates.models.enums.update_step import UpdateStep


class ShowUpdateStepSubcommand(Subcommand[ShowUpdateStep, ChatMark]):
    """`journal update step <run> <step> [detail]`: what `journal server update` runs to show its chat mark at
    a step."""

    cli_name = "update"
    name = "step"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("run")
        parser.add_argument("step", type=UpdateStep, choices=list(UpdateStep))
        parser.add_argument("detail", nargs="?", default="")

    def command(self, arguments: Namespace, caller: Caller) -> ShowUpdateStep:
        return ShowUpdateStep(arguments.run, arguments.step, arguments.detail)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ChatMark):
            output.line(f"the update is at {value.variant}")
