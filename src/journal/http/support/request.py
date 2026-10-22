from dataclasses import dataclass, field, replace

from journal.support.actor import Actor
from journal.http.support.cli_post import CliPost
from journal.support.rejection import Rejection
from journal.support.missing_row import MissingRow

ENVIRONMENT_HEADER = "X-Journal-Env"


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
        if self.path == "/cli/run":
            return "/cli/" + " ".join(CliPost.parsed(self.body["raw"]).argv[:2])
        return self.path

    def with_params(self, params: dict) -> "Request":
        return replace(self, params=params)

    def number(self, name: str) -> int:
        value = self.params.get(name, "")
        if not value.isdigit():
            raise MissingRow("rows", value or "nothing")
        return int(value)

    def queried(self, name: str, default: float = 0.0) -> float:
        value = self.query.get(name)
        return float(value) if value else default

    @property
    def environment(self) -> str:
        matched = self.headers.get(ENVIRONMENT_HEADER.lower()) or self.query.get("env")
        if not matched:
            raise Rejection(f"no environment: send it in the {ENVIRONMENT_HEADER} header")
        return matched
