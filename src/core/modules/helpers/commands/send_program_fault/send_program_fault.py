from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendProgramFault(Command[None]):

    lock = False
    agent_id: int
    exit_code: int
