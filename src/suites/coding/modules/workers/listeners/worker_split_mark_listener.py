from engine.enums.actor_type import ActorType
from engine.change.logged_event import LoggedEvent
from engine.change.updated import Updated
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.helpers.support.helper_settings import PROGRAM_SPLIT
from core.modules.settings.models.setting import Setting
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant


class WorkerSplitMarkListener(MarkListener[Updated[Setting]]):
    """Shows an agent changing the program split."""

    name = "workers.split-mark"
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Updated[Setting], logged: LoggedEvent) -> None:
        if event.row.key != PROGRAM_SPLIT or self.event_rows.required(ActorRecord, logged.actor_id).type is not ActorType.AGENT:
            return
        self.show(logged, WorkerMarkType.SPLIT, WorkerMarkVariant.SPLIT,
                  f"Agent {logged.actor_id} changed the program split", detail=event.row.value)
