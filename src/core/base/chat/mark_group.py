from enum import StrEnum


class MarkGroup(StrEnum):
    """Whose mark it is, which gives its icon colour when it has no outcome: the agent's, a reminder, work, or the
    journal's own."""

    AGENT = "agent"
    REMINDERS = "reminders"
    WORK = "work"
    JOURNAL = "journal"
