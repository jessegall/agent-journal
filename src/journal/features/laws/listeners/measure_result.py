from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision

LARGE = 400


class MeasureResult(AgentListener[ToolFinished]):
    """A tool result of many lines is named, since every line stays in the context for good."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger) -> None:
        self.machine, self.nudger = machine, nudger

    def handle(self, event: ToolFinished) -> Decision | None:
        from journal.features.laws.feature import Laws
        lines = event.output.count("\n") + 1
        if lines < LARGE:
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), Laws.LARGE_RESULT.about(lines=lines))
        return Decision.tell(line) if line else None
