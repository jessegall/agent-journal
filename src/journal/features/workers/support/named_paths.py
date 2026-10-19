import re

PATH = re.compile(r"(?:[\w.-]+/)+[\w.-]+\.\w+")
"""A file path a job names, such as src/journal/features/shell/chain.py."""


class NamedPaths:
    """The files a job's text names, by which two jobs are told to be about the same work."""

    @staticmethod
    def of(text: str) -> set[str]:
        return set(PATH.findall(text))
