from dataclasses import dataclass


@dataclass(frozen=True)
class VersionFourStep:
    """One step of a version 4 sequence: its title and its instructions."""

    title: str
    instructions: str

    @classmethod
    def parsed(cls, fields: dict[str, str]) -> "VersionFourStep":
        return cls(fields["title"], fields["instructions"])

    @property
    def text(self) -> str:
        return f"{self.title}: {self.instructions}" if self.instructions else self.title
