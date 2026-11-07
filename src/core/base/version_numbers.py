import re


class VersionNumbers:
    """The numbers of a version such as 5.2.1, to compare two versions part by part; trailing zeros are dropped,
    so 5.2 and 5.2.0 are the same version."""

    @staticmethod
    def parsed(version: str) -> tuple[int, ...]:
        numbers = [int(part) for part in re.findall(r"\d+", version)]
        while numbers and numbers[-1] == 0:
            numbers.pop()
        return tuple(numbers)
