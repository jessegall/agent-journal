from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.support.trigger_action_process import TriggerActionProcess
from engine.event.updated import Updated

FIRED_FIELD = "fired_count"


class TriggerActionsListener(CommitListener[Updated[Trigger]]):
    """When a trigger has fired, its extra actions start in order, after the write has ended."""

    name = "triggers.extra-actions"

    def __init__(self, queries: Queries, process: TriggerActionProcess) -> None:
        self.queries, self.process = queries, process

    def handle(self, event: Updated[Trigger], logged: LoggedEvent) -> None:
        if FIRED_FIELD not in logged.data:
            return
        for action in event.row.parsed_extra_actions():
            self.process.start(action, logged)
