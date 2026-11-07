from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ReportProgramFault(Command[None]):
    agent_id: int
    exit_code: int
