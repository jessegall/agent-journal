from typing import TypedDict


class StepFields(TypedDict):
    """The values the sentence of a worker's point is filled with, by the name the sentence uses for each."""

    waiting: str
    task: int
    open_tasks: str
    runs: str
    label: str
    deliver: str
    files: str
    proven: str
    commit: str
    commit_tests: str
    missing: str
