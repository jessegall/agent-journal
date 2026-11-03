from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.support.trigger_action_process import TriggerActionProcess

FIRED_FIELD = "fired_count"


class TriggerActionsListener(CommitListener):
    """When a trigger has fired, its extra actions start in order, after the write has ended."""

    name = "triggers.extra-actions"
    event = "trigger.update"

    def __init__(self, queries: Queries, process: TriggerActionProcess) -> None:
        self.queries, self.process = queries, process

    def handle(self, event: LoggedEvent) -> None:
        if FIRED_FIELD not in event.data:
            return
        for action in self.queries.query(Trigger).find(event.row_id).parsed_extra_actions():
            self.process.start(action)
