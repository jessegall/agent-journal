from dataclasses import dataclass


@dataclass(frozen=True)
class ProfileProblem:
    """A profile file that cannot supply usable instructions."""

    name: str
    path: str
    problem: str
