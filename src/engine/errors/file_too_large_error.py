class FileTooLargeError(Exception):
    """Raised for a whole-file read of a file past the read's limit: a large file, such as an output or a transcript,
    is read in parts with FileAccess.bytes_range, or with a larger limit named where the read is written."""

    def __init__(self, path: str, size_bytes: int, limit_bytes: int) -> None:
        super().__init__(f"{path} holds {size_bytes} bytes, more than the {limit_bytes} a whole read may take: read it in parts with FileAccess.bytes_range")
        self.path, self.size_bytes, self.limit_bytes = path, size_bytes, limit_bytes
