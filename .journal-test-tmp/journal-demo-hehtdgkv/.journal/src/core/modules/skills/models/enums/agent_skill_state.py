from enum import StrEnum


class AgentSkillState(StrEnum):
    """Where a skill stands for an agent: due to be read, or read."""

    DUE = "due"
    LOADED = "loaded"
