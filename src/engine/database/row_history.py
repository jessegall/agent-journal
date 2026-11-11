from dataclasses import dataclass

NEWEST_EVENTS_READ = 50


@dataclass(frozen=True)
class RowHistory:
    """Which events of one row a read wants: the newest ones, at most the limit, and only those of the given
    event names when any are given."""

    row_table: str
    row_id: int
    limit: int = NEWEST_EVENTS_READ
    names: tuple[str, ...] = ()
