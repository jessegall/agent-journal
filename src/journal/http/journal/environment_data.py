from dataclasses import dataclass

from journal.http.journal.task_block import TaskBlock
from journal.models.environment import Environment


@dataclass(frozen=True)
class EnvironmentData:
    """How an environment stands: its live agent with what it is doing, the task it holds, how many questions, unread messages and open tasks wait, whether a busy agent went quiet, and the name of the person who owns it on a shared journal."""

    environment: Environment
    agent: dict | None
    task: TaskBlock | None
    questions: int
    messages: int
    tasks: int
    silent: bool
    owner: str = ""
