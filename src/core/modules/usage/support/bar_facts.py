from dataclasses import dataclass


@dataclass(frozen=True)
class BarFacts:
    """What the viewer's bars show: the helpers still running, the tasks not done, the questions waiting and the main agent's task."""

    helpers: int
    tasks: int
    waiting: int
    task_id: int | None
    task_title: str
