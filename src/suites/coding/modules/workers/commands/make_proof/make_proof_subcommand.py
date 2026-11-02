from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.make_proof.make_proof import MakeProof
from suites.coding.modules.workers.models.proof import Proof


class MakeProofSubcommand(Subcommand[MakeProof, Proof]):
    """`journal proof make <point> "<text>" --test "<command>"`: a worker's proof for one point of its task's brief,
    with the test command the journal runs to check it."""

    cli_name = "proof"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("point", type=int)
        parser.add_argument("text", help="the file and line, and the test that shows it")
        parser.add_argument("--test", default="", help="the test command the journal runs in your worktree to check this point")

    def command(self, arguments: Namespace, caller: Caller) -> MakeProof:
        return MakeProof(arguments.point, arguments.text, arguments.test)
