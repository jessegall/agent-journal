import time
from contextlib import contextmanager
from pathlib import Path

from controllers.types import Notifications
from engine.record import Record
from features.base import Feature
from resources.base import SYSTEM

OVER = "is slower than its budget"


class Budget(Feature):
    name = "budget"
    title_ = "The speed budget"
    abstract_ = "While developing, anything local that runs longer than its budget is reported so it can be fixed"
    help_ = "Off unless you turn it on; it is for development, not for a release. budget.request, budget.hook and budget.command are milliseconds per environment, 50 by default, and 0 drops that budget. Everything here runs on one machine against files, so anything over the budget is a bug: one notification per target, carrying the worst time, the last and how many times it went over."
    default = False
    budget = {"request": 50, "hook": 50, "command": 50}

    def milliseconds(self, record, kind: str) -> int:
        return int(record.budget.get(kind, self.budget.get(kind, 0)))

    def report(self, record, kind: str, name: str, took: float) -> None:
        rows = Notifications(record, actor=SYSTEM)
        title = f"{kind} {name} {OVER}"[:80]
        standing = next((r for r in rows._every() if not r.completed and r.title == title), None)
        worst = max(took, float(standing.data.get("worst", 0)) if standing else 0)
        times = (int(standing.data.get("times", 0)) if standing else 0) + 1
        brief = f"{took:.0f}ms last, {worst:.0f}ms worst, {times} over the {self.milliseconds(record, kind)}ms budget."
        if standing:
            rows.update(standing.n, brief=brief, worst=worst, times=times)
        else:
            rows.create(title, brief=brief, worst=worst, times=times, kind=kind, target=name)


@contextmanager
def watched(root, env: str, kind: str, name: str):
    began = time.perf_counter()
    try:
        yield
    finally:
        spent(root, env, kind, name, (time.perf_counter() - began) * 1000)


def spent(root, env: str, kind: str, name: str, took: float) -> None:
    from features import FEATURES
    feature = FEATURES.get("budget")
    if not feature or took < min(feature.budget.values() or [0]):
        return
    try:
        record = Record(Path(root), env)
        if feature.on_for(record) and 0 < feature.milliseconds(record, kind) < took:
            feature.report(record, kind, name, took)
    except (OSError, ValueError, KeyError):
        return
