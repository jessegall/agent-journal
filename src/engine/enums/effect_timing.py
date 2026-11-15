from enum import StrEnum


class EffectTiming(StrEnum):
    """When an effect of a step runs: whatever the decision, only on admission, or after the commit as an intent."""

    UNCONDITIONAL = "unconditional"
    WHEN_ALLOWED = "on-admission"
    AFTER_COMMIT = "after-commit"
