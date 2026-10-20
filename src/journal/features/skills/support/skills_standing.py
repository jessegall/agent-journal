from dataclasses import dataclass


@dataclass(frozen=True)
class SkillsStanding:
    """The skills feature's reading: the skills the agent owes a read of."""

    owed: tuple[str, ...]
