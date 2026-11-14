class ClientLeftError(Exception):
    """Raised when the client of a waiting ticket hung up, so the ticket leaves the lane without running."""

    def __init__(self, line: str) -> None:
        super().__init__(f"the client of {line} left before it started")
