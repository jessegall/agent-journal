from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from core.modules.processes.commands.store_end_decisions.store_end_decisions import StoreEndDecisions
from core.modules.processes.events.output_ended import OutputEnded
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME


class EndDecisionListener(CommitListener[OutputEnded]):
    """Keeps the reading decision of a run once its output has all its text, after the run's end is saved, so
    ending a run never waits for the judge."""

    name = "processes.end-decision"

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: OutputEnded, logged: LoggedEvent) -> None:
        self.bus.run(StoreEndDecisions(event.row.process_id), self.actors.actor(MODULE_NAME), cause_id=logged.id)
