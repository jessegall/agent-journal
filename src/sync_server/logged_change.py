from dataclasses import dataclass, field


@dataclass(frozen=True)
class LoggedChange:
    """One change in the team's log: its place in the order, the row's table and number, whether it was created, updated or deleted, the fields it set with when each was changed, who wrote it, and the person and device that sent it."""

    row_table: str
    row: int
    action: str
    actor: str
    account_id: int
    device_id: int
    fields: dict = field(default_factory=dict)
    changed_at: dict = field(default_factory=dict)
    sequence: int = 0

