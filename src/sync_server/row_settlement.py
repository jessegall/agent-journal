from sync_server.logged_change import LoggedChange
from sync_server.rejected_field import RejectedField
from sync_server.settlement import Settlement


class RowSettlement:
    """How one pushed change meets the row as the server holds it: a creation and a deletion are kept whole, an update to a deleted row is dropped, and an update keeps each field whose edit is not older than the one the server holds."""

    @staticmethod
    def outcome(change: LoggedChange, current: tuple[dict, dict] | None, is_deleted: bool) -> Settlement:
        if not change.is_update():
            return Settlement(change, ())
        if is_deleted:
            return Settlement(change.without(set(change.fields)), (RejectedField.deleted_row(change.row_table, change.row),))
        row_values, row_changed_at = current or ({}, {})
        rejections = tuple(RejectedField(change.row_table, change.row, name, row_values[name], row_changed_at[name]) for name in change.fields if row_changed_at.get(name, 0.0) > change.changed_at.get(name, 0.0))
        return Settlement(change.without({rejection.field for rejection in rejections}), rejections)
