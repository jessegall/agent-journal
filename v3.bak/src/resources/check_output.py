import re
from typing import TypedDict

SAID_LINES = 40
PERCENT = re.compile(r"(\d{1,3})%")
COUNTED = re.compile(r"\b(\d+)\s*/\s*(\d+)\b")
ITEMS = re.compile(r"\[(\d+) items?\]|collected (\d+) items?")
STEPS = re.compile(r"^[.FEsxX]+(?=\s*(?:\[\s*\d+%\])?\s*$)", re.M)
ANSI = re.compile(r"\x1b\[[0-9;]*m")


def tail(output: str) -> str:
    return "\n".join(output.strip().splitlines()[-SAID_LINES:])


def steps(output: str) -> int:
    return sum(len(found) for found in STEPS.findall(output))


def summary(output: str) -> str:
    lines = [ANSI.sub("", line).strip() for line in output.splitlines()]
    return next((line for line in reversed(lines) if line and not line.startswith(("↳", "#"))), "")


class Progress(TypedDict, total=False):
    done: int
    total: int
    percent: float | None


def progress(output: str, last_steps: int = 0) -> Progress:
    counted = COUNTED.findall(output[-2000:])
    if counted and 0 < int(counted[-1][1]) and int(counted[-1][0]) <= int(counted[-1][1]):
        done, total = int(counted[-1][0]), int(counted[-1][1])
        return {"done": done, "total": total, "percent": round(done / total * 100, 1)}
    listed = ITEMS.findall(output)
    total = int(next(filter(None, listed[-1]))) if listed else last_steps
    done = steps(output)
    if done and total:
        return {"done": min(done, total), "total": total, "percent": round(min(done, total) / total * 100, 1)}
    printed = PERCENT.findall(output[-2000:])
    return {"percent": min(100, int(printed[-1]))} if printed else {"percent": None}
