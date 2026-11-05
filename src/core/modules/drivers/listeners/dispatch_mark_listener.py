from core.base.change.logged_event import LoggedEvent
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.drivers.models.enums.dispatch_mark_type import DispatchMarkType
from core.modules.drivers.models.enums.dispatch_mark_variant import DispatchMarkVariant
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch
from core.base.change.changed import Changed


class DispatchMarkListener(MarkListener[Changed[SubagentDispatch]]):
    """A subagent's dispatch shows as one mark in the chat with its instruction, which ends in place with what the
    subagent returned, and a click opens the subagent once it has started."""

    name = "drivers.dispatch-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.core.drivers"

    def handle(self, event: Changed[SubagentDispatch], logged: LoggedEvent) -> None:
        row = event.row
        key = f"dispatch:{row.id}"
        if self.queries.query(ChatMark).filter(environment_id=row.environment_id, key=key, state=ChatMarkState.ENDED).exists():
            return
        table = AGENTS_TABLE if row.subagent_id is not None else ""
        if row.ended_at is None:
            self.show(logged, DispatchMarkType.DISPATCH, DispatchMarkVariant.DISPATCHED, f"Dispatched {row.profile} . {row.program_model}: {row.description}", row.environment_id, row.agent_id, table, row.subagent_id, detail=row.instruction, key=key, ended=False)
        else:
            self.show(logged, DispatchMarkType.DISPATCH, DispatchMarkVariant.FINISHED, f"Finished {row.profile}: {row.description}", row.environment_id, row.agent_id, table, row.subagent_id, detail=row.returned, key=key, ended=True)
