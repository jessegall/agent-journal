from typing import TypedDict

from journal.features.chart.support.agent_standing import AgentStanding


class WorkflowStanding(TypedDict):
    """Where each live agent stands in a workflow, with the numbers its count checks compare against."""

    agents: list[AgentStanding]
    limits: dict[str, str]
