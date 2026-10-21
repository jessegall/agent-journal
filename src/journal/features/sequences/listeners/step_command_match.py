from journal.events.agent.tool_starting import ToolStarting
from journal.events.listener import Listener
from journal.support.run_tracker import RunTracker


class StepCommandMatch(Listener[ToolStarting]):
    """A command the step in hand names, run by the agent, takes the step up before the command runs."""

    blocking = True

    def __init__(self, runs: RunTracker) -> None:
        self.runs = runs

    def handle(self, event: ToolStarting) -> None:
        run = None if event.subagent else self.runs.in_hand(event.session, event.environment_id)
        if run is None or run.parked_why or run.taken_up_at or not self.runs.names(run, event.call.parts):
            return
        self.runs.follow(event.session, event.environment_id)
