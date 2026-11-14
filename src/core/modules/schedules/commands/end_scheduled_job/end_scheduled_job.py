from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class EndScheduledJob(Command[int]):
    """An agent's program deleted a job."""

    agent_id: int
    job_id: str
