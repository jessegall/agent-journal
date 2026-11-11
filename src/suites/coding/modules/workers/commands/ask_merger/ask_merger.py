from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.models.enums.ask_topic import AskTopic


@dataclass(frozen=True)
class AskMerger(Command[str]):
    """A worker asks the merger for something it cannot settle itself, about the started task it names, or
    about the task it works on when it names none."""

    worker_id: int
    topic: AskTopic
    text: str
    task_id: int | None = None
