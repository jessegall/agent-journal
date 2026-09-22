import time
from contextlib import contextmanager
from pathlib import Path

from controllers.types import Agents, Notifications
from engine import runtime
from engine.record import Record
from resources.base import SYSTEM

OVER = "is slower than its budget"
THREW = "the viewer threw"
SAID = 300
EVERY = 10
AGAIN = 300
BUDGET = {"request": 50, "hook": 50, "command": 50}
WARMED = ("request", "hook")


class FaultReports:
    def __init__(self, feature):
        self.feature = feature

    def milliseconds(self, record, kind: str) -> int:
        return int(record.budget.get(kind, BUDGET.get(kind, 0)))

    def file(self, record, title: str, brief: str, **data) -> None:
        rows = Notifications(record, actor=SYSTEM)
        standing = rows._titled(title, standing=True)
        times = (int(standing.data.get("times", 0)) if standing else 0) + 1
        notified_at = float(standing.data.get("notified_at", 0)) if standing else 0.0
        summary = f"{brief} Seen {self.feature.plural(times, 'time')}."
        telling = times == 1 or times % EVERY == 0 or time.time() - notified_at >= AGAIN
        notified_at = time.time() if telling else notified_at
        if standing:
            rows.update(standing.n, brief=summary, times=times, notified_at=notified_at, **data)
        else:
            self.feature.journal.log(record, "fault", title=title, summary=summary, times=times, notified_at=notified_at, **data)
        agent = Agents(record, actor=SYSTEM).primary() if telling else None
        if agent:
            self.feature.journal.say(record, agent, "fault", title=title, summary=summary)

    def slow(self, record, kind: str, name: str, took: float, working: float | None = None) -> None:
        if working is not None and working <= self.milliseconds(record, kind):
            return
        self.file(record, f"{kind} {name} {OVER}"[:80],
                  f"{took:.0f}ms last{'' if working is None else f' ({working:.0f}ms of it working)'}, against a budget of {self.milliseconds(record, kind)}ms.",
                  kind=kind, target=name, worst=took)

    def threw(self, record, message: str, where: str, stack: str, kind: str = "threw") -> None:
        title = {"slow": f"the viewer's {where} {OVER}", "overlap": f"the viewer sent {where} twice at once",
                 "page": f"the viewer asked {where} for more than a page", "refetch": f"the viewer refetched {where} with nothing changed"}.get(kind, f"{THREW} {message}")
        self.file(record, title[:80], f"{message}\n\n{where}\n\n{stack}"[:SAID], kind=kind, target=where, stack=stack)

    @contextmanager
    def watched(self, root, env: str, kind: str, name: str):
        began = time.perf_counter()
        try:
            yield
        finally:
            self.spent(root, env, kind, name, (time.perf_counter() - began) * 1000)

    def spent(self, root, env: str, kind: str, name: str, took: float, working: float | None = None) -> None:
        if took < min(BUDGET.values() or [0]) or (kind in WARMED and runtime.warming()):
            return
        try:
            record = Record(Path(root), env)
            if self.feature.on(record, "budget") and 0 < self.milliseconds(record, kind) < took:
                self.slow(record, kind, name, took, working)
        except (OSError, ValueError, KeyError):
            return

    def report_console(self, root, env: str, message: str, where: str, stack: str, kind: str = "threw") -> bool:
        if kind == "slow" and runtime.warming():
            return True
        record = Record(Path(root), env)
        if not self.feature.on(record, "budget" if kind in ("slow", "overlap", "page", "refetch") else "console"):
            return False
        self.threw(record, message, where, stack, kind)
        return True
