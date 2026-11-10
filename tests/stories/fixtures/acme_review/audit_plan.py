from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AuditPlan(Command[str]):
    plan_id: int
