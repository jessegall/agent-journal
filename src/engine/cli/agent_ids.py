class AgentIds:
    """Checks that an agent id a line names is an agent of the environment the line runs in. A module binds the
    check; without one every id passes."""

    def checked(self, agent_id: int, environment_id: int | None) -> int:
        return agent_id
