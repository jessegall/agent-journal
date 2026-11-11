from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordProgramCompaction(Command[None]):
    """Records that an agent's program was started on its compaction line, for an agent whose program takes no
    typed line."""

    agent_id: int
    request_tokens: int
    line: str
