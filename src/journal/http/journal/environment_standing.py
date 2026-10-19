from dataclasses import dataclass

from journal.http.journal.held_task import HeldTask
from journal.models.environment import Environment


@dataclass(frozen=True)
class EnvironmentStanding:
    """How an environment stands: its live agent with what it is doing, the task it holds, how many questions, unread messages and open tasks wait, and whether a busy agent went quiet."""

    environment: Environment
    agent: dict | None
    task: HeldTask | None
    questions: int
    messages: int
    tasks: int
    silent: bool
