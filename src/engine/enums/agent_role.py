from enum import StrEnum


class AgentRole(StrEnum):
    """What an agent session is there for: the main agent of an environment, or a helper. Every agent outside
    the main agents is a helper, whatever its kind; the kind is a helper type a module or suite registers."""

    MAIN = "main"
    HELPER = "helper"
