class FileChanges:
    """How many times the journal's own writes have changed one file, so a version of the file says whether it is current."""

    def __init__(self) -> None:
        self.count = 0
