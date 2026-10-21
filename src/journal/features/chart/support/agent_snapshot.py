from typing import TypedDict


class AgentSnapshot(TypedDict):
    """Where one agent stands in a workflow, as the page shows it: the node its last walk stopped at and by which port, when, whether it waits there, and the workflow's counts and times in its environment, each time as the seconds since it was noted."""

    session: str
    n: int
    node: int
    port: str
    at: str
    waits: bool
    counts: dict[str, int]
    times: dict[str, int]
