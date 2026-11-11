from enum import StrEnum


class WorkerStep(StrEnum):
    """The fixed points of a worker's round, each with the one thing to do there."""

    BUILD = "build"
    COMMIT = "commit"
    TASK_PROVEN = "task-proven"
    GROUP_END = "group-end"
    WAIT = "wait"
    FIX = "fix"
    CONFLICT = "conflict"
    QUESTION = "question"
    BLOCKED = "blocked"

    def may_stop(self) -> bool:
        return self in (WorkerStep.WAIT, WorkerStep.QUESTION, WorkerStep.BLOCKED)
