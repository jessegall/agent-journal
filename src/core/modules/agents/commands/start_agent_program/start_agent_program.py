from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

from engine.command.command import Command
from engine.provider.launch_command import LaunchCommand
from core.modules.agents.models.enums.dispatch import Dispatch


@dataclass(frozen=True)
class StartAgentProgram(Command[Dispatch]):
    """Starts the program of an agent: the program line, the folder it runs in and the variables it starts
    with. The answer says whether it was started, runs already, is being started by another, failed or may not
    start. It takes no write lock, since a launcher can take seconds to answer."""

    lock = False

    agent_id: int
    arguments: Sequence[str]
    folder: str
    variables: Mapping[str, str] = field(default_factory=dict[str, str])

    @classmethod
    def launching(cls, agent_id: int, launch: LaunchCommand) -> "StartAgentProgram":
        return cls(agent_id, tuple(launch.arguments), str(launch.folder), dict(launch.variables))
