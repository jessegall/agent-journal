"""The one queue of heavy runs for the whole project, kept where every environment can read it.

A test run, a browser scenario or a check takes the machine for as long as it lasts, so two at once
take longer than one after the other and neither time can be trusted. What is running is already in
the record - every agent row carries its background runs and whether each is still going - but the
ORDER is not, and that is the part an orchestrator was keeping in its head. It is kept here.
"""

import time
from dataclasses import dataclass
from pathlib import Path

from engine import runtime
from engine.state import State

QUEUE = "queue"


@dataclass(frozen=True)
class Run:
    """One heavy run: the command it will make, the environment that asked for it, and when it joined the queue."""

    command: str
    environment: str
    ticket: str = ""
    at: float = 0.0

    @classmethod
    def from_json(cls, held: dict) -> "Run":
        return cls(command=held.get("command", ""), environment=held.get("environment", ""), ticket=held.get("ticket", ""), at=float(held.get("at", 0.0)))

    def to_json(self) -> dict:
        return {"command": self.command, "environment": self.environment, "ticket": self.ticket, "at": self.at}

    def waited_for(self, now: float) -> float:
        return now - self.at


class HeavyRuns:
    """What is running and what waits, for the whole project. It is one file beside the runtime, because a queue of one environment is no queue at all."""

    def __init__(self, root: Path, forgotten_after: float):
        self.state = State(runtime.folder(Path(root)) / "heavy-runs.json")
        self.forgotten_after = forgotten_after

    def waiting(self, now: float = 0.0) -> list[Run]:
        """The queue as it stands, oldest first, without the runs nobody is waiting on any more."""
        now = now or time.time()
        return [run for run in (Run.from_json(held) for held in self.state.get(QUEUE, []) or []) if run.waited_for(now) < self.forgotten_after]

    def joined(self, run: Run) -> list[Run]:
        """Puts a run at the back of the queue unless that environment is already in it, and answers the queue it joined."""
        with self.state.changing() as held:
            queue = [one for one in self.waiting(run.at) if one.environment != run.environment]
            held[QUEUE] = [one.to_json() for one in [*queue, run]]
        return self.waiting(run.at)

    def left(self, environment: str) -> None:
        """Takes an environment's run out of the queue, which is what ending or giving up on it does."""
        with self.state.changing() as held:
            held[QUEUE] = [one.to_json() for one in self.waiting() if one.environment != environment]

    def place_of(self, environment: str, now: float = 0.0) -> int:
        """Where an environment stands in the queue, counting from one, and nought when it is not in it."""
        queue = self.waiting(now)
        return next((at + 1 for at, one in enumerate(queue) if one.environment == environment), 0)
