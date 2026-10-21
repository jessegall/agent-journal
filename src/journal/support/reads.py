from journal.features.shell.support.part import Part
from journal.support.chain import Chain
from journal.support.writes import Writes

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
        """The tokens after a reading command that are not flags: a sed script or a line count among them names no file and matches none."""
        tokens = Part(text.split("|")[0]).unquoted().split()
        if not tokens or tokens[0].rsplit("/", 1)[-1] not in READERS:
            return []
        return [w for w in tokens[1:] if not w.startswith("-")]
