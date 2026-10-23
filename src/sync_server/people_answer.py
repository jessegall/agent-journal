from dataclasses import dataclass

from sync_server.team_person import TeamPerson


@dataclass(frozen=True)
class PeopleAnswer:
    """Every person on the team, removed ones left out."""

    people: tuple[TeamPerson, ...]

    @classmethod
    def parsed(cls, people: list) -> "PeopleAnswer":
        return cls(tuple(TeamPerson(**person) for person in people))
