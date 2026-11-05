from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.allow_program.allow_program import AllowProgram
from core.modules.secrets.commands.support.secret_program import SecretProgram


class AllowProgramSubcommand(Subcommand[AllowProgram, SecretProgram]):
    """`journal secret allow <n> [<program>] [--helpers]`: the Secrets window's line for a program the user
    lets a secret go to, or for letting helpers use it."""

    cli_name = "secret"
    name = "allow"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)
        parser.add_argument("program", nargs="?", default="")
        parser.add_argument("--helpers", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> AllowProgram:
        return AllowProgram(arguments.n, arguments.program, arguments.helpers)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, SecretProgram):
            return
        if value.program:
            output.line(f"secret {value.secret.id} may go to {value.program}")
        if value.secret.helpers:
            output.line(f"helpers may use secret {value.secret.id}")
