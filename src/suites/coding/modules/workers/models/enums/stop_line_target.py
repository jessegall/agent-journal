from enum import StrEnum


class StopLineTarget(StrEnum):
    """Who gets the line about a worker that stopped with tasks left."""

    MERGER = "merger"
    MAIN_AGENT = "main agent"
