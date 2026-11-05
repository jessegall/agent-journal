from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerDomains:
    """The domains of the logged-in account, and the subdomain this journal asks for."""

    names: tuple[str, ...]
    subdomain: str

    def json(self) -> Mapping[str, object]:
        return {"domains": [{"name": name, "own": name.partition(".")[0] == self.subdomain} for name in self.names]}
