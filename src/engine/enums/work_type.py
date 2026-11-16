from enum import StrEnum


class WorkType(StrEnum):
    """What a Working stacked state stands for."""

    TASK = "task"
    HANDED_TASK = "handed-task"
    MAIN_AGENT_TASKS = "own-tasks"
    SEQUENCE = "sequence"
    UNIT = "unit"
    JOB = "job"
    MERGE_JOB = "merge-job"
