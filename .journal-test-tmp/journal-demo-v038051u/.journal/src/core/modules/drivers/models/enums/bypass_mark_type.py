from enum import StrEnum


class BypassMarkType(StrEnum):
    """The chat mark of hooks that went around a journal that did not answer."""

    BYPASS = "drivers.bypass"
