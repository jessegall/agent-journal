from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class RecordKeptSkills(Command[Agent]):
    """Loads the due skills the agent's program put back into its context, read once from its transcript,
    and notes on the agent that its session and compaction have been recorded."""

    agent_id: int
    program: str
    event_id: str
    transcript_path: str
