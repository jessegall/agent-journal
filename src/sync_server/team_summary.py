from dataclasses import dataclass


@dataclass(frozen=True)
class TeamSummary:
    """What anyone may ask a team server before joining it: the first commit of the repository its journal belongs to, whether it holds a journal yet, the journal version the team is pinned to, and the migration its rows are at."""

    repository: str
    has_rows: bool
    version: str = ""
    migration: int = 0
