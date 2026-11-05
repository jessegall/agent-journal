from enum import StrEnum


class PluginCardTone(StrEnum):
    """The tones a plugin's card is shown in."""

    GOOD = "good"
    WARN = "warn"
    DANGER = "danger"
    NOTE = "note"
    MUTED = "muted"
