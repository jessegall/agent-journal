from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass

from core.modules.agents.support.agent_program_choice import AgentProgramChoice


@dataclass(frozen=True)
class AgentProgramList:
    """The agent programs the journal can start, each its name and its title."""

    programs: Sequence[AgentProgramChoice]

    def json(self) -> Mapping[str, object]:
        return {"rows": [asdict(program) for program in self.programs]}
