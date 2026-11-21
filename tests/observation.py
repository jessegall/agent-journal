from dataclasses import dataclass

from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers


@dataclass(frozen=True)
class Observation:
    """What one step of a replay or a simulation showed the agent and left behind: the hook's answer, refused when it is a 409 or a held stop, the lines typed to it since the last step, the nudges said since by key and by line, its stack, its load, each worker's state, and how many pieces of deferred work were skipped so far."""

    answer: object
    typed: tuple[str, ...]
    nudges: tuple[str, ...]
    lines: tuple[str, ...]
    stack: tuple[str, ...]
    load: float
    workers: tuple[str, ...]
    skipped: int

    def is_refused(self) -> bool:
        return isinstance(self.answer, tuple) and bool(self.answer) and (self.answer[0] == 409 or self.is_blocked_stop())

    def is_blocked_stop(self) -> bool:
        return len(self.answer) > 1 and isinstance(self.answer[1], dict) and self.answer[1].get("decision") == "block"


class Observer:
    """Reads an observation of the main environment after each step, once the worker thread has settled, counting what was said since the step before."""

    def __init__(self, app, typed: list[str]) -> None:
        self.app, self.typed, self.last_id = app, typed, 0

    def observe(self, answer=None) -> Observation:
        keystrokes = tuple(self.typed)
        with self.app.container.get(Scope).environment(self.app.container.get(Environments).lookup("main").id):
            said = self.app.container.get(Entries).newer_kind_rows("nudge", self.last_id)
            self.app.runtime().deferred.drain()
            agent = self.app.container.get(Agents).current()
            workers = tuple(f"{worker.id}:{worker.state}" + (":locked" if worker.edit_lock else "") for worker in self.app.container.get(Workers).open_workers())
        self.last_id = said[-1].row_id if said else self.last_id
        del self.typed[:len(keystrokes)]
        stack = tuple(layer["state"] for layer in agent.stack) if agent else ()
        load = agent.work_queue.rho if agent else 0.0
        skipped = self.app.runtime().deferred.skipped
        return Observation(answer, keystrokes, tuple(entry.data["key"] for entry in said), tuple(entry.data.get("line", "") for entry in said), stack, load, workers, skipped)
