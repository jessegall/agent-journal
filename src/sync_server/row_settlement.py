from sync_server.logged_change import LoggedChange
from sync_server.rejected_field import RejectedField
from sync_server.settlement import Settlement
from sync_server.stored_row import StoredRow


class RowSettlement:
    """How one pushed change meets the row as the server holds it: a creation and a deletion are kept whole, an update to a deleted row is dropped, and an update keeps each field whose edit is not older than the one the server holds."""

    @staticmethod
    def outcome(change: LoggedChange, current: StoredRow | None, is_deleted: bool) -> Settlement:
        if not change.is_update():
            return Settlement(change, ())
        if is_deleted:
            return Settlement(change.without(set(change.fields)), (RejectedField.deleted_row(change.row_table, change.row),))
        stored = current or StoredRow()
        rejections = tuple(RejectedField(change.row_table, change.row, name, stored.fields[name], stored.changed_at[name], str(stored.writers.get(name, ""))) for name in change.fields if stored.changed_at.get(name, 0.0) > change.changed_at.get(name, 0.0))
        return Settlement(change.without({rejection.field for rejection in rejections}), rejections)
