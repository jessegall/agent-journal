from enum import StrEnum


class WorkType(StrEnum):
    """What a Working frame stands for."""

    TASK = "task"
    HANDED_TASK = "handed-task"
    OWN_TASKS = "own-tasks"
    SEQUENCE = "sequence"
    UNIT = "unit"
    JOB = "job"
    MERGE_JOB = "merge-job"
