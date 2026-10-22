from dataclasses import dataclass


@dataclass(frozen=True)
class CardKind:
    """A kind of card a plugin's manifest declares: the label, icon and tone its cards take unless a card says its own, and whether it shows folded."""

    kind: str
    label: str = ""
    icon: str = "plug"
    tone: str = ""
    collapsed: bool = False

    @classmethod
    def parsed(cls, data: dict) -> "CardKind":
        return cls(**data)
