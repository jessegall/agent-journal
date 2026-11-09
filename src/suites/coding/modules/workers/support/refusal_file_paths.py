import re

PATH_PATTERN = re.compile(r"[\w./-]*\w\.[A-Za-z][A-Za-z0-9]{0,4}\b")


class RefusalFilePaths:
    """Finds the file names in the text of a judge refusal."""

    @staticmethod
    def paths(text: str) -> tuple[str, ...]:
        return tuple(dict.fromkeys(PATH_PATTERN.findall(text)))
