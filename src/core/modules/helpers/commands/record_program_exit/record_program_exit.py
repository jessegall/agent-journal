from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordProgramExit(Command[None]):
    """The launcher says an agent's program has exited, and with which code."""

    lock = False

    agent_id: int
    exit_code: int
    launch_ended: bool = False
    pid: int | None = None
