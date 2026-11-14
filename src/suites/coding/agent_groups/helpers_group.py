from engine.agent.groups.agent_group import AgentGroup


class HelpersGroup(AgentGroup):
    """The read-only helpers of every other profile."""

    key = "helpers"
    label = "Helpers"
    agent_type = "helper"
