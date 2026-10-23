from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model


@dataclass(frozen=True)
class BrowserSession(Model):
    """A person signed in to a hosted journal from a browser: their account number and name, and the key their session cookie carries, kept only as a hash. Kept on this machine."""

    shared: ClassVar[bool] = False
    timeline_visible: ClassVar[bool] = False

    key_hash: str = ""
    person: int = 0
    name: str = ""
