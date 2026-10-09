import cProfile
import io
import pstats
import time
from pathlib import Path

from controllers.types import Agents, Notifications, Todos
from engine import runtime
from engine.record import Record
from engine.wording import digest, plural
from features.dev_faults.diagnostics import logged
from resources.base import SYSTEM

OVER = "is slower than its budget"
THREW = "the viewer threw"
SAID = 300
TOLD_EVERY = 25
HOLD_AFTER = 20
RETIRED = "slow"
BUDGET = {"request": 50, "hook": 50, "command": 50}
WARMED = ("request", "hook")
SERVED: set[str] = set()
VIEWER = {"overlap": "the viewer sent {where} twice at once", "page": "the viewer asked {where} for more than a page",
          "refetch": "the viewer refetched {where} with nothing changed"}
ALL_THREADS = "cProfile records every thread, so cumulative times include work other threads did while this ran.\n\n"




class FaultReports:
    def __init__(self, feature):
        self.feature = feature

    def milliseconds(self, record, kind: str) -> int:
        return int(self.feature.values(record).get(f"budget.{kind}", BUDGET[kind]))

    def file(self, record, title: str, brief: str, **data) -> None:
        rows = Notifications(record, actor=SYSTEM)
        standing = rows.rows.by_title(title, standing=True)
        agent = Agents(record, actor=SYSTEM).primary()
        if standing and not self._due(standing, agent):
            rows.stamp(standing.n, times=int(standing.data["times"]) + 1, **data)
            return
        times = int(standing.data["times"]) + 1 if standing else 1
        summary = f"{brief} Seen {plural(times, 'time')}."
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

    def slow(self, record, kind: str, name: str, took: float, working: float | None = None, garbage: float = 0.0, waiting: float = 0.0,
             after: float = 0.0, whole_reads: tuple[str, ...] = ()) -> None:
        if working is not None and working <= self.milliseconds(record, kind):
            return
        parts = [f"{working:.0f}ms of it working" if working is not None else "", f"{garbage:.0f}ms collecting garbage" if garbage >= 1 else "",
                 f"{waiting:.0f}ms waiting on locks" if waiting >= 1 else "", f"then {after:.0f}ms more after it answered" if after >= 1 else "",
                 f"it read a whole transcript for {'; '.join(whole_reads)}" if whole_reads else ""]
        spent = ", ".join(part for part in parts if part)
        title = f"{kind} {name} {OVER}"[:80]
        brief = f"{took:.0f}ms last{f' ({spent})' if spent else ''}, against a budget of {self.milliseconds(record, kind)}ms."
        self.file(record, title, brief, kind=kind, target=name, worst=took)
        self.answer(record, title, brief)

    def answer(self, record, title: str, brief: str) -> None:
        """A first breach files its own to-do, and one seen over and over with no to-do open holds the agent's writes until one is filed."""
        fault = Notifications(record, actor=SYSTEM).rows.by_title(title, standing=True)
        if fault is not None and int(fault.data["times"]) == 1 and not self.opened(record, title):
            Todos(record, actor=SYSTEM).create(title, brief=f"{brief} The budget is {BUDGET.get(fault.data.get('kind'), 50)}ms: profile it, fix it, and verify the new time before the release.")
        self.settle(record, title)

    @staticmethod
    def opened(record, title: str) -> bool:
        """Whether a to-do of this title stands open in any environment of the project."""
        return any(Todos(each, actor=SYSTEM).rows.by_title(title, standing=True) is not None for each in Record.every(record.root))

    def restart(self, root: Path, title: str) -> None:
        """A to-do closed settles the notices before it: the count of that title starts again and its hold is lifted."""
        for each in Record.every(root):
            fault = Notifications(each, actor=SYSTEM).rows.by_title(title, standing=True)
            if fault is not None:
                Notifications(each, actor=SYSTEM).stamp(fault.n, times=0)
                self.feature.release(each, digest(title, 12))

    def settle(self, record, title: str) -> None:
        fault = Notifications(record, actor=SYSTEM).rows.by_title(title, standing=True)
        if fault is None:
            return
        key = digest(title, 12)
        if self.opened(record, title):
            return self.feature.release(record, key)
        if int(fault.data["times"]) >= HOLD_AFTER:
            self.feature.hold(record, "overdue", key, title=title, times=fault.data["times"])

    def threw(self, record, message: str, where: str, stack: str, kind: str = "threw") -> None:
        if self.feature.on(record, "log"):
            logged(record.root, f"{kind} {where}: {message}")
        title = VIEWER[kind].format(where=where) if kind in VIEWER else f"{THREW} {message}"
        self.file(record, title[:80], f"{message}\n\n{where}\n\n{stack}"[:SAID], kind=kind, target=where, stack=stack)

    def kept(self, root, name: str, took: float, profile: cProfile.Profile) -> None:
        out = io.StringIO()
        pstats.Stats(profile, stream=out).sort_stats("cumulative").print_stats(30)
        folder = runtime.profiles(root)
        folder.mkdir(exist_ok=True)
        (folder / f"{time.strftime('%H%M%S')}-{name.replace('/', '_').replace(' ', '-')}-{took:.0f}ms.txt").write_text(ALL_THREADS + out.getvalue())

    def spent(self, root, env: str, kind: str, name: str, took: float, working: float | None = None, profile=None, garbage: float = 0.0,
              waiting: float = 0.0, after: float = 0.0, whole_reads: tuple[str, ...] = ()) -> None:
        if whole_reads:
            logged(root, f"{kind} {name} read a whole transcript for {'; '.join(whole_reads)}")
        if took < min(BUDGET.values() or [0]) or cold(kind, name) or runtime.tests_running(Path(root)):
            return
        try:
            record = Record(Path(root), env)
            if self.feature.on(record, "log") and 0 < self.milliseconds(record, kind) < took:
                logged(root, f"slow {kind} {name} {took:.0f}ms" + (f", {working:.0f}ms working" if working is not None else "")
                       + (f", {waiting:.0f}ms waiting on locks" if waiting >= 1 else ""))
            if self.feature.on(record, "budget") and 0 < self.milliseconds(record, kind) < took:
                self.slow(record, kind, name, took, working, garbage, waiting, after, whole_reads)
                if profile:
                    self.kept(root, name, took, profile)
        except (OSError, ValueError, KeyError):
            return

    def report_console(self, root, env: str, message: str, where: str, stack: str, kind: str = "threw") -> bool:
        if kind == RETIRED:
            return True
        record = Record(Path(root), env)
        if not self.feature.on(record, "budget" if kind in VIEWER else "console"):
            return False
        self.threw(record, message, where, stack, kind)
        return True


def cold(kind: str, name: str) -> bool:
    if kind not in WARMED:
        return False
    first = name not in SERVED
    SERVED.add(name)
    return first or runtime.warming()
