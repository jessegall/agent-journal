import shlex
from dataclasses import dataclass


@dataclass(frozen=True)
class ChainedLine:
    """A journal line a command hands the console to run after its own verb, printed under its heading, or the words that say why it cannot run."""

    text: str
    argv: tuple[str, ...]
    absent: str

    @classmethod
    def runnable(cls, text: str) -> "ChainedLine":
        return cls(text, tuple(shlex.split(text)), "")

    @classmethod
    def missing(cls, text: str, absent: str) -> "ChainedLine":
        return cls(text, (), absent)

    def heading(self) -> str:
        return f"== journal {self.text} =="
