from dataclasses import dataclass


@dataclass(frozen=True)
class ReviewerListing:
    """The lines `journal reviewer list` prints."""

    lines: tuple[str, ...]
