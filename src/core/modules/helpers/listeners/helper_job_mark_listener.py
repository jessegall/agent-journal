from core.base.change.logged_event import LoggedEvent
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.enums.dispatch_mark_type import DispatchMarkType
from core.modules.drivers.models.enums.dispatch_mark_variant import DispatchMarkVariant
from core.modules.drivers.models.helper_job import HelperJob
from core.base.change.changed import Changed


class HelperJobMarkListener(MarkListener[Changed[HelperJob]]):
    """A helper's job shows as one mark in the chat with its instruction, which ends in place with what the helper
    returned, and a click opens the helper once it has started."""

    name = "helpers.job-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.core.drivers"

    def handle(self, event: Changed[HelperJob], logged: LoggedEvent) -> None:
        row = event.row
        key = f"dispatch:{row.id}"
        table = AGENTS_TABLE if row.helper_id is not None else ""
        if row.ended_at is None:
            self.show(logged, DispatchMarkType.DISPATCH, DispatchMarkVariant.DISPATCHED, f"Started {row.profile} . {row.program_model}: {row.description}", row.session_agent_id, table, row.helper_id, detail=row.instruction, key=key, ended=False)
        else:
            self.show(logged, DispatchMarkType.DISPATCH, DispatchMarkVariant.FINISHED, f"Agent {row.helper_id} reported back" if row.report_message_id else f"Finished {row.profile}", row.session_agent_id, table, row.helper_id, detail=row.returned, key=key, ended=True)
