from dataclasses import dataclass

from journal.models.base import Model


@dataclass(frozen=True)
class Environment(Model):
    name: str = ""
    branch: str = ""
