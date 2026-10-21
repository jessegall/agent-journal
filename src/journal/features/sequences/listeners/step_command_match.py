from journal.events.agent.tool_starting import ToolStarting
from journal.events.listener import Listener
from journal.features.sequences.support.run_tracker import RunTracker


class StepCommandMatch(Listener[ToolStarting]):
    """A command the step in hand names, run by the agent, takes the step up before the command runs."""

    blocking = True

    def __init__(self, runs: RunTracker) -> None:
        self.runs = runs

    def handle(self, event: ToolStarting) -> None:
        run = None if event.subagent else self.runs.current(event.session, event.environment_id)
        if run is None or run.suspension_reason or run.adopted_at or not self.runs.names(run.text, event.call.parts):
            return
        self.runs.follow(event.session, event.environment_id)
