import re

from journal.support.check_progress import CheckProgress

SAID_LINES = 40
"""How many of the last lines a run in progress shows."""
TOLD = 300
"""How many of the last characters of a failing check's output the line that tells the agent carries; the card and the check's page show more."""
PERCENT = re.compile(r"(\d{1,3})%")
COUNTED = re.compile(r"\b(\d+)\s*/\s*(\d+)\b")
ITEMS = re.compile(r"\[(\d+) items?\]|collected (\d+) items?")
STEPS = re.compile(r"^[.FEsxX]+(?=\s*(?:\[\s*\d+%\])?\s*$)", re.M)


class CheckOutput:
    """What a running check has printed, read for how far it is: a count such as 120/983, test dots against the items collected, or a percent."""

    @staticmethod
    def told(output: str) -> str:
        """The end of what a check printed, short enough for one line typed to the agent."""
        text = " ".join(output.split())
        return text if len(text) <= TOLD else f"... {text[-TOLD:]}"

    @staticmethod
    def tail(output: str) -> str:
        return "\n".join(output.strip().splitlines()[-SAID_LINES:])

    @classmethod
    def progress(cls, output: str, at: float) -> CheckProgress:
        counted = COUNTED.findall(output[-2000:])
        if counted and 0 < int(counted[-1][1]) and int(counted[-1][0]) <= int(counted[-1][1]):
            done, total = int(counted[-1][0]), int(counted[-1][1])
            return CheckProgress(at, cls.tail(output), done, total, round(done / total * 100, 1))
        listed = ITEMS.findall(output)
        total = int(next(filter(None, listed[-1]))) if listed else 0
        done = sum(len(found) for found in STEPS.findall(output))
        if done and total:
            return CheckProgress(at, cls.tail(output), min(done, total), total, round(min(done, total) / total * 100, 1))
        printed = PERCENT.findall(output[-2000:])
        return CheckProgress(at, cls.tail(output), percent=min(100, int(printed[-1])) if printed else None)
