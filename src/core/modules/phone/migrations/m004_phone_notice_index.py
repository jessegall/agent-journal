from engine.database.migration import Migration


class PhoneNoticeIndexMigration(Migration):
    """Indexes paired phones waiting for a notice."""

    number = 4
    statements = ["CREATE INDEX phones_state_notice ON phones (state, notice_waiting)"]
