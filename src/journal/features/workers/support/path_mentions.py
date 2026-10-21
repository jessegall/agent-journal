import re

PATH = re.compile(r"[\w.-]+(?:/[\w.-]+)+\.\w+|\b[\w-]+\.(?:py|js|ts|vue|md|json|toml|css|sh)\b")


class PathMentions:
    """The files a job's text names, by which two jobs are told to be about the same work."""

    @staticmethod
    def build(text: str) -> set[str]:
        return set(PATH.findall(text))
