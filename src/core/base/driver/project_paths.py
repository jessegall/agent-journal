import re


class ProjectPaths:
    """A shell line written relative to the folder it runs in: a cd into that folder goes, and a path inside it loses the
    folder's own part, so a mark names the command and not where the project lives; a path outside it stays."""

    @staticmethod
    def relative_line(line: str, folder: str) -> str:
        root = re.escape(folder.rstrip("/"))
        line = re.sub(rf"^\s*cd\s+(['\"]?){root}/?\1\s*(&&|;)\s*", "", line)
        line = re.sub(rf"(?<![\w.~-]){root}/", "", line)
        return re.sub(rf"(?<![\w.~/-]){root}(?![\w.-])", ".", line)
