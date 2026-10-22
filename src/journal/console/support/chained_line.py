import shlex
from dataclasses import dataclass


@dataclass(frozen=True)
class ChainedLine:
    """A journal line a command hands the console to run after its own verb, printed under its heading."""

    text: str
    argv: tuple[str, ...]

    @classmethod
    def runnable(cls, text: str) -> "ChainedLine":
        return cls(text, tuple(shlex.split(text)))

    def heading(self) -> str:
        return f"== journal {self.text} =="
