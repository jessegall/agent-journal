from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class NotifyProgramFault(Command[None]):
    agent_id: int
    exit_code: int
