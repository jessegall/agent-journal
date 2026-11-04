from dataclasses import dataclass


@dataclass(frozen=True)
class BarFacts:
    """What the viewer's bars show: the helpers still running, the tasks not done, the questions
    waiting, the main agent's task, its scheduled jobs and the processes running now."""

    helpers: int
    tasks: int
    waiting: int
    task_id: int | None
    task_title: str
    jobs: int = 0
    processes: int = 0
