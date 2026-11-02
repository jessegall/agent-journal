from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.enums.dispatch_mark_type import DispatchMarkType
from core.modules.drivers.models.enums.dispatch_mark_variant import DispatchMarkVariant
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch


class DispatchMarkListener(MarkListener):
    """A subagent's dispatch shows as one mark in the chat with its instruction, which ends in place with what the
    subagent returned."""

    name = "drivers.dispatch-mark"
    event = "subagent_dispatch.*"
    module_name = "journal.core.drivers"

    def handle(self, event: LoggedEvent) -> None:
        row = self.queries.query(SubagentDispatch).find(event.row_id)
        key = f"dispatch:{row.id}"
        if row.ended_at is None:
            self.show(event, DispatchMarkType.DISPATCH, DispatchMarkVariant.DISPATCHED, f"Dispatched {row.profile} . {row.program_model}: {row.description}", row.environment_id, row.agent_id, detail=row.instruction, key=key, ended=False)
        else:
            self.show(event, DispatchMarkType.DISPATCH, DispatchMarkVariant.FINISHED, f"Finished {row.profile}: {row.description}", row.environment_id, row.agent_id, detail=row.returned, key=key, ended=True)
