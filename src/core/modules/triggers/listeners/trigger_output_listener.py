from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.triggers.commands.deliver_trigger_output import DeliverTriggerOutput
from core.modules.triggers.models.trigger_action_run import TriggerActionRun


class TriggerOutputListener(CommitListener):
    name = "triggers.command-output"
    event = "process.*"

    def __init__(self, queries: Queries, bus: Bus, actors: ModuleActors) -> None:
        self.queries, self.bus, self.actors = queries, bus, actors

    def handle(self, event: LoggedEvent) -> None:
        if "state" not in event.data:
            return
        for run in self.queries.query(TriggerActionRun).filter(process_id=event.row_id, tell_agent=True, delivered_at=None).all_rows():
            self.bus.run(DeliverTriggerOutput(run.id), self.actors.actor("journal.core.triggers"), cause_id=event.id, environment_id=event.environment_id)
