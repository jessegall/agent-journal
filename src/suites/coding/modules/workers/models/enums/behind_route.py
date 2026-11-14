from enum import StrEnum


class BehindRoute(StrEnum):
    """Where a look at a worktree behind its base sent it: nowhere, onto the base at once, straight to its worker
    as an update order, to the main agent, or to the merger to judge."""

    NONE = "none"
    FAST_FORWARDED = "fast forwarded"
    UPDATE_ORDERED = "update ordered"
    MAIN_AGENT = "main agent"
    MERGER = "merger"
