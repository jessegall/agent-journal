from enum import StrEnum


class HookWildcard(StrEnum):
    """The hook name that covers every hook event, for a rule that answers each hook its agent sends."""

    ALL_HOOKS = "*"
