from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordProgramExit(Command[None]):
    """The launcher says an agent's program has exited, and with which code."""

    agent_id: int
    exit_code: int
