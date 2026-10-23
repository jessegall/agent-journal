from dataclasses import dataclass


@dataclass(frozen=True)
class TeamPerson:
    """One person on the team as any of its devices may see them: their account number, name and role, and when any device of theirs last pulled, zero before one has."""

    id: int
    name: str
    role: str
    pulled_at: float
