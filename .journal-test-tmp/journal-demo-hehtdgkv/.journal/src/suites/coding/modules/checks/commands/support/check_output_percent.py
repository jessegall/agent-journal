import re

PERCENT_TEXT = re.compile(r"(\d{1,3})%")
COUNT_TEXT = re.compile(r"\b(\d+)\s*/\s*(\d+)\b")


class CheckOutputPercent:
    """How far a line a check printed says it has come, as a percent or as a count such as 12/50; a line that
    says neither has no percent."""

    @staticmethod
    def parsed(line: str) -> int | None:
        percent = PERCENT_TEXT.search(line)
        if percent:
            return min(int(percent.group(1)), 100)
        count = COUNT_TEXT.search(line)
        if count and 0 < int(count.group(2)) and int(count.group(1)) <= int(count.group(2)):
            return int(count.group(1)) * 100 // int(count.group(2))
        return None
