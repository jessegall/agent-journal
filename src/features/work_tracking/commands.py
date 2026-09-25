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


def numbered(words: tuple, n: int, ask: str) -> tuple[int, str]:
    first = len(words) > 1 and words[0].isdigit()
    text = " ".join(words[1:] if first else words).strip()
    if not text:
        raise Refused(ask)
    return (int(words[0]) if first else n), text


class LogWork(Command):
    name = "log"

    def run(self, context: Context, works: Works, *words: str, n: int = 0):
        n, text = numbered(words, n, "say what was decided or done: journal work log <n> \"<text>\"")
        row = in_hand(works, n)
        return works.section(row.n, f"{len(row.sections) + 1} · {time.strftime('%Y-%m-%d %H:%M')}", text)


class ParkWork(Command):
    name = "park"

    def run(self, context: Context, works: Works, *words: str, n: int = 0):
        n, why = numbered(words, n, "say why it waits: journal work park <n> \"<why>\"")
        return works.update(in_hand(works, n).n, parked=why, awaiting="")


class AwaitWork(Command):
    name = "await"

    def run(self, context: Context, works: Works, *words: str, n: int = 0):
        n, awaiting = numbered(words, n, "say what you are waiting for: journal work await <n> \"<what>\"")
        return works.update(in_hand(works, n).n, awaiting=awaiting, awaiting_since=time.time())


class ResumeWork(Command):
    name = "resume"

    def run(self, context: Context, works: Works, n: int):
        row = works.load(n)
        if not row.parked:
            raise Refused(f"work {row.n} is not parked")
        works._gate(int(row.todo))
        return works.update(n, parked="")
