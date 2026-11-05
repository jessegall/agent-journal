from dataclasses import dataclass

from core.base.access import Access
from core.base.agent_roster import AgentRoster


@dataclass(frozen=True)
class AgentType:
    """A kind of agent a module registers, with its file access and how it starts and holds work."""

    key: str
    label: str
    extends: str = ""
    access: Access = Access.READ_ONLY
    own_folder: bool = False
    default_profile: str = ""
    start_line: str = ""
    roster: type[AgentRoster] | None = None
