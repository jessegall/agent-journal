from dataclasses import dataclass

from journal.models.proof import Proof
from journal.models.task import Task
from journal.models.worker_todo import WorkerTodo


@dataclass(frozen=True)
class WorkerTaskView:
    """The task a worker holds as its page shows it: the task's number, the points of its brief, the worker's to-do items and the latest proof of each point."""

    task_id: int | None = None
    points: tuple[str, ...] = ()
    todos: tuple[WorkerTodo, ...] = ()
    proofs: tuple[Proof, ...] = ()

    @classmethod
    def built(cls, task: Task, todos: list[WorkerTodo], proofs: list[Proof]) -> "WorkerTaskView":
        latest = {proof.point: proof for proof in sorted(proofs, key=lambda proof: proof.row_id)}
        return cls(task.id, task.points(), tuple(todos), tuple(proof for _, proof in sorted(latest.items())))
