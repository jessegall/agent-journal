class WaitInWriteTurnError(Exception):
    """Raised when a thread holding the database's write turn starts to wait for a slot or a child run, which
    would keep every other write waiting as long."""

    def __init__(self, subject: str) -> None:
        super().__init__(f"{subject} waits while it holds the database's write turn: give the turn back first")
        self.subject = subject
