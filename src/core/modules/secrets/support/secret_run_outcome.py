from dataclasses import dataclass


@dataclass(frozen=True)
class SecretRunOutcome:
    """What a program a secret went to printed, every form of the value masked, and its exit code."""

    program: str
    exit_code: int
    output: str
