from pathlib import Path

NOT_TEXT = (".png", ".jpg", ".jpeg", ".gif", ".pdf", ".ipynb")


class FileLines:
    """How many lines a file has; none for a file that is not there or not text."""

    @staticmethod
    def of(path: Path) -> int:
        if not path.is_file() or path.suffix.lower() in NOT_TEXT:
            return 0
        with path.open("rb") as file:
            return sum(1 for _ in file)
