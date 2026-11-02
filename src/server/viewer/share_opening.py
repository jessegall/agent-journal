from dataclasses import dataclass


@dataclass(frozen=True)
class ShareOpening:
    """What opening a share link answers: its status, and the cookie value that opens the shell in this
    browser."""

    status: int
    cookie: str = ""
