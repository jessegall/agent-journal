from engine.database.migration import Migration


class AsksPlainFieldNamesMigration(Migration):
    """A helper question's parent question, a step's helper question and whether the journal passed it on, and a
    question stack's approval take the plain column names their fields use."""

    number = 5
    statements = [
        "ALTER TABLE asks RENAME COLUMN parent_ask_id TO parent_question_id",
        "ALTER TABLE ask_steps RENAME COLUMN ask_id TO helper_question_id",
        "ALTER TABLE ask_steps RENAME COLUMN passed_by_journal TO journal_passed",
        "ALTER TABLE ask_stacks RENAME COLUMN needs_approval TO requires_approval",
    ]
