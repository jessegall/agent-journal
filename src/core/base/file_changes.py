class FileChanges:
    """The mutation count shared by live versions of one file."""

    def __init__(self) -> None:
        self.count = 0
