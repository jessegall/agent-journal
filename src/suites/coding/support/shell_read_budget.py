class ShellReadBudget:
    """Tracks the bytes a hook can read and the lines it can compare."""

    def __init__(self, byte_limit: int, line_limit: int) -> None:
        self.remaining_bytes, self.remaining_lines = byte_limit, line_limit

    def consume_bytes(self, count: int) -> None:
        self.remaining_bytes -= count

    def accept_lines(self, count: int) -> bool:
        if count > self.remaining_lines:
            return False
        self.remaining_lines -= count
        return True
