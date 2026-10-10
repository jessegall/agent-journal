import cProfile
import io
import json
import os
import pstats
import time
from pathlib import Path

from controllers.types import Agents, Environments, Notifications, Todos
from engine import runtime
from engine.record import Record
from engine.version import version
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
FIRST_RUN_COLD = ("request", "hook")
WARMED = (*FIRST_RUN_COLD, "command")
SERVED: set[str] = set()
VIEWER = {"overlap": "the viewer sent {where} twice at once", "page": "the viewer asked {where} for more than a page",
          "refetch": "the viewer refetched {where} with nothing changed"}
STARVED = "the server is starved"
STARVED_EVERY = 60.0
BUDGET_LOG = "budget.jsonl"
BUDGET_LOG_KEPT = 200_000
ALL_THREADS = "cProfile records every thread, so cumulative times include work other threads did while this ran.\n\n"




class FaultReports:
    def __init__(self, feature):
        self.feature = feature
        self.starved_at: dict[Path, float] = {}

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
             after: float = 0.0, whole_reads: tuple[str, ...] = (), by: str = "") -> None:
        if working is not None and working <= self.milliseconds(record, kind):
            return
        parts = [f"{working:.0f}ms of it working" if working is not None else "", f"{garbage:.0f}ms collecting garbage" if garbage >= 1 else "",
                 f"{waiting:.0f}ms waiting on locks" if waiting >= 1 else "", f"then {after:.0f}ms more after it answered" if after >= 1 else "",
                 f"it read a whole transcript for {'; '.join(whole_reads)}" if whole_reads else ""]
        spent = ", ".join(part for part in parts if part)
        title = f"{kind} {name} {OVER}"[:80]
        brief = f"{took:.0f}ms last{f' ({spent})' if spent else ''}, against a budget of {self.milliseconds(record, kind)}ms."
        brief += f" Run by the helper in environment {by}." if by else ""
        brief += f" The machine's load was {load():.1f} on {os.cpu_count()} cores."
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

    @staticmethod
    def dispatcher(record) -> Record:
        """The environment that reads a breach: a helper's own breaches go to the environment that dispatched it."""
        place = Environments(record, actor=SYSTEM).rows.by_title(record.env)
        while place is not None and place.helping and place.launched_from:
            record = Record(record.root, place.launched_from)
            place = Environments(record, actor=SYSTEM).rows.by_title(record.env)
        return record

    def lift(self, root: Path, title: str) -> None:
        """A to-do of a breach title was filed: every session in every environment that holds its writes is released at once."""
        for each in Record.every(root):
            self.feature.release(each, digest(title, 12))

    def restart(self, root: Path, title: str) -> None:
        """A to-do closed settles the notices before it: the count of that title starts again and every session that held its writes is released."""
        for each in Record.every(root):
            fault = Notifications(each, actor=SYSTEM).rows.by_title(title, standing=True)
            if fault is not None:
                Notifications(each, actor=SYSTEM).stamp(fault.n, times=0)
        self.lift(root, title)

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

    def kept(self, root, name: str, took: float, profile: cProfile.Profile | None, stacks: str) -> None:
        out = io.StringIO()
        if profile:
            out.write(ALL_THREADS)
            pstats.Stats(profile, stream=out).sort_stats("cumulative").print_stats(30)
        if stacks:
            out.write(f"\nWhere every thread was while this ran:\n\n{stacks}")
        folder = runtime.profiles(root)
        folder.mkdir(exist_ok=True)
        (folder / f"{time.strftime('%H%M%S')}-{name.replace('/', '_').replace(' ', '-')}-{took:.0f}ms.txt").write_text(out.getvalue())

    def spent(self, root, env: str, kind: str, name: str, took: float, working: float | None = None, profile=None, garbage: float = 0.0,
              waiting: float = 0.0, after: float = 0.0, whole_reads: tuple[str, ...] = (), stacks: str = "") -> None:
        if whole_reads:
            logged(root, f"{kind} {name} read a whole transcript for {'; '.join(whole_reads)}")
        if took < min(BUDGET.values() or [0]) or cold(Path(root), kind, name) or runtime.tests_running(Path(root)):
            return
        try:
            ran = Record(Path(root), env)
            record = self.dispatcher(ran)
            if self.feature.on(record, "log") and 0 < self.milliseconds(record, kind) < took:
                logged(root, f"slow {kind} {name} {took:.0f}ms" + (f", {working:.0f}ms working" if working is not None else "")
                       + (f", {waiting:.0f}ms waiting on locks" if waiting >= 1 else "") + f", machine load {load():.1f} on {os.cpu_count()} cores")
            if self.feature.on(record, "budget") and 0 < self.milliseconds(record, kind) < took:
                self.breached(root, kind, name, took, working, after)
                if working is not None and working > self.milliseconds(record, kind):
                    self.slow(record, kind, name, took, working, garbage, waiting, after, whole_reads, by=ran.env if record.env != ran.env else "")
                    if profile or stacks:
                        self.kept(root, name, took, profile, stacks)
                else:
                    self.starved(root, record, kind, name, took, working)
        except (OSError, ValueError, KeyError):
            return

    @staticmethod
    def breached(root, kind: str, name: str, took: float, working: float | None, after: float) -> None:
        """One line for every breach of a budget, with the release and the moment, so a release's effect can be read off the file; it keeps its newest half when it grows too large."""
        line = json.dumps({"version": version(), "kind": kind, "target": name, "took": round(took), "working": None if working is None else round(working), "after": round(after),
                           "load": round(load(), 2), "time": round(time.time())})
        try:
            file = runtime.folder(Path(root)) / BUDGET_LOG
            if file.is_file() and file.stat().st_size > BUDGET_LOG_KEPT:
                kept = file.read_text().splitlines()
                file.write_text("\n".join(kept[len(kept) // 2:]) + "\n")
            with file.open("a") as out:
                out.write(line + "\n")
        except OSError:
            return

    def starved(self, root, record, kind: str, name: str, took: float, working: float | None) -> None:
        """A request whose working time is within its budget but whose wall time is over it was kept waiting by a machine with no time to give: that is said once a minute, with the load, and never as a slow request."""
        now = time.monotonic()
        if now - self.starved_at.get(Path(root), -STARVED_EVERY) < STARVED_EVERY:
            return
        self.starved_at[Path(root)] = now
        worked = f", {working:.0f}ms of it working" if working is not None else ""
        brief = (f"{kind} {name} took {took:.0f}ms{worked}, against a budget of {self.milliseconds(record, kind)}ms of working time. "
                 f"The machine's load was {load():.1f} on {os.cpu_count()} cores: the time went on waiting for the machine, not on the journal's code.")
        self.file(record, STARVED, brief, kind="starved", target=name, worst=took)

    def report_console(self, root, env: str, message: str, where: str, stack: str, kind: str = "threw") -> bool:
        if kind == RETIRED:
            return True
        record = Record(Path(root), env)
        if not self.feature.on(record, "budget" if kind in VIEWER else "console"):
            return False
        self.threw(record, message, where, stack, kind)
        return True


def load() -> float:
    return os.getloadavg()[0]


def cold(root: Path, kind: str, name: str) -> bool:
    if kind not in WARMED:
        return False
    first = kind in FIRST_RUN_COLD and name not in SERVED
    SERVED.add(name)
    return first or runtime.warming(root)
