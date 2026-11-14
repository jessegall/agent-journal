from dataclasses import dataclass


@dataclass(frozen=True)
class SavedCommandCheck:
    candidate: str
    saved: dict[str, str]
