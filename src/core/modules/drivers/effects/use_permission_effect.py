from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.commands.use_grant.use_grant import UseGrant
from core.modules.drivers.agent_messages.permission_use_failed_message import PermissionUseFailedMessage
from core.modules.drivers.support.restricted_read_access import RestrictedReadAccess


class UsePermissionEffect(Effect):
    """An admitted action of a read-only agent that only an allowed request for leave let through spends that
    request in the step's own write, so a second use is refused; a request that cannot be spent withdraws the
    admission."""

    events = [HookEventName.PRE_TOOL_USE]
    timing = EffectTiming.PERMITTED
    is_required = True
    failure = PermissionUseFailedMessage

    def __init__(self, access: RestrictedReadAccess) -> None:
        self.access = access

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        event = record.action.event
        spent = self.access.spent_permission(event, view.agent.agent_id) if event is not None else None
        return [UseGrant(spent.id)] if spent is not None else []
