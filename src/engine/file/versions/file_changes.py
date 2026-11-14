class FileChanges:
    """The version of one file as the journal's own writes change it, so a version of the file says whether it
    is current."""

    def __init__(self) -> None:
        self.version = 0
