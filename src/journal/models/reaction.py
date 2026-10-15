from dataclasses import dataclass

from journal.models.author import Author
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Reaction(Scoped):
    """One face by one side on one message; the message it sits on is a link of kind reacts."""

    face: str = ""
    author: Author = Author.USER
