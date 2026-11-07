from dataclasses import dataclass

from core.modules.drivers.commands.record_reminder_passes.record_reminder_passes import RecordReminderPasses


@dataclass(frozen=True)
class ReminderRound:
    """What one due reminder does: the things it only tells the agent of, the things it blocks the agent for,
    and the counts to keep."""

    reminded: tuple[str, ...]
    blocking: tuple[str, ...]
    record: RecordReminderPasses
