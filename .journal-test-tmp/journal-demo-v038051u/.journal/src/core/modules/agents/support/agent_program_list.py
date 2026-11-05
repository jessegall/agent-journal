from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class AgentProgramList:
    """The agent programs the journal can start, each its name and its title."""

    programs: Sequence[tuple[str, str]]

    def json(self) -> Mapping[str, object]:
        return {"rows": [{"name": name, "title": title} for name, title in self.programs]}
