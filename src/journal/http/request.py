from dataclasses import dataclass, replace

from journal.models.actor import Actor


@dataclass(frozen=True)
class Request:
    method: str
    path: str
    query: dict
    body: dict
    params: dict
    headers: dict
    actor: Actor
    """Who sent it: the user the viewer is signed in as, or the one local user; a hook names its own agent in its body."""

    def with_params(self, params: dict) -> "Request":
        return replace(self, params=params)

    @property
    def environment(self) -> str:
        return self.headers.get("x-journal-env", "main")
