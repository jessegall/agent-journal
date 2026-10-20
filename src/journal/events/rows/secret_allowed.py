from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class SecretAllowed(RowEvent):
    """The user let a secret go to programs it could not go to before."""

    secret_id: int
    title: str
    programs: tuple[str, ...]
