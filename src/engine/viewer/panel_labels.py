from enum import StrEnum


class PanelLabels(StrEnum):
    """The words the viewer keeps for its own panel actions: no label of an action on a model may start with
    one."""

    CLOSE = "close"
    OPEN = "open"
    HIDE = "hide"
    DISMISS = "dismiss"
    PREVIOUS = "back"

    @classmethod
    def begins(cls, label: str) -> bool:
        parts = label.split()
        return bool(parts) and parts[0].lower() in {word.value for word in cls}
