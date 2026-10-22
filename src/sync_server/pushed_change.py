from dataclasses import dataclass, field

from sync_server.logged_change import LoggedChange


@dataclass(frozen=True)
class PushedChange:
    """One change as a device sends it: the row's table and number, whether it was created, updated or deleted, who wrote it, the fields it set and when each was changed by the device's clock."""

    row_table: str
    row: int
    action: str
    actor: str
    fields: dict = field(default_factory=dict)
    changed_at: dict = field(default_factory=dict)

    def logged_change(self, account_id: int, device_id: int, clock_offset: float) -> LoggedChange:
        return LoggedChange(self.row_table, self.row, self.action, self.actor, account_id, device_id, dict(self.fields), {name: seconds + clock_offset for name, seconds in self.changed_at.items()})
