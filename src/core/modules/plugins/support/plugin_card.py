from dataclasses import dataclass


@dataclass(frozen=True)
class PluginCard:
    """A card a plugin's answer shows in the chat: its key, type, label, tone and detail; an empty tone takes the
    tone its manifest gives the type."""

    key: str
    card_type: str
    label: str
    tone: str
    detail: str
