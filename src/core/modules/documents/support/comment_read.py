from dataclasses import dataclass


@dataclass(frozen=True)
class CommentRead:
    """A comment as a reader sees it: its message, its own words and the selection they are about, if any."""

    id: int
    text: str
    body: str
    creator_id: int
    created_at: str
    quote: str = ""
    position: int | None = None
    selection_type: str = ""
    revision: int | None = None
