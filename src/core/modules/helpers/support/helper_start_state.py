from dataclasses import dataclass


@dataclass(frozen=True)
class HelperStartState:
    """Whether a person can start a helper now: the reason when not, and the programs installed here."""

    reason: str
    programs: tuple[str, ...]
