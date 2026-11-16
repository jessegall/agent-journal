from typing import TypedDict


class ClassTableJson(TypedDict):
    """One execution class as the class table sends it to the viewer."""

    name: str
    lane: str
    cost: int
    priority: str
    limit: int
    pattern: str
    plugin: str
    origin: str
