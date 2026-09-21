import time
from contextlib import contextmanager
from pathlib import Path

from controllers.types import Notifications
from engine.record import Record
from features.base import Behaviour, Feature
from resources.base import SYSTEM

OVER = "is slower than its budget"
THREW = "the viewer threw"
SAID = 300


class Faults(Feature):
    name = "faults"
    title_ = "Faults while developing"
    abstract_ = "While developing, what would otherwise pass in silence is reported: anything local that runs past its budget, and any error the viewer throws"
    help_ = "Off unless you turn it on; it is for development, not for a release. budget: everything here runs on one machine against files, so anything over the budget is a bug — faults.budget.request, .hook and .command are milliseconds per environment, 50 by default, and 0 drops that budget. console: the viewer posts what it throws and it is filed the same way. One notification per target, carrying the worst time or the last words and how many times it happened."
    default = False
    aliases = (("budget", "budget"),)
    behaviours = {"budget": Behaviour("Report anything slower than its budget", "Fifty milliseconds for a request, a hook or a command"),
                  "console": Behaviour("Report what the viewer throws", "An error in the client's console is filed and said to the agent")}
    budget = {"request": 50, "hook": 50, "command": 50}

    def milliseconds(self, record, kind: str) -> int:
        return int(record.budget.get(kind, self.budget.get(kind, 0)))

    def file(self, record, title: str, brief: str, **data) -> None:
        rows = Notifications(record, actor=SYSTEM)
        standing = next((r for r in rows._every() if not r.completed and r.title == title), None)
        times = (int(standing.data.get("times", 0)) if standing else 0) + 1
        said = f"{brief} Seen {self.plural(times, 'time')}."
        if standing:
            rows.update(standing.n, brief=said, times=times, **data)
        else:
            rows.create(title, brief=said, times=times, **data)

    def slow(self, record, kind: str, name: str, took: float) -> None:
        self.file(record, f"{kind} {name} {OVER}"[:80],
                  f"{took:.0f}ms last, against a budget of {self.milliseconds(record, kind)}ms.",
                  kind=kind, target=name, worst=took)

    def threw(self, record, said: str, where: str, stack: str) -> None:
        self.file(record, f"{THREW} {said}"[:80], f"{said}\n\n{where}\n\n{stack}"[:SAID], kind="console", target=where, stack=stack)


def feature(record, key: str):
    from features import FEATURES
    found = FEATURES.get("faults")
    return found if found and found.on(record, key) else None


@contextmanager
def watched(root, env: str, kind: str, name: str):
    began = time.perf_counter()
    try:
        yield
    finally:
        spent(root, env, kind, name, (time.perf_counter() - began) * 1000)


def spent(root, env: str, kind: str, name: str, took: float) -> None:
    from features import FEATURES
    known = FEATURES.get("faults")
    if not known or took < min(known.budget.values() or [0]):
        return
    try:
        record = Record(Path(root), env)
        if feature(record, "budget") and 0 < known.milliseconds(record, kind) < took:
            known.slow(record, kind, name, took)
    except (OSError, ValueError, KeyError):
        return


def threw(root, env: str, said: str, where: str, stack: str) -> bool:
    record = Record(Path(root), env)
    found = feature(record, "console")
    if not found:
        return False
    found.threw(record, said, where, stack)
    return True
