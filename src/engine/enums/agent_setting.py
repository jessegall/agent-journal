from enum import StrEnum


class AgentSetting(StrEnum):
    """A setting the journal changes for one running agent; each provider maps it to its program's own key."""

    COMPACT_WINDOW = "compact-window"
