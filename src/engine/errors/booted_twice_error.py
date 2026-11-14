class BootedTwiceError(Exception):
    """Raised when a process boots the same journal a second time."""

    def __init__(self, folder: str) -> None:
        super().__init__(f"the journal in {folder} was booted a second time in this process")
