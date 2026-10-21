from dataclasses import dataclass, field, replace

from journal.support.actor import Actor
from journal.support.refused import Refused
from journal.support.not_found import NotFound

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
    files: dict = field(default_factory=dict)

    def measured_path(self) -> str:
        if self.path == "/cli":
            return "/cli/" + " ".join(str(word) for word in self.body.get("argv", [])[:2])
        return self.path

    def with_params(self, params: dict) -> "Request":
        return replace(self, params=params)

    def number(self, name: str) -> int:
        given = self.params.get(name, "")
        if not given.isdigit():
            raise NotFound("rows", given or "nothing")
        return int(given)

    def queried(self, name: str, default: float = 0.0) -> float:
        given = self.query.get(name)
        return float(given) if given else default

    @property
    def environment(self) -> str:
        named = self.headers.get(ENV_HEADER.lower()) or self.query.get("env")
        if not named:
            raise Refused(f"no environment: send it in the {ENV_HEADER} header")
        return named
