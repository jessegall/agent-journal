from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.permission import Permission


@dataclass(frozen=True)
class Subagent(AgentState):
    """A subagent of a working agent: allowed what its parent is, nudged about nothing."""

    name = "subagent"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS})
    parent_session: str = ""
