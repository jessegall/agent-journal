from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.missing_points import MissingPoints
from suites.coding.modules.workers.support.task_proofs import TaskProofs

UNPROVED_TEXT = "task {task} is not part of this commit: it has no proof"
CANCELLED_TEXT = "task {task} is cancelled and left out"


@dataclass(frozen=True)
class Staging:
    """What a commit of a worker would take of its started tasks, in the order of their numbers: the ready
    tasks, whose every point is proved and none by a short proof; the incomplete tasks, which have a shown
    proof and miss points; and the unproved tasks, which have no shown proof. A task cancelled with a shown
    proof is named and no part of it."""

    entries: tuple[TaskProofs, ...]
    cancelled: tuple[Task, ...] = ()

    @classmethod
    def grouped(cls, tasks: Sequence[Task], proofs: Sequence[Proof], cancelled: Sequence[Task] = ()) -> "Staging":
        ordered = sorted(tasks, key=lambda task: task.id)
        return cls(tuple(TaskProofs(task, tuple(proof for proof in proofs if proof.task_id == task.id)) for task in ordered), tuple(cancelled))

    @property
    def ready(self) -> tuple[Task, ...]:
        return tuple(entry.task for entry in self.entries if entry.is_ready())

    @property
    def incomplete(self) -> tuple[MissingPoints, ...]:
        return tuple(entry.missing() for entry in self.entries if entry.is_incomplete())

    @property
    def unproved(self) -> tuple[Task, ...]:
        return tuple(entry.task for entry in self.entries if not entry.is_ready() and not entry.has_shown())

    def refused_short(self) -> tuple[Proof, ...]:
        refused = tuple(proof for entry in self.entries if entry.is_refused_short() for proof in entry.short())
        if refused or self.ready:
            return refused
        return tuple(proof for entry in self.entries for proof in entry.short())

    def is_final(self) -> bool:
        return all(entry.is_ready() for entry in self.entries)

    def missing_text(self) -> str:
        return "; ".join(entry.text() for entry in self.incomplete)

    def notes(self) -> tuple[str, ...]:
        return (*(UNPROVED_TEXT.format(task=task.id) for task in self.unproved), *(CANCELLED_TEXT.format(task=task.id) for task in self.cancelled))
