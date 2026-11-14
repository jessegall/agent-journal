from enum import IntEnum


class RulePriority(IntEnum):
    """Where a driver rule is asked among the rules of its hook: a lower number is asked first, and rules of one
    priority keep the order their modules declare them in."""

    FIRST = -100
    STOP_PLAN_CHECK = -10
    STOP_OPEN_WORK = -5
    COMMAND_CATEGORY_CHECK = -3
    COMMAND_PHASE_CHECK = -2
    COMMAND_COUNT_CHECK = -1
    NORMAL = 0
    LAST = 100
