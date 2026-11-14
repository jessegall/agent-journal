from core.modules.triggers.models.trigger import Trigger


class TriggerLines:
    """How a trigger reads in a command's answer and in the list."""

    @staticmethod
    def made(trigger: Trigger) -> str:
        if trigger.is_scheduled:
            return f"trigger {trigger.id}: {trigger.text}, next at {trigger.next_at.text if trigger.next_at else ''}"
        return f"trigger {trigger.id}: {', '.join(trigger.phrases)} -> {trigger.action.value}"

    @staticmethod
    def listed(trigger: Trigger) -> str:
        timing = f"next at {trigger.next_at.text}" if trigger.next_at is not None else ", ".join(trigger.phrases)
        return f"{trigger.id:>4}  {timing} -> {trigger.action.value}: {trigger.text}"
