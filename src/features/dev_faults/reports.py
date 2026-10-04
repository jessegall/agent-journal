import cProfile
import io
import pstats
import re
import time
from pathlib import Path

from controllers.types import Agents, Notifications
from engine import runtime
from engine.record import Record
from features.dev_faults.diagnostics import logged
from resources.base import SYSTEM

OVER = "is slower than its budget"
THREW = "the viewer threw"
SAID = 300
TOLD_EVERY = 25
RETIRED = "slow"
BUDGET = {"request": 50, "hook": 50, "command": 50}
WARMED = ("request", "hook")
SERVED: set[str] = set()
ALL_THREADS = "cProfile records every thread, so cumulative times include work other threads did while this ran.\n\n"




class FaultReports:
    def __init__(self, feature):
        self.feature = feature

    def milliseconds(self, record, kind: str) -> int:
        return int(self.feature.setting(record, f"budget.{kind}", BUDGET[kind]))

    def file(self, record, title: str, brief: str, **data) -> None:
        rows = Notifications(record, actor=SYSTEM)
        standing = rows._titled(title, standing=True)
        agent = Agents(record, actor=SYSTEM).primary()
        if standing and not self._due(standing, agent):
            rows.stamp(standing.n, times=int(standing.data["times"]) + 1, **data)
            return
        times = int(standing.data["times"]) + 1 if standing else 1
        summary = f"{brief} Seen {self.feature.plural(times, 'time')}."
        told = {"told_uses": agent.uses} if agent else {}
        if standing:
            rows.update(standing.n, brief=summary, times=times, **told, **data)
        else:
            self.feature.journal.log(record, "fault", title=title, summary=summary, times=times, **told, **data)
        if agent:
            self.feature.journal.say(record, agent, "fault", title=title, summary=summary)

    @staticmethod
    def _due(standing, agent) -> bool:
        told = standing.data.get("told_uses")
        return bool(agent) and (told is None or agent.uses - int(told) >= TOLD_EVERY)

    def slow(self, record, kind: str, name: str, took: float, working: float | None = None, garbage: float = 0.0, waiting: float = 0.0) -> None:
        if working is not None and working <= self.milliseconds(record, kind):
            return
        parts = [f"{working:.0f}ms of it working" if working is not None else "", f"{garbage:.0f}ms collecting garbage" if garbage >= 1 else "",
                 f"{waiting:.0f}ms waiting on locks" if waiting >= 1 else ""]
        spent = ", ".join(part for part in parts if part)
        self.file(record, f"{kind} {name} {OVER}"[:80],
                  f"{took:.0f}ms last{f' ({spent})' if spent else ''}, against a budget of {self.milliseconds(record, kind)}ms.",
                  kind=kind, target=name, worst=took)

    def threw(self, record, message: str, where: str, stack: str, kind: str = "threw") -> None:
        if self.feature.on(record, "log"):
            logged(record.root, f"{kind} {where}: {message}")
        title = {"overlap": f"the viewer sent {where} twice at once",
                 "page": f"the viewer asked {where} for more than a page", "refetch": f"the viewer refetched {where} with nothing changed"}.get(kind, f"{THREW} {message}")
        self.file(record, title[:80], f"{message}\n\n{where}\n\n{stack}"[:SAID], kind=kind, target=where, stack=stack)

    def kept(self, root, name: str, took: float, profile: cProfile.Profile) -> None:
        out = io.StringIO()
        pstats.Stats(profile, stream=out).sort_stats("cumulative").print_stats(30)
        folder = runtime.profiles(root)
        folder.mkdir(exist_ok=True)
        (folder / f"{time.strftime('%H%M%S')}-{name.replace('/', '_').replace(' ', '-')}-{took:.0f}ms.txt").write_text(ALL_THREADS + out.getvalue())

    def spent(self, root, env: str, kind: str, name: str, took: float, working: float | None = None, profile=None, garbage: float = 0.0,
              waiting: float = 0.0) -> None:
        if took < min(BUDGET.values() or [0]) or cold(kind, name) or runtime.tests_running(Path(root)):
            return
        try:
            record = Record(Path(root), env)
            if self.feature.on(record, "log") and 0 < self.milliseconds(record, kind) < took:
                logged(root, f"slow {kind} {name} {took:.0f}ms" + (f", {working:.0f}ms working" if working is not None else "")
                       + (f", {waiting:.0f}ms waiting on locks" if waiting >= 1 else ""))
            if self.feature.on(record, "budget") and 0 < self.milliseconds(record, kind) < took:
                self.slow(record, kind, name, took, working, garbage, waiting)
                if profile:
                    self.kept(root, name, took, profile)
        except (OSError, ValueError, KeyError):
            return

    def report_console(self, root, env: str, message: str, where: str, stack: str, kind: str = "threw") -> bool:
        if kind == RETIRED:
            return True
        record = Record(Path(root), env)
        if not self.feature.on(record, "budget" if kind in ("overlap", "page", "refetch") else "console"):
            return False
        self.threw(record, message, where, stack, kind)
        return True


def cold(kind: str, name: str) -> bool:
    if kind not in WARMED:
        return False
    first = name not in SERVED
    SERVED.add(name)
    return first or runtime.warming()
