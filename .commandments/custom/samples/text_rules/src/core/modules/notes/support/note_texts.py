from core.base.refusal import Refusal


def refuse_both(count: int) -> None:
    if count:
        # @sin naming_plain_journal_text
        raise Refusal("the note names a row that holds nothing", "ask again")
    # @righteous naming_plain_journal_text
    raise Refusal("the note has no row", "ask again")


def refuse_skip(name: str, count: int) -> None:
    if count:
        # @sin naming_column_word_in_text
        raise Refusal(f"{name} has not refused you skipped_at your last skip", "ask again")
    # @righteous naming_column_word_in_text
    raise Refusal(f"{name} has not refused you since your last skip", "ask again")


# @righteous naming_column_word_in_text
ROW_ORDER = "rows are ordered by created_at"
# @righteous naming_column_word_in_text
OPEN_ROWS = "state = ? AND ended_at IS NULL"
# @sin architecture_core_sql_outside_database_layer
SELECT_ALL = "SELECT * FROM notes WHERE id = 1"
# @righteous architecture_core_sql_outside_database_layer
GREETING = "Select a note"
