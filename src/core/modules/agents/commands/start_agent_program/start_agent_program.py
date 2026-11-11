from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

from engine.command.command import Command
from core.modules.agents.models.enums.dispatch import Dispatch


@dataclass(frozen=True)
class StartAgentProgram(Command[Dispatch]):
    """Starts the program of an agent: the program line, the folder it runs in and the variables it starts
    with. The answer says whether it was started, runs already, is being started by another, failed or may not
    start."""

    agent_id: int
    arguments: Sequence[str]
    folder: str
    variables: Mapping[str, str] = field(default_factory=dict)
