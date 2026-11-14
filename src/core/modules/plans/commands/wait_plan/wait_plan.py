from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class WaitPlan(Command[Plan]):
    plan_id: int
    reason: str
    targets: tuple[str, ...]

    def wait_reason(self) -> str:
        return ", ".join(f"waits on {text.replace(':', ' ')}" for text in self.targets)
