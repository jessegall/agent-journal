from engine.database.migration import Migration


class JournalExceptionRenameMigration(Migration):
    """Renames the journal faults table to journal exceptions and carries what names it: the chat marks' type
    and target, the events logged for it and the cursor of the listener that shows it. The mark type's allowed
    values are checked by triggers that the sync rebuilds after the migrations, so the old ones go first."""

    number = 4
    statements = (
        "ALTER TABLE journal_faults RENAME TO journal_exceptions",
        "DROP TRIGGER IF EXISTS chat_marks_rule_type_insert",
        "DROP TRIGGER IF EXISTS chat_marks_rule_type_update",
        "UPDATE chat_marks SET type = 'chat.exception' WHERE type = 'chat.fault'",
        "UPDATE chat_marks SET target_model = 'journal-exception' WHERE target_model = 'journal-fault'",
        "UPDATE events SET name = 'journal_exception.create', row_table = 'journal_exceptions',"
        " command = replace(replace(command, 'JournalFault', 'JournalException'), 'journal_fault', 'journal_exception')"
        " WHERE row_table = 'journal_faults'",
        "UPDATE listener_cursors SET listener = 'chat.exception-mark' WHERE listener = 'chat.fault-mark'",
        "UPDATE listener_skips SET listener = 'chat.exception-mark' WHERE listener = 'chat.fault-mark'",
    )
