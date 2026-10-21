from typing import TypedDict

from journal.features.chart.support.agent_snapshot import AgentSnapshot
from journal.features.chart.support.value_shown import ValueShown


class WorkflowSnapshot(TypedDict):
    """Where each live agent stands in a workflow, the counts and times it keeps in the environment, and the numbers its count checks compare against."""

    agents: list[AgentSnapshot]
    values: list[ValueShown]
    limits: dict[str, str]
