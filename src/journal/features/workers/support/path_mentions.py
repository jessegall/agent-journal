import re

PATH = re.compile(r"(?:[\w.-]+/)+[\w.-]+\.\w+")


class PathMentions:
    """The files a job's text names, by which two jobs are told to be about the same work."""

    @staticmethod
    def build(text: str) -> set[str]:
        return set(PATH.findall(text))
