from core.base.provider.transcript_row import TranscriptRow

TRANSCRIPT_AUTHORS = ("user", "assistant")

JOURNAL_AUTHOR = "journal"
MONITOR_AUTHOR = "monitor"
USER_AUTHOR = "user"
JOURNAL_OPENINGS = ("[journal]", "Stop hook feedback", "<system-reminder", "[SYSTEM NOTIFICATION")
MONITOR_OPENINGS = ("<task-notification", "<monitor")


class TranscriptAuthor:
    """Who wrote a transcript row: an agent program files the journal's lines and a monitor's events as the user's,
    so a user row is told apart by how it opens."""

    @staticmethod
    def row(position: int, row_type: object, text: str) -> TranscriptRow:
        return TranscriptRow(position, TranscriptAuthor.author(str(row_type), text), str(row_type), text)

    @staticmethod
    def author(row_type: str, text: str) -> str:
        if row_type != USER_AUTHOR:
            return row_type
        opening = text.lstrip()
        if opening.startswith(MONITOR_OPENINGS):
            return MONITOR_AUTHOR
        return JOURNAL_AUTHOR if opening.startswith(JOURNAL_OPENINGS) else USER_AUTHOR
