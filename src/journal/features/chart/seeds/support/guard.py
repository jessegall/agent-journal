from dataclasses import dataclass

from journal.support.drawn_line import NO, YES


@dataclass(frozen=True)
class Guard:
    """A check a drawn path passes on its way to an action: the check's key and text, and the answer that lets the path on."""

    key: str
    text: str = ""
    passes: str = YES

    @property
    def stops(self) -> str:
        """The answer that ends the path here."""
        return NO if self.passes == YES else YES
