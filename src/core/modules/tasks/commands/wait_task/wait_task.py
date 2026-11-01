from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class WaitTask(Command[Task]):
    task_id: int
    reason: str
    targets: tuple[str, ...]
    until_command: str
    interval_minutes: int

    def wait_reason(self) -> str:
        terms = [f"waits on {text.replace(':', ' ')}" for text in self.targets]
        if self.until_command:
            terms.append(f"waits until this passes: {self.until_command}")
        return ", ".join(terms)
