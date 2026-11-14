from enum import StrEnum


class BehindRoute(StrEnum):
    """Where a look at a worktree behind its base sent it: nowhere, onto the base at once, to the main agent, or to
    the merger to judge."""

    NONE = "none"
    FAST_FORWARDED = "fast forwarded"
    MAIN_AGENT = "main agent"
    MERGER = "merger"
