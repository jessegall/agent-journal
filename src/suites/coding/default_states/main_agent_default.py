from engine.enums.agent_kind import AgentKind
from engine.enums.agent_role import AgentRole
from engine.module.default_state import DefaultState
from core.modules.tasks.states.main_agent_state import MainAgentState


class MainAgentDefault(DefaultState):
    """Every main agent of the coding suite starts in the main agent's default state."""

    state = MainAgentState
    kind = AgentKind.ROLE
    value = AgentRole.MAIN
