from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Environment(Model):
    name: str = ""
    branch: str = ""
