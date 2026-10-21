from dataclasses import dataclass

from journal.support.chain import Chain


@dataclass(frozen=True)
class AliasCall:
    """A part of a line read as journal <name> [args]: the name it calls and the arguments it passes on, both empty for a part that is no journal command."""

    name: str
    args: str

    @classmethod
    def parsed(cls, text: str) -> "AliasCall":
        tokens = text.split(None, 2)
        if len(tokens) < 2 or not Chain.is_journal(text):
            return cls("", "")
        return cls(tokens[1], tokens[2] if len(tokens) > 2 else "")
