from dataclasses import dataclass


@dataclass(frozen=True)
class ProgressListingCommand:
    line: str
    position: int
    pattern: str


