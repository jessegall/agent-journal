from enum import StrEnum


class PanelWords(StrEnum):
    """The words the viewer keeps for its own panel actions: no label of an action on a model may start with
    one."""

    CLOSE = "close"
    OPEN = "open"
    HIDE = "hide"
    DISMISS = "dismiss"
    BACK = "back"

    @classmethod
    def begins(cls, label: str) -> bool:
        words = label.split()
        return bool(words) and words[0].lower() in {word.value for word in cls}
