from core.base.provider.transcript_row import TranscriptRow

TRANSCRIPT_AUTHORS = ("user", "assistant")

AGENT_AUTHOR = "assistant"
JOURNAL_AUTHOR = "journal"
MONITOR_AUTHOR = "monitor"
PEER_AUTHOR = "peer"
USER_AUTHOR = "user"
JOURNAL_OPENINGS = ("[journal]", "Stop hook feedback", "<system-reminder", "[SYSTEM NOTIFICATION")
MONITOR_OPENINGS = ("<task-notification", "<monitor")
PEER_OPENINGS = ("<cross-session-message", "[Cross-session idle notice")


class TranscriptAuthor:
    """Who wrote a transcript row: an agent program files the journal's lines, a monitor's events and another
    agent's messages and idle notices as the user's, so a user row is told apart by how it opens."""

    @staticmethod
    def row(position: int, row_type: object, text: str, time: object = "") -> TranscriptRow:
        return TranscriptRow(position, TranscriptAuthor.author(str(row_type), text), str(row_type), text, str(time) if time else "")

    @staticmethod
    def author(row_type: str, text: str) -> str:
        if row_type != USER_AUTHOR:
            return row_type
        opening = text.lstrip()
        if opening.startswith(MONITOR_OPENINGS):
            return MONITOR_AUTHOR
        if opening.startswith(PEER_OPENINGS):
            return PEER_AUTHOR
        return JOURNAL_AUTHOR if opening.startswith(JOURNAL_OPENINGS) else USER_AUTHOR
