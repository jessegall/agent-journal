from engine.driver.states.agent_row_state import AgentRowState


class WhereYouStand(AgentRowState):
    """The main agent's default state: it stands on the agent's own row and gates no rule yet; the
    role-only rules of the main agent move into it later."""

    name = "tasks.where-you-stand"
