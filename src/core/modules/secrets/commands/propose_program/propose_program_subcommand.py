from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.propose_program.propose_program import ProposeProgram
from core.modules.secrets.commands.support.secret_program import SecretProgram


class ProposeProgramSubcommand(Subcommand[ProposeProgram, SecretProgram]):
    """Proposes a program and asks a person in the approval dock."""

    cli_name = "secret"
    name = "propose"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)
        parser.add_argument("program")

    def command(self, arguments: Namespace, caller: Caller) -> ProposeProgram:
        return ProposeProgram(arguments.n, arguments.program)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, SecretProgram):
            return
        if value.is_new:
            output.line(f"{value.program} proposed for secret {value.secret.id}: a person was asked in the dock")
        else:
            output.line(f"{value.program} is {'allowed' if value.program in value.secret.programs else 'proposed'} for secret {value.secret.id} already")
