from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.triggers.commands.deliver_trigger_output.deliver_trigger_output import DeliverTriggerOutput
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from core.base.change.touched import Touched
from core.modules.processes.models.process import Process


class TriggerOutputListener(CommitListener[Touched[Process]]):
    name = "triggers.command-output"

    def __init__(self, queries: Queries, bus: Bus, actors: ModuleActors) -> None:
        self.queries, self.bus, self.actors = queries, bus, actors

    def handle(self, event: Touched[Process], logged: LoggedEvent) -> None:
        if "state" not in logged.data:
            return
        for run in self.queries.query(TriggerActionRun).filter(process_id=logged.row_id, notify_agent=True, delivered_at=None).all_rows():
            self.bus.run(DeliverTriggerOutput(run.id), self.actors.actor("journal.core.triggers"), cause_id=logged.id, environment_id=logged.environment_id)
