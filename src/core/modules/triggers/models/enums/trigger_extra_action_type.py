from enum import StrEnum


class TriggerExtraActionType(StrEnum):
    """What a trigger's extra action does: run a command line, or call a web address."""

    RUN = "run"
    WEB = "web"
