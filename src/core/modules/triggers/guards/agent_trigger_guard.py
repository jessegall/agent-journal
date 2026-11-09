from core.base.guard.guard import Guard
from core.base.user_approval_refusal import UserApprovalRefusal
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.support.trigger_approval import TriggerApproval
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context

ACTING_FIELDS = ("phrases", "action", "text", "conditions", "extra_actions", "watch_places", "match_mode", "interval_minutes", "cron_line")


class AgentTriggerGuard(Guard[Changed[Trigger]]):
    """An agent cannot enable a trigger, nor change what an enabled trigger does: only the user can, unless the
    setting lets agents enable their own."""

    name = "triggers.agent-trigger"
    is_safety = True

    def __init__(self, approval: TriggerApproval) -> None:
        self.approval = approval

    def check(self, event: Changed[Trigger], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        old, new = event.old_row, event.row
        if not self.approval.needs_user(context.actor):
            return
        if not new.needs_enabling and (old is None or old is not None and old.needs_enabling):
            raise UserApprovalRefusal(f"Enable trigger {new.id}?", ("trigger", "enable", str(new.id)))
        if old is not None and not old.needs_enabling and any(getattr(old, name) != getattr(new, name) for name in ACTING_FIELDS):
            raise UserApprovalRefusal(f"Change the enabled trigger {old.id}?", command=context.command)
