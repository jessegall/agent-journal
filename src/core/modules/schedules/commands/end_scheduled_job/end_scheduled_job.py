from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class EndScheduledJob(Command[int]):
    """An agent's program deleted a job; no job id ends every job of the agent, whose program holds them only
    while it runs."""

    agent_id: int
    job_id: str | None
