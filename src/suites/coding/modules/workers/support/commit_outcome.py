from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.submission import Submission
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.commit_subject import CommitSubject


@dataclass(frozen=True)
class CommitOutcome:
    """What a commit of a worker came to: the tasks it took, the worktree that holds its git commit and what
    submitting their proofs came to."""

    tasks: tuple[Task, ...]
    worktree: Worktree
    submission: Submission

    def text(self, short_id: str) -> str:
        return f"committed {CommitSubject(self.tasks).label()} as {short_id}; {self.submission.answer_text}"
