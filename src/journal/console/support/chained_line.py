import shlex
from dataclasses import dataclass

JOURNAL = "journal"


@dataclass(frozen=True)
class ChainedLine:
    """A whole command line a command hands the console to run after its own verb, printed under its heading: a journal line the console runs itself, any other in the project's shell."""

    text: str

    def is_journal(self) -> bool:
        return self.text.split(maxsplit=1)[:1] == [JOURNAL]

    def journal_argv(self) -> list[str]:
        return shlex.split(self.text)[1:]

    def heading(self) -> str:
        return f"== {self.text} =="
