from enum import StrEnum


class ContributionType(StrEnum):
    """The ten lists a module gives the agent machine."""

    NEED = "need"
    FACT = "fact"
    POLICY = "policy"
    LINE = "line"
    TRANSFORM = "transform"
    EFFECT = "effect"
    WAKE_CAUSE = "wake-cause"
    SUBJECT = "subject"
    AGENT_LISTENER = "agent-listener"
    BLOCK_CONDITION = "block-condition"
