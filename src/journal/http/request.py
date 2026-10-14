from dataclasses import dataclass

from journal.models.actor import Actor


@dataclass(frozen=True)
class Request:
    method: str
    path: str
    query: dict
    body: dict
    params: dict
    actor: Actor
    """Who sent it: the agent whose hook it is, the user the viewer is signed in as, or the system."""
