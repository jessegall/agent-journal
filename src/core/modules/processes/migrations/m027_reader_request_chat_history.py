from core.base.database.migration import Migration


class ReaderRequestChatHistoryMigration(Migration):
    """Removes reader requests from the chat history."""

    number = 27
    statements = ["DELETE FROM chat_marks WHERE type = 'processes.reader_request'"]
