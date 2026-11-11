from dataclasses import dataclass


@dataclass(frozen=True)
class ConditionCheck:
    """Whether the condition of a plugin service passed, and the fault to report when it ran past its limit."""

    is_passed: bool
    faults: tuple[str, ...] = ()
