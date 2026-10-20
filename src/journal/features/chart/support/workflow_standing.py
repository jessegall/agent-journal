from typing import TypedDict

from journal.features.chart.support.agent_standing import AgentStanding
from journal.features.chart.support.value_shown import ValueShown


class WorkflowStanding(TypedDict):
    """Where each live agent stands in a workflow, the counts and times it keeps in the environment, and the numbers its count checks compare against."""

    agents: list[AgentStanding]
    values: list[ValueShown]
    limits: dict[str, str]
