from typing import Generic, TypeVar

from core.base.command.command import Command
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.triggers.commands.support.trigger_lines import TriggerLines
from core.modules.triggers.models.trigger import Trigger

C = TypeVar("C", bound=Command[Trigger])


class TriggerLineSubcommand(Subcommand[C, Trigger], Generic[C]):
    """A trigger command that answers with the one line that tells what the trigger is."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Trigger):
            output.line(TriggerLines.made(value))
