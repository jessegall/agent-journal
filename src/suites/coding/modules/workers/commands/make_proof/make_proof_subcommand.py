from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.make_proof.make_proof import MakeProof
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.waiting_proofs import WaitingProofs


class MakeProofSubcommand(Subcommand[MakeProof, Proof]):
    """Creates a proof for a task point."""

    cli_name = "proof"
    name = "make"
    outward = True

    def __init__(self, proofs: ProofQuery, tasks: TaskQuery) -> None:
        self.proofs, self.tasks = proofs, tasks

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("point", type=int)
        parser.add_argument("text", help="the file and line, and the test that shows it")
        parser.add_argument("--task", type=int, required=True, help="the task this proof is for")
        parser.add_argument("--test", default="", help="read the test suite and choose new and existing tests of changed files; the journal runs this command in your worktree")

    def command(self, arguments: Namespace, caller: Caller) -> MakeProof:
        return MakeProof(arguments.point, arguments.text, arguments.task, arguments.test)

    def write_output(self, value: Proof, output: Output) -> None:
        super().write_output(value, output)
        held = {task.id for task in self.tasks.started_tasks(value.creator_id)}
        output.line(WaitingProofs(tuple(proof for proof in self.proofs.waiting_proofs(value.worktree_id).all_rows() if proof.task_id in held)).text())
