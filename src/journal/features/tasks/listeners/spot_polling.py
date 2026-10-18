from collections import defaultdict, deque

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision

SAME = 3


class SpotPolling(AgentListener[ToolStarting]):
    """The same shell command run three times in a row is named, since a check that is polled is a wait that should be awaited."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger) -> None:
        self.machine, self.nudger = machine, nudger
        self._last: dict[str, deque] = defaultdict(lambda: deque(maxlen=SAME))

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.tasks.feature import Tasks
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        if not command:
            return None
        last = self._last[event.session]
        last.append(command)
        if len(last) < SAME or len(set(last)) != 1:
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), Tasks.POLLING.about(times=SAME, command=command))
        return Decision.tell(line) if line else None
