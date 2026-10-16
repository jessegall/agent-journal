from dataclasses import dataclass, field, replace

from journal.models.actor import Actor
from journal.refused import Refused
from journal.repositories.not_found import NotFound

ENV_HEADER = "X-Journal-Env"


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
    files: dict = field(default_factory=dict)
    """The files a multipart request carried, by name."""

    def with_params(self, params: dict) -> "Request":
        return replace(self, params=params)

    def number(self, name: str) -> int:
        """A row's number from the path; an address with something else there names no row."""
        given = self.params.get(name, "")
        if not given.isdigit():
            raise NotFound("rows", given or "nothing")
        return int(given)

    @property
    def environment(self) -> str:
        """The environment the header names; an address the browser opens itself, a picture or a stream, names it as ?env= since it cannot carry a header."""
        named = self.headers.get(ENV_HEADER.lower()) or self.query.get("env")
        if not named:
            raise Refused(f"no environment: send it in the {ENV_HEADER} header")
        return named
