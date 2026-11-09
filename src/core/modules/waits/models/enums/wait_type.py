from enum import StrEnum


class WaitType(StrEnum):
    """What a wait is for: rows the agent waits on, a report that the agent is stuck, or an answer it asked for."""

    ROWS = "rows"
    HELP_REQUEST = "help_request"
    ANSWER = "answer"


WORK_ENDED_TYPES = (WaitType.HELP_REQUEST, WaitType.ANSWER)
