from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Rule(Model):
    """Project-wide: binds every environment."""

    text: str = ""
    reason: str = ""
    keywords: tuple[str, ...] = ()
    """Words that, when the agent writes one, bring the rule back to it as a whisper."""

    def mentioning_text(self) -> str | None:
        return self.text
