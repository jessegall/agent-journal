from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.features.long_runs.listeners.time_runs import TimeRuns
from journal.hooks.decision import Decision


class HoldLongRuns(AgentListener[ToolStarting]):
    """A shell command that took a minute last time is told to run in the background this time, unless it already does."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, timing: TimeRuns) -> None:
        self.machine, self.nudger, self.timing = machine, nudger, timing

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.long_runs.feature import LongRuns
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        if not command:
            return None
        self.timing.starting(event.session, command)
        if event.input.get("run_in_background") or not self.timing.is_long(command):
            return None
        seconds = int(self.timing.longest[command])
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), LongRuns.BACKGROUND.about(command=command, seconds=seconds))
        return Decision.tell(line) if line else None
