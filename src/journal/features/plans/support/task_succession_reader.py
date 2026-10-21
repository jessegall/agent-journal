from typing import ClassVar

from journal.features.plans.support.plans_data_reader import PlansDataReader
from journal.features.tasks.support.task_succession import TaskSuccession
from journal.models.agent import Agent


class TaskSuccessionReader:
    """Answers the tasks' question of which task starts on its own next: the next task of the plan started here."""

    source: ClassVar[type[TaskSuccession]] = TaskSuccession

    def __init__(self, plans: PlansDataReader) -> None:
        self.plans = plans

    def read(self, agent: Agent) -> int:
        started = self.plans.read(agent).started
        return started.next_task if started else 0
