from collections.abc import Iterable


class ListFileEntries:
    """The entries of a list file: each line trimmed, with blank lines and # lines left out."""

    @staticmethod
    def parsed(lines: Iterable[str]) -> tuple[str, ...]:
        return tuple(line.strip() for line in lines if line.strip() and not line.lstrip().startswith("#"))
