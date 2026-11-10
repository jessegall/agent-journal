from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.make_proof.make_proof import MakeProof
from suites.coding.modules.workers.models.proof import Proof


class MakeProofSubcommand(Subcommand[MakeProof, Proof]):
    """Creates a proof for a task point."""

    cli_name = "proof"
    name = "make"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("point", type=int)
        parser.add_argument("text", help="the file and line, and the test that shows it")
        parser.add_argument("--task", type=int, required=True, help="the task this proof is for")
        parser.add_argument("--test", default="", help="read the test suite and choose new and existing tests of changed files; the journal runs this command in your worktree")

    def command(self, arguments: Namespace, caller: Caller) -> MakeProof:
        return MakeProof(arguments.point, arguments.text, arguments.task, arguments.test)
