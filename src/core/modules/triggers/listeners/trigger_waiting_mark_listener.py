from engine.event.logged_event import LoggedEvent
from engine.scope.actor_scope import ActorScope
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.triggers.models.enums.trigger_mark_type import TriggerMarkType
from core.modules.triggers.models.enums.trigger_mark_variant import TriggerMarkVariant
from core.modules.triggers.models.trigger import Trigger
from engine.event.changed import Changed


class TriggerWaitingMarkListener(MarkListener[Changed[Trigger]]):
    """A trigger an agent made shows in the chat with its Enable button until the user enables it, no matter which
    agent made it, since only the user can."""

    name = "triggers.waiting-mark"
    module_name = "journal.core.triggers"
    disabled_scopes = [ActorScope]

    def handle(self, event: Changed[Trigger], logged: LoggedEvent) -> None:
        trigger = event.row
        name = trigger.name or trigger.text
        if "ended_at" in logged.data and trigger.ended_at is not None:
            if trigger.needs_enabling:
                self.shown(logged, trigger, TriggerMarkVariant.REMOVED, f"Trigger removed: {name}", True)
        elif "needs_enabling" in logged.data:
            if trigger.needs_enabling:
                self.shown(logged, trigger, TriggerMarkVariant.WAITING, f"An agent made a trigger that waits for you: {name}", False)
            else:
                self.shown(logged, trigger, TriggerMarkVariant.ENABLED, f"Trigger enabled: {name}", True)

    def shown(self, logged: LoggedEvent, trigger: Trigger, variant: TriggerMarkVariant, mark_text: str, ended: bool) -> None:
        self.show(logged, TriggerMarkType.WAITING, variant, mark_text, row_model="trigger", row_id=trigger.id, detail=f"{trigger.action.value}: {trigger.text}\n{trigger.extra_actions}", key=f"trigger:{trigger.id}", ended=ended)
