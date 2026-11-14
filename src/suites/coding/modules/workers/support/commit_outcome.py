from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.submission import Submission
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.commit_subject import CommitSubject


@dataclass(frozen=True)
class CommitOutcome:
    """What a commit of a worker came to: the tasks it took, the worktree that holds its git commit, what
    submitting their proofs came to, a line that says whether the worker goes on or waits, and a line for
    each task it left out."""

    tasks: tuple[Task, ...]
    worktree: Worktree
    submission: Submission
    next_step_text: str
    notes: tuple[str, ...] = ()

    def text(self) -> str:
        return f"committed {CommitSubject(self.tasks).label()} as {self.worktree.commit_short_id}; {self.submission.answer_text}"
