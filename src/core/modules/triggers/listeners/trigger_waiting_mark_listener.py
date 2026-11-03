from core.base.change.logged_event import LoggedEvent
from core.base.scope.actor_scope import ActorScope
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.triggers.models.enums.trigger_mark_type import TriggerMarkType
from core.modules.triggers.models.enums.trigger_mark_variant import TriggerMarkVariant
from core.modules.triggers.models.trigger import Trigger


class TriggerWaitingMarkListener(MarkListener):
    """A trigger an agent made shows in the chat with its Enable button until the user enables it, whichever agent
    made it, since only the user can."""

    name = "triggers.waiting-mark"
    event = "trigger.*"
    module_name = "journal.core.triggers"
    disabled_scopes = [ActorScope]

    def handle(self, event: LoggedEvent) -> None:
        trigger = self.queries.query(Trigger).find(event.row_id)
        waiting = "needs_enabling" in event.data and event.data["needs_enabling"][1] in (1, True)
        enabled = event.event.endswith(".update") and "needs_enabling" in event.data and not trigger.needs_enabling
        if not (waiting or enabled):
            return
        variant = TriggerMarkVariant.WAITING if waiting else TriggerMarkVariant.ENABLED
        mark_text = f"An agent made a trigger that waits for you: {trigger.name or trigger.text}" if waiting else f"Trigger enabled: {trigger.name or trigger.text}"
        self.show(event, TriggerMarkType.WAITING, variant, mark_text, row_model="trigger", row_id=trigger.id, detail=f"{trigger.action.value}: {trigger.text}\n{trigger.extra_actions}", key=f"trigger:{trigger.id}", ended=not waiting)
