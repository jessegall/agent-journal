from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.make_proof import MakeProof
from suites.coding.modules.workers.models.proof import Proof


class MakeProofSubcommand(Subcommand[MakeProof, Proof]):
    """`journal proof make <point> "<text>"`: a worker's proof for one point of its task's brief."""

    cli_name = "proof"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("point", type=int)
        parser.add_argument("text", help="the file and line, and the test that shows it")

    def command(self, arguments: Namespace, caller: Caller) -> MakeProof:
        return MakeProof(arguments.point, arguments.text)
