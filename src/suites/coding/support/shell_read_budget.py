from dataclasses import dataclass


@dataclass
class ShellReadBudget:
    """The bytes a hook may still read and the lines it may still compare."""

    remaining_bytes: int
    remaining_lines: int

    def consume_bytes(self, count: int) -> None:
        self.remaining_bytes -= count

    def accept_lines(self, count: int) -> bool:
        if count > self.remaining_lines:
            return False
        self.remaining_lines -= count
        return True
