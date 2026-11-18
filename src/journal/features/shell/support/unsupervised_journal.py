import os


class UnsupervisedJournal(RuntimeError):
    """A restart the supervisor refused, as it does when it runs no journal service, so the journal server keeps running its old code until that process is restarted by hand."""

    def __init__(self, refusal: str) -> None:
        super().__init__(f"the supervisor did not restart the journal ({refusal}), so the journal server, process {os.getpid()}, still runs the old code: restart that process yourself")
