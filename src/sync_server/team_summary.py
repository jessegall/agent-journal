from dataclasses import dataclass


@dataclass(frozen=True)
class TeamSummary:
    """What anyone may ask a team server before joining it: the first commit of the repository its journal belongs to, whether it holds a journal yet, and the journal version the team is pinned to."""

    repository: str
    has_rows: bool
    version: str = ""
