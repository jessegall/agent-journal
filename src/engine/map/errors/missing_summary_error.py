class MissingSummaryError(Exception):
    """Raised when a folder of the code has no readable summary line; it names the folder and what to write."""

    def __init__(self, folder: str, instruction: str) -> None:
        super().__init__(f"{folder} has no summary: {instruction}")
        self.folder = folder
        self.instruction = instruction
