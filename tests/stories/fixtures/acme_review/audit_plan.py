from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class AuditPlan(Command[str]):
    plan_id: int
