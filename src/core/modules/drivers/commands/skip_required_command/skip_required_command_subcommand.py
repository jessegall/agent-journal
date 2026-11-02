from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.close_required_command.close_required_command import CloseRequiredCommand
from core.modules.drivers.models.required_command import RequiredCommand


class SkipRequiredCommandSubcommand(Subcommand[CloseRequiredCommand, RequiredCommand]):
    """`journal required-command skip <n> --reason <why>`: leaves a line's command unrun, saying why; the chat
    shows it."""

    cli_name = "required-command"
    name = "skip"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("required_command_id", type=int)
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> CloseRequiredCommand:
        if not arguments.reason.strip():
            raise Refusal("say why the line does not apply", "--reason '<why>'")
        return CloseRequiredCommand(arguments.required_command_id, arguments.reason.strip())

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RequiredCommand):
            output.line(f"required_command {value.id} skipped: {value.skip_reason}")
