import time
from collections import defaultdict

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_finished import ToolFinished
from journal.features.agent_listener import AgentListener

LONG = 60.0


class TimeRuns(AgentListener[ToolFinished]):
    """How long each shell command took, kept by command, so the next run of a long one can be told to go to the background."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger) -> None:
        self.machine, self.nudger = machine, nudger
        self.started: dict[tuple[str, str], float] = {}
        self.longest: dict[str, float] = defaultdict(float)
        self.now = time.time

    def starting(self, session: str, command: str) -> None:
        self.started[(session, command)] = self.now()

    def handle(self, event: ToolFinished) -> None:
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        began = self.started.pop((event.session, command), None)
        if command and began is not None:
            self.longest[command] = max(self.longest[command], self.now() - began)

    def is_long(self, command: str) -> bool:
        return self.longest.get(command, 0.0) >= LONG
