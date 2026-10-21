import re

from journal.support.check_progress import CheckProgress

OUTPUT_LINE_LIMIT = 40
TAIL_CHARACTERS = 300
PERCENT = re.compile(r"(\d{1,3})%")
COUNTED = re.compile(r"\b(\d+)\s*/\s*(\d+)\b")
ITEMS = re.compile(r"\[(\d+) items?\]|collected (\d+) items?")
STEPS = re.compile(r"^[.FEsxX]+(?=\s*(?:\[\s*\d+%\])?\s*$)", re.M)


class CheckOutput:
    """What a running check has printed, read for how far it is: a count such as 120/983, test dots against the items collected, or a percent."""

    @staticmethod
    def summary(output: str) -> str:
        text = " ".join(output.split())
        return text if len(text) <= TAIL_CHARACTERS else f"... {text[-TAIL_CHARACTERS:]}"

    @staticmethod
    def tail(output: str) -> str:
        return "\n".join(output.strip().splitlines()[-OUTPUT_LINE_LIMIT:])

    @classmethod
    def progress(cls, output: str, time: float) -> CheckProgress:
        counted = COUNTED.findall(output[-2000:])
        if counted and 0 < int(counted[-1][1]) and int(counted[-1][0]) <= int(counted[-1][1]):
            finished, total = int(counted[-1][0]), int(counted[-1][1])
            return CheckProgress(time, cls.tail(output), finished, total, round(finished / total * 100, 1))
        listed = ITEMS.findall(output)
        total = int(next(filter(None, listed[-1]))) if listed else 0
        finished = sum(len(rows) for rows in STEPS.findall(output))
        if finished and total:
            return CheckProgress(time, cls.tail(output), min(finished, total), total, round(min(finished, total) / total * 100, 1))
        output_text = PERCENT.findall(output[-2000:])
        return CheckProgress(time, cls.tail(output), percent=min(100, int(output_text[-1])) if output_text else None)
