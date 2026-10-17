from journal.features.shell.chain import Chain
from journal.features.shell.writes import Writes

READERS = {"cat", "head", "tail", "sed", "less", "more", "bat"}
"""Commands that print the files they name."""


class Reads:
    """The files a shell line prints, read from its text before it runs, as the editor's read tool names its file; a line that writes reads nothing."""

    @classmethod
    def of(cls, line: str) -> tuple[str, ...]:
        if Writes.of(line):
            return ()
        return tuple(path for p in Chain.parts(line) if p.recorded for path in cls.part(p.text))

    @staticmethod
    def part(text: str) -> list[str]:
        """The words after a reading command that are not flags: a sed script or a line count among them names no file and matches none."""
        words = Writes.unquoted(text.split("|")[0]).split()
        if not words or words[0].rsplit("/", 1)[-1] not in READERS:
            return []
        return [w for w in words[1:] if not w.startswith("-")]
