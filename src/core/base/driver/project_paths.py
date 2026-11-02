import re

LONG_PATH = re.compile(r"""(?<![\w.~/:-])(?:[\w.~-]*/){2,}([^\s/'"]+)""")


class ProjectPaths:
    """A shell line written relative to the folder it runs in: a cd into that folder goes, and a
    path inside it loses the folder's own part, so a mark names the command and not where the
    project lives; a path outside it stays. A line to read at a glance keeps only a long path's file name."""

    @staticmethod
    def short_paths(line: str) -> str:
        return LONG_PATH.sub(r"…/\1", line)

    @staticmethod
    def relative_line(line: str, folder: str) -> str:
        root = re.escape(folder.rstrip("/"))
        line = re.sub(rf"^\s*cd\s+(['\"]?){root}/?\1\s*(&&|;)\s*", "", line)
        line = re.sub(rf"(?<![\w.~-]){root}/", "", line)
        return re.sub(rf"(?<![\w.~/-]){root}(?![\w.-])", ".", line)
