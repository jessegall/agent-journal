from typing import TypedDict

from journal.features.chart.agent_standing import AgentStanding


class WorkflowStanding(TypedDict):
    """Where each live agent stands in a workflow, with what its count checks read and the numbers they compare against."""

    agents: list[AgentStanding]
    readings: dict[str, str]
    limits: dict[str, str]
