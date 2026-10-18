from dataclasses import dataclass

from journal.models.plugin_card import PluginCard


@dataclass(frozen=True)
class PluginAnswer:
    """What a plugin answers to one event: allow, refuse with a reason, or tell a line; the cards it shows and the journal commands it runs."""

    answer: str = "allow"
    reason: str = ""
    tell: str = ""
    cards: tuple[PluginCard, ...] = ()
    commands: tuple[str, ...] = ()
    v: int = 1
