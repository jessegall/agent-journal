from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Fact(Scoped):
    text: str = ""
    keywords: tuple[str, ...] = ()
    """Words that, when the agent writes one, bring the row back to it as a whisper."""
