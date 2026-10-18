from typing import TypedDict


class AgentStanding(TypedDict):
    """Where one agent stands in a workflow, as the page shows it: the node its last walk stopped at and by which port, when, whether it waits there, and the counts and readings it has."""

    session: str
    n: int
    node: int
    port: str
    at: str
    waits: bool
    counts: dict[str, int]
    readings: dict[str, int]
