import os
import time
from contextlib import contextmanager
from pathlib import Path

from controllers.types import Agents, Notifications
from engine.record import Record
from features.base import Behaviour, Feature
from resources.base import SYSTEM

DEVELOPING = "DEVELOPMENT_MODE"
OVER = "is slower than its budget"
THREW = "the viewer threw"
SAID = 300
EVERY = 10
AGAIN = 300


def developing(project: Path) -> bool:
    said = os.environ.get(DEVELOPING, "")
    try:
        said = said or next((line.split("=", 1)[1] for line in (project / ".env").read_text().splitlines() if line.strip().startswith(f"{DEVELOPING}=")), "")
    except OSError:
        pass
    return said.strip().strip("'\"").lower() in ("1", "true", "yes", "on")


class Faults(Feature):
    name = "faults"
    title_ = "Faults while developing"
    abstract_ = "While developing, what would otherwise pass in silence is reported: anything local that runs past its budget, and any error the viewer throws"
    help_ = "Starts on only while developing: DEVELOPMENT_MODE=true in the project's .env or the environment; everywhere else it starts off, and either way it can be switched. budget: everything here runs on one machine against files, so anything over the budget is a bug — faults.budget.request, .hook and .command are milliseconds per environment, 50 by default, and 0 drops that budget. console: the viewer posts what it throws and it is filed the same way. One notification per target, carrying the worst time or the last words and how many times it happened."
    default = False
    aliases = (("budget", "budget"),)
    behaviours = {"budget": Behaviour("Report anything slower than its budget", "Fifty milliseconds for a request, a hook or a command"),
                  "console": Behaviour("Report what the viewer throws", "An error in the client's console is filed and said to the agent")}
    budget = {"request": 50, "hook": 50, "command": 50}

    @classmethod
    def default_for(cls, root) -> bool:
        return developing(Path(root).parent) if root else cls.default

    def milliseconds(self, record, kind: str) -> int:
        return int(record.budget.get(kind, self.budget.get(kind, 0)))

    def file(self, record, title: str, brief: str, **data) -> None:
        rows = Notifications(record, actor=SYSTEM)
        found = next((row for row in rows.summaries() if not row["deleted"] and not row["completed"] and row["title"] == title), None)
        standing = rows.load(found["n"]) if found else None
        times = (int(standing.data.get("times", 0)) if standing else 0) + 1
        told = float(standing.data.get("told", 0)) if standing else 0.0
        said = f"{brief} Seen {self.plural(times, 'time')}."
        telling = times == 1 or times % EVERY == 0 or time.time() - told >= AGAIN
        told = time.time() if telling else told
        if standing:
            rows.update(standing.n, brief=said, times=times, told=told, **data)
        else:
            rows.create(title, brief=said, times=times, told=told, **data)
        agent = Agents(record, actor=SYSTEM).primary() if telling else None
        if agent:
            self.nudge(record, agent, title, said)

    def slow(self, record, kind: str, name: str, took: float, working: float | None = None) -> None:
        self.file(record, f"{kind} {name} {OVER}"[:80],
                  f"{took:.0f}ms last{'' if working is None else f' ({working:.0f}ms of it working)'}, against a budget of {self.milliseconds(record, kind)}ms.",
                  kind=kind, target=name, worst=took)

    def threw(self, record, said: str, where: str, stack: str, kind: str = "threw") -> None:
        title = {"slow": f"the viewer's {where} {OVER}", "overlap": f"the viewer sent {where} twice at once",
                 "page": f"the viewer asked {where} for more than a page", "refetch": f"the viewer refetched {where} with nothing changed"}.get(kind, f"{THREW} {said}")
        self.file(record, title[:80], f"{said}\n\n{where}\n\n{stack}"[:SAID], kind=kind, target=where, stack=stack)

    @contextmanager
    def watched(self, root, env: str, kind: str, name: str):
        began = time.perf_counter()
        try:
            yield
        finally:
            self.spent(root, env, kind, name, (time.perf_counter() - began) * 1000)

    def spent(self, root, env: str, kind: str, name: str, took: float, working: float | None = None) -> None:
        if took < min(self.budget.values() or [0]):
            return
        try:
            record = Record(Path(root), env)
            if self.on(record, "budget") and 0 < self.milliseconds(record, kind) < took:
                self.slow(record, kind, name, took, working)
        except (OSError, ValueError, KeyError):
            return

    def heard(self, root, env: str, said: str, where: str, stack: str, kind: str = "threw") -> bool:
        record = Record(Path(root), env)
        if not self.on(record, "budget" if kind in ("slow", "overlap", "page", "refetch") else "console"):
            return False
        self.threw(record, said, where, stack, kind)
        return True
