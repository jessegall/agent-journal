from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.support.run_tracker import RunTracker
from journal.models.scoped import Scoped
from journal.supervisor_link import SupervisorLink

CANCELLED = "cancelled"


class CancelledRowRunEnd(Listener[Updated]):
    """A row a run is about that is cancelled ends the run, and the agent is told."""

    def __init__(self, running: RunTracker, supervisor: SupervisorLink) -> None:
        self.running, self.supervisor = running, supervisor

    def handle(self, event: Updated) -> None:
        row = event.model
        if not isinstance(row, Scoped) or "state" not in event.changed() or getattr(row, "state", "") != CANCELLED:
            return
        ref = f"{row.table()}:{row.id}"
        for agent, line in self.running.finish_matching(row.environment_id, lambda run: run.about == ref, f"{ref} was cancelled"):
            if self.running.typed_agent(agent.session, row.environment_id):
                self.supervisor.type(row.environment_id, line)
