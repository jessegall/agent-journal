from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SendProgramFault(Command[None]):

    agent_id: int
    exit_code: int
