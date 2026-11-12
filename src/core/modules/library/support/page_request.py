from dataclasses import dataclass


@dataclass(frozen=True)
class PageRequest:
    """Which page of the server's list a user asks for: the share, the words searched for and the page number."""

    share: str
    search: str
    number: int
