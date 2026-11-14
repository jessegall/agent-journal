from enum import IntEnum


class StateTier(IntEnum):
    """Where an agent state's rules are asked in a hook's walk: critical first, then the stack newest first, then in
    the place the rules have today, and deferred after the reply."""

    CRITICAL = 0
    STACK = 1
    IN_PLACE = 2
    DEFERRED = 3
