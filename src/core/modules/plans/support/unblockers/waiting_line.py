from dataclasses import dataclass

from core.modules.plans.models.enums.waiting_reason import WaitingReason


@dataclass(frozen=True)
class WaitingLine:
    """An open task a plan waits on that cannot be handed out to the asking agent, with the reason and the
    words for it, which follow the number of the task in a sentence."""

    task_id: int
    reason: WaitingReason
    text: str
