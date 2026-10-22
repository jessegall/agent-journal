from argparse import Namespace

from journal.console.command import WORKER_KINDS, Command
from journal.models.proof import Proof
from journal.models.proof_state import ProofState
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.repositories.proofs import Proofs
from journal.repositories.tasks import Tasks
from journal.support.caller import Caller
from journal.support.rejection import Rejection


class ProofCommand(Command):
    """journal proof <point> "<proof>": a worker shows how one point of its task's brief is met, or says with --not-done why it is not."""

    noun = "proof"
    default_verb = "record"
    callers = {"record": WORKER_KINDS}

    def __init__(self, tasks: Tasks, proofs: Proofs) -> None:
        self.tasks, self.proofs = tasks, proofs

    def arguments(self, verbs) -> None:
        record = self.verb(verbs, "record", "show how one point of your task's brief is met: the file and line, and the test that shows it")
        record.add_argument("point", type=int)
        record.add_argument("text")
        record.add_argument("--not-done", action="store_true", help="the point is not met, and the text says why")

    def record(self, args: Namespace, caller: Caller) -> int:
        holdings = [] if caller.worker_number is None else self.tasks.holder_task_ids(Ref(Worker.table(), caller.worker_number))
        if not holdings:
            raise Rejection("a proof is for a point of the task a worker holds: only a worker on a task proves")
        task = self.tasks.find(holdings[0])
        if not 1 <= args.point <= len(task.points()):
            raise Rejection(f"task {task.id}'s brief has {len(task.points())} points: journal task show {task.id} lists them")
        state = ProofState.UNFINISHED if args.not_done else ProofState.SHOWN
        self.proofs.added(Proof(environment_id=task.environment_id, point=args.point, text=args.text, state=state), task, caller.actor)
        print(f"point {args.point} of task {task.id} is {state}: {args.text}")
        return 0
