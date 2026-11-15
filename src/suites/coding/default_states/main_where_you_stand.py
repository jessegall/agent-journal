from engine.enums.agent_kind import AgentKind
from engine.enums.agent_role import AgentRole
from engine.module.default_state import DefaultState
from core.modules.tasks.states.where_you_stand import WhereYouStand


class MainWhereYouStand(DefaultState):
    """Every main agent of the coding suite is told where it stands."""

    state = WhereYouStand
    kind = AgentKind.ROLE
    value = AgentRole.MAIN
