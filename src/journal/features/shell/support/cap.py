from dataclasses import dataclass

DIRECT, FULL, ENDS, HINT = "direct", "whole", "ends", "hint"


@dataclass(frozen=True)
class Cap:
    """How a line's output reaches the agent: direct, as it comes with nothing kept, for a read or write of the project's code; whole for a line of journal commands; by its two ends past so many characters for a read; and whole up to so many characters, past that a line naming the output, for anything else."""

    display: str
    characters: int

    def is_direct(self) -> bool:
        return self.display == DIRECT

    def is_whole(self) -> bool:
        return self.display == FULL

    def is_ends(self) -> bool:
        return self.display == ENDS
