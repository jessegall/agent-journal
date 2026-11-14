from engine.agent.groups.agent_group import AgentGroup


class DesignerGroup(AgentGroup):
    """The read-only helpers started with the designer profile."""

    key = "designer"
    label = "Designer"
    agent_type = "helper"
    profiles = tuple(["journal-designer"])
