from dataclasses import dataclass

from core.modules.sequences.models.sequence import STEP_LIMIT_CHARACTERS

SHORTENED_END = "…"


@dataclass(frozen=True)
class VersionFourStep:
    """One step of a version 4 sequence: its title and its instructions, as one version 5 step, cut with an
    ellipsis to the length version 5 allows a step."""

    title: str
    instructions: str

    @classmethod
    def parsed(cls, fields: dict[str, str]) -> "VersionFourStep":
        return cls(fields["title"], fields["instructions"])

    @property
    def text(self) -> str:
        whole = f"{self.title}: {self.instructions}" if self.instructions else self.title
        return whole if len(whole) <= STEP_LIMIT_CHARACTERS else whole[:STEP_LIMIT_CHARACTERS - len(SHORTENED_END)] + SHORTENED_END
