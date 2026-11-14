from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class RequestTranscriptionFetch(Command[Task]):
    """Asks the main agent to fetch transcriptions through an installed MCP server, whose tools only an agent has."""

    server: str
