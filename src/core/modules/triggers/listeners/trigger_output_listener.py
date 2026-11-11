from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.triggers.commands.deliver_trigger_output.deliver_trigger_output import DeliverTriggerOutput
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from engine.event.moved import Moved
from core.modules.processes.models.process import Process
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle


class TriggerOutputListener(CommitListener[Moved[Process]]):
    name = "triggers.command-output"
    moves = [ProcessLifecycle.finish, ProcessLifecycle.fail, ProcessLifecycle.stop, ProcessLifecycle.orphan]

    def __init__(self, queries: Queries, bus: Bus, actors: ModuleActors) -> None:
        self.queries, self.bus, self.actors = queries, bus, actors

    def handle(self, event: Moved[Process], logged: LoggedEvent) -> None:
        for run in self.queries.query(TriggerActionRun).filter(process_id=logged.row_id, notify_agent=True, delivered_at=None).all_rows():
            self.bus.run(DeliverTriggerOutput(run.id), self.actors.actor("journal.core.triggers"), cause_id=logged.id)
