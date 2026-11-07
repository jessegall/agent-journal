from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class NotePlan(Command[str]):
    plan_id: int
