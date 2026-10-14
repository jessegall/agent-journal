import cProfile
import io
import json
import os
import pstats
import time
from pathlib import Path

from engine.version import version
from resources.text import digest, plural
from resources.places import folder, profiles
from features.dev_faults.diagnostics import LOG_PATH, logged
from resources.types import AgentRow, Environment, Notification, Todo
from serving import Elsewhere, JournalRoot

SEND = (" This project is not agent-journal: send this notice's title and numbers to the agent-journal session (message that peer), with the journal "
        "version {version}, so whoever builds the journal sees them.")
OVER = "is slower than its budget"
THREW = "the viewer threw"
SAID = 300
TOLD_EVERY = 25
HOLD_AFTER = 20
RETIRED = "slow"
BUDGET = {"request": 50, "write": 150, "hook": 50, "command": 50}
# a request that changes something takes a lock, writes a row and tells its events, which no read does; it is judged by the write budget
WRITES = ("POST", "PUT", "PATCH", "DELETE")
FIRST_RUN_COLD = ("request", "hook")
WARMED = (*FIRST_RUN_COLD, "command")
SERVED: set[str] = set()
VIEWER = {"overlap": "the viewer sent {where} twice at once", "page": "the viewer asked {where} for more than a page",
          "refetch": "the viewer refetched {where} with nothing changed"}
STARVED = "the server is starved"
STARVED_EVERY = 60.0
BUDGET_LOG = str(folder(Path()) / "budget.jsonl")
BUDGET_LOG_KEPT = 200_000
PROFILES = str(profiles(Path()))
STARTED_AT: dict[str, float] = {}
ALL_THREADS = "cProfile records every thread, so cumulative times include work other threads did while this ran.\n\n"




class FaultReports:
    """What is filed about a fault, over the services that reach every environment of the journal and its folder."""

    def __init__(self, elsewhere: Elsewhere, root: JournalRoot):
        self.elsewhere, self.root = elsewhere, root

    @classmethod
    def over(cls, record) -> "FaultReports":
        """The journal's own services over a record, for whoever reports outside the engine's lanes."""
        from framework.lanes import TheEnvironments, TheJournalRoot
        from framework.loaded import FEATURES
        return cls(TheEnvironments(FEATURES["dev_faults"], record), TheJournalRoot(record))

    def here(self, env: str):
        return self.elsewhere.named(env)

    def milliseconds(self, env: str, kind: str, name: str = "") -> int:
        """The budget of a kind of call; a request that writes has the write budget."""
        judged = "write" if kind == "request" and name.split(" ", 1)[0] in WRITES else kind
        return int(self.here(env).settings("dev_faults").get(f"budget.{judged}", BUDGET[judged]))

    def file(self, env: str, title: str, brief: str, **data) -> None:
        here = self.here(env)
        rows = here.rows(Notification)
        standing = rows.rows.by_title(title, standing=True)
        agent = here.rows(AgentRow).primary()
        if standing and not self._due(standing, agent):
            rows.stamp(standing.n, times=int(standing.data["times"]) + 1, **data)
            return
        times = int(standing.data["times"]) + 1 if standing else 1
        summary = f"{brief} Seen {plural(times, 'time')}."
        agent_uses = {"told_uses": agent.uses} if agent else {}
        if standing:
            rows.update(standing.n, brief=summary, times=times, **agent_uses, **data)
        else:
            here.log("fault", title=title, summary=summary, times=times, send=self.send(), **agent_uses, **data)
        if agent:
            here.chat().say("fault", title=title, summary=summary, send=self.send())

    def send(self) -> str:
        """What the agent is told to do with a notice: nothing more in the journal's own development project, and send its numbers to the agent-journal session in any other."""
        return "" if self.root.developing() else SEND.format(version=version())

    @staticmethod
    def _due(standing, agent) -> bool:
        agent_uses = standing.data.get("told_uses")
        return bool(agent) and (agent_uses is None or agent.uses - int(agent_uses) >= TOLD_EVERY)

    def slow(self, env: str, kind: str, name: str, took: float, working: float | None = None, garbage: float = 0.0, waiting: float = 0.0,
             after: float = 0.0, whole_reads: tuple[str, ...] = (), *, by: str, request: int = 0, within: int = 0) -> None:
        budget = self.milliseconds(env, kind, name)
        if working is not None and working <= budget and (waiting <= budget or load() >= (os.cpu_count() or 1)):
            return
        parts = [f"{working:.0f}ms of it working" if working is not None else "", f"{garbage:.0f}ms collecting garbage" if garbage >= 1 else "",
                 f"{waiting:.0f}ms waiting on locks" if waiting >= 1 else "", f"then {after:.0f}ms more after it answered" if after >= 1 else "",
                 f"it read a whole transcript for {'; '.join(whole_reads)}" if whole_reads else ""]
        spent = ", ".join(part for part in parts if part)
        title = f"{kind} {name} {OVER}"[:80]
        brief = f"{took:.0f}ms last{f' ({spent})' if spent else ''}, against a budget of {budget}ms."
        brief += f" Run by the helper in environment {by}." if by else ""
        brief += span_of(request, within)
        brief += f" The machine's load was {load():.1f} on {os.cpu_count()} cores."
        self.file(env, title, brief, kind=kind, target=name, worst=took)
        self.answer(env, title, brief)

    def broken(self, env: str, title: str, brief: str) -> None:
        """A handler that ran in the world an expectation states and did not do what it says: told like a slow request, once with its count."""
        self.file(env, title, brief, kind="expectation", target=title)

    def answer(self, env: str, title: str, brief: str) -> None:
        """A first breach files its own to-do, and one seen over and over with no to-do open holds the agent's writes until one is filed."""
        here = self.here(env)
        fault = here.rows(Notification).rows.by_title(title, standing=True)
        if fault is not None and int(fault.data["times"]) == 1 and not self.opened(title):
            here.rows(Todo).create(title, brief=f"{brief} The budget is {BUDGET.get(fault.data.get('kind'), 50)}ms: profile it, fix it, and verify the new time before the release.")
        self.settle(env, title)

    def opened(self, title: str) -> bool:
        """Whether a to-do of this title stands open in any environment of the project."""
        return any(self.here(each).rows(Todo).rows.by_title(title, standing=True) is not None for each in self.root.environments())

    def dispatcher(self, env: str) -> str:
        """The environment that reads a breach: a helper's own breaches go to the environment that dispatched it."""
        place = self.here(env).rows(Environment).rows.by_title(env)
        while place is not None and place.helping and place.launched_from:
            env = place.launched_from
            place = self.here(env).rows(Environment).rows.by_title(env)
        return env

    def lift(self, title: str) -> None:
        """A to-do of a breach title was filed: every session in every environment that holds its writes is released at once."""
        for each in self.root.environments():
            self.here(each).release(digest(title, 12))

    def restart(self, title: str) -> None:
        """A to-do closed settles the notices before it: the count of that title starts again and every session that held its writes is released."""
        for each in self.root.environments():
            notices = self.here(each).rows(Notification)
            fault = notices.rows.by_title(title, standing=True)
            if fault is not None:
                notices.stamp(fault.n, times=0)
        self.lift(title)

    def settle(self, env: str, title: str) -> None:
        here = self.here(env)
        fault = here.rows(Notification).rows.by_title(title, standing=True)
        if fault is None:
            return
        key = digest(title, 12)
        if self.opened(title):
            return here.release(key)
        if int(fault.data["times"]) >= HOLD_AFTER:
            here.hold("overdue", key, title=title, times=fault.data["times"])

    def threw(self, env: str, message: str, where: str, stack: str, kind: str = "threw") -> None:
        if self.here(env).is_on("dev_faults", "log"):
            logged(self.root, f"{kind} {where}: {message}")
        title = VIEWER[kind].format(where=where) if kind in VIEWER else f"{THREW} {message}"
        self.file(env, title[:80], f"{message}\n\n{where}\n\n{stack}"[:SAID], kind=kind, target=where, stack=stack)

    def kept(self, name: str, took: float, profile: cProfile.Profile | None, stacks: str) -> None:
        out = io.StringIO()
        if profile:
            out.write(ALL_THREADS)
            pstats.Stats(profile, stream=out).sort_stats("cumulative").print_stats(30)
        if stacks:
            out.write(f"\nWhere every thread was while this ran:\n\n{stacks}")
        self.root.write(f"{PROFILES}/{time.strftime('%H%M%S')}-{name.replace('/', '_').replace(' ', '-')}-{took:.0f}ms.txt", out.getvalue())

    def spent(self, env: str, kind: str, name: str, took: float, working: float | None = None, profile=None, garbage: float = 0.0,
              waiting: float = 0.0, after: float = 0.0, whole_reads: tuple[str, ...] = (), stacks: str = "", request: int = 0, within: int = 0) -> None:
        if whole_reads:
            logged(self.root, f"{kind} {name} read a whole transcript for {'; '.join(whole_reads)}")
        if took < min(BUDGET.values() or [0]) or self.cold(kind, name) or self.root.is_testing():
            return
        try:
            seen = self.dispatcher(env)
            budget = self.milliseconds(seen, kind, name)
            by = env if seen != env else ""
            here = self.here(seen)
            if here.is_on("dev_faults", "log") and 0 < budget < took:
                logged(self.root, f"slow {kind} {name} {took:.0f}ms" + (f", {working:.0f}ms working" if working is not None else "")
                       + (f", {waiting:.0f}ms waiting on locks" if waiting >= 1 else "") + f", machine load {load():.1f} on {os.cpu_count()} cores")
            if here.is_on("dev_faults", "budget") and 0 < budget < took:
                self.breached(kind, name, took, working, after, request, within)
                if working is not None and working > budget:
                    self.slow(seen, kind, name, took, working, garbage, waiting, after, whole_reads, by=by, request=request, within=within)
                    if profile or stacks:
                        self.kept(name, took, profile, stacks)
                elif kind != "command" and working is not None and waiting > budget:
                    self.slow(seen, kind, name, took, working, garbage, waiting, after, whole_reads, by=by, request=request, within=within)
                elif working is not None and took - working - waiting > budget:
                    self.starved(seen, kind, name, took, working)
        except (OSError, ValueError, KeyError):
            return

    def breached(self, kind: str, name: str, took: float, working: float | None, after: float, request: int = 0, within: int = 0) -> None:
        """One line for every breach of a budget, with the release and the moment, so a release's effect can be read off the file; it keeps its newest half when it grows too large."""
        line = json.dumps({"version": version(), "kind": kind, "target": name, "took": round(took), "working": None if working is None else round(working), "after": round(after),
                           "request": request, "within": within, "load": round(load(), 2), "time": round(time.time())})
        self.root.halve(BUDGET_LOG, BUDGET_LOG_KEPT)
        self.root.append(BUDGET_LOG, line)

    def starved(self, env: str, kind: str, name: str, took: float, working: float | None) -> None:
        """A request whose working time is within its budget but which spent more than its budget off the processor, with no lock or check to account for it, on a machine busier than it has cores, was
        waiting for the machine: it is told once a minute, not once a request."""
        now, root = time.monotonic(), str(self.root.project())
        if load() < (os.cpu_count() or 1) or now - STARTED_AT.get(root, -STARVED_EVERY) < STARVED_EVERY:
            return
        STARTED_AT[root] = now
        worked = f", {working:.0f}ms of it working" if working is not None else ""
        brief = (f"{kind} {name} took {took:.0f}ms{worked}, against a budget of {self.milliseconds(env, kind, name)}ms of working time. "
                 f"The machine's load was {load():.1f} on {os.cpu_count()} cores: the time went on waiting for the machine, not on the journal's code.")
        self.file(env, STARVED, brief, kind="starved", target=name, worst=took)

    def report_console(self, env: str, message: str, where: str, stack: str, kind: str = "threw") -> bool:
        if kind == RETIRED:
            return True
        if not self.here(env).is_on("dev_faults", "budget" if kind in VIEWER else "console"):
            return False
        self.threw(env, message, where, stack, kind)
        return True

    def cold(self, kind: str, name: str) -> bool:
        if kind not in WARMED:
            return False
        first = kind in FIRST_RUN_COLD and name not in SERVED
        SERVED.add(name)
        return first or self.root.is_warming()


class Reporting:
    """The faults as the rest of the journal files them, from a folder and an environment or from a record, over the journal's own services."""

    @staticmethod
    def over(record) -> FaultReports:
        return FaultReports.over(record)

    def spent(self, record, env: str, *measured, **more) -> None:
        self.over(record).spent(env, *measured, **more)

    def file(self, record, title: str, brief: str, **data) -> None:
        self.over(record).file(record.env, title, brief, **data)

    def slow(self, record, *measured, **more) -> None:
        self.over(record).slow(record.env, *measured, **more)

    def kept(self, record, *measured) -> None:
        self.over(record).kept(*measured)

    def send(self, record) -> str:
        return self.over(record).send()

    def milliseconds(self, record, kind: str, name: str = "") -> int:
        return self.over(record).milliseconds(record.env, kind, name)

    def broken(self, record, title: str, brief: str) -> None:
        self.over(record).broken(record.env, title, brief)

    def report_console(self, record, message: str, where: str, stack: str, kind: str = "threw") -> bool:
        return self.over(record).report_console(record.env, message, where, stack, kind)


def span_of(request: int, within: int) -> str:
    """Which span a row measures, so the two rows of one call are joined by their numbers and not mistaken for a disagreement."""
    if request:
        return f" This measures request {request} whole: its answer and what ran after it."
    if within:
        return f" This measures the command alone, run inside request {within}, whose own row measures the whole of it."
    return ""


def load() -> float:
    return os.getloadavg()[0]
