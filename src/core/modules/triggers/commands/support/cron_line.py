from datetime import datetime, timedelta, timezone

from core.base.refusal import Refusal
from core.base.timestamp import Timestamp

SEARCH_DAYS = 366
FIELD_LIMITS = ((0, 59), (0, 23), (1, 31), (1, 12), (0, 6))


class CronLine:
    """Five fields, minute, hour, day of the month, month and day of the week, each * or a number, a list a,b,
    a range a-b or a step */n, and the next minute after a time that all five fit."""

    def __init__(self, line: str) -> None:
        fields = line.split()
        if len(fields) != 5:
            raise Refusal(f"a cron line has five fields, not {len(fields)}: {line!r}", "write it as minute hour day month weekday, such as '0 9 * * 1'")
        self.line = line
        self.allowed = [self.numbers(field, low, high) for field, (low, high) in zip(fields, FIELD_LIMITS)]

    def numbers(self, field: str, low: int, high: int) -> set[int]:
        selected: set[int] = set()
        for part in field.split(","):
            span, _, step_text = part.partition("/")
            first, _, last = span.partition("-")
            if span == "*":
                start, stop = low, high
            elif first.isdigit() and (last.isdigit() or not last):
                start, stop = int(first), int(last or (high if step_text else first))
            else:
                raise Refusal(f"{part!r} is no cron field", "use *, a number, a list a,b, a range a-b or a step */n")
            selected.update(range(start, stop + 1, int(step_text) if step_text.isdigit() else 1))
        return {number for number in selected if low <= number <= high}

    def next_after(self, start: Timestamp) -> Timestamp:
        candidate = start.value.astimezone(timezone.utc).replace(second=0, microsecond=0) + timedelta(minutes=1)
        for _ in range(SEARCH_DAYS * 24 * 60):
            if self.fits(candidate):
                return Timestamp(candidate)
            candidate += timedelta(minutes=1)
        raise Refusal(f"the cron line {self.line!r} never comes", "check its day and month")

    def fits(self, candidate: datetime) -> bool:
        minute, hour, day, month, weekday = self.allowed
        return candidate.minute in minute and candidate.hour in hour and candidate.day in day and candidate.month in month and (candidate.weekday() + 1) % 7 in weekday
