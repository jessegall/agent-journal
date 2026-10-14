from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class User(Model):
    """A person who can reach this journal. One on a local journal; many on a shared one."""

    name: str = ""
    email: str = ""
