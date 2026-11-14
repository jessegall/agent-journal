from engine.agent.groups.agent_group import AgentGroup


class WorkersGroup(AgentGroup):
    """The workers, each under the worker type."""

    key = "workers"
    label = "Workers"
    agent_type = "worker"
