from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.support.trigger_approval import TriggerApproval

ACTING_FIELDS = ("phrases", "action", "text", "conditions", "extra_actions", "watch_places", "match_mode", "interval_minutes", "cron_line")


class AgentTriggerGuard(Guard):
    """An agent cannot enable a trigger, nor change what an enabled trigger does: only the user can, unless the
    setting lets agents enable their own."""

    name = "triggers.agent-trigger"
    event = "trigger.*"

    def __init__(self, approval: TriggerApproval) -> None:
        self.approval = approval

    def check(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if not isinstance(new, Trigger) or not self.approval.needs_user(change.actor, change.context.environment_id):
            return
        if not new.needs_enabling and (old is None or isinstance(old, Trigger) and old.needs_enabling):
            raise Refusal("only the user enables a trigger an agent made", "the user enables it in the chat or on the Triggers page")
        if isinstance(old, Trigger) and not old.needs_enabling and any(getattr(old, name) != getattr(new, name) for name in ACTING_FIELDS):
            raise Refusal(f"only the user changes what enabled trigger {old.id} does", "make a new trigger, which waits for the user to enable it")
