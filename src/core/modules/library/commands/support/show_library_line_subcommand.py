from engine.command.command import Command
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.library.support.line_answer import LineAnswer


class ShowLibraryLineSubcommand[C: Command[object], R: LineAnswer](Subcommand[C, R]):
    """A subcommand that prints what the shared server answered as the text of the answer."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LineAnswer):
            output.write(value.line(), value.json())
