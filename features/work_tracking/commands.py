import time

from controllers.types import Works
from features.parts import Command, Context
from resources.base import Refused


def in_hand(works: Works, n: int = 0):
    row = works.load(n) if n else works.active()
    if not row:
        raise Refused('nothing is open: journal work start "<the work>" first')
    if n and (row.completed or row.parked):
        raise Refused(f"work {row.n} is {'done' if row.completed else 'parked'}; the one in hand is what a log entry means")
    return row


class LogWork(Command):
    name = "log"

    def run(self, context: Context, works: Works, text: str, n: int = 0):
        row = in_hand(works, n)
        return works.section(row.n, f"{len(row.sections) + 1} · {time.strftime('%Y-%m-%d %H:%M')}", text)


class ParkWork(Command):
    name = "park"

    def run(self, context: Context, works: Works, why: str, n: int = 0):
        return works.update(in_hand(works, n).n, parked=why)


class ResumeWork(Command):
    name = "resume"

    def run(self, context: Context, works: Works, n: int):
        busy = works.active()
        if busy:
            raise Refused(f"work {busy.n} is open: end it or park it before picking up another")
        row = works.load(n)
        if not row.parked:
            raise Refused(f"work {row.n} is not parked")
        return works.update(n, parked="")
